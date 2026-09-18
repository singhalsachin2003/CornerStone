import {
  BASE_INTERVALS,
  activeItems,
  isRetired,
  pruneRetired,
  ReviewItem,
  addDays,
  dayKey,
  dueItems,
  intervalForStep,
  isDue,
  parseDayKey,
  scheduleLapse,
  schedulePromotion,
} from '@/store/review';

describe('dayKey / addDays', () => {
  it('formats a local date, not a UTC one', () => {
    // 1 Jan 2027 00:30 local. A UTC-based formatter would report 2026-12-31
    // for anyone west of Greenwich.
    const d = new Date(2027, 0, 1, 0, 30);
    expect(dayKey(d)).toBe('2027-01-01');
  });

  it('pads month and day', () => {
    expect(dayKey(new Date(2026, 8, 5))).toBe('2026-09-05');
  });

  it('crosses month and year boundaries', () => {
    expect(addDays(1, new Date(2026, 11, 31))).toBe('2027-01-01');
    expect(addDays(-1, new Date(2027, 0, 1))).toBe('2026-12-31');
    expect(addDays(1, new Date(2028, 1, 28))).toBe('2028-02-29'); // leap year
  });

  it('round-trips through parseDayKey without drifting', () => {
    for (const iso of ['2026-01-01', '2026-07-29', '2026-12-31', '2028-02-29']) {
      expect(dayKey(parseDayKey(iso))).toBe(iso);
    }
  });
});

describe('intervalForStep', () => {
  it('uses the intervals the product copy promises', () => {
    // "They'll resurface tomorrow, then in four days, then in ten."
    expect(BASE_INTERVALS).toEqual([1, 4, 10]);
    expect(intervalForStep(0)).toBe(1);
    expect(intervalForStep(1)).toBe(4);
    expect(intervalForStep(2)).toBe(10);
  });

  it('never shrinks, and strictly grows until it reaches the cap', () => {
    const seq = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(intervalForStep);
    for (let i = 1; i < seq.length; i++) {
      // Non-decreasing everywhere; strictly increasing while below the cap, where
      // it is expected to plateau rather than keep climbing.
      expect(seq[i]).toBeGreaterThanOrEqual(seq[i - 1]);
      if (seq[i - 1] < 120) expect(seq[i]).toBeGreaterThan(seq[i - 1]);
    }
  });

  it('caps so an item can never be scheduled absurdly far out', () => {
    expect(intervalForStep(50)).toBeLessThanOrEqual(120);
    expect(intervalForStep(1000)).toBeLessThanOrEqual(120);
  });
});

describe('scheduleLapse', () => {
  it('puts a newly missed question due tomorrow', () => {
    const item = scheduleLapse(undefined, 'cfa-l1-fixed', 2);
    expect(item.id).toBe('cfa-l1-fixed#2');
    expect(item.step).toBe(0);
    expect(item.lapses).toBe(1);
    expect(item.dueOn).toBe(addDays(1));
  });

  it('resets an already-promoted item back to the start and counts the lapse', () => {
    const promoted: ReviewItem = {
      id: 'cfa-l1-fixed#2',
      topicKey: 'cfa-l1-fixed',
      qIdx: 2,
      step: 2,
      dueOn: addDays(10),
      lapses: 1,
      updatedAt: 0,
    };
    const relapsed = scheduleLapse(promoted, 'cfa-l1-fixed', 2);
    expect(relapsed.step).toBe(0);
    expect(relapsed.dueOn).toBe(addDays(1));
    expect(relapsed.lapses).toBe(2);
  });
});

