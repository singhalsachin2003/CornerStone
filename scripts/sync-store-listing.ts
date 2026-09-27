/**
 * Push the store listing text in `docs/STORE_LISTING.md` to Play. Run with
 * `npm run sync:listing` — which changes nothing — and `-- --commit` to publish.
 *
 * ```bash
 * npm run sync:listing              # diff the doc against what is live
 * npm run sync:listing -- --commit  # send the doc's text to Play for review
 * ```
 *
 * **Why this exists.** On 27 September 2026 the live listing was found to be
 * 2,282 characters against the doc's 3,362, missing two whole sections — the
 * always-free glossary, and the one explaining what the subscription buys. The
 * app had been selling a subscription since v1.1 while its listing never used
 * the word. Nothing compared the two, so nothing noticed for weeks.
 *
 * The same drift had already happened to OTC Learn's custom listing, which sat
 * on an August snapshot describing twenty products when there were thirty-six.
 * Two apps, same failure: the listing lives in a console, the copy lives in a
 * repo, and only a human eye connects them. This is that eye.
 *
 * **It does not touch custom store listings.** No Play API reaches them — they
 * are Console-only. After committing here, open Grow users → Store presence →
 * Store listings and bring each custom listing into step by hand, in the same
 * sitting. A custom listing is a copy, not an overlay: it keeps its old text
 * silently until somebody edits it.
 */
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC = join(HERE, '..', 'docs', 'STORE_LISTING.md');

const PACKAGE = 'io.cornerstone.study';
const KEY_PATH = join(homedir(), '.config', 'otc-learn', 'play-service-account.json');
const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';
const LANGUAGE = 'en-GB';

const LIMITS = { title: 30, shortDescription: 80, fullDescription: 4000 } as const;

const commit = process.argv.includes('--commit');

/** The first fenced block under a heading. The doc is the source of truth. */
function block(markdown: string, heading: string): string {
  const at = markdown.indexOf(heading);
  if (at === -1) throw new Error(`docs/STORE_LISTING.md has no "${heading}" heading`);
  const fence = /```\n([\s\S]*?)\n```/.exec(markdown.slice(at));
  if (!fence) throw new Error(`no fenced block under "${heading}"`);
  return fence[1];
}

const base64url = (value: string | object) =>
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

async function call<T>(url: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${response.status} ${url}\n${text}`);
  return (text ? JSON.parse(text) : {}) as T;
}

async function main() {
  const doc = readFileSync(DOC, 'utf8');
  const wanted = {
    title: block(doc, '## App title'),
    shortDescription: block(doc, '## Short description'),
    fullDescription: block(doc, '## Full description'),
  };

  // Over a limit is rejected on commit anyway; say so before touching the API.
  let refused = false;
  for (const [field, limit] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
    const length = wanted[field].length;
    if (length > limit) {
      console.error(`✗ ${field} is ${length} characters, over Play's ${limit}`);
      refused = true;
    }
  }
  if (refused) process.exit(1);

  const token = await accessToken();
  const edit = await call<{ id: string }>(`${API}/${PACKAGE}/edits`, token, { method: 'POST' });

  try {
    const live = await call<Record<string, string>>(
      `${API}/${PACKAGE}/edits/${edit.id}/listings/${LANGUAGE}`,
      token,
    );

    const changed = (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).filter(
      (field) => (live[field] ?? '') !== wanted[field],
    );

    for (const field of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
      const from = (live[field] ?? '').length;
      const to = wanted[field].length;
      const mark = changed.includes(field) ? '~' : ' ';
      console.log(`${mark} ${field}: live ${from} → doc ${to} (limit ${LIMITS[field]})`);
    }

    if (changed.length === 0) {
      console.log('\nThe listing already matches the doc. Nothing to do.');
    } else if (!commit) {
      console.log(
        `\n${changed.length} field(s) differ. Re-run with --commit to send them for review.`,
      );
    } else {
      await call(`${API}/${PACKAGE}/edits/${edit.id}/listings/${LANGUAGE}`, token, {
        method: 'PUT',
        body: JSON.stringify({ language: LANGUAGE, ...wanted }),
      });
      await call(`${API}/${PACKAGE}/edits/${edit.id}:commit`, token, { method: 'POST' });
      console.log(
        `\nCommitted ${changed.join(', ')}. Play reviews listing changes before they appear.`,
      );
      console.log('Now bring the custom store listings into step by hand — the API cannot.');
      process.exit(0);
    }
  } finally {
    if (!commit) {
      await fetch(`${API}/${PACKAGE}/edits/${edit.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
