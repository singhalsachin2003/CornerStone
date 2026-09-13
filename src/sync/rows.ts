/**
 * Translating between the store's shape and the database's.
 *
 * Pure and separate from the engine, because a field mapped to the wrong column
 * fails silently: the write succeeds, the read returns something plausible, and
 * the damage only shows up on a second device weeks later.
 *
 * Column names are snake_case to match `supabase/schema.sql`; the store is
 * camelCase. That boundary lives here and nowhere else.
 */
import { ReviewItem } from '@/store/review';
import { BookmarkMap } from '@/store/syncMeta';
import { BookmarkRow, ProfileState, SettingsState, StatsState, TopicProgressRow } from './merge';

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface ProfileDbRow {
  user_id: string;
  display_name: string | null;
  onboarded: boolean;
  exam: string | null;
  level: string | null;
  level_by_exam: Record<string, string>;
  pathway: string | null;
  variant: string | null;
  updated_at: string;
}

/** The store's placeholder for "no name given". Null on the server, not ''. */
export const GUEST_NAME = 'Guest';

export function profileToRow(
  userId: string,
  profile: ProfileState,
  updatedAt: number,
): ProfileDbRow {
  return {
    user_id: userId,
    // Null is the unnamed state and is distinct from an empty string. Writing
    // 'Guest' would make the placeholder look like a chosen name on every other
    // device, which is exactly the bug the guest default was added to fix.
    display_name: profile.name === GUEST_NAME ? null : profile.name,
    onboarded: profile.onboarded,
    exam: profile.exam,
    level: profile.level,
    level_by_exam: profile.levelByExam,
    pathway: profile.pathway,
    variant: profile.variant,
    updated_at: new Date(updatedAt).toISOString(),
  };
}