describe('schedulePromotion', () => {
  const base: ReviewItem = {
    id: 'cfa-l1-ethics#0',
    topicKey: 'cfa-l1-ethics',
    qIdx: 0,
    step: 0,
    dueOn: addDays(1),
    lapses: 1,
    updatedAt: 0,
  };

  it('advances one rung and pushes the due date out', () => {
    const next = schedulePromotion(base)!;
    expect(next.step).toBe(1);
    expect(next.dueOn).toBe(addDays(4));
    expect(next.lapses).toBe(1); // promotion is not a lapse
  });

  /**
   * Retirement used to delete the item. It now leaves a tombstone, because a
   * deletion cannot be represented by an absent row: a second device still
   * holding its own copy would treat that copy as newer and put the question
   * back on the next merge.
   */
  it('retires an item after enough clean passes, as a tombstone rather than a deletion', () => {
    let item = base;
    let promotions = 0;
    while (!isRetired(item) && promotions < 20) {
      item = schedulePromotion(item);
      promotions++;
    }
    expect(isRetired(item)).toBe(true);
    expect(item.retiredAt).toBeGreaterThan(0);
    // Graduation must be reachable, and not instant.
    expect(promotions).toBeGreaterThan(1);
    expect(promotions).toBeLessThan(20);
  });

  it('stamps every promotion so a merge can order two devices', () => {
    const promoted = schedulePromotion(base, 1_700_000_000_000);
    expect(promoted.updatedAt).toBe(1_700_000_000_000);
  });

  it('brings a retired item back when it is missed again, keeping the lapse count', () => {
    const retired: ReviewItem = { ...base, step: 9, retiredAt: 111, updatedAt: 111, lapses: 2 };
    const relapsed = scheduleLapse(retired, retired.topicKey, retired.qIdx, 222);
    expect(relapsed.retiredAt).toBeUndefined();
    expect(relapsed.step).toBe(0);
    expect(relapsed.lapses).toBe(3);
    expect(relapsed.updatedAt).toBe(222);
  });
});

describe('tombstones', () => {
  const mk = (id: string, retiredAt?: number): ReviewItem => ({
    id,
    topicKey: 'cfa-l1-fixed',
    qIdx: 0,
    step: 0,
    dueOn: '2026-01-01',
    lapses: 1,
    updatedAt: 0,
    retiredAt,
  });

  it('never counts a retired item as due, however old its due date', () => {
    expect(isDue(mk('a', 999), '2030-01-01')).toBe(false);
    expect(dueItems([mk('a', 999), mk('b')], '2030-01-01').map((i) => i.id)).toEqual(['b']);
  });

  it('excludes retired items from the active queue', () => {
    expect(activeItems([mk('a', 999), mk('b')]).map((i) => i.id)).toEqual(['b']);
  });

  /**
   * A tombstone only has to outlive the slowest device that might still hold the
   * live item. Keeping them forever would grow the queue without bound for a
   * long-term user, which is the thing the pruning exists to prevent.
   */
  it('prunes tombstones past the retention window and keeps live items forever', () => {
    const now = 1_000_000_000_000;
    const day = 86_400_000;
    const queue = [mk('old', now - 100 * day), mk('recent', now - 10 * day), mk('live')];
    expect(pruneRetired(queue, now).map((i) => i.id)).toEqual(['recent', 'live']);
  });
});

describe('isDue / dueItems', () => {
  const mk = (id: string, dueOn: string): ReviewItem => ({
    id,
    topicKey: 'cfa-l1-fixed',
    qIdx: 0,
    step: 0,
    dueOn,
    lapses: 1,
    updatedAt: 0,
  });

  it('treats today as due, and overdue as due', () => {
    expect(isDue(mk('a', '2026-07-29'), '2026-07-29')).toBe(true);
    expect(isDue(mk('b', '2026-07-01'), '2026-07-29')).toBe(true);
  });

  it('does not surface future items', () => {
    expect(isDue(mk('c', '2026-07-30'), '2026-07-29')).toBe(false);
  });

  it('filters a mixed queue correctly', () => {
    const queue = [
      mk('overdue', '2026-07-20'),
      mk('today', '2026-07-29'),
      mk('tomorrow', '2026-07-30'),
      mk('later', '2026-08-15'),
    ];
    expect(dueItems(queue, '2026-07-29').map((i) => i.id)).toEqual(['overdue', 'today']);
  });

  it('compares dates as strings safely across month boundaries', () => {
    // Lexicographic comparison on zero-padded ISO must agree with chronology.
    expect(isDue(mk('d', '2026-09-02'), '2026-10-01')).toBe(true);
    expect(isDue(mk('e', '2026-10-01'), '2026-09-02')).toBe(false);
  });
});
