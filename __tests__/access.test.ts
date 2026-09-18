/**
 * The access rule is the one piece of this app that can do damage by being wrong:
 * a false negative locks content a candidate paid for, a false positive gives the
 * paid segments away. Every guard below exists because the obvious implementation
 * gets one of these cases wrong.
 */
import {
  AccessInput,
  accessReason,
  gatingActive,
  hasPremiumAccess,
  paywallState,
  promoActive,
  promoDaysRemaining,
  shouldShowUpsell,
} from '@/access/rules';
import { applyEntitlementSnapshot } from '@/access/entitlement';

const NOW = Date.UTC(2026, 8, 12);
const DAY = 86_400_000;

/** A build that can sell, with content to sell, to somebody who has bought nothing. */
function input(over: Partial<AccessInput> = {}): AccessInput {
  return {
    purchasesConfigured: true,
    productAvailable: true,
    premiumContentExists: true,
    subscriptionActive: false,
    grandfathered: false,
    promoGrantUntil: null,
    now: NOW,
    ...over,
  };
}

describe('the three guards that switch gating off', () => {
  it('does not gate a build with no purchases key', () => {
    const i = input({ purchasesConfigured: false });
    expect(gatingActive(i)).toBe(false);
    expect(hasPremiumAccess(i)).toBe(true);
    expect(accessReason(i)).toBe('not-gating');
  });

  it('does not gate when no product is buyable, even with a key', () => {
    const i = input({ productAvailable: false });
    expect(hasPremiumAccess(i)).toBe(true);
  });

  it('does not gate when nothing in the catalogue is premium', () => {
    const i = input({ premiumContentExists: false });
    expect(hasPremiumAccess(i)).toBe(true);
  });

  it('gates only when all three hold', () => {
    expect(gatingActive(input())).toBe(true);
    expect(hasPremiumAccess(input())).toBe(false);
  });
});

describe('grandfathering', () => {
  it('is permanent and outranks everything else', () => {
    const i = input({ grandfathered: true, now: NOW + 4000 * DAY });
    expect(accessReason(i)).toBe('grandfathered');
    expect(hasPremiumAccess(i)).toBe(true);
  });

  it('wins over a live subscription, so the copy never misattributes access', () => {
    expect(accessReason(input({ grandfathered: true, subscriptionActive: true }))).toBe(
      'grandfathered',
    );
  });

  // `null` is "the first-run check has not finished", not "no". Treating it as a
  // grant would hand the paid segments to every fresh install for one render.
  it('does not grant while still undetermined', () => {
    expect(hasPremiumAccess(input({ grandfathered: null }))).toBe(false);
  });
});

describe('subscription and promotional grants', () => {
  it('an active entitlement grants access', () => {
    expect(accessReason(input({ subscriptionActive: true }))).toBe('subscribed');
  });

  it('a live promo grants access and reports whole days left', () => {
    const i = input({ promoGrantUntil: NOW + 30 * DAY });
    expect(promoActive(i)).toBe(true);
    expect(accessReason(i)).toBe('promo');
    expect(promoDaysRemaining(i)).toBe(30);
  });

  it('rounds a part-day up, so the last day never reads as zero', () => {
    expect(promoDaysRemaining(input({ promoGrantUntil: NOW + DAY / 4 }))).toBe(1);
  });

  it('a lapsed promo grants nothing', () => {
    const i = input({ promoGrantUntil: NOW - 1 });
    expect(promoActive(i)).toBe(false);
    expect(accessReason(i)).toBe('locked');
    expect(promoDaysRemaining(i)).toBe(0);
  });

  it('a subscription outranks a promo, so cancelling does not silently extend it', () => {
    expect(accessReason(input({ subscriptionActive: true, promoGrantUntil: NOW + 30 * DAY }))).toBe(
      'subscribed',
    );
  });
});

describe('what the UI is allowed to say', () => {
  it('stays silent about subscriptions whenever gating is off', () => {
    expect(shouldShowUpsell(input({ purchasesConfigured: false }))).toBe(false);
    expect(shouldShowUpsell(input({ productAvailable: false }))).toBe(false);
    expect(shouldShowUpsell(input({ premiumContentExists: false }))).toBe(false);
  });

  it('stays silent for anyone who already has access', () => {
    expect(shouldShowUpsell(input({ subscriptionActive: true }))).toBe(false);
    expect(shouldShowUpsell(input({ grandfathered: true }))).toBe(false);
    expect(shouldShowUpsell(input({ promoGrantUntil: NOW + DAY }))).toBe(false);
  });

  it('pitches only to somebody who could actually buy something', () => {
    expect(shouldShowUpsell(input())).toBe(true);
  });

  it('gives the paywall a distinct state for each honest answer', () => {
    expect(paywallState(input({ purchasesConfigured: false }))).toBe('unavailable');
    expect(paywallState(input({ subscriptionActive: true }))).toBe('subscribed');
    expect(paywallState(input({ grandfathered: true }))).toBe('grandfathered');
    expect(paywallState(input({ promoGrantUntil: NOW + DAY }))).toBe('promo');
    expect(paywallState(input())).toBe('offer');
  });
});

/**
 * Found by running the app rather than by reading it: the first version of
 * `applySnapshot` wrote every result into the store, including the one produced
 * when the store could not be reached at all. On a device with no network that
 * turns a paying subscriber into a locked-out one.
 */
describe('an unreachable store is not an answer', () => {
  const products = [
    { id: 'monthly', priceLabel: '£3.49', periodLabel: 'Monthly', title: '', description: '' },
  ];
  const held = { subscriptionActive: true, productAvailable: true, products };

  it('leaves a known entitlement alone when the store cannot be reached', () => {
    const next = applyEntitlementSnapshot(held, {
      reachable: false,
      active: false,
      productAvailable: false,
      products: [],
    });
    expect(next).toBe(held);
  });

  it('accepts a reachable store reporting a lapsed subscription', () => {
    const next = applyEntitlementSnapshot(held, {
      reachable: true,
      active: false,
      productAvailable: true,
      products,
    });
    expect(next.subscriptionActive).toBe(false);
    expect(next.productAvailable).toBe(true);
  });

  it('accepts a reachable store reporting an empty offering', () => {
    const next = applyEntitlementSnapshot(held, {
      reachable: true,
      active: false,
      productAvailable: false,
      products: [],
    });
    expect(next.productAvailable).toBe(false);
  });
});
