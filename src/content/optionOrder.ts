/**
 * Canonical option order for numeric answer sets.
 *
 * `shuffleOptions` deliberately leaves numeric option sets alone: exam boards
 * print values in order, and scrambling "1.20 / 1.35 / 1.50 / 1.65" makes an item
 * harder to read without making it harder to answer. The consequence is that for
 * those questions the *authored* position is the position every candidate sees,
 * every time.
 *
 * Which made an authoring bias into a defect. Of the questions whose options stay
 * put, roughly half had the correct answer in the second slot and none had it in
 * the fourth — so "pick B" scored far better than it should, on exactly the
 * questions where a candidate is most tempted to guess.
 *
 * Sorting ascending fixes it at the root rather than by hand: position becomes a
 * function of magnitude, which is uncorrelated with correctness, and it is what
 * the convention said the options were doing anyway. A content check enforces it
 * so the bias cannot creep back in with the next batch written.
 */
import { Question } from './types';

/**
 * An option that reads as a bare value. Deliberately the same test
 * `shouldShuffleOptions` uses, because these are exactly the sets that are not
 * shuffled at session time.
 */
export const NUMERIC_OPTION = /^[−\-+]?[\d.,]+\s*%?$|^\$?[\d.,]+[mbk]?$/i;

export function isNumericOptionSet(q: Question): boolean {
  return q.opts.every((o) => NUMERIC_OPTION.test(o.trim()));
}

/** "−1.84%" → −1.84, "1,100,000" → 1100000, "£3.49" → 3.49. */
export function optionValue(option: string): number {
  const cleaned = option.replace(/−/g, '-').replace(/[^0-9.\-]/g, '');
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

export function isAscending(q: Question): boolean {
  const values = q.opts.map(optionValue);
  return values.every((v, i) => i === 0 || v >= values[i - 1]);
}

/**
 * Sort a numeric option set ascending, carrying the answer index with it.
 * Non-numeric sets are returned untouched — those are shuffled at session time,
 * where ordering is randomised per sitting and carries no information.
 */
export function normaliseOptionOrder(q: Question): Question {
  if (!isNumericOptionSet(q) || isAscending(q)) return q;
  const order = q.opts
    .map((_, i) => i)
    .sort((x, y) => optionValue(q.opts[x]) - optionValue(q.opts[y]));
  return { ...q, opts: order.map((i) => q.opts[i]), a: order.indexOf(q.a) };
}
