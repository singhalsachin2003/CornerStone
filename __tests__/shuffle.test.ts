import { Question } from '@/content';
import { shuffleOptions, shuffleSession, shuffled, shuffledPair } from '@/store/shuffle';

const q = (over: Partial<Question> = {}): Question => ({
  text: 'Which Standard is violated?',
  given: null,
  opts: ['Standard I(A)', 'Standard III(B)', 'Standard IV(B)', 'Standard VI(A)'],
  a: 2,
  why: 'because',
  ref: 'ref',
  ...over,
});

describe('shuffled', () => {
  it('preserves every element exactly once', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffled(input);
    expect(out).toHaveLength(input.length);
    expect([...out].sort((a, b) => a - b)).toEqual(input);
  });

  it('does not mutate its input', () => {
    const input = [1, 2, 3];
    shuffled(input);
    expect(input).toEqual([1, 2, 3]);
  });
});

describe('shuffledPair', () => {
  it('applies the same permutation to both arrays', () => {
    const letters = ['a', 'b', 'c', 'd', 'e'];
    const numbers = [0, 1, 2, 3, 4];
    for (let run = 0; run < 50; run++) {
      const [ls, ns] = shuffledPair(letters, numbers);
      // Wherever a letter landed, its partner number must be at the same index.
      ls.forEach((l, i) => expect(ns[i]).toBe(letters.indexOf(l)));
    }
  });
});

describe('shuffleOptions', () => {
  it('keeps the correct answer correct', () => {
    for (let run = 0; run < 200; run++) {
      const original = q();
      const s = shuffleOptions(original);
      expect(s.opts[s.a]).toBe(original.opts[original.a]);
    }
  });

  it('keeps the same set of options', () => {
    const original = q();
    const s = shuffleOptions(original);
    expect([...s.opts].sort()).toEqual([...original.opts].sort());
  });

  it('preserves the stem, explanation and reference', () => {
    const original = q({ given: 'ModDur = 7.2' });
    const s = shuffleOptions(original);
    expect(s.text).toBe(original.text);
    expect(s.given).toBe(original.given);
    expect(s.why).toBe(original.why);
    expect(s.ref).toBe(original.ref);
  });

  it('actually reorders sometimes', () => {
    const original = q();
    const reordered = Array.from({ length: 100 }, () => shuffleOptions(original)).some(
      (s) => s.opts.join('|') !== original.opts.join('|'),
    );
    expect(reordered).toBe(true);
  });

  it('leaves numeric answer sets in their printed order', () => {
    // Exam boards present numeric choices in ascending order; scrambling them makes
    // the item harder to read without making it harder to answer.
    const numeric = q({ opts: ['−2.88%', '−0.29%', '+2.88%', '−7.20%'], a: 0 });
    for (let run = 0; run < 50; run++) {
      expect(shuffleOptions(numeric).opts).toEqual(numeric.opts);
    }
    const money = q({ opts: ['$7.9m', '$25.0m', '$2.5m', '$5.0m'], a: 0 });
    expect(shuffleOptions(money).opts).toEqual(money.opts);
  });
});

describe('shuffleSession', () => {
  const bank = [q({ text: 'Q1' }), q({ text: 'Q2' }), q({ text: 'Q3' }), q({ text: 'Q4' }), q({ text: 'Q5' })];
  const origins = bank.map((_, i) => ({ topicKey: 'cfa-l1-ethics', qIdx: i }));

  it('keeps each question paired with its bank index', () => {
    for (let run = 0; run < 100; run++) {
      const [qs, os] = shuffleSession(bank, origins);
      qs.forEach((question, i) => {
        // origins[i].qIdx must still address the same question in the original bank,
        // or the review queue would key lapses to the wrong item.
        expect(bank[os[i].qIdx].text).toBe(question.text);
      });
    }
  });

  it('returns every question exactly once', () => {
    const [qs] = shuffleSession(bank, origins);
    expect(qs.map((x) => x.text).sort()).toEqual(['Q1', 'Q2', 'Q3', 'Q4', 'Q5']);
  });

  it('varies the order across sessions', () => {
    const orders = new Set(
      Array.from({ length: 60 }, () => shuffleSession(bank, origins)[0].map((x) => x.text).join('')),
    );
    // A retake that always replayed the same order would give exactly one.
    expect(orders.size).toBeGreaterThan(1);
  });
});
