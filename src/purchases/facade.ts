/**
 * Everything that talks to RevenueCat, behind one module.
 *
 * Two rules hold throughout:
 *
 * 1. **Nothing here is imported until it is needed.** `react-native-purchases`
 *    reaches for a native module that does not exist on web and does not exist in
 *    Expo Go, so a top-level import would crash both. Every entry point below
 *    checks `configured` first and `require`s lazily.
 * 2. **Every call resolves.** A store outage, an unsigned build, a device with no
 *    Play Services — none of these should throw into a screen. Failures become a
 *    typed result, and the access rule reads the result as "no entitlement",
 *    which under guards 1–3 means the content stays open rather than locked.
 */
import { ENTITLEMENT_ID, apiKey, configured } from './config';

export interface PurchaseProduct {
  /** RevenueCat package identifier, passed back to `purchase`. */
  id: string;
  /** Localised price string, e.g. "£3.99". Never format this yourself. */
  priceLabel: string;
  /** "Monthly", "Annual" — the package's period, for the plan row. */
  periodLabel: string;
  title: string;
  description: string;
}

export interface EntitlementSnapshot {
  /**
   * Did the store actually answer?
   *
   * False for every failure path — no key, native module missing, offline, store
   * outage. Callers must not write a snapshot with `reachable: false` over state
   * they already hold: "we could not ask" is not the same as "you have nothing",
   * and treating it as the same locks a paying subscriber out of what they bought
   * the moment their train enters a tunnel.
   */
  reachable: boolean;
  /** Does this install currently hold the premium entitlement? */
  active: boolean;
  /**
   * Guard 2: is there a product the candidate could actually buy?
   *
   * False whenever the SDK could not be reached, the offering is empty, or the
   * Play products have not been created yet. The paywall stays silent on false.
   */
  productAvailable: boolean;
  products: PurchaseProduct[];
  /** Set when the last call failed, for logging — never shown to the candidate. */
  error?: string;
}

export const UNREACHABLE: EntitlementSnapshot = {
  reachable: false,
  active: false,
  productAvailable: false,
  products: [],
};

/** Lazily loaded so an unconfigured or web build never touches the native module. */
function sdk() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('react-native-purchases').default;
}

let initialised = false;

async function ensureInitialised(): Promise<boolean> {
  if (!configured) return false;
  if (initialised) return true;
  const key = apiKey();
  if (!key) return false;
  try {
    await sdk().configure({ apiKey: key });
    initialised = true;
    return true;
  } catch {
    // A failed configure leaves `initialised` false, so a later call retries.
    // Retrying matters: the first attempt often runs before the network is up.
    return false;
  }
}

function readSnapshot(customerInfo: any, offerings: any): EntitlementSnapshot {
  const active = Boolean(customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]);
  const packages = offerings?.current?.availablePackages ?? [];
  const products: PurchaseProduct[] = packages.map((p: any) => ({
    id: p.identifier,
    priceLabel: p.product?.priceString ?? '',
    periodLabel: periodLabelFor(p),
    title: p.product?.title ?? '',
    description: p.product?.description ?? '',
  }));
  return { reachable: true, active, productAvailable: products.length > 0, products };
}

/** RevenueCat's package type is an enum-ish string; this is the human version. */
function periodLabelFor(p: any): string {
  const type: string = p?.packageType ?? '';
  switch (type) {
    case 'MONTHLY':
      return 'Monthly';
    case 'ANNUAL':
      return 'Annual';
    case 'SIX_MONTH':
      return 'Six months';
    case 'THREE_MONTH':
      return 'Three months';
    case 'LIFETIME':
      // No lifetime tier is sold. Under a content pipeline it hands over every
      // future segment forever for a little over a year of the monthly price, so
      // none was ever created in the Play Console — but if one appears in an
      // offering by mistake, it should at least be labelled honestly.
      return 'One-off';
    default:
      return p?.product?.subscriptionPeriod ?? '';
  }
}

/** Current entitlement and what is for sale. Never throws. */
export async function fetchEntitlement(): Promise<EntitlementSnapshot> {
  if (!(await ensureInitialised())) return UNREACHABLE;
  try {
    const purchases = sdk();
    const [customerInfo, offerings] = await Promise.all([
      purchases.getCustomerInfo(),
      purchases.getOfferings(),
    ]);
    return readSnapshot(customerInfo, offerings);
  } catch (e) {
    return { ...UNREACHABLE, error: String(e) };
  }
}

export type PurchaseOutcome =
  | { kind: 'purchased'; snapshot: EntitlementSnapshot }
  /** The candidate backed out of the Play sheet. Not an error; say nothing. */
  | { kind: 'cancelled' }
  | { kind: 'unavailable' }
  | { kind: 'failed'; message: string };

/** Buy a package by its identifier. */
export async function purchasePackage(packageId: string): Promise<PurchaseOutcome> {
  if (!(await ensureInitialised())) return { kind: 'unavailable' };
  try {
    const purchases = sdk();
    const offerings = await purchases.getOfferings();
    const target = (offerings?.current?.availablePackages ?? []).find(
      (p: any) => p.identifier === packageId,
    );
    if (!target) return { kind: 'unavailable' };
    const result = await purchases.purchasePackage(target);
    const customerInfo = result?.customerInfo ?? (await purchases.getCustomerInfo());
    return { kind: 'purchased', snapshot: readSnapshot(customerInfo, offerings) };
  } catch (e: any) {
    // RevenueCat signals a user cancellation through this flag rather than a
    // distinct error type. Treating it as a failure would put an error message on
    // screen every time somebody changes their mind, which is most of the time.
    if (e?.userCancelled) return { kind: 'cancelled' };
    return { kind: 'failed', message: String(e?.message ?? e) };
  }
}

/** Restore purchases made on another install of the same store account. */
export async function restorePurchases(): Promise<EntitlementSnapshot> {
  if (!(await ensureInitialised())) return UNREACHABLE;
  try {
    const purchases = sdk();
    const customerInfo = await purchases.restorePurchases();
    const offerings = await purchases.getOfferings();
    return readSnapshot(customerInfo, offerings);
  } catch (e) {
    return { ...UNREACHABLE, error: String(e) };
  }
}

/** Where a subscriber manages or cancels — Play's own page, not ours. */
export const MANAGE_SUBSCRIPTION_URL = 'https://play.google.com/store/account/subscriptions';
