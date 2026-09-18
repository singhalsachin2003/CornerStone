/**
 * Looking a term up. Pure, so the behaviour below is pinned by tests rather than
 * by tapping around the screen.
 */
import { GlossaryExam, GlossaryTerm } from './types';

/**
 * Fold a string to something comparable: lowercase, accents stripped, and every
 * run of non-alphanumerics reduced to a single space.
 *
 * Punctuation has to go. Candidates type "value at risk" for "Value-at-Risk" and
 * "buy and hold" for "buy-and-hold", and an exact-substring search over the raw
 * strings finds neither. Accents go for the same reason — nobody types the
 * diaeresis in "naïve".
 */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Everything about a term that a query may match. */
function haystack(t: GlossaryTerm): string[] {
  return [t.term, ...(t.aka ?? [])].map(fold);
}

/**
 * Rank, low is better. A prefix match beats a word-start match beats a match
 * anywhere, so typing "dur" puts "Duration" above "Macaulay duration" and both
 * above "Effective duration gap". Within a rank the caller's alphabetical order
 * survives, because the sort below is stable.
 */
function rank(names: string[], q: string): number {
  let best = Infinity;
  for (const n of names) {
    if (n === q) return 0;
    if (n.startsWith(q)) best = Math.min(best, 1);
    else if (n.includes(` ${q}`)) best = Math.min(best, 2);
    else if (n.includes(q)) best = Math.min(best, 3);
  }
  return best;
}

/**
 * Terms matching `query`, best first. An empty or whitespace-only query returns
 * everything, which is what makes the same function serve both the search box
 * and the plain A–Z list.
 *
 * The definition body is deliberately **not** searched. Including it turns a
 * search for "risk" into most of the glossary, and a lookup that returns two
 * hundred rows has not answered anything.
 */
export function searchTerms(terms: GlossaryTerm[], query: string): GlossaryTerm[] {
  const q = fold(query);
  if (!q) return terms;
  return terms
    .map((t) => ({ t, r: rank(haystack(t), q) }))
    .filter((x) => x.r !== Infinity)
    .sort((a, b) => a.r - b.r)
    .map((x) => x.t);
}

/** CFA and FRM topic keys are prefixed, so a term's exams follow from its topics. */
export function examsFor(term: GlossaryTerm): GlossaryExam[] {
  const exams = new Set<GlossaryExam>();
  for (const key of term.topics) {
    if (key.startsWith('cfa-')) exams.add('CFA');
    if (key.startsWith('frm-')) exams.add('FRM');
  }
  return [...exams];
}

/** Terms tagged with any of `topicKeys`; an empty filter means no filtering. */
export function filterByTopics(terms: GlossaryTerm[], topicKeys: string[]): GlossaryTerm[] {
  if (topicKeys.length === 0) return terms;
  const wanted = new Set(topicKeys);
  return terms.filter((t) => t.topics.some((k) => wanted.has(k)));
}

export function filterByExam(terms: GlossaryTerm[], exam: GlossaryExam | null): GlossaryTerm[] {
  if (!exam) return terms;
  return terms.filter((t) => examsFor(t).includes(exam));
}

export interface GlossarySection {
  /** "A"–"Z", or "#" for anything that does not start with a letter. */
  letter: string;
  terms: GlossaryTerm[];
}

/** The initial a term files under. Digits and symbols share one "#" section. */
export function initialOf(term: GlossaryTerm): string {
  const c = fold(term.term).charAt(0).toUpperCase();
  return c >= 'A' && c <= 'Z' ? c : '#';
}

/**
 * Group into A–Z sections for the list. Input order is preserved inside each
 * section, and empty sections are dropped rather than rendered as bare headings.
 */
export function sectionise(terms: GlossaryTerm[]): GlossarySection[] {
  const byLetter = new Map<string, GlossaryTerm[]>();
  for (const t of terms) {
    const l = initialOf(t);
    const bucket = byLetter.get(l);
    if (bucket) bucket.push(t);
    else byLetter.set(l, [t]);
  }
  return [...byLetter.entries()]
    .sort((a, b) => {
      // "#" sorts last: digits before letters is the ASCII order, but a candidate
      // scanning an index expects A at the top.
      if (a[0] === '#') return 1;
      if (b[0] === '#') return -1;
      return a[0].localeCompare(b[0]);
    })
    .map(([letter, ts]) => ({ letter, terms: ts }));
}

/** Alphabetical by term, ignoring case, accents and leading punctuation. */
export function sortTerms(terms: GlossaryTerm[]): GlossaryTerm[] {
  return [...terms].sort((a, b) => fold(a.term).localeCompare(fold(b.term)));
}
