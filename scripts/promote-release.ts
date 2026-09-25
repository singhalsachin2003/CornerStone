/**
 * Promote a build to the production track. Run with `npm run promote` — which
 * changes nothing. Pass `--commit` to publish.
 *
 * ```bash
 * npm run promote                            # show what would change
 * npm run promote -- --commit                # full rollout
 * npm run promote -- --rollout=0.2 --commit  # staged, 20% of users
 * ```
 *
 * **This is the only script here that reaches real users.** Everything else touches
 * a test track, a draft product or a dashboard. So it prints the before and after,
 * refuses several ways to get it wrong, and needs `--commit` to do anything.
 *
 * **What it refuses:**
 *
 * - A versionCode that is not already on a testing track. Production should receive
 *   something that has been installed somewhere first, never a fresh artifact.
 * - A versionCode lower than or equal to what production already serves.
 * - Release notes over Play's 500-character cap, which is rejected on commit anyway.
 * - Running at all if the release notes still read like Expo's placeholder — the
 *   production listing has carried "First release of this awesome app." since v1.0
 *   because `eas submit` writes that when nothing is supplied.
 *
 * **What it cannot check, and you must have done first:** Data Safety must declare
 * email and purchase history, and Sign-in details must say Yes and carry the
 * `PLAYREVIEW` route. Both are Console-only — no API reaches them. A build that
 * collects data its listing denies collecting is the under-declaring direction, and
 * that is what Play suspends apps for. See `docs/PRIVACY.md` for the exact answers.
 */
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PACKAGE = 'io.cornerstone.study';
const KEY_PATH = join(homedir(), '.config', 'otc-learn', 'play-service-account.json');
const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';
const LANGUAGE = 'en-GB';
const NOTES_LIMIT = 500;

/** Expo's placeholder, which has been live on the production listing since v1.0. */
const PLACEHOLDER = 'First release of this awesome app.';

/**
 * The release notes, read from `docs/STORE_LISTING.md` rather than retyped here, so
 * the character count in that file is the count that actually ships.
 */
function releaseNotes(): string {
  const doc = readFileSync(join(process.cwd(), 'docs', 'STORE_LISTING.md'), 'utf8');
  // Version-free on purpose: the marker used to read "The v1.1 text, at", which
  // stopped matching the moment the release was not v1.1 — a stale literal
  // failing a good release, the same shape of bug as a pinned versionName.
  const marker = doc.indexOf('The current text, at');
  if (marker < 0)
    throw new Error(
      'Could not find "The current text, at" in docs/STORE_LISTING.md — the release ' +
        'notes are read from the fenced block directly below that sentence.',
    );
  const open = doc.indexOf('```', marker);
  const close = doc.indexOf('```', open + 3);
  if (open < 0 || close < 0) throw new Error('Could not find the fenced release notes block');
  const text = doc
    .slice(open + 3, close)
    .replace(/^\n/, '')
    .replace(/\n$/, '');
  if (!text.trim()) throw new Error('The release notes block is empty');
  return text;
}

const base64url = (value: unknown) =>
  Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');

