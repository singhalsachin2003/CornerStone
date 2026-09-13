/**
 * One sync: pull, merge, save, push.
 *
 * The order is deliberate. **Saving before the upload** means that if the push
 * fails the device still holds everything the server had — losing the pull
 * because the push failed would make a flaky network cost the user data. What is
 * pushed is the *merged* snapshot rather than what the device started with, so a
 * single round trip converges both sides.
 *
 * Nothing here throws. A device with no signal, an expired token or a paused
 * free-tier project has to behave exactly like the app did before any of this
 * existed — and on the free plan a project pauses after a week of inactivity, so
 * "unreachable" is the ordinary case rather than the exceptional one.
 */
import { SupabaseClient } from '@supabase/supabase-js';
import { pruneRetired } from '@/store/review';
import { useStudyStore } from '@/store/useStudyStore';
import {
  mergeBookmarks,
  mergeProfile,
  mergeReviewQueue,
  mergeSettings,
  mergeStats,
  mergeStudyDays,
  mergeSyncMeta,
  mergeTopicProgress,
} from './merge';
import {
  bookmarksToRows,
  profileToRow,
  reviewToRows,
  rowToProfile,
  rowToSettings,
  rowToStats,
  rowsToBookmarks,
  rowsToReview,
  rowsToStudyDays,
  rowsToTopicProgress,
  settingsToRow,
  statsToRow,
  studyDaysToRows,
  topicProgressToRows,
} from './rows';

export type SyncOutcome =
  /** Merged and pushed. */
  | { kind: 'synced'; at: number }
  /** No client, or nobody signed in. Not an error and not worth reporting. */
  | { kind: 'skipped'; reason: 'not-configured' | 'signed-out' }
  /** Reached the server and something went wrong; the local state is intact. */
  | { kind: 'failed'; message: string };

/** Pull every table for this user. A table that errors comes back empty. */
async function pullAll(client: SupabaseClient, userId: string) {
  const table = async <T>(name: string): Promise<T[]> => {
    const { data, error } = await client.from(name).select('*').eq('user_id', userId);
    return error ? [] : ((data ?? []) as T[]);
  };
  const [profiles, settings, topics, stats, review, bookmarks, days] = await Promise.all([
    table<never>('profiles'),
    table<never>('settings'),
    table<never>('topic_progress'),
    table<never>('stats'),
    table<never>('review_queue'),
    table<never>('bookmarks'),
    table<never>('study_days'),
  ]);
  return { profiles, settings, topics, stats, review, bookmarks, days };
}

/**
 * Merge the server's view into the store and persist it.
 *
 * Returns the merged snapshot so the caller can push exactly what was saved,
 * rather than re-reading the store and racing a session that finished mid-sync.
 */
function mergeAndSave(remote: Awaited<ReturnType<typeof pullAll>>) {
  const s = useStudyStore.getState();

  const remoteProfile = remote.profiles[0] ? rowToProfile(remote.profiles[0]) : null;
  const { profile, updatedAt: profileAt } = mergeProfile(
    {
      name: s.name,
      onboarded: s.onboarded,
      exam: s.exam,
      level: s.level,
      levelByExam: s.levelByExam as Record<string, string>,
      pathway: s.pathway,
      variant: s.variant,
    },
    remoteProfile?.profile ?? null,
    s.syncMeta.profile,
    remoteProfile?.updatedAt ?? 0,
  );

  const remoteSettings = remote.settings[0] ? rowToSettings(remote.settings[0]) : null;
  const { settings, updatedAt: settingsAt } = mergeSettings(
    s.settings,
    remoteSettings?.settings ?? null,
    s.syncMeta.settings,
    remoteSettings?.updatedAt ?? 0,
  );

  const progress = mergeTopicProgress(
    { mastery: s.mastery, masteryUpdatedAt: s.masteryUpdatedAt, cardProgress: s.cardProgress },
    rowsToTopicProgress(remote.topics),
  );

  const stats = mergeStats(
    { questionsAnswered: s.questionsAnswered, questionsCorrect: s.questionsCorrect },
    remote.stats[0] ? rowToStats(remote.stats[0]) : null,
  );

  // Pruned after merging, not before: a tombstone that is past retention on this
  // device may still be the newest thing the server has, and dropping it first
  // would let the server's live copy win and resurrect the question.
  const reviewQueue = pruneRetired(mergeReviewQueue(s.reviewQueue, rowsToReview(remote.review)));

  const bookmarkedQuestions = mergeBookmarks(
    s.bookmarkedQuestions,
    rowsToBookmarks(remote.bookmarks, 'question'),
  );
  const bookmarkedCards = mergeBookmarks(
    s.bookmarkedCards,
    rowsToBookmarks(remote.bookmarks, 'card'),
  );

  const studyDays = mergeStudyDays(s.studyDays, rowsToStudyDays(remote.days));

  const merged = {
    ...profile,
    // `initials` is derived from the name and is not stored on the server; it has
    // to be recomputed here or a synced name shows the old avatar.
    initials: s.initials,
    settings,
    ...progress,
    ...stats,
    reviewQueue,
    bookmarkedQuestions,
    bookmarkedCards,
    studyDays,
    syncMeta: mergeSyncMeta(s.syncMeta, profileAt, settingsAt),
  };

  useStudyStore.setState({
    onboarded: merged.onboarded,
    name: merged.name,
    initials: merged.name === s.name ? s.initials : initialsOf(merged.name),
    exam: merged.exam as never,
    level: merged.level as never,
    levelByExam: merged.levelByExam as never,
    pathway: merged.pathway as never,
    variant: merged.variant as never,
    settings: merged.settings,
    mastery: merged.mastery,
    masteryUpdatedAt: merged.masteryUpdatedAt,
    cardProgress: merged.cardProgress,
    questionsAnswered: merged.questionsAnswered,
    questionsCorrect: merged.questionsCorrect,
    reviewQueue: merged.reviewQueue,
    bookmarkedQuestions: merged.bookmarkedQuestions,
    bookmarkedCards: merged.bookmarkedCards,
    studyDays: merged.studyDays,
    syncMeta: merged.syncMeta,
  });

  return merged;
}

