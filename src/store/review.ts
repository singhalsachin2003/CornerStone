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
  /**
   * Epoch ms of the last change, for cross-device merge — later wins.
   *
   * `dueOn` cannot serve: it is in the future by construction and says nothing
   * about when the item was last touched. An item restored from a build that
   * predates sync carries 0 and loses its first merge, which is correct — the
   * winner is then written back with a real stamp and both devices converge.
   */
  updatedAt: number;
  /**
   * Epoch ms at which the item graduated out of the queue, if it has.
   *
   * A retired item stays in the queue as a tombstone rather than being deleted.
   * A deletion cannot be represented by an absent row: a device that has not
   * synced since before the promotion would see its own copy as new and put the
   * question back. `pruneRetired` bounds the growth.
   */
  retiredAt?: number;
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

/**
 * A missed question enters the queue, or resets if it was already there.
 *
 * A retired item that is missed again comes back: the tombstone is cleared and
 * the lapse count continues from where it left off, because the candidate has
 * demonstrably not finished with the question.
 */
export function scheduleLapse(
  existing: ReviewItem | undefined,
  topicKey: string,
  qIdx: number,
  now: number = Date.now(),
): ReviewItem {
  return {
    id: `${topicKey}#${qIdx}`,
    topicKey,
    qIdx,
    step: 0,
    dueOn: addDays(intervalForStep(0)),
    lapses: (existing?.lapses ?? 0) + 1,
    updatedAt: now,
    retiredAt: undefined,
  };
}

/**
 * A correct answer on a queued question promotes it to the next interval, or
 * retires it once it has graduated.
 *
 * Retirement returns a tombstone rather than null. The caller used to delete the
 * item, which is invisible to another device holding its own copy.
 */
export function schedulePromotion(item: ReviewItem, now: number = Date.now()): ReviewItem {
  const nextStep = item.step + 1;
  // Graduated: three clean passes retires the item from the queue.
  if (nextStep >= BASE_INTERVALS.length + 3) {
    return { ...item, step: nextStep, updatedAt: now, retiredAt: now };
  }
  return {
    ...item,
    step: nextStep,
    dueOn: addDays(intervalForStep(nextStep)),
    updatedAt: now,
    retiredAt: undefined,
  };
}

/** Retired items are tombstones, not queue members. */
export function isRetired(item: ReviewItem): boolean {
  return item.retiredAt !== undefined;
}

/** Items still in the queue — everything the UI counts, shows or schedules. */
export function activeItems(queue: ReviewItem[]): ReviewItem[] {
  return queue.filter((i) => !isRetired(i));
}

export function isDue(item: ReviewItem, today: string = dayKey()): boolean {
  return !isRetired(item) && item.dueOn <= today;
}

export function dueItems(queue: ReviewItem[], today: string = dayKey()): ReviewItem[] {
  return queue.filter((i) => isDue(i, today));
}

/**
 * How long a tombstone is kept before it is dropped.
 *
 * A tombstone only has to outlive the slowest device that might still hold the
 * live item. Ninety days is far beyond any plausible gap, and keeping them
 * forever would grow the queue without bound for a long-term user.
 */
export const TOMBSTONE_RETENTION_DAYS = 90;

export function pruneRetired(
  queue: ReviewItem[],
  now: number = Date.now(),
  retentionDays: number = TOMBSTONE_RETENTION_DAYS,
): ReviewItem[] {
  const cutoff = now - retentionDays * 86_400_000;
  return queue.filter((i) => i.retiredAt === undefined || i.retiredAt > cutoff);
}
