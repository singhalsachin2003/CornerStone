/**
 * App Links pre-flight. Run with `npm run check:applinks`.
 *
 * Android verifies an App Link by fetching
 * `https://<host>/.well-known/assetlinks.json` — **from the host root**, never
 * from the path the link points at. That single fact is what makes this check
 * worth having: the public pages are served from a GitHub *project* site at
 * `singhalsachin2003.github.io/CornerStone`, so the file committed under `docs/`
 * lands at `/CornerStone/.well-known/assetlinks.json`, which Android will never
 * look at. Verification needs the same file published at the root of
 * `singhalsachin2003.github.io`, which is a different repository.
 *
 * Until that is true, `autoVerify` fails silently and links open in the browser —
 * the behaviour the app had before, so nothing regresses. This check exists so the
 * gap is stated rather than discovered.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const problems: string[] = [];
const notes: string[] = [];

const PACKAGE = 'io.cornerstone.study';
const PLACEHOLDER = 'REPLACE_WITH_PLAY_APP_SIGNING_SHA256';
const SHA256 = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

const path = join(__dirname, '../docs/.well-known/assetlinks.json');
const raw = readFileSync(path, 'utf8');
const statements = JSON.parse(raw) as {
  relation: string[];
  target: { namespace: string; package_name: string; sha256_cert_fingerprints: string[] };
}[];

if (!Array.isArray(statements) || statements.length === 0) {
  problems.push('assetlinks.json must be a non-empty array of statements');
}

for (const [i, s] of statements.entries()) {
  if (!s.relation?.includes('delegate_permission/common.handle_all_urls')) {
    problems.push(`statement ${i}: missing the handle_all_urls relation`);
  }
  if (s.target?.namespace !== 'android_app') {
    problems.push(`statement ${i}: namespace must be android_app`);
  }
  if (s.target?.package_name !== PACKAGE) {
    problems.push(
      `statement ${i}: package_name is "${s.target?.package_name}", expected ${PACKAGE}`,
    );
  }
  const fingerprints = s.target?.sha256_cert_fingerprints ?? [];
  if (fingerprints.length === 0) problems.push(`statement ${i}: no fingerprints`);
  for (const fp of fingerprints) {
    if (fp === PLACEHOLDER) {
      notes.push(
        'fingerprint is still the placeholder — paste the **Play app signing** SHA-256 ' +
          '(Play Console → App integrity → Play Store protection → Protect app signing key → ' +
          'Manage Play app signing). It is the app signing key, not the upload key beneath it, ' +
          'and the Console shows it as a copy button rather than selectable text.',
      );
      continue;
    }
    if (!SHA256.test(fp)) {
      problems.push(
        `statement ${i}: "${fp}" is not an upper-case colon-separated SHA-256 fingerprint`,
      );
    }
  }
}

notes.push(
  'Android fetches https://singhalsachin2003.github.io/.well-known/assetlinks.json — the HOST ' +
    'root. The copy in docs/ is served at /CornerStone/.well-known/ and will not be read. ' +
    'Publish the same file in the singhalsachin2003.github.io repository.',
);

if (notes.length) {
  console.log('App Links — outstanding:');
  notes.forEach((n) => console.log('  · ' + n));
  console.log('');
}

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('assetlinks.json is well formed');
