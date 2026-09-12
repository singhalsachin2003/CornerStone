import { create } from 'zustand';
import {
  Question,
  accessibleQuestionEntries,
  allQuestionsFor,
  questionsFor,
  topicByKey,
} from '@/content';
import { SessionAnswer } from './useStudyStore';
import { ReviewItem } from './review';
import { shuffleOptions, shuffleSession } from './shuffle';

export type SessionMode = 'topic' | 'placement' | 'review';

interface SessionState {
  mode: SessionMode;
  /** Null for a placement or mixed review run. */
  topicKey: string | null;
  title: string;
  questions: Question[];
  /** Parallel to `questions` — where each item came from, for mastery and queue updates. */
  origins: { topicKey: string; qIdx: number }[];

  qIdx: number;
  chosen: number | null;
  answers: SessionAnswer[];
  elapsed: number;
  questionStart: number;

  start: (args: {
    mode: SessionMode;
    topicKey: string | null;
    title: string;
    questions: Question[];
    origins: { topicKey: string; qIdx: number }[];
  }) => void;
  choose: (i: number) => void;
  next: () => boolean;
  tick: () => void;
  restart: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  mode: 'topic',
  topicKey: null,
  title: '',
  questions: [],
  origins: [],
  qIdx: 0,
  chosen: null,
  answers: [],
  elapsed: 0,
  questionStart: 0,

  start: ({ mode, topicKey, title, questions, origins }) =>
    set({
      mode,
      topicKey,
      title,
      questions,
      origins,
      qIdx: 0,
      chosen: null,
      answers: [],
      elapsed: 0,
      questionStart: 0,
    }),

  choose: (i) => {
    const s = get();
    if (s.chosen !== null) return;
    const q = s.questions[s.qIdx];
    if (!q) return;
    set({
      chosen: i,
      answers: [
        ...s.answers,
        {
          qIdx: s.origins[s.qIdx]?.qIdx ?? s.qIdx,
          chosen: i,
          ok: i === q.a,
          seconds: Math.max(1, s.elapsed - s.questionStart),
        },
      ],
    });
  },

  /** Returns true when the session is finished. */
  next: (): boolean => {
    const s = get();
    if (s.chosen === null) return false;
    if (s.qIdx + 1 >= s.questions.length) return true;
    set({ qIdx: s.qIdx + 1, chosen: null, questionStart: s.elapsed });
    return false;
  },

  tick: () => set((s) => ({ elapsed: s.elapsed + 1 })),

  /**
   * Retake. Re-shuffles rather than replaying the identical run — otherwise the
   * second attempt tests recall of answer positions, not of the material.
   */
  restart: () =>
    set((s) => {
      const [questions, origins] = shuffleSession(s.questions, s.origins);
      return { questions, origins, qIdx: 0, chosen: null, answers: [], elapsed: 0, questionStart: 0 };
    }),
}));

// ---------------------------------------------------------------------------
// Session builders
// ---------------------------------------------------------------------------

/**
 * A topic run over everything this install may study.
 *
 * Origins carry the question's index in the *canonical bank* — core first, then
 * premium in authored order — not in the shuffled session and not in the filtered
 * subset. That is what keeps a review-queue id meaning the same question after a
 * subscription starts, and after one lapses.
 */
export function buildTopicSession(topicKey: string, hasPremium: boolean) {
  const topic = topicByKey(topicKey);
  const entries = accessibleQuestionEntries(topicKey, hasPremium);
  const [questions, origins] = shuffleSession(
    entries.map((e) => e.question),
    entries.map((e) => ({ topicKey, qIdx: e.qIdx })),
  );
  return {
    mode: 'topic' as const,
    topicKey,
    title: topic?.name ?? 'Topic',
    questions,
    origins,
  };
}

/** A run over one segment only, free or premium. */
export function buildSegmentSession(segment: {
  topicKey: string;
  name: string;
  questions: Question[];
  questionOffset: number;
}) {
  const [questions, origins] = shuffleSession(
    segment.questions,
    segment.questions.map((_, i) => ({
      topicKey: segment.topicKey,
      qIdx: segment.questionOffset + i,
    })),
  );
  return {
    mode: 'topic' as const,
    topicKey: segment.topicKey,
    title: segment.name,
    questions,
    origins,
  };
}

/**
 * Placement: one question from each topic area in the level, capped at five,
 * spread across the syllabus rather than clustered at the front.
 */
export function buildPlacementSession(topics: { key: string; name: string }[], examName: string) {
  const picked: { topicKey: string; qIdx: number }[] = [];
  const stride = Math.max(1, Math.floor(topics.length / 5));
  for (let i = 0; i < topics.length && picked.length < 5; i += stride) {
    const t = topics[i];
    if (questionsFor(t.key).length > 0) picked.push({ topicKey: t.key, qIdx: 0 });
  }
  return {
    mode: 'placement' as const,
    topicKey: null,
    title: `${examName} placement`,
    questions: picked.map((p) => questionsFor(p.topicKey)[p.qIdx]),
    origins: picked,
  };
}

/**
 * Review: whatever is due, oldest first, capped at ten.
 *
 * Selection stays oldest-first (that is the schedule doing its job), but options are
 * shuffled — a queued question is one the candidate already got wrong, and recognising
 * the shape of the right answer is exactly the failure mode review exists to break.
 */
export function buildReviewSession(due: ReviewItem[], hasPremium: boolean) {
  const sorted = [...due].sort((a, b) => a.dueOn.localeCompare(b.dueOn));

  // Resolve first, then take ten. A queue item can fail to resolve two ways: the
  // content moved under it, or it is a premium question held by somebody whose
  // access has lapsed. Either way the item is skipped rather than dropped from the
  // queue — access can come back, and the schedule should survive the gap.
  //
  // Filtering questions and origins separately is what this replaces: the two
  // arrays are parallel, and filtering one of them silently misattributes every
  // answer after the first gap.
  const resolved: { question: Question; origin: { topicKey: string; qIdx: number } }[] = [];
  for (const item of sorted) {
    if (resolved.length >= 10) break;
    const bank = allQuestionsFor(item.topicKey);
    const question = bank[item.qIdx];
    if (!question) continue;
    if (!hasPremium && item.qIdx >= questionsFor(item.topicKey).length) continue;
    resolved.push({ question, origin: { topicKey: item.topicKey, qIdx: item.qIdx } });
  }

  const origins = resolved.map((r) => r.origin);
  const questions = resolved.map((r) => shuffleOptions(r.question));
  return {
    mode: 'review' as const,
    topicKey: null,
    title: 'Review queue',
    questions,
    origins,
  };
}
