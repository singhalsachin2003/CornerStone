/**
 * Numeric option sets are not shuffled at session time — exam boards print values
 * in order and scrambling them makes an item harder to read without making it
 * harder to answer. So for those questions the authored position is the position
 * every candidate sees, and an authoring bias becomes a defect: before this,
 * roughly half of them had the answer in the second slot and none in the fourth.
 */
import {
  ALL_TOPICS,
  Question,
  QUESTIONS,
  isAscending,
  isNumericOptionSet,
  normaliseOptionOrder,
  optionValue,
  premiumSegmentsFor,
  questionsFor,
  segmentsFor,
} from '@/content';

function q(over: Partial<Question> = {}): Question {
  return {
    text: 'stem',
    given: null,
    opts: ['1.0%', '2.0%', '3.0%', '4.0%'],
    a: 0,
    why: 'because',
    ref: 'ref',
    ...over,
  };
}

describe('recognising a numeric option set', () => {
  it('accepts percentages, plain numbers and currency amounts', () => {
    expect(isNumericOptionSet(q({ opts: ['1.0%', '2.0%', '3.0%', '4.0%'] }))).toBe(true);
    expect(isNumericOptionSet(q({ opts: ['41.60', '44.44', '50.00', '52.00'] }))).toBe(true);
    expect(isNumericOptionSet(q({ opts: ['220,000', '400,000', '1,100,000', '2,000,000'] }))).toBe(
      true,
    );
  });

  it('rejects a set where any option carries prose', () => {
    expect(isNumericOptionSet(q({ opts: ['1.0%', '2.0%', '3.0%', 'Indeterminate'] }))).toBe(false);
    expect(isNumericOptionSet(q({ opts: ['17 contracts', '24 contracts', '12', '34'] }))).toBe(
      false,
    );
  });

  it('parses signs and separators', () => {
    expect(optionValue('−1.84%')).toBeCloseTo(-1.84);
    expect(optionValue('1,100,000')).toBe(1100000);
    expect(optionValue('£3.49')).toBeCloseTo(3.49);
  });
});

describe('normalising', () => {
  it('sorts ascending and carries the answer with it', () => {
    const out = normaliseOptionOrder(q({ opts: ['0.71%', '1.00%', '1.41%', '0.50%'], a: 1 }));
    expect(out.opts).toEqual(['0.50%', '0.71%', '1.00%', '1.41%']);
    expect(out.opts[out.a]).toBe('1.00%');
  });

  it('leaves an already-ascending set untouched', () => {
    const input = q({ opts: ['1.0%', '2.0%', '3.0%', '4.0%'], a: 2 });
    expect(normaliseOptionOrder(input)).toBe(input);
  });

  it('leaves a prose set alone, since those are shuffled per sitting anyway', () => {
    const input = q({ opts: ['Rises', 'Falls', 'Unchanged', 'Indeterminate'], a: 1 });
    expect(normaliseOptionOrder(input)).toBe(input);
  });
});

describe('the shipped catalogue', () => {
  const everyQuestion: Question[] = [];
  for (const topic of ALL_TOPICS) {
    for (const segment of segmentsFor(topic.key)) everyQuestion.push(...segment.questions);
  }

  it('exposes every numeric option set in ascending order', () => {
    const offenders = everyQuestion
      .filter(isNumericOptionSet)
      .filter((question) => !isAscending(question));
    expect(offenders.map((o) => o.text)).toEqual([]);
  });

  /**
   * The reason the module exists. Before sorting, 51% of these had the answer in
   * slot B and *none* had it in slot D — "always pick B" scored twice what
   * guessing should. Sorting makes position a function of magnitude, which spreads
   * it to roughly 13/47/33/7 and fills every slot.
   *
   * The bound is 50% rather than 25% because sorting cannot fix everything: the
   * residual comes from a real authoring habit of writing one distractor below the
   * answer and two above it, and closing that gap means re-choosing distractor
   * values question by question, not another transformation. The test guards
   * against regression to the old state rather than claiming the problem is gone.
   */
  it('spreads the answers of unshuffled questions across the four slots', () => {
    const fixed = everyQuestion.filter(isNumericOptionSet);
    const counts = [0, 0, 0, 0];
    for (const question of fixed) counts[question.a] += 1;
    expect(fixed.length).toBeGreaterThan(50);
    expect(Math.max(...counts) / fixed.length).toBeLessThan(0.5);
    expect(Math.min(...counts)).toBeGreaterThan(0);
  });

  it('normalises the free banks and the premium segments alike', () => {
    expect(questionsFor('cfa-l1-quant').filter(isNumericOptionSet).every(isAscending)).toBe(true);
    for (const topic of ALL_TOPICS) {
      for (const segment of premiumSegmentsFor(topic.key)) {
        expect(segment.questions.filter(isNumericOptionSet).every(isAscending)).toBe(true);
      }
    }
  });

  it('leaves the exported QUESTIONS bank normalised too', () => {
    for (const bank of Object.values(QUESTIONS)) {
      expect(bank.filter(isNumericOptionSet).every(isAscending)).toBe(true);
    }
  });
});
