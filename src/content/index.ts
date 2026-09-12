import { ALL_TOPICS, TopicArea, topicByKey } from './syllabus';
import { CardBank, Question, QuizBank, Segment, SnapshotCard } from './types';
import { PREMIUM_SEGMENTS } from './segments';
import { normaliseOptionOrder } from './optionOrder';

import { CFA_L1_CARDS } from './cards/cfaL1';
import { CFA_L2_CARDS } from './cards/cfaL2';
import { CFA_L3_CARDS } from './cards/cfaL3';
import { FRM_CARDS } from './cards/frm';

import { CFA_L1_QUESTIONS } from './questions/cfaL1';
import { CFA_L2_QUESTIONS } from './questions/cfaL2';
import { CFA_L3_QUESTIONS } from './questions/cfaL3';
import { FRM_QUESTIONS } from './questions/frm';

export * from './syllabus';
export * from './types';
export * from './optionOrder';
export { PREMIUM_SEGMENTS } from './segments';

export const CARDS: CardBank = {
  ...CFA_L1_CARDS,
  ...CFA_L2_CARDS,
  ...CFA_L3_CARDS,
  ...FRM_CARDS,
};

const AUTHORED_QUESTIONS: QuizBank = {
  ...CFA_L1_QUESTIONS,
  ...CFA_L2_QUESTIONS,
  ...CFA_L3_QUESTIONS,
  ...FRM_QUESTIONS,
};

/**
 * Numeric option sets are put into ascending order once, here, rather than in
 * every bank by hand — see `optionOrder.ts` for why the authored order was a
 * problem. Normalising at the boundary means the banks stay readable as written
 * and nothing downstream has to remember to do it.
 */
export const QUESTIONS: QuizBank = Object.fromEntries(
  Object.entries(AUTHORED_QUESTIONS).map(([key, questions]) => [
    key,
    questions.map(normaliseOptionOrder),
  ]),
);

export function cardsFor(topicKey: string): SnapshotCard[] {
  return CARDS[topicKey] ?? [];
}

export function questionsFor(topicKey: string): Question[] {
  return QUESTIONS[topicKey] ?? [];
}

export function cardCount(topicKey: string): number {
  return cardsFor(topicKey).length;
}

export function questionCount(topicKey: string): number {
  return questionsFor(topicKey).length;
}

/**
 * Totals shown on the exam picker. Derived from the banks rather than hard-coded,
 * so the copy can never drift from what actually ships.
 */
export function examTotals(examKey: 'CFA' | 'FRM') {
  const prefix = examKey.toLowerCase();
  const topics = ALL_TOPICS.filter((t) => t.key.startsWith(prefix));
  return {
    areas: topics.length,
    cards: topics.reduce((n, t) => n + cardCount(t.key), 0),
    questions: topics.reduce((n, t) => n + questionCount(t.key), 0),
  };
}

/**
 * Coverage check. Every topic area must have at least one card and one question —
 * a missing bank is a content bug, not something to paper over with generic filler.
 */
export function missingContent(): { topic: TopicArea; cards: number; questions: number }[] {
  return ALL_TOPICS.map((topic) => ({
    topic,
    cards: cardCount(topic.key),
    questions: questionCount(topic.key),
  })).filter((r) => r.cards === 0 || r.questions === 0);
}

// ---------------------------------------------------------------------------
// Segments
// ---------------------------------------------------------------------------

/** The slug of every topic's free segment. Reserved — no premium segment may use it. */
export const CORE_SLUG = 'core';

/**
 * The free segment of a topic area, derived from the banks above rather than
 * declared anywhere.
 *
 * This is load-bearing. "Everything already shipped stays free, permanently" is a
 * promise, and a promise kept by a list is a promise that drifts the first time
 * somebody edits the list. Deriving it means the only way to put a price on
 * shipped content would be to delete it from `CARDS`/`QUESTIONS` — which is a
 * conspicuous diff, not an oversight.
 */
export function coreSegment(topicKey: string): Segment {
  const topic = topicByKey(topicKey);
  return {
    key: `${topicKey}/${CORE_SLUG}`,
    topicKey,
    slug: CORE_SLUG,
    name: 'Core',
    blurb: topic?.blurb ?? 'The essentials for this area.',
    // The core segment spans the whole area rather than a module cluster, so it
    // lists the area's modules — which is what it is actually drawn from.
    modules: topic?.modules ?? [],
    tier: 'free',
    cards: cardsFor(topicKey),
    questions: questionsFor(topicKey),
    // Core is always first in the canonical bank, which is what keeps every
    // pre-paywall review-queue id pointing at the question it always pointed at.
    questionOffset: 0,
    cardOffset: 0,
  };
}

/**
 * Premium questions with their numeric options sorted, computed once per segment.
 * `premiumSegmentsFor` is called on every render of a topic row, so mapping the
 * bank on each call would re-sort several hundred questions for a list redraw.
 */