async function accessToken(): Promise<string> {
  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8')) as {
    client_email: string;
    private_key: string;
  };
  const issued = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url({ alg: 'RS256', typ: 'JWT' })}.${base64url({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: 'https://oauth2.googleapis.com/token',
    exp: issued + 3600,
    iat: issued,
  })}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(body)}`);
  return body.access_token;
}

async function call(url: string, token: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      message = JSON.stringify(JSON.parse(text).error, null, 2);
    } catch {
      /* raw body is the best message available */
    }
    throw new Error(`${init.method ?? 'GET'} ${url}\n${response.status}\n${message}`);
  }
  return text ? JSON.parse(text) : {};
}

type Track = { track: string; releases?: { versionCodes?: string[]; status?: string }[] };
const codesOn = (t?: Track) =>
  (t?.releases ?? []).flatMap((r) => r.versionCodes ?? []).map((c) => Number(c));

async function main() {
  const commit = process.argv.includes('--commit');
  const rolloutArg = process.argv.find((a) => a.startsWith('--rollout='));
  const rollout = rolloutArg ? Number(rolloutArg.split('=')[1]) : undefined;
  if (rollout !== undefined && !(rollout > 0 && rollout < 1)) {
    throw new Error(`--rollout must be between 0 and 1 (exclusive); got ${rolloutArg}`);
  }

  const notes = releaseNotes();
  if (notes.length > NOTES_LIMIT) {
    throw new Error(
      `Release notes are ${notes.length} characters; Play's limit is ${NOTES_LIMIT}.`,
    );
  }
  if (notes.includes(PLACEHOLDER)) {
    throw new Error("The release notes are still Expo's placeholder. Write them first.");
  }

  const token = await accessToken();
  const edit = await call(`${API}/${PACKAGE}/edits`, token, { method: 'POST' });

  try {
    const { tracks } = (await call(`${API}/${PACKAGE}/edits/${edit.id}/tracks`, token)) as {
      tracks: Track[];
    };
    const byName = Object.fromEntries(tracks.map((t) => [t.track, t]));
    const productionNow = Math.max(0, ...codesOn(byName.production));
    const testing = ['internal', 'alpha', 'beta'].flatMap((n) => codesOn(byName[n]));
    const candidate = Math.max(0, ...testing);

    console.log(`Promote to production — ${PACKAGE}\n`);
    for (const t of tracks) {
      console.log(`  ${t.track.padEnd(12)} versionCode ${codesOn(t).join(', ') || '(none)'}`);
    }
    console.log(`\n  production now       ${productionNow}`);
    console.log(`  would become         ${candidate}`);
    console.log(
      `  rollout              ${rollout !== undefined ? `${rollout * 100}% (staged)` : '100%'}`,
    );
    console.log(`  release notes        ${notes.length}/${NOTES_LIMIT} characters\n`);
    console.log(
      notes
        .split('\n')
        .map((l) => `    ${l}`)
        .join('\n'),
    );

    if (!candidate) throw new Error('\nNo versionCode on any testing track. Nothing to promote.');
    if (candidate <= productionNow) {
      throw new Error(
        `\nProduction already serves versionCode ${productionNow}; the best testing track has ${candidate}. Nothing to do.`,
      );
    }

    console.log(
      '\n  Console-only, and NOT checked by this script — confirm both are done:\n' +
        '    Data Safety     declares email + purchase history (currently "No data collected")\n' +
        '    Sign-in details says Yes, with the PLAYREVIEW route\n' +
        '  A build collecting data its listing denies collecting is what Play suspends for.',
    );

    if (!commit) {
      console.log('\nDRY RUN — nothing was published. Add --commit to promote.');
      return;
    }

    const release: Record<string, unknown> = {
      versionCodes: [String(candidate)],
      releaseNotes: [{ language: LANGUAGE, text: notes }],
      ...(rollout !== undefined
        ? { status: 'inProgress', userFraction: rollout }
        : { status: 'completed' }),
    };

    await call(`${API}/${PACKAGE}/edits/${edit.id}/tracks/production`, token, {
      method: 'PUT',
      body: JSON.stringify({ track: 'production', releases: [release] }),
    });
    const committed = await call(`${API}/${PACKAGE}/edits/${edit.id}:commit`, token, {
      method: 'POST',
    });
    console.log(`\nPublished. Edit ${committed.id} committed.`);
    console.log('Play review for a production release typically takes hours to a few days.');
  } catch (error) {
    // Deleting the edit discards everything staged in it; an uncommitted edit
    // changes nothing, so a failure here leaves production exactly as it was.
    await fetch(`${API}/${PACKAGE}/edits/${edit.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    throw error;
  }
}

main().catch((error) => {
  console.error(`${error.message}`);
  process.exit(1);
});
