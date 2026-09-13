/**
 * The access rule, wired to the stores.
 *
 * Everything decisive lives in `rules.ts` as a pure function. This file only
 * gathers the four inputs and passes the clock in, so there is exactly one place
 * where the decision is made and one place where it is fed.
 */
import { useMemo } from 'react';
import { hasPremiumContent } from '@/content';
import { configured } from '@/purchases';
import { useAccessStore } from '@/store/useAccessStore';
import {
  AccessInput,
  AccessReason,
  PaywallState,
  accessReason,
  gatingActive,
  hasPremiumAccess,
  paywallState,
  promoDaysRemaining,
  shouldShowUpsell,
} from './rules';

export interface Access {
  /** May premium segments be opened? */
  premium: boolean;
  reason: AccessReason;
  paywall: PaywallState;
  /** Is anything being gated at all, for anyone? */
  gating: boolean;
  /** Should any surface mention a subscription? */
  showUpsell: boolean;
  promoDaysRemaining: number;
  input: AccessInput;
}

/**
 * `now` is captured per render rather than ticking. Access changes on a day
 * boundary at the earliest, so a clock that only advances when something else
 * re-renders is accurate enough and costs nothing.
 */
export function useAccess(): Access {
  const subscriptionActive = useAccessStore((s) => s.subscriptionActive);
  const productAvailable = useAccessStore((s) => s.productAvailable);
  const grandfathered = useAccessStore((s) => s.grandfathered);
  const promoGrantUntil = useAccessStore((s) => s.promoGrantUntil);

  return useMemo(() => {
    const input: AccessInput = {
      purchasesConfigured: configured,
      productAvailable,
      premiumContentExists: hasPremiumContent(),
      subscriptionActive,
      grandfathered,
      promoGrantUntil,
      now: Date.now(),
    };
    return {
      premium: hasPremiumAccess(input),
      reason: accessReason(input),
      paywall: paywallState(input),
      gating: gatingActive(input),
      showUpsell: shouldShowUpsell(input),
      promoDaysRemaining: promoDaysRemaining(input),
      input,
    };
  }, [subscriptionActive, productAvailable, grandfathered, promoGrantUntil]);
}
