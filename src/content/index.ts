import { ALL_TOPICS, TopicArea } from './syllabus';
import { CardBank, Question, QuizBank, SnapshotCard } from './types';

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

export const CARDS: CardBank = {
  ...CFA_L1_CARDS,
  ...CFA_L2_CARDS,
  ...CFA_L3_CARDS,
  ...FRM_CARDS,
};

export const QUESTIONS: QuizBank = {
  ...CFA_L1_QUESTIONS,
  ...CFA_L2_QUESTIONS,
  ...CFA_L3_QUESTIONS,
  ...FRM_QUESTIONS,
};

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
