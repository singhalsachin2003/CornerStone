import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  EXAMS,
  ExamKey,
  LevelKey,
  PathwayKey,
  parseISODate,
  questionsFor,
  topicsFor,
} from '@/content';
import { STORAGE_KEY, storage } from './persistence';
import {
  ReviewItem,
  addDays,
  dayKey,
  dueItems,
  pruneRetired,
  scheduleLapse,
  schedulePromotion,
} from './review';
import {
  BookmarkMap,
  EMPTY_SYNC_META,
  SyncMeta,
  migrateToSyncable,
  toggleBookmark,
} from './syncMeta';

export { bookmarkCount, isBookmarked } from './syncMeta';

export type TopicVariant = 'a' | 'b' | 'c';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface Settings {
  spacedRepetition: boolean;
  dailyReminder: boolean;
  timedQuizzes: boolean;
}

export interface SessionAnswer {
  qIdx: number;
  chosen: number;
  ok: boolean;
  seconds: number;
}

interface StudyState {
  hydrated: boolean;
  onboarded: boolean;
  name: string;
  initials: string;

  exam: ExamKey | null;
  level: LevelKey | null;
  /**
   * The level last studied in each exam. Candidates often sit both programmes, so
   * switching exam restores where they were rather than resetting them to nothing.
   */
  levelByExam: Partial<Record<ExamKey, LevelKey>>;
  pathway: PathwayKey;
  variant: TopicVariant;
  /**
   * Light, dark, or whatever the phone is set to. Persisted on the device and
   * deliberately *not* synced: a phone in dark mode and a tablet in light is
   * the normal case, and the profile row has no column for it.
   */
  themePreference: ThemePreference;

  /** Percentage mastery per topic key, 0–100. */
  mastery: Record<string, number>;
  /**
   * Epoch ms of the last change to each topic's mastery, for cross-device merge.
   * Kept beside `mastery` rather than inside it so every reader — and there are
   * many — stays `mastery[key] ?? 0`.
   */
  masteryUpdatedAt: Record<string, number>;
  /** Highest snapshot card index reached per topic, for the resume card. */
  cardProgress: Record<string, number>;

  /** Keyed `topicKey#index`. A removal is `on: false`, not an absent entry. */
  bookmarkedQuestions: BookmarkMap;
  bookmarkedCards: BookmarkMap;

  reviewQueue: ReviewItem[];
  /** Local date keys on which a session was completed. */
  studyDays: string[];

  questionsAnswered: number;
  questionsCorrect: number;

  settings: Settings;

  /** Whole-row timestamps for state with no natural per-item key. */
  syncMeta: SyncMeta;

  // actions
  setHydrated: () => void;
  completeOnboarding: () => void;
  setExam: (exam: ExamKey) => void;
  setLevel: (level: LevelKey) => void;
  /** Move to any exam+level in one step, from the switcher. */
  setExamLevel: (exam: ExamKey, level: LevelKey) => void;
  setPathway: (p: PathwayKey) => void;
  setVariant: (v: TopicVariant) => void;
  setThemePreference: (p: ThemePreference) => void;
  setName: (name: string) => void;
  toggleSetting: (key: keyof Settings) => void;
  markCardProgress: (topicKey: string, cardIdx: number) => void;
  toggleQuestionBookmark: (topicKey: string, qIdx: number) => void;
  toggleCardBookmark: (topicKey: string, cardIdx: number) => void;
  recordSession: (topicKey: string, answers: SessionAnswer[]) => { before: number; after: number };
  resetProgress: () => void;
}

const initialSettings: Settings = {
  spacedRepetition: true,
  // Off by default: turning it on prompts for the OS notification permission, and
  // asking on first launch before the candidate has seen anything is a good way to
  // get denied permanently.
  dailyReminder: false,
  timedQuizzes: false,
};

/** Mastery moves toward the session score rather than jumping to it. */
const LEARNING_RATE = 0.35;

/**
 * Shown until the candidate names themselves on the profile screen. The app never
 * asks for a name, so this is what the greeting and avatar render on a fresh
 * install — it has to read as a placeholder, not as somebody else's account.
 */
export const GUEST_NAME = 'Guest';

/** The design mock's placeholder, shipped as the default through versionCode 2. */
const LEGACY_PLACEHOLDER_NAME = 'Anaya Kulkarni';

