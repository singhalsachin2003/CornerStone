/**
 * Dynamic layer over `app.json`.
 *
 * `app.json` stays the static base — icons, permissions, plugins — and everything
 * that has to differ per build profile is assembled here, because a static file
 * cannot read the environment and EAS supplies these per profile.
 *
 * Nothing here has a fallback that would make an unconfigured build *look*
 * configured. A missing RevenueCat key produces `null`, which makes
 * `src/purchases/config.ts` report the build as unable to sell, which turns the
 * paywall off for everyone. That is guard 1, and it has to survive a
 * misconfigured build rather than be defeated by one.
 */
const PROJECT_ID = 'f5f1e57a-eea4-4335-b432-2cc793f18b35';

/** Where the public pages live. Also the host App Links are claimed against. */
const SITE_HOST = 'singhalsachin2003.github.io';
const SITE_PATH = '/CornerStone';

function purchasesExtra() {
  const extra = { entitlementId: process.env.REVENUECAT_ENTITLEMENT || 'premium' };
  if (process.env.REVENUECAT_ANDROID_KEY) {
    extra.revenueCatAndroidKey = process.env.REVENUECAT_ANDROID_KEY;
  }
  if (process.env.REVENUECAT_IOS_KEY) extra.revenueCatIosKey = process.env.REVENUECAT_IOS_KEY;
  return extra;
}

module.exports = ({ config }) => ({
  ...config,

  // Over-the-air updates, which is what makes retiring a promotional code a
  // minutes-long update instead of a store release. The promo table depends on
  // that, because every code in it is public.
  //
  // `fingerprint`, not the `appVersion` default that `eas update:configure`
  // writes. With `appVersionSource: remote` and `version` pinned in app.json,
  // `appVersion` holds the runtime constant across native changes — so forgetting
  // to bump `version` after adding a native module pushes JS onto a binary that
  // cannot run it. This repo has now added one (`react-native-purchases`), which
  // turns that from a hypothetical into the next mistake waiting to happen.
  // Fingerprinting the native project means a native change produces a new runtime
  // on its own, and existing installs simply stop receiving updates until they
  // take the store build — which is the correct outcome.
  runtimeVersion: { policy: 'fingerprint' },
  updates: {
    enabled: true,
    url: `https://u.expo.dev/${PROJECT_ID}`,
    // Long enough to fetch on a slow connection, short enough that a cold start
    // never feels broken. Past this the app starts on the bundle it already has
    // and picks the update up next launch.
    fallbackToCacheTimeout: 6000,
  },

  android: {
    ...config.android,
    intentFilters: [
      ...(config.android?.intentFilters ?? []),
      {
        action: 'VIEW',
        autoVerify: true,
        data: [{ scheme: 'https', host: SITE_HOST, pathPrefix: SITE_PATH }],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },

  extra: {
    ...config.extra,
    eas: { projectId: PROJECT_ID },
    site: { host: SITE_HOST, path: SITE_PATH },
    // Public SDK keys — safe in a bundle, and there is nowhere else to put them in
    // an app with no backend. Absent means the build cannot sell, which is a
    // supported state rather than a broken one.
    //
    // Keys are *omitted* rather than set to null. Expo serialises a null in the
    // public config as `{}`, which is truthy, which would make an unconfigured
    // build claim it can sell and then throw on the first string method called
    // against it. Omitting leaves `undefined`, which is what the reader expects.
    purchases: purchasesExtra(),
  },
});
