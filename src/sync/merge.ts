/**
 * How two devices' views of the same account are reconciled.
 *
 * Pure, with no client and no clock of its own, because this is where sync is
 * either correct or quietly destructive. Every rule here is the one stated in
 * `supabase/sync.md`, and the table there is the specification.
 *
 * Two rules carry the weight:
 *
 * - **Counters take the greater, never the sum.** Both devices count the same
 *   local history, so adding them inflates every figure each time a device
 *   re-uploads. Taking the greater is stable under repeated sync, which is the
 *   property that matters — sync is retried far more often than it succeeds
 *   cleanly.
 * - **Deletions need a tombstone.** A removed bookmark and a retired review item
 *   are both deletions, and neither can be represented by an absent record. The
 *   device that still holds it would otherwise treat its copy as newer and
 *   restore it.
 */
import { ReviewItem } from '@/store/review';
import { BookmarkMap, BookmarkState, SyncMeta } from '@/store/syncMeta';

/** Later wins, with the local side winning a tie. */
export function laterWins<T>(local: T, remote: T, localAt: number, remoteAt: number): T {
  return remoteAt > localAt ? remote : local;
}

export function greater(local: number, remote: number): number {
  return Math.max(local, remote);
}

// ---------------------------------------------------------------------------
// Mastery and card progress
// ---------------------------------------------------------------------------

export interface TopicProgressRow {
  topicKey: string;
  mastery: number;
  cardProgress: number;
  updatedAt: number;
}

export interface TopicProgressState {
  mastery: Record<string, number>;
  masteryUpdatedAt: Record<string, number>;
  cardProgress: Record<string, number>;
}

/**
 * Mastery takes the later stamp; card progress takes the greater regardless.
 *
 * They are merged independently even though they share a row, because they have
 * genuinely different rules: mastery can legitimately fall — `recordSession`
 * moves it toward a bad sitting's score — while card progress is the furthest
 * card ever reached and the app never revises it down. Applying "later wins" to
 * card progress would let a stale device rewind someone's place in the deck.
 */
export function mergeTopicProgress(
  local: TopicProgressState,
  remote: TopicProgressRow[],
): TopicProgressState {
  const mastery = { ...local.mastery };
  const masteryUpdatedAt = { ...local.masteryUpdatedAt };
  const cardProgress = { ...local.cardProgress };

  for (const row of remote) {
    const localAt = local.masteryUpdatedAt[row.topicKey] ?? 0;
    if (row.updatedAt > localAt) {
      mastery[row.topicKey] = row.mastery;
      masteryUpdatedAt[row.topicKey] = row.updatedAt;
    }
    cardProgress[row.topicKey] = greater(local.cardProgress[row.topicKey] ?? 0, row.cardProgress);
  }

  return { mastery, masteryUpdatedAt, cardProgress };
}

// ---------------------------------------------------------------------------
// Review queue
// ---------------------------------------------------------------------------

/**
 * Later wins per item, including retirement.
 *
 * A remote tombstone that is newer retires the local item; a local lapse that is
 * newer un-retires it. Both directions matter: the first stops a stale device
 * resurrecting a graduated question, the second stops a tombstone burying a
 * question the candidate has just got wrong again.
 */
export function mergeReviewQueue(local: ReviewItem[], remote: ReviewItem[]): ReviewItem[] {
  const byId = new Map(local.map((i) => [i.id, i]));
  for (const item of remote) {
    const mine = byId.get(item.id);
    if (!mine || item.updatedAt > mine.updatedAt) byId.set(item.id, item);
  }
  return [...byId.values()];
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

export interface BookmarkRow {
  itemKey: string;
  bookmarked: boolean;
  updatedAt: number;
}

export function mergeBookmarks(local: BookmarkMap, remote: BookmarkRow[]): BookmarkMap {
  const out: BookmarkMap = { ...local };
  for (const row of remote) {
    const mine: BookmarkState | undefined = out[row.itemKey];
    if (!mine || row.updatedAt > mine.at) {
      out[row.itemKey] = { on: row.bookmarked, at: row.updatedAt };
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Study days and counters
// ---------------------------------------------------------------------------

/**
 * Union, sorted, and capped the way the store caps it.
 *
 * A day studied on either device was studied — there is no version of this where
 * one device's record of a day is wrong. The cap matches `recordSession`'s
 * `slice(-400)` so a merge cannot grow the list past what the app maintains.
 */
export const MAX_STUDY_DAYS = 400;

export function mergeStudyDays(local: string[], remote: string[]): string[] {
  return [...new Set([...local, ...remote])].sort().slice(-MAX_STUDY_DAYS);
}

export interface StatsState {
  questionsAnswered: number;
  questionsCorrect: number;
}

export function mergeStats(local: StatsState, remote: StatsState | null): StatsState {
  if (!remote) return local;
  return {
    questionsAnswered: greater(local.questionsAnswered, remote.questionsAnswered),
    questionsCorrect: greater(local.questionsCorrect, remote.questionsCorrect),
  };
}

// ---------------------------------------------------------------------------
// Whole-row state
// ---------------------------------------------------------------------------

export interface ProfileState {
  name: string;
  onboarded: boolean;
  exam: string | null;
  level: string | null;
  levelByExam: Record<string, string>;
  pathway: string;
  variant: string;
}

export interface SettingsState {
  spacedRepetition: boolean;
  dailyReminder: boolean;
  timedQuizzes: boolean;
}

/**
 * The profile moves as one row, because its fields are not independent: an exam
 * with a level from a different device is a state the app can never produce.
 */
export function mergeProfile(
  local: ProfileState,
  remote: ProfileState | null,
  localAt: number,
  remoteAt: number,
): { profile: ProfileState; updatedAt: number } {
  if (!remote || remoteAt <= localAt) return { profile: local, updatedAt: localAt };
  return { profile: remote, updatedAt: remoteAt };
}

/**
 * Settings move as one row too, with one exception the caller applies:
 * `dailyReminder` is reconciled against the OS on launch, so a `true` pulled
 * from another device still resolves to `false` here if permission is gone.
 */
export function mergeSettings(
  local: SettingsState,
  remote: SettingsState | null,
  localAt: number,
  remoteAt: number,
): { settings: SettingsState; updatedAt: number } {
  if (!remote || remoteAt <= localAt) return { settings: local, updatedAt: localAt };
  return { settings: remote, updatedAt: remoteAt };
}

export function mergeSyncMeta(local: SyncMeta, profile: number, settings: number): SyncMeta {
  return { profile: greater(local.profile, profile), settings: greater(local.settings, settings) };
}