/** Up to two initials, falling back to the guest initial for unusable input. */
export function initialsFor(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || GUEST_NAME[0]
  );
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboarded: false,
      name: GUEST_NAME,
      initials: initialsFor(GUEST_NAME),

      exam: null,
      level: null,
      levelByExam: {},
      pathway: 'portfolio',
      variant: 'b',
      themePreference: 'system',

      mastery: {},
      masteryUpdatedAt: {},
      cardProgress: {},
      bookmarkedQuestions: {},
      bookmarkedCards: {},
      reviewQueue: [],
      studyDays: [],
      questionsAnswered: 0,
      questionsCorrect: 0,
      settings: initialSettings,
      syncMeta: EMPTY_SYNC_META,

      setHydrated: () => set({ hydrated: true }),
      completeOnboarding: () =>
        set((s) => ({ onboarded: true, syncMeta: { ...s.syncMeta, profile: Date.now() } })),

      // Switching exam restores that exam's last level, so moving between the CFA
      // and FRM programmes costs one tap and never discards a selection.
      setExam: (exam) =>
        set((s) => ({
          exam,
          level: s.levelByExam[exam] ?? null,
          syncMeta: { ...s.syncMeta, profile: Date.now() },
        })),

      setLevel: (level) =>
        set((s) => ({
          level,
          levelByExam: s.exam ? { ...s.levelByExam, [s.exam]: level } : s.levelByExam,
          syncMeta: { ...s.syncMeta, profile: Date.now() },
        })),

      setExamLevel: (exam, level) =>
        set((s) => ({
          exam,
          level,
          levelByExam: { ...s.levelByExam, [exam]: level },
          syncMeta: { ...s.syncMeta, profile: Date.now() },
        })),
      setPathway: (pathway) =>
        set((s) => ({ pathway, syncMeta: { ...s.syncMeta, profile: Date.now() } })),
      setVariant: (variant) =>
        set((s) => ({ variant, syncMeta: { ...s.syncMeta, profile: Date.now() } })),
      setThemePreference: (themePreference) => set({ themePreference }),
      setName: (name) =>
        set((s) => ({
          name,
          initials: initialsFor(name),
          syncMeta: { ...s.syncMeta, profile: Date.now() },
        })),

      toggleSetting: (key) =>
        set((s) => ({
          settings: { ...s.settings, [key]: !s.settings[key] },
          syncMeta: { ...s.syncMeta, settings: Date.now() },
        })),

      markCardProgress: (topicKey, cardIdx) =>
        set((s) => ({
          cardProgress: {
            ...s.cardProgress,
            [topicKey]: Math.max(s.cardProgress[topicKey] ?? 0, cardIdx),
          },
        })),

      // The entry stays when a bookmark is removed, carrying `on: false`. An
      // absent entry cannot express a removal, so a second device holding its own
      // copy would treat that copy as newer and restore the bookmark.
      toggleQuestionBookmark: (topicKey, qIdx) =>
        set((s) => ({
          bookmarkedQuestions: toggleBookmark(
            s.bookmarkedQuestions,
            `${topicKey}#${qIdx}`,
            Date.now(),
          ),
        })),

      toggleCardBookmark: (topicKey, cardIdx) =>
        set((s) => ({
          bookmarkedCards: toggleBookmark(s.bookmarkedCards, `${topicKey}#${cardIdx}`, Date.now()),
        })),

      recordSession: (topicKey, answers) => {
        const state = get();
        const before = state.mastery[topicKey] ?? 0;
        if (answers.length === 0) return { before, after: before };

        const correct = answers.filter((a) => a.ok).length;
        const sessionPct = Math.round((correct / answers.length) * 100);
        const after = Math.max(0, Math.min(100, Math.round(before + (sessionPct - before) * LEARNING_RATE)));

        // Rebuild the queue: missed questions enter or reset, correct ones promote.
        // A graduated item is retired in place rather than deleted — see
        // `schedulePromotion`. Tombstones are pruned here so the queue stays
        // bounded without needing a separate sweep.
        const now = Date.now();
        const byId = new Map(state.reviewQueue.map((i) => [i.id, i]));
        if (state.settings.spacedRepetition) {
          for (const a of answers) {
            const id = `${topicKey}#${a.qIdx}`;
            const existing = byId.get(id);
            if (!a.ok) {
              byId.set(id, scheduleLapse(existing, topicKey, a.qIdx, now));
            } else if (existing && existing.retiredAt === undefined) {
              byId.set(id, schedulePromotion(existing, now));
            }
          }
        }

        const today = dayKey();
        set({
          mastery: { ...state.mastery, [topicKey]: after },
          masteryUpdatedAt: { ...state.masteryUpdatedAt, [topicKey]: now },
          reviewQueue: pruneRetired([...byId.values()], now),
          studyDays: state.studyDays.includes(today)
            ? state.studyDays
            : [...state.studyDays, today].slice(-400),
          questionsAnswered: state.questionsAnswered + answers.length,
          questionsCorrect: state.questionsCorrect + correct,
        });

        return { before, after };
      },

      resetProgress: () =>
        set({
          mastery: {},
          masteryUpdatedAt: {},
          cardProgress: {},
          bookmarkedQuestions: {},
          bookmarkedCards: {},
          reviewQueue: [],
          studyDays: [],
          questionsAnswered: 0,
          questionsCorrect: 0,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => storage),
      /**
       * Bumped from the implicit 0 when sync timestamps were added. Anything
       * stored by an earlier build runs through `migrateToSyncable`.
       */
      version: 1,
      migrate: (persisted) => migrateToSyncable(persisted as Record<string, unknown>),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        // No state means the persisted JSON was unreadable. The splash screen is
        // held until `hydrated` flips, so returning early here strands the app on a
        // blank screen permanently — start fresh instead of never starting.
        if (!state) {
          useStudyStore.setState({ hydrated: true });
          return;
        }
        // Seed levelByExam for anyone who installed before it existed, so their
        // current selection survives the first exam switch.
        if (state.exam && state.level && !state.levelByExam[state.exam]) {
          state.levelByExam = { ...state.levelByExam, [state.exam]: state.level };
        }
        // Anyone who installed a build before the guest default has the design
        // mock's placeholder persisted. Nothing ever wrote that name deliberately —
        // the app has no field that asks for one at install time — so treat it as
        // the unset value and show the guest placeholder instead.
        if (state.name === LEGACY_PLACEHOLDER_NAME) {
          state.name = GUEST_NAME;
          state.initials = initialsFor(GUEST_NAME);
        }
        state.setHydrated();
      },
    },
  ),
);

