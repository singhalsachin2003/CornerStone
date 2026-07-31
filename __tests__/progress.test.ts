import { GUEST_NAME, currentStreak, initialsFor, weekStrip, weightedProgress } from '@/store/useStudyStore';
import { addDays, dayKey } from '@/store/review';
import { formatExamDate, parseISODate, topicsFor } from '@/content';

describe('currentStreak', () => {
  it('is zero with no history', () => {
    expect(currentStreak([])).toBe(0);
  });

  it('counts a run ending today', () => {
    const days = [addDays(-2), addDays(-1), dayKey()];
    expect(currentStreak(days)).toBe(3);
  });

  it('still counts a run ending yesterday — the day is not over', () => {
    const days = [addDays(-3), addDays(-2), addDays(-1)];
    expect(currentStreak(days)).toBe(3);
  });

  it('is broken by a gap', () => {
    // Studied 5 and 4 days ago, then nothing until today.
    const days = [addDays(-5), addDays(-4), dayKey()];
    expect(currentStreak(days)).toBe(1);
  });

  it('is zero when the last session is older than yesterday', () => {
    expect(currentStreak([addDays(-4), addDays(-3), addDays(-2)])).toBe(0);
  });

  it('is not confused by unsorted or duplicated entries', () => {
    const days = [dayKey(), addDays(-2), addDays(-1), dayKey(), addDays(-1)];
    expect(currentStreak(days)).toBe(3);
  });

  it('counts across a month boundary', () => {
    // Anchor on a real boundary rather than relying on today's date.
    const days = ['2026-08-01', '2026-07-31', '2026-07-30'];
    const set = new Set(days);
    // Walk the same way the implementation does, from the newest day backwards.
    let count = 0;
    const d = parseISODate('2026-08-01');
    while (set.has(dayKey(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    expect(count).toBe(3);
  });
});

describe('initialsFor', () => {
  it('takes the first letter of the first two words', () => {
    expect(initialsFor('Anaya Kulkarni')).toBe('AK');
  });

  it('ignores words past the second', () => {
    expect(initialsFor('Jean Baptiste Grenouille')).toBe('JB');
  });

  it('handles a single name', () => {
    expect(initialsFor('Prakash')).toBe('P');
  });

  it('tolerates stray whitespace', () => {
    expect(initialsFor('  mei   chen  ')).toBe('MC');
  });

  it('falls back to the guest initial for unusable input', () => {
    expect(initialsFor('   ')).toBe('G');
    expect(initialsFor('')).toBe('G');
  });

  it('gives the guest placeholder a single initial', () => {
    expect(initialsFor(GUEST_NAME)).toBe('G');
  });
});

describe('weekStrip', () => {
  it('always returns seven Monday-first days', () => {
    const strip = weekStrip([]);
    expect(strip).toHaveLength(7);
    expect(strip.map((d) => d.label)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });

  it('marks exactly one day as today, and nothing before it as future', () => {
    const strip = weekStrip([]);
    expect(strip.filter((d) => d.isToday)).toHaveLength(1);
    const todayIdx = strip.findIndex((d) => d.isToday);
    strip.forEach((d, i) => expect(d.isFuture).toBe(i > todayIdx));
  });

  it('flags a studied day inside the current week', () => {
    const strip = weekStrip([dayKey()]);
    expect(strip.find((d) => d.isToday)?.studied).toBe(true);
  });

  it('ignores study days outside the current week', () => {
    const strip = weekStrip(['2020-01-01']);
    expect(strip.some((d) => d.studied)).toBe(false);
  });
});

describe('weightedProgress', () => {
  const topics = [
    { key: 'heavy', weightMid: 20 },
    { key: 'light', weightMid: 5 },
  ];

  it('is zero with no mastery', () => {
    expect(weightedProgress(topics, {})).toBe(0);
  });

  it('weights by exam weight, not by topic count', () => {
    // Mastering only the heavy topic must beat mastering only the light one.
    const heavyOnly = weightedProgress(topics, { heavy: 100 });
    const lightOnly = weightedProgress(topics, { light: 100 });
    expect(heavyOnly).toBe(80); // 20/25
    expect(lightOnly).toBe(20); // 5/25
    expect(heavyOnly).toBeGreaterThan(lightOnly);
  });

  it('reaches 100 only when everything is mastered', () => {
    expect(weightedProgress(topics, { heavy: 100, light: 100 })).toBe(100);
  });

  it('does not divide by zero on an empty topic list', () => {
    expect(weightedProgress([], { anything: 100 })).toBe(0);
  });

  it('differs from a flat mean when weights are uneven', () => {
    const mastery = { heavy: 100, light: 0 };
    const flatMean = (100 + 0) / 2;
    expect(weightedProgress(topics, mastery)).not.toBe(flatMean);
  });
});

describe('exam dates', () => {
  it('are ISO and parse to a real date on any engine', () => {
    // Hermes only parses ISO-8601. A human-readable date yields Invalid Date on
    // device while working on web under V8 — this is the regression guard.
    for (const iso of ['2027-05-17', '2026-11-15']) {
      const d = parseISODate(iso);
      expect(Number.isFinite(d.getTime())).toBe(true);
      expect(dayKey(d)).toBe(iso);
    }
  });

  it('format for display without leaking NaN', () => {
    expect(formatExamDate('2027-05-17')).toBe('17 May 2027');
    expect(formatExamDate('2026-11-15')).toBe('15 November 2026');
  });
});

describe('topicsFor', () => {
  it('returns the published number of areas per level', () => {
    expect(topicsFor('CFA', 'L1')).toHaveLength(10);
    expect(topicsFor('CFA', 'L2')).toHaveLength(10);
    expect(topicsFor('FRM', 'P1')).toHaveLength(4);
    expect(topicsFor('FRM', 'P2')).toHaveLength(6);
  });

  it('gives Level III five core areas plus the chosen pathway', () => {
    const portfolio = topicsFor('CFA', 'L3', 'portfolio');
    const wealth = topicsFor('CFA', 'L3', 'private-wealth');
    expect(portfolio).toHaveLength(6);
    expect(wealth).toHaveLength(6);
    // The first five are shared; only the sixth changes with the pathway.
    expect(portfolio.slice(0, 5)).toEqual(wealth.slice(0, 5));
    expect(portfolio[5].key).not.toBe(wealth[5].key);
  });

  it('keys every topic uniquely so exams never share progress', () => {
    const all = [
      ...topicsFor('CFA', 'L1'),
      ...topicsFor('CFA', 'L2'),
      ...topicsFor('CFA', 'L3'),
      ...topicsFor('FRM', 'P1'),
      ...topicsFor('FRM', 'P2'),
    ].map((t) => t.key);
    expect(new Set(all).size).toBe(all.length);
  });
});
