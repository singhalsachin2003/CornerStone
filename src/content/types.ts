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
