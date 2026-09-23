/**
 * Verify a built AAB before it goes anywhere. Run with
 * `npm run check:aab -- store/cornerstone-versionCode10.aab`.
 *
 * `docs/RELEASE_CHECKLIST.md` described all of this in prose, and the prose was
 * wrong twice in ways that produced a confident wrong answer. This encodes the
 * checks so they cannot be run half-remembered.
 *
 * **The four traps, each of which has actually bitten:**
 *
 * 1. **Grep the whole artifact, not the JS bundle.** `extra` is not bundled with
 *    the JS — it is written to `base/assets/app.config` and read at runtime
 *    through `expo-constants`. Searching only `index.android.bundle` reports "no
 *    RevenueCat key" on a build that has one.
 * 2. **`index.android.bundle` is Hermes bytecode, and `grep` treats it as
 *    binary.** A plain `grep -c` returns 0 for a string that is present. `-a` is
 *    mandatory, and its absence silently turns every content check into a false
 *    negative.
 * 3. **Match permissions on the `<uses-permission` element, not on the word
 *    "permission" in the name.** `com.android.vending.BILLING` does not contain
 *    it, so a name filter reports the one permission that matters as missing.
 * 4. **Anchor the test-key search.** `grep -oE "test_[A-Za-z0-9]+"` hits
 *    `…shortest_paths` abutting `paywall_components_localizations` in a string
 *    table and cries wolf on every build.
 * 5. **Hermes stores a string containing ANY non-ASCII character as UTF-16LE**,
 *    and an ASCII search then reports a string that is plainly there as missing.
 *    `No account needed — without one, nothing leaves your device.` is absent as
 *    UTF-8 and present as UTF-16LE in versionCode 11, purely because of the em
 *    dash. This app's copy is full of em dashes, so content checks search both
 *    encodings and say which one matched.
 *
 * `aapt2 dump xmltree` cannot read an AAB manifest — it is protobuf-encoded —
 * so the manifest comes from `bundletool`.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Read from `app.json` rather than written here. A literal went stale the moment
 * 1.1.0 became 1.2.0, and a stale expectation fails a good build — which teaches
 * people to ignore the check.
 */
const APP_VERSION = (
  JSON.parse(readFileSync(join(__dirname, '..', 'app.json'), 'utf8')) as {
    expo: { version: string };
  }
).expo.version;

/**
 * The Hermes engine build, read out of the artifact.
 *
 * versionCode 10 and 11 both shipped a Hermes with a memory regression, and
 * neither `expo-doctor` nor the upgrade command noticed: both read the source
 * tree, and neither opens the AAB. `…0.14` is the bad one, `…0.16` the first
 * fix, `…0.17` what vc12 shipped. Asserting "not the known-bad build" rather
 * than an exact string, so a later Expo upgrade does not fail this for moving
 * forward.
 */
const BAD_HERMES = '250829098.0.14';

/** Anything outside this set means a dependency added a permission. */
const EXPECTED_PERMISSIONS = [
  'android.permission.INTERNET',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.ACCESS_NETWORK_STATE',
  'com.android.vending.BILLING',
  'io.cornerstone.study.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION',
];

/**
 * Strings that prove the v1.1 features actually shipped.
 *
 * **Every one of these was verified absent from versionCode 5**, which predates
 * all of them. That is the whole test of a marker: a string that is also in the
 * old build proves nothing. Two obvious-looking candidates failed it —
 * `IN THE EXAM` and `glossary` both appear in versionCode 5, so checking either
 * would have reported the glossary as shipped in versionCode 9, which does not
 * contain it. Re-run that comparison before adding to this list.
 */
const EXPECTED_STRINGS = [
  'PLAYREVIEW', // the reviewer's promo code
  'Cornerstone Plus', // the paywall and Profile row
  'Search a term or abbreviation', // the glossary screen's search placeholder
  'Back up your progress', // the optional account screen
  'nothing leaves your device', // onboarding's corrected privacy line, new in vc11
  // Dark mode is what this release is. A string only the Theme row can carry is
  // how the artifact proves it, rather than the build log claiming it.
  "System follows your phone's light or dark setting.",
];

/**
 * Strings that must NOT ship. A build is not verified by what it contains alone
 * when the point of the build was to remove something.
 *
 * `Everything stays on your device` was onboarding's unqualified promise, made
 * before the user is told an optional account exists and untrue once one does.
 * versionCode 10 and every build before it carry it; `41f91e7` replaced it.
 */
const FORBIDDEN_STRINGS = ['Everything stays on your device'];

/** Native modules that must be linked, read from the dex. */
const EXPECTED_DEX = [
  'com.revenuecat.purchases',
  'com.android.billingclient',
  'expo.modules.updates',
  'ExpoStoreReview',
];

