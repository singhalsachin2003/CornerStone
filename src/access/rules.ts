/**
 * Who may see the paid content, and whether there is any paid content to see.
 *
 * Pure on purpose. `now` is passed in, nothing here reads a store, a clock or a
 * network, so every state below is reachable from a test rather than from a
 * particular device on a particular day.
 *
 * The shape of the deal, decided before any of this was written: **everything the
 * app already shipped stays free, permanently.** A subscription buys the segments
 * added afterwards. A content paywall dropped over a finished catalogue makes the
 * subscription irrational — nothing renews if nothing is added — so what is sold
 * here is the pipeline, not the archive.
 */

export interface AccessInput {
  /**
   * Guard 1 — a purchases key is configured in this build.
   *
   * With no key the SDK can answer nothing, so `subscriptionActive` is false for
   * everybody. Gating on that would lock the paid segments for every user of a
   * build that cannot sell them anything. Off by default is the only safe default.
   */
  purchasesConfigured: boolean;
  /**
   * Guard 2 — the offering actually contains a buyable product.
   *
   * A key is not enough. The Play product has to exist, the offering has to carry
   * it, and merchant verification sits weeks away from the line of code that adds
   * the key. Never lock what cannot be bought.
   */
  productAvailable: boolean;
  /**
   * Guard 3 — the shipped catalogue marks something premium.
   *
   * Until it does, a subscription buys nothing, and the honest thing to do with a
   * pitch for nothing is not show it.
   */
  premiumContentExists: boolean;

  /** The entitlement, as the purchases SDK reports it. */
  subscriptionActive: boolean;
  /**
   * Guard 4 — this install predates the paywall.
   *
   * Set once, on any install that already had saved progress when the paywall
   * build first ran, and never expires. Anyone already using the app keeps all of
   * it. `null` means the check has not run yet, which is treated as "not yet
   * known" rather than "no".
   */
  grandfathered: boolean | null;
  /** Epoch ms at which the current promotional grant lapses, or null for none. */
  promoGrantUntil: number | null;
  /** Epoch ms. Injected so the caller owns the clock. */
  now: number;
}

/**
 * Why the candidate can see the paid segments — or why the question does not
 * arise. Ordered by precedence, and the screen says something different for each,
 * because "you already have this" and "there is nothing to buy" are not the same
 * sentence.
 */
export type AccessReason =
  /** Guards 1–3: nothing is being gated, for anyone. */
  | 'not-gating'
  /** Installed before the paywall existed. Permanent. */
  | 'grandfathered'
  /** A live subscription. */
  | 'subscribed'
  /** A promotional code, until it lapses. */
  | 'promo'
  /** Gating is on and none of the above applies. */
  | 'locked';

/**
 * Is the paywall doing anything at all?
 *
 * All three guards have to hold. Any one of them false means the paid segments
 * are open to everybody, which is the correct behaviour for a build that cannot
 * sell, a product that does not exist yet, or a catalogue with nothing premium
 * in it.
 */
export function gatingActive(input: AccessInput): boolean {
  return input.purchasesConfigured && input.productAvailable && input.premiumContentExists;
}

/** Is a promotional grant live right now? */
export function promoActive(input: AccessInput): boolean {
  return input.promoGrantUntil !== null && input.promoGrantUntil > input.now;
}

/** The single answer, with its reason attached. */
export function accessReason(input: AccessInput): AccessReason {
  if (!gatingActive(input)) return 'not-gating';
  // Grandfathering outranks everything: it is permanent, and telling someone who
  // has had the app for a year that their access came from a 30-day code would be
  // both wrong and alarming. `null` is "not yet determined" and does not grant.
  if (input.grandfathered === true) return 'grandfathered';
  if (input.subscriptionActive) return 'subscribed';
  if (promoActive(input)) return 'promo';
  return 'locked';
}

/** May this install open premium segments? */
export function hasPremiumAccess(input: AccessInput): boolean {
  return accessReason(input) !== 'locked';
}

/**
 * Should anything in the UI mention a subscription?
 *
 * Only when there is a real product, real paid content, and the candidate does not
 * already have access by some other route. Every other state produces silence —
 * no badges, no locks, no upsell row.
 */
export function shouldShowUpsell(input: AccessInput): boolean {
  return accessReason(input) === 'locked';
}

/**
 * What the paywall screen renders. It has to be honest in all five states, which
 * is the whole reason this returns a state rather than a boolean.
 */
export type PaywallState =
  /** Guards 1–3 fail: say so plainly rather than showing a dead Subscribe button. */
  | 'unavailable'
  | 'subscribed'
  | 'grandfathered'
  | 'promo'
  /** The ordinary pitch. */
  | 'offer';

export function paywallState(input: AccessInput): PaywallState {
  const reason = accessReason(input);
  if (reason === 'not-gating') return 'unavailable';
  if (reason === 'locked') return 'offer';
  return reason;
}

/** Whole days left on a promotional grant, rounded up; 0 when none is live. */
export function promoDaysRemaining(input: AccessInput): number {
  if (!promoActive(input)) return 0;
  return Math.ceil((input.promoGrantUntil! - input.now) / 86_400_000);
}
