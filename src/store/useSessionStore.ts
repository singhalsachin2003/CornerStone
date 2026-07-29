import { create } from 'zustand';
import { Question, questionsFor, topicByKey } from '@/content';
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

export function buildTopicSession(topicKey: string) {
  const topic = topicByKey(topicKey);
  const bank = questionsFor(topicKey);
  // Origins carry the question's index in the *bank*, not in the shuffled session, so
  // review-queue ids stay stable no matter what order the candidate saw them in.
  const [questions, origins] = shuffleSession(
    bank,
    bank.map((_, i) => ({ topicKey, qIdx: i })),
  );
  return {
    mode: 'topic' as const,
    topicKey,
    title: topic?.name ?? 'Topic',
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
export function buildReviewSession(due: ReviewItem[]) {
  const items = [...due].sort((a, b) => a.dueOn.localeCompare(b.dueOn)).slice(0, 10);
  const origins = items.map((i) => ({ topicKey: i.topicKey, qIdx: i.qIdx }));
  const questions = origins
    .map((o) => questionsFor(o.topicKey)[o.qIdx])
    .filter(Boolean)
    .map(shuffleOptions);
  return {
    mode: 'review' as const,
    topicKey: null,
    title: 'Review queue',
    questions,
    origins,
  };
}