// ---------------------------------------------------------------------------
// Derived selectors — computed, never stored, so they cannot drift.
// ---------------------------------------------------------------------------

export function useTopics() {
  const exam = useStudyStore((s) => s.exam);
  const level = useStudyStore((s) => s.level);
  const pathway = useStudyStore((s) => s.pathway);
  if (!exam || !level) return [];
  return topicsFor(exam, level, pathway);
}

/** Syllabus progress weighted by published exam weight, as the copy promises. */
export function weightedProgress(
  topics: { key: string; weightMid: number }[],
  mastery: Record<string, number>,
): number {
  const totalWeight = topics.reduce((n, t) => n + t.weightMid, 0);
  if (totalWeight === 0) return 0;
  const earned = topics.reduce((n, t) => n + (mastery[t.key] ?? 0) * t.weightMid, 0);
  return Math.round(earned / totalWeight);
}

/**
 * Days until the next published sitting — negative once that date has passed.
 *
 * Sitting dates are hardcoded and revised annually, so this *will* go negative on
 * a released build before the next content update lands. It is deliberately not
 * clamped to zero: "0 days to exam day" shown forever is a worse lie than saying
 * the date is stale, and only the caller knows how to phrase it.
 */
export function daysToExam(exam: ExamKey | null): number {
  if (!exam) return 0;
  const target = parseISODate(EXAMS[exam].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  return Number.isFinite(days) ? days : 0;
}

/** Consecutive study days ending today or yesterday. */
export function currentStreak(studyDays: string[]): number {
  if (studyDays.length === 0) return 0;
  const set = new Set(studyDays);
  const today = dayKey();
  const yesterday = addDays(-1);
  let cursor = set.has(today) ? today : set.has(yesterday) ? yesterday : null;
  if (!cursor) return 0;
  let count = 0;
  // parseISODate, not new Date(iso): the latter is UTC midnight, which dayKey then
  // reads with local getters — off by a day in any timezone behind UTC.
  const d = parseISODate(cursor);
  while (set.has(dayKey(d))) {
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

/** Monday-first week strip for the home dashboard. */
export function weekStrip(studyDays: string[]) {
  const set = new Set(studyDays);
  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label,
      key: dayKey(d),
      studied: set.has(dayKey(d)),
      isToday: i === dow,
      isFuture: i > dow,
    };
  });
}

export function dueCount(queue: ReviewItem[]): number {
  return dueItems(queue).length;
}

/** Total questions available for the current exam+level, for honest copy. */
export function totalQuestions(topics: { key: string }[]): number {
  return topics.reduce((n, t) => n + questionsFor(t.key).length, 0);
}
