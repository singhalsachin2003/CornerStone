/** Content model for snapshot cards and quiz banks. Mirrors the prototype's shapes. */

export interface SnapshotCard {
  /** Small mono eyebrow, e.g. "CORE IDEA", "SENSITIVITY". */
  kicker: string;
  title: string;
  body: string;
  /** Rendered in the bordered FORMULA block. Null for qualitative cards. */
  formula: string | null;
  /** Revealed on tap under the "IN THE EXAM" divider. */
  exam: string;
}

export interface Question {
  text: string;
  /** Optional given-data block with the 2px brass left border. */
  given: string | null;
  opts: string[];
  /** Index of the correct option. */
  a: number;
  why: string;
  /** Curriculum reference shown as "Reading: {ref}". */
  ref: string;
}

export type CardBank = Record<string, SnapshotCard[]>;
export type QuizBank = Record<string, Question[]>;

// ---------------------------------------------------------------------------
// Segments
// ---------------------------------------------------------------------------

/**
 * Free content is everything the app had already shipped. Premium is what was
 * added afterwards, and only ever what was added afterwards — see
 * `src/access/rules.ts` for why the deal is shaped that way.
 */
export type SegmentTier = 'free' | 'premium';

/**
 * A named unit of study inside a topic area, drawn along the lines of the
 * official learning modules rather than invented for the app.
 *
 * A topic area is too big to be a unit of work — "Fixed Income" is nineteen
 * modules — and a single module is too small to be worth opening. A segment sits
 * between them: a few related modules, one sitting's worth of cards and questions.
 */
export interface Segment {
  /** Globally unique: `${topicKey}/${slug}`. Also the route param. */
  key: string;
  topicKey: string;
  slug: string;
  name: string;
  /** One line, shown on the segment row. */
  blurb: string;
  /**
   * The official learning modules this segment covers, quoted from the outline so
   * a candidate can line the app up against the curriculum they were given.
   */
  modules: string[];
  tier: SegmentTier;
  cards: SnapshotCard[];
  questions: Question[];
  /**
   * Index of this segment's first question within the topic's canonical bank
   * (core first, then premium in authored order).
   *
   * The review queue keys items as `topicKey#index`, so those indices must mean
   * the same question forever — including for somebody whose subscription lapses
   * and whose queue still holds premium items. Carrying the offset here is what
   * lets a segment build a session without ever re-deriving an index.
   */
  questionOffset: number;
  cardOffset: number;
}

/**
 * A premium segment as authored. `topicKey` and `key` are filled in by the bank
 * that holds it, so a segment cannot be filed under one topic and keyed to another.
 */
export interface PremiumSegmentSpec {
  slug: string;
  name: string;
  blurb: string;
  modules: string[];
  cards: SnapshotCard[];
  questions: Question[];
}

export type PremiumSegmentBank = Record<string, PremiumSegmentSpec[]>;
