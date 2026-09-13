/**
 * The glossary: every term a candidate might need to look up, in one place.
 *
 * **Free, permanently, for both exams.** Nothing here goes through
 * `src/access/rules.ts` and nothing here belongs to a segment. A candidate who
 * cannot remember what "convexity" means is not a candidate to sell to — and a
 * paywalled dictionary would make the app worse at the one job it has. The
 * subscription sells the pipeline of new segments; a reference does not renew.
 *
 * Terms are keyed rather than positional, unlike questions. The review queue
 * keys items as `topicKey#index` and so depends on authored order forever; the
 * glossary has no such constraint, so entries may be added, reworded or
 * reordered freely.
 */

/** Which exam a term belongs to, derived from its topics rather than authored. */
export type GlossaryExam = 'CFA' | 'FRM';

export interface GlossaryTerm {
  /**
   * Stable, globally unique slug — lowercase, hyphenated, e.g. `modified-duration`.
   * Used as the React key and as the anchor when a card links to a definition.
   */
  key: string;
  /** The term as a candidate would see it written in the curriculum. */
  term: string;
  /**
   * Other names for the same thing, so search finds it under whichever one the
   * candidate happens to know. "Vol", "sigma" and "standard deviation" are all
   * one entry, not three.
   */
  aka?: string[];
  /**
   * What it is, in one or two sentences of plain English.
   *
   * Written to be read cold, by someone who has just met the term in a question
   * and does not yet have the surrounding chapter. No forward references to
   * other entries that are not themselves defined here.
   */
  definition: string;
  /** Rendered in the bordered block, same treatment as a snapshot card. */
  formula?: string;
  /**
   * The exam angle: the distinction that gets tested, or the trap that catches
   * people. Optional — plenty of terms are just vocabulary.
   */
  note?: string;
  /**
   * Topic areas this term belongs to. Must be real keys from `syllabus.ts`;
   * `check:glossary` fails the build otherwise, because a typo here silently
   * removes the term from its topic filter rather than erroring at runtime.
   */
  topics: string[];
}