let failures = 0;
const check = (ok: boolean, label: string, detail = '') => {
  if (!ok) failures += 1;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`);
};

function main() {
  const aab = process.argv[2];
  if (!aab || !existsSync(aab)) {
    console.error('Usage: npm run check:aab -- <path to .aab>');
    process.exit(2);
  }

  const work = mkdtempSync(join(tmpdir(), 'checkaab-'));
  try {
    console.log(`Verifying ${aab}\n`);

    // ---- Manifest, via bundletool (aapt2 cannot read a protobuf manifest) ----
    const manifest = execFileSync('bundletool', ['dump', 'manifest', `--bundle=${aab}`], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });

    const versionCode = /android:versionCode="(\d+)"/.exec(manifest)?.[1];
    const versionName = /android:versionName="([^"]+)"/.exec(manifest)?.[1];
    console.log('Manifest');
    check(!!versionCode, 'versionCode present', versionCode ?? '');
    check(versionName === APP_VERSION, `versionName is ${APP_VERSION}`, versionName ?? '(missing)');

    // Trap 3: match the element, never the word "permission" in the name.
    const declared = [...manifest.matchAll(/<uses-permission android:name="([^"]+)"/g)].map(
      (m) => m[1],
    );
    check(
      declared.includes('com.android.vending.BILLING'),
      'com.android.vending.BILLING declared',
      '(Play requires it for subscriptions)',
    );
    const unexpected = declared.filter((p) => !EXPECTED_PERMISSIONS.includes(p));
    const missing = EXPECTED_PERMISSIONS.filter((p) => !declared.includes(p));
    check(unexpected.length === 0, 'no unexpected permissions', unexpected.join(', '));
    check(missing.length === 0, 'no expected permission missing', missing.join(', '));
    check(manifest.includes('android:autoVerify="true"'), 'App Links autoVerify filter present');

    // ---- Unpack once; everything below reads the whole artifact ----
    execFileSync('unzip', ['-q', '-o', aab, '-d', work]);
    const assets = join(work, 'base', 'assets');

    // ---- Engine. The regression neither expo-doctor nor the CLI can see ----
    console.log('\nHermes (read from the artifact, never from the tooling)');
    const hermesPath = join(work, 'base', 'lib', 'arm64-v8a', 'libhermesvm.so');
    if (existsSync(hermesPath)) {
      const engine = readFileSync(hermesPath);
      const versions = [...engine.toString('latin1').matchAll(/25\d{7}\.\d+\.\d+/g)].map(
        (m) => m[0],
      );
      const found = [...new Set(versions)];
      check(found.length > 0, 'Hermes build string found', found.join(', ') || 'none');
      check(!found.includes(BAD_HERMES), `not the ${BAD_HERMES} regression`, found.join(', '));
    } else {
      check(false, 'libhermesvm.so present', hermesPath);
    }

    console.log('\nConfig (base/assets/app.config — NOT the JS bundle)');
    const config = JSON.parse(readFileSync(join(assets, 'app.config'), 'utf8'));
    const purchases = config?.extra?.purchases ?? {};
    check(
      purchases.entitlementId === 'premium',
      'entitlementId is premium',
      purchases.entitlementId ?? '(missing)',
    );
    check(
      typeof purchases.revenueCatAndroidKey === 'string' &&
        purchases.revenueCatAndroidKey.startsWith('goog_'),
      'RevenueCat key present',
      purchases.revenueCatAndroidKey ?? '(missing — the build cannot sell)',
    );
    check(
      config?.runtimeVersion?.policy === 'fingerprint',
      'runtimeVersion policy is fingerprint',
      JSON.stringify(config?.runtimeVersion ?? null),
    );

    const fingerprint = existsSync(join(assets, 'fingerprint'))
      ? readFileSync(join(assets, 'fingerprint'), 'utf8').trim()
      : '(none)';
    console.log(`        fingerprint  ${fingerprint}`);

    // Trap 4: anchored, with a realistic key length.
    const all = execFileSync(
      'sh',
      ['-c', `grep -rhoaE "\\btest_[A-Za-z0-9]{20,}" ${JSON.stringify(work)} | sort -u`],
      { encoding: 'utf8' },
    ).trim();
    check(all === '', 'no RevenueCat test key anywhere in the artifact', all);

    // ---- Content. Traps 2 and 5: Hermes bytecode, and UTF-16 for non-ASCII ----
    console.log('\nContent (Hermes bytecode — searched as UTF-8 and UTF-16LE)');
    const bundle = readFileSync(join(assets, 'index.android.bundle'));

    /** Counts occurrences in both encodings Hermes may have used. */
    const occurrences = (term: string) => {
      const count = (buf: Buffer) => {
        let n = 0;
        for (let i = bundle.indexOf(buf); i !== -1; i = bundle.indexOf(buf, i + 1)) n += 1;
        return n;
      };
      const utf8 = count(Buffer.from(term, 'utf8'));
      const utf16 = count(Buffer.from(term, 'utf16le'));
      return { utf8, utf16, total: utf8 + utf16 };
    };

    for (const term of EXPECTED_STRINGS) {
      const { utf8, total } = occurrences(term);
      check(total > 0, `"${term}" ships`, total ? `as ${utf8 ? 'UTF-8' : 'UTF-16LE'}` : '0 hits');
    }

    for (const term of FORBIDDEN_STRINGS) {
      const { total } = occurrences(term);
      check(total === 0, `"${term}" is GONE`, total ? `${total} hit(s) — still present` : '');
    }

    const supabase = execFileSync(
      'sh',
      [
        '-c',
        `grep -aoE "https://[a-z]+\\.supabase\\.co" ${JSON.stringify(join(assets, 'index.android.bundle'))} | sort -u`,
      ],
      { encoding: 'utf8' },
    ).trim();
    check(supabase !== '', 'Supabase URL present', supabase || '(missing)');

    // ---- Native modules, from the dex ----
    console.log('\nNative modules (dex)');
    for (const symbol of EXPECTED_DEX) {
      const hits = execFileSync(
        'sh',
        [
          '-c',
          `grep -rla ${JSON.stringify(symbol)} ${JSON.stringify(join(work, 'base', 'dex'))} | head -1`,
        ],
        { encoding: 'utf8' },
      ).trim();
      check(hits !== '', `${symbol} linked`);
    }

    console.log(
      failures === 0
        ? '\nAll checks passed. This artifact is safe to upload.'
        : `\n${failures} check(s) FAILED. Do not upload this artifact.`,
    );
    process.exit(failures === 0 ? 0 : 1);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

main();