const normalisedPremiumCache = new Map<string, Question[]>();
function normalisedPremium(topicKey: string, slug: string, questions: Question[]): Question[] {
  const key = `${topicKey}/${slug}`;
  const cached = normalisedPremiumCache.get(key);
  if (cached) return cached;
  const normalised = questions.map(normaliseOptionOrder);
  normalisedPremiumCache.set(key, normalised);
  return normalised;
}

/** The premium segments of a topic area, in the order they were authored. */
export function premiumSegmentsFor(topicKey: string): Segment[] {
  let questionOffset = questionCount(topicKey);
  let cardOffset = cardCount(topicKey);
  return (PREMIUM_SEGMENTS[topicKey] ?? []).map((spec) => {
    const segment: Segment = {
      key: `${topicKey}/${spec.slug}`,
      topicKey,
      slug: spec.slug,
      name: spec.name,
      blurb: spec.blurb,
      modules: spec.modules,
      tier: 'premium' as const,
      cards: spec.cards,
      questions: normalisedPremium(topicKey, spec.slug, spec.questions),
      questionOffset,
      cardOffset,
    };
    questionOffset += spec.questions.length;
    cardOffset += spec.cards.length;
    return segment;
  });
}

/**
 * The canonical question bank for a topic: core first, then premium in authored
 * order. Indices into this array are what the review queue stores, so appending
 * is the only safe way to add content and reordering is never safe.
 */
export function allQuestionsFor(topicKey: string): Question[] {
  return segmentsFor(topicKey).flatMap((s) => s.questions);
}

export function allCardsFor(topicKey: string): SnapshotCard[] {
  return segmentsFor(topicKey).flatMap((s) => s.cards);
}

/** Is the question at this canonical index behind the paywall? */
export function isPremiumQuestion(topicKey: string, qIdx: number): boolean {
  return qIdx >= questionCount(topicKey);
}

/**
 * The questions this install may study, each paired with its canonical index.
 *
 * Returning the pair rather than the array is deliberate: every caller needs the
 * index for the review queue, and every caller that recomputes it from the
 * filtered array gets it wrong the moment premium content is filtered out.
 */
export function accessibleQuestionEntries(
  topicKey: string,
  hasPremium: boolean,
): { question: Question; qIdx: number }[] {
  return accessibleSegmentsFor(topicKey, hasPremium).flatMap((segment) =>
    segment.questions.map((question, i) => ({ question, qIdx: segment.questionOffset + i })),
  );
}

/** Every segment of a topic area, free first. */
export function segmentsFor(topicKey: string): Segment[] {
  return [coreSegment(topicKey), ...premiumSegmentsFor(topicKey)];
}

/** The segments this install may actually open. */
export function accessibleSegmentsFor(topicKey: string, hasPremium: boolean): Segment[] {
  return hasPremium ? segmentsFor(topicKey) : [coreSegment(topicKey)];
}

export function segmentByKey(key: string): Segment | undefined {
  const slash = key.lastIndexOf('/');
  if (slash === -1) return undefined;
  const topicKey = key.slice(0, slash);
  const slug = key.slice(slash + 1);
  if (slug === CORE_SLUG) return topicByKey(topicKey) ? coreSegment(topicKey) : undefined;
  return premiumSegmentsFor(topicKey).find((s) => s.slug === slug);
}

/** Cards a given install may study in a topic area — core, plus premium if entitled. */
export function accessibleCardsFor(topicKey: string, hasPremium: boolean): SnapshotCard[] {
  return accessibleSegmentsFor(topicKey, hasPremium).flatMap((s) => s.cards);
}

/** Questions a given install may study in a topic area. */
export function accessibleQuestionsFor(topicKey: string, hasPremium: boolean): Question[] {
  return accessibleSegmentsFor(topicKey, hasPremium).flatMap((s) => s.questions);
}

/**
 * Guard 3 of the access rule: is there any paid content in this build at all?
 *
 * Computed from the shipped catalogue, never configured. A build with an empty
 * premium bank cannot show a paywall, which is what stops the subscription being
 * offered before there is anything to sell.
 */
export function hasPremiumContent(): boolean {
  return Object.values(PREMIUM_SEGMENTS).some((segments) => segments.length > 0);
}

/** Premium question and card totals, for honest listing and paywall copy. */
export function premiumTotals() {
  const topicKeys = Object.keys(PREMIUM_SEGMENTS);
  let segments = 0;
  let cards = 0;
  let questions = 0;
  for (const key of topicKeys) {
    for (const seg of premiumSegmentsFor(key)) {
      segments += 1;
      cards += seg.cards.length;
      questions += seg.questions.length;
    }
  }
  return {
    areas: topicKeys.filter((k) => premiumSegmentsFor(k).length > 0).length,
    segments,
    cards,
    questions,
  };
}
