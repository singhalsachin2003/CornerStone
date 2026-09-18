/**
 * Every code in the table is public — it ships in the bundle and `strings` will
 * find it. These tests pin down the properties that make that survivable.
 */
import { MAX_GRANT_DAYS, normaliseCode, redeem, redeemMessage } from '@/access/promoCode';
import { PROMO_CODES } from '@/content/promoCodes';

const NOW = Date.UTC(2026, 8, 12);
const DAY = 86_400_000;

function attempt(input: string, over: Partial<Parameters<typeof redeem>[0]> = {}) {
  return redeem({
    input,
    now: NOW,
    currentGrantUntil: null,
    premiumContentExists: true,
    ...over,
  });
}

describe('the table itself', () => {
  it('grants nothing permanently — a year is the ceiling', () => {
    for (const code of PROMO_CODES) {
      expect(code.days).toBeGreaterThan(0);
      expect(code.days).toBeLessThanOrEqual(MAX_GRANT_DAYS);
    }
  });

  it('gives every campaign a retirement date', () => {
    for (const code of PROMO_CODES) {
      expect(code.redeemableUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('has no duplicate codes', () => {
    const seen = PROMO_CODES.map((c) => normaliseCode(c.code));
    expect(new Set(seen).size).toBe(seen.length);
  });

  // Play's "Sign-in details" declaration points a reviewer at this code instead of
  // a demo account. Retiring it silently breaks the next submission.
  it('still carries the reviewer code', () => {
    const reviewer = PROMO_CODES.find((c) => c.code === 'PLAYREVIEW');
    expect(reviewer).toBeDefined();
    expect(reviewer!.days).toBeGreaterThanOrEqual(90);
  });
});

describe('redeeming', () => {
  it('accepts a code however it was typed', () => {
    for (const typed of ['playreview', '  PlayReview ', 'PLAY REVIEW']) {
      expect(attempt(typed).kind).toBe('granted');
    }
  });

  it('grants the stated number of days from now', () => {
    const outcome = attempt('CORNERSTONE30');
    expect(outcome.kind).toBe('granted');
    if (outcome.kind === 'granted') {
      expect(outcome.days).toBe(30);
      expect(outcome.until).toBe(NOW + 30 * DAY);
    }
  });

  it('rejects an unknown code', () => {
    expect(attempt('NOPE').kind).toBe('unknown');
  });

  it('rejects an empty field before looking anything up', () => {
    expect(attempt('   ').kind).toBe('empty');
  });

  it('refuses a campaign past its retirement date', () => {
    const afterRetirement = Date.UTC(2029, 0, 1);
    expect(attempt('PLAYREVIEW', { now: afterRetirement }).kind).toBe('expired');
  });

  it('includes the whole of the final day', () => {
    const lastDay = Date.UTC(2027, 5, 30, 12);
    expect(attempt('CORNERSTONE30', { now: lastDay }).kind).toBe('granted');
  });

  // The reason this exists: somebody holding a year of access who types a 30-day
  // code must not end up with 30 days.
  it('never shortens access already held', () => {
    const outcome = attempt('CORNERSTONE30', { currentGrantUntil: NOW + 300 * DAY });
    expect(outcome.kind).toBe('already-longer');
    if (outcome.kind === 'already-longer') expect(outcome.until).toBe(NOW + 300 * DAY);
  });

  it('extends from now rather than stacking onto an existing grant', () => {
    const outcome = attempt('CFACLASS', { currentGrantUntil: NOW + 10 * DAY });
    expect(outcome.kind).toBe('granted');
    if (outcome.kind === 'granted') expect(outcome.until).toBe(NOW + 60 * DAY);
  });

  it('says plainly that there is nothing to unlock in a build with no paid content', () => {
    expect(attempt('PLAYREVIEW', { premiumContentExists: false }).kind).toBe('nothing-to-unlock');
  });
});

describe('what the screen says', () => {
  it('has a distinct, true sentence for every outcome', () => {
    const outcomes = [
      attempt('CORNERSTONE30'),
      attempt('CORNERSTONE30', { currentGrantUntil: NOW + 300 * DAY }),
      attempt('NOPE'),
      attempt('PLAYREVIEW', { now: Date.UTC(2029, 0, 1) }),
      attempt('PLAYREVIEW', { premiumContentExists: false }),
      attempt(''),
    ];
    const messages = outcomes.map(redeemMessage);
    expect(new Set(messages).size).toBe(messages.length);
    for (const m of messages) expect(m.length).toBeGreaterThan(0);
  });
});
