/**
 * What this build is configured to sell, if anything.
 *
 * The key is read from `expo-constants` extra, which EAS populates per build
 * profile. No key means no purchases: `configured` is false, the SDK is never
 * initialised, and the access rule turns the paywall off for everyone. That is
 * guard 1, and it is the reason a development build does not accidentally lock
 * content behind a subscription it cannot sell.
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';

interface PurchasesExtra {
  revenueCatAndroidKey?: string;
  revenueCatIosKey?: string;
  /** The RevenueCat entitlement that unlocks premium segments. */
  entitlementId?: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as { purchases?: PurchasesExtra };
const purchases = extra.purchases ?? {};

/** The entitlement identifier configured in RevenueCat. */
export const ENTITLEMENT_ID = purchases.entitlementId ?? 'premium';

/**
 * The platform's public SDK key, or null.
 *
 * A key that still carries RevenueCat's `test_` prefix is treated as absent in a
 * production build: shipping one would create a build that appears able to sell
 * and cannot, which is the exact state guard 2 exists to prevent — except that
 * guard 2 needs a working SDK to notice, and this one does not.
 */
export function apiKey(): string | null {
  const key = Platform.OS === 'ios' ? purchases.revenueCatIosKey : purchases.revenueCatAndroidKey;
  // Typed as `string | undefined`, but this is read from a JSON config assembled at
  // build time and shipped in the bundle — the type is a claim about the build, not
  // a guarantee about the file. Anything that is not a string is no key, and saying
  // so here is cheaper than a crash at module scope on somebody's device.
  if (typeof key !== 'string' || key.length === 0) return null;
  if (__DEV__) return key;
  return key.startsWith('test_') ? null : key;
}

/** Purchases are an Android and iOS capability; web has no store to talk to. */
export const platformSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/** Guard 1 of the access rule, as a single expression. */
export const configured = platformSupported && apiKey() !== null;