export function rowToProfile(row: ProfileDbRow): { profile: ProfileState; updatedAt: number } {
  return {
    profile: {
      name: row.display_name ?? GUEST_NAME,
      onboarded: row.onboarded,
      exam: row.exam,
      level: row.level,
      levelByExam: row.level_by_exam ?? {},
      pathway: row.pathway ?? 'portfolio',
      variant: row.variant ?? 'b',
    },
    updatedAt: Date.parse(row.updated_at) || 0,
  };
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface SettingsDbRow {
  user_id: string;
  spaced_repetition: boolean;
  daily_reminder: boolean;
  timed_quizzes: boolean;
  updated_at: string;
}

export function settingsToRow(
  userId: string,
  settings: SettingsState,
  updatedAt: number,
): SettingsDbRow {
  return {
    user_id: userId,
    spaced_repetition: settings.spacedRepetition,
    daily_reminder: settings.dailyReminder,
    timed_quizzes: settings.timedQuizzes,
    updated_at: new Date(updatedAt).toISOString(),
  };
}

export function rowToSettings(row: SettingsDbRow): { settings: SettingsState; updatedAt: number } {
  return {
    settings: {
      spacedRepetition: row.spaced_repetition,
      dailyReminder: row.daily_reminder,
      timedQuizzes: row.timed_quizzes,
    },
    updatedAt: Date.parse(row.updated_at) || 0,
  };
}

// ---------------------------------------------------------------------------
// Topic progress
// ---------------------------------------------------------------------------

export interface TopicProgressDbRow {
  user_id: string;
  topic_key: string;
  mastery: number;
  card_progress: number;
  updated_at: string;
}

/**
 * One row per topic the device knows anything about.
 *
 * A topic with card progress but no mastery is real — the candidate read the
 * cards and has not taken the quiz — so the union of both maps is the row set,
 * not just the mastery keys.
 */
export function topicProgressToRows(
  userId: string,
  mastery: Record<string, number>,
  masteryUpdatedAt: Record<string, number>,
  cardProgress: Record<string, number>,
): TopicProgressDbRow[] {
  const keys = new Set([...Object.keys(mastery), ...Object.keys(cardProgress)]);
  return [...keys].map((topicKey) => ({
    user_id: userId,
    topic_key: topicKey,
    mastery: mastery[topicKey] ?? 0,
    card_progress: cardProgress[topicKey] ?? 0,
    updated_at: new Date(masteryUpdatedAt[topicKey] ?? 0).toISOString(),
  }));
}

export function rowsToTopicProgress(rows: TopicProgressDbRow[]): TopicProgressRow[] {
  return rows.map((r) => ({
    topicKey: r.topic_key,
    mastery: r.mastery,
    cardProgress: r.card_progress,
    updatedAt: Date.parse(r.updated_at) || 0,
  }));
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface StatsDbRow {
  user_id: string;
  questions_answered: number;
  questions_correct: number;
  updated_at: string;
}

export function statsToRow(userId: string, stats: StatsState, updatedAt: number): StatsDbRow {
  return {
    user_id: userId,
    questions_answered: stats.questionsAnswered,
    questions_correct: stats.questionsCorrect,
    updated_at: new Date(updatedAt).toISOString(),
  };
}

export function rowToStats(row: StatsDbRow): StatsState {
  return {
    questionsAnswered: row.questions_answered,
    questionsCorrect: row.questions_correct,
  };
}

// ---------------------------------------------------------------------------
// Review queue
// ---------------------------------------------------------------------------

export interface ReviewDbRow {
  user_id: string;
  item_id: string;
  topic_key: string;
  q_idx: number;
  step: number;
  due_on: string;
  lapses: number;
  retired_at: string | null;
  updated_at: string;
}

export function reviewToRows(userId: string, queue: ReviewItem[]): ReviewDbRow[] {
  return queue.map((i) => ({
    user_id: userId,
    item_id: i.id,
    topic_key: i.topicKey,
    q_idx: i.qIdx,
    step: i.step,
    due_on: i.dueOn,
    lapses: i.lapses,
    retired_at: i.retiredAt === undefined ? null : new Date(i.retiredAt).toISOString(),
    updated_at: new Date(i.updatedAt).toISOString(),
  }));
}

export function rowsToReview(rows: ReviewDbRow[]): ReviewItem[] {
  return rows.map((r) => ({
    id: r.item_id,
    topicKey: r.topic_key,
    qIdx: r.q_idx,
    step: r.step,
    dueOn: r.due_on,
    lapses: r.lapses,
    updatedAt: Date.parse(r.updated_at) || 0,
    // `undefined` rather than null: the store's type uses an optional, and a
    // null would make `retiredAt !== undefined` true and retire every item.
    retiredAt: r.retired_at ? Date.parse(r.retired_at) : undefined,
  }));
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

export type BookmarkKind = 'question' | 'card';

export interface BookmarkDbRow {
  user_id: string;
  kind: BookmarkKind;
  item_key: string;
  bookmarked: boolean;
  updated_at: string;
}

export function bookmarksToRows(
  userId: string,
  kind: BookmarkKind,
  map: BookmarkMap,
): BookmarkDbRow[] {
  return Object.entries(map).map(([itemKey, state]) => ({
    user_id: userId,
    kind,
    item_key: itemKey,
    bookmarked: state.on,
    updated_at: new Date(state.at).toISOString(),
  }));
}

export function rowsToBookmarks(rows: BookmarkDbRow[], kind: BookmarkKind): BookmarkRow[] {
  return rows
    .filter((r) => r.kind === kind)
    .map((r) => ({
      itemKey: r.item_key,
      bookmarked: r.bookmarked,
      updatedAt: Date.parse(r.updated_at) || 0,
    }));
}

// ---------------------------------------------------------------------------
// Study days
// ---------------------------------------------------------------------------

export interface StudyDayDbRow {
  user_id: string;
  day: string;
}

export function studyDaysToRows(userId: string, days: string[]): StudyDayDbRow[] {
  return days.map((day) => ({ user_id: userId, day }));
}

export function rowsToStudyDays(rows: StudyDayDbRow[]): string[] {
  return rows.map((r) => r.day);
}
