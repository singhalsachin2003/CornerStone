/**
 * Spaced repetition scheduling.
 *
 * The product copy promises "tomorrow, then in four days, then in ten", so the
 * first three intervals are fixed at 1 / 4 / 10 days. Beyond that the interval
 * grows by an SM-2 style ease factor. A lapse sends the item back to the start.
 */

export const BASE_INTERVALS = [1, 4, 10] as const;
const EASE = 2.3;
const MAX_INTERVAL = 120;

export interface ReviewItem {
  /** `${topicKey}#${questionIndex}` */
  id: string;
  topicKey: string;
  qIdx: number;
  /** Position in the interval ladder. 0 means "due tomorrow". */
  step: number;
  /** Date-only ISO string, e.g. "2026-07-30". */
  dueOn: string;
  lapses: number;
}

/** Date-only key in local time — the unit the whole review system works in. */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return dayKey(d);
}

/**
 * Inverse of dayKey. Never use `new Date(iso)` for these: that parses as UTC midnight,
 * which dayKey then reads back with local getters — a day early anywhere behind UTC.
 */
export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function intervalForStep(step: number): number {
  if (step < BASE_INTERVALS.length) return BASE_INTERVALS[step];
  const beyond = step - BASE_INTERVALS.length + 1;
  return Math.min(MAX_INTERVAL, Math.round(BASE_INTERVALS[BASE_INTERVALS.length - 1] * EASE ** beyond));
}

/** A missed question enters the queue, or resets if it was already there. */
export function scheduleLapse(existing: ReviewItem | undefined, topicKey: string, qIdx: number): ReviewItem {
  return {
    id: `${topicKey}#${qIdx}`,
    topicKey,
    qIdx,
    step: 0,
    dueOn: addDays(intervalForStep(0)),
    lapses: (existing?.lapses ?? 0) + 1,
  };
}

/** A correct answer on a queued question promotes it to the next interval. */
export function schedulePromotion(item: ReviewItem): ReviewItem | null {
  const nextStep = item.step + 1;
  // Graduated: three clean passes retires the item from the queue.
  if (nextStep >= BASE_INTERVALS.length + 3) return null;
  return { ...item, step: nextStep, dueOn: addDays(intervalForStep(nextStep)) };
}

export function isDue(item: ReviewItem, today: string = dayKey()): boolean {
  return item.dueOn <= today;
}

export function dueItems(queue: ReviewItem[], today: string = dayKey()): ReviewItem[] {
  return queue.filter((i) => isDue(i, today));
}