/** Up to two initials, mirroring `initialsFor` without importing the store's copy. */
function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || 'G'
  );
}

/** Push the merged snapshot. Upserts, because every table is keyed by the user. */
async function pushAll(
  client: SupabaseClient,
  userId: string,
  merged: ReturnType<typeof mergeAndSave>,
): Promise<string | null> {
  // `PromiseLike`, not `Promise`: a Supabase query builder is thenable but is not
  // a Promise, and typing it as one rejects every call here.
  const writes: PromiseLike<{ error: { message: string } | null }>[] = [
    client.from('profiles').upsert(profileToRow(userId, merged, merged.syncMeta.profile)),
    client
      .from('settings')
      .upsert(settingsToRow(userId, merged.settings, merged.syncMeta.settings)),
    client
      .from('stats')
      .upsert(statsToRow(userId, merged, Math.max(merged.syncMeta.profile, Date.now()))),
  ];

  const topicRows = topicProgressToRows(
    userId,
    merged.mastery,
    merged.masteryUpdatedAt,
    merged.cardProgress,
  );
  if (topicRows.length > 0) writes.push(client.from('topic_progress').upsert(topicRows));

  const reviewRows = reviewToRows(userId, merged.reviewQueue);
  if (reviewRows.length > 0) writes.push(client.from('review_queue').upsert(reviewRows));

  const bookmarkRows = [
    ...bookmarksToRows(userId, 'question', merged.bookmarkedQuestions),
    ...bookmarksToRows(userId, 'card', merged.bookmarkedCards),
  ];
  if (bookmarkRows.length > 0) writes.push(client.from('bookmarks').upsert(bookmarkRows));

  const dayRows = studyDaysToRows(userId, merged.studyDays);
  // `ignoreDuplicates` because study days have no updatable column — the row's
  // existence is the whole fact, and a plain upsert would rewrite every day on
  // every sync for no gain.
  if (dayRows.length > 0) {
    writes.push(client.from('study_days').upsert(dayRows, { ignoreDuplicates: true }));
  }

  const results = await Promise.all(writes);
  const failed = results.find((r) => r.error);
  return failed?.error?.message ?? null;
}

/**
 * Run one sync. Never throws; every failure is a returned outcome.
 */
export async function runSync(client: SupabaseClient | null): Promise<SyncOutcome> {
  if (!client) return { kind: 'skipped', reason: 'not-configured' };

  try {
    const { data } = await client.auth.getSession();
    const userId = data.session?.user?.id;
    if (!userId) return { kind: 'skipped', reason: 'signed-out' };

    const remote = await pullAll(client, userId);
    const merged = mergeAndSave(remote);
    const pushError = await pushAll(client, userId, merged);
    if (pushError) return { kind: 'failed', message: pushError };
    return { kind: 'synced', at: Date.now() };
  } catch (e) {
    return { kind: 'failed', message: String((e as Error)?.message ?? e) };
  }
}
