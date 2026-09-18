/**
 * Redeeming a promotional code.
 *
 * Pure: `now` and the existing grant expiry are arguments, and the result is a
 * typed outcome rather than a boolean, so the screen can say something true for
 * every failure instead of "invalid code" five different ways.
 */
import { PROMO_CODES, PromoCode } from '@/content/promoCodes';

/**
 * No grant may exceed a year.
 *
 * Not a policy preference — a bound on what a leaked code can cost, given that
 * every code in the table is readable in the shipped bundle. The test enforces
 * it against the table, so a 3,650-day entry fails the build rather than shipping.
 */
export const MAX_GRANT_DAYS = 365;

export type RedeemOutcome =
  | { kind: 'granted'; code: PromoCode; until: number; days: number }
  /**
   * The code is valid but the access already held runs longer. A redemption must
   * never shorten access: somebody with an annual subscription typing a 30-day
   * code would otherwise trade eleven months for one.
   */
  | { kind: 'already-longer'; code: PromoCode; until: number }
  | { kind: 'unknown' }
  | { kind: 'expired'; code: PromoCode }
  /** Nothing is behind a paywall in this build, so there is nothing to unlock. */
  | { kind: 'nothing-to-unlock' }
  | { kind: 'empty' };

const DAY_MS = 86_400_000;

/** Codes are typed by humans: trim, strip inner spaces, upper-case. */
export function normaliseCode(input: string): string {
  return input.trim().replace(/\s+/g, '').toUpperCase();
}

function parseISODateUTC(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  // End of the stated day, so "redeemable until 30 June" includes 30 June.
  return Date.UTC(y, m - 1, d, 23, 59, 59, 999);
}

export function findCode(input: string): PromoCode | undefined {
  const wanted = normaliseCode(input);
  return PROMO_CODES.find((c) => normaliseCode(c.code) === wanted);
}

export interface RedeemInput {
  input: string;
  now: number;
  /** Epoch ms of the current promotional grant, or null if none is held. */
  currentGrantUntil: number | null;
  /** False when this build has no premium content, so no code can unlock anything. */
  premiumContentExists: boolean;
}

export function redeem({
  input,
  now,
  currentGrantUntil,
  premiumContentExists,
}: RedeemInput): RedeemOutcome {
  if (normaliseCode(input).length === 0) return { kind: 'empty' };
  if (!premiumContentExists) return { kind: 'nothing-to-unlock' };

  const code = findCode(input);
  if (!code) return { kind: 'unknown' };
  if (now > parseISODateUTC(code.redeemableUntil)) return { kind: 'expired', code };

  const days = Math.min(code.days, MAX_GRANT_DAYS);
  const until = now + days * DAY_MS;

  // Extend from *now*, not from the existing expiry. Stacking codes to accumulate
  // years of access is the obvious exploit once the table is public, and refusing
  // to shorten access is a separate promise from agreeing to lengthen it.
  if (currentGrantUntil !== null && currentGrantUntil >= until) {
    return { kind: 'already-longer', code, until: currentGrantUntil };
  }

  return { kind: 'granted', code, until, days };
}

/** What the screen says. One sentence per outcome, all of them true. */
export function redeemMessage(outcome: RedeemOutcome): string {
  switch (outcome.kind) {
    case 'granted':
      return `${outcome.code.label} — unlocked for ${outcome.days} days.`;
    case 'already-longer':
      return 'You already have access for longer than this code would give.';
    case 'unknown':
      return 'That code was not recognised.';
    case 'expired':
      return 'That code has expired.';
    case 'nothing-to-unlock':
      return 'There is no paid content in this version, so nothing to unlock.';
    case 'empty':
      return 'Enter a code.';
  }
}
