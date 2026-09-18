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
 *
 * `aapt2 dump xmltree` cannot read an AAB manifest — it is protobuf-encoded —
 * so the manifest comes from `bundletool`.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
];

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
    check(versionName === '1.1.0', 'versionName is 1.1.0', versionName ?? '(missing)');

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

    // ---- Content. Trap 2: -a, because this is Hermes bytecode ----
    console.log('\nContent (index.android.bundle is Hermes bytecode — grep -a is mandatory)');
    const bundle = join(assets, 'index.android.bundle');
    for (const term of EXPECTED_STRINGS) {
      const hits = execFileSync(
        'sh',
        ['-c', `grep -ac ${JSON.stringify(term)} ${JSON.stringify(bundle)} || true`],
        { encoding: 'utf8' },
      ).trim();
      check(Number(hits) > 0, `"${term}" ships`, `${hits} hit(s)`);
    }

    const supabase = execFileSync(
      'sh',
      ['-c', `grep -aoE "https://[a-z]+\\.supabase\\.co" ${JSON.stringify(bundle)} | sort -u`],
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
