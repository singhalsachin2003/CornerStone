import { Question } from '@/content';

/** Fisher–Yates on a copy. */
export function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Shuffle two parallel arrays with the same permutation. */
export function shuffledPair<A, B>(a: readonly A[], b: readonly B[]): [A[], B[]] {
  const order = shuffled(a.map((_, i) => i));
  return [order.map((i) => a[i]), order.map((i) => b[i])];
}

/**
 * Shuffle a question's options and move the answer index with them.
 *
 * Without this, the correct answer sits at the same position on every retake, so a
 * candidate re-learns positions rather than content. Questions whose options are
 * ordinal — numeric values, or a set that reads as a sequence — are left alone,
 * because reordering those makes the item harder to read without making it harder
 * to answer.
 */
export function shuffleOptions(q: Question): Question {
  if (!shouldShuffleOptions(q)) return q;

  const order = shuffled(q.opts.map((_, i) => i));
  return {
    ...q,
    opts: order.map((i) => q.opts[i]),
    a: order.indexOf(q.a),
  };
}

/**
 * Numeric answer sets are conventionally presented in order (ascending values, or
 * "A discount / Par / A premium"), and exam boards print them that way. Detect the
 * numeric case and leave those untouched.
 */
function shouldShuffleOptions(q: Question): boolean {
  const numericLike = q.opts.filter((o) => /^[−\-+]?[\d.,]+\s*%?$|^\$?[\d.,]+[mbk]?$/i.test(o.trim()));
  return numericLike.length < q.opts.length;
}

/** A whole session: question order shuffled, options shuffled, origins kept in step. */
export function shuffleSession<O>(questions: readonly Question[], origins: readonly O[]): [Question[], O[]] {
  const [qs, os] = shuffledPair(questions, origins);
  return [qs.map(shuffleOptions), os];
}
