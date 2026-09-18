/**
 * The timestamps cross-device merge needs, and the migration that backfills them.
 *
 * Pure and separate from the store so the migration can be tested without
 * AsyncStorage — it is the one piece of this feature that touches data already
 * on people's phones, and getting it wrong loses study history.
 *
 * Not everything needs a timestamp. `supabase/sync.md` sets the rule per field,
 * and only the ones that merge by "later wins" need one:
 *
 * | Field | Merge | Stamp? |
 * | --- | --- | --- |
 * | studyDays | union | no |
 * | questionsAnswered/Correct | greater | no |
 * | cardProgress | greater | no |
 * | mastery | later wins | **per topic** |
 * | review items | later wins | **per item** (in `ReviewItem`) |
 * | bookmarks | later wins | **per bookmark**, with an on/off flag |
 * | profile, settings | later wins, whole row | **one each** |
 */

/**
 * A bookmark, as stored.
 *
 * Presence used to mean "bookmarked" and absence "not". That cannot express a
 * *removal*: a device still holding the entry would treat its own copy as newer
 * and restore it on the next merge. So the flag is explicit and the row stays.
 */
export interface BookmarkState {
  on: boolean;
  /** Epoch ms of the last toggle. */
  at: number;
}

export type BookmarkMap = Record<string, BookmarkState>;

/** Whole-row timestamps for the state that has no natural per-item key. */
export interface SyncMeta {
  /** Name, exam, level, pathway and list style all move as one row. */
  profile: number;
  settings: number;
}

export const EMPTY_SYNC_META: SyncMeta = { profile: 0, settings: 0 };

export function isBookmarked(map: BookmarkMap, id: string): boolean {
  return map[id]?.on === true;
}

export function bookmarkCount(map: BookmarkMap): number {
  return Object.values(map).filter((b) => b.on).length;
}

/** Toggle, keeping the entry so a removal survives a merge. */
export function toggleBookmark(map: BookmarkMap, id: string, now: number): BookmarkMap {
  return { ...map, [id]: { on: !isBookmarked(map, id), at: now } };
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

/** The shape persisted by every build before sync existed. */
interface LegacyPersistedState {
  mastery?: Record<string, number>;
  bookmarkedQuestions?: Record<string, unknown>;
  bookmarkedCards?: Record<string, unknown>;
  /**
   * Loosely typed on purpose: this is JSON off disk written by a build that may
   * be older than the current `ReviewItem`, so the only fields worth naming are
   * the ones the migration reads.
   */
  reviewQueue?: (Record<string, unknown> & { updatedAt?: number; retiredAt?: number })[];
  studyDays?: string[];
  [key: string]: unknown;
}

/**
 * Backfill timestamps onto state written before they existed.
 *
 * **What a legacy record gets matters**, because it decides which device wins
 * the first disagreement. Stamping everything with the migration's own clock
 * would make every record look equally recent and would order two devices by
 * which happened to open the app first — the one fact that has nothing to do
 * with where the study actually happened.
 *
 * So each falls back to something the record already knows, and where it knows
 * nothing it gets 0. A zero stamp is not a problem: it loses the first merge,
 * the winner is written back with a real stamp, and both devices converge.
 *
 * Mastery is the exception worth the effort. It falls back to the most recent
 * study day, which is a real statement about when the progress was last touched
 * — and mastery is the field where losing a merge costs weeks rather than a
 * preference.
 */
export function migrateToSyncable(state: LegacyPersistedState): LegacyPersistedState {
  const studyDays = Array.isArray(state.studyDays) ? state.studyDays : [];
  // Day keys are ISO date-only strings, so the lexical maximum is the latest.
  const latestDay = studyDays.length > 0 ? [...studyDays].sort().at(-1) : undefined;
  const masteryStamp = latestDay ? new Date(`${latestDay}T00:00:00`).getTime() : 0;

  const mastery = state.mastery ?? {};
  const masteryUpdatedAt: Record<string, number> = {};
  for (const topicKey of Object.keys(mastery)) masteryUpdatedAt[topicKey] = masteryStamp;

  return {
    ...state,
    masteryUpdatedAt,
    bookmarkedQuestions: migrateBookmarks(state.bookmarkedQuestions),
    bookmarkedCards: migrateBookmarks(state.bookmarkedCards),
    reviewQueue: (state.reviewQueue ?? []).map((item) => ({
      ...item,
      // Never overwrite a stamp that is already there: the migration must be safe
      // to run against partially migrated state.
      updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : 0,
    })),
    syncMeta: EMPTY_SYNC_META,
  };
}

/** `{ id: true }` becomes `{ id: { on: true, at: 0 } }`, idempotently. */
function migrateBookmarks(legacy: Record<string, unknown> | undefined): BookmarkMap {
  const out: BookmarkMap = {};
  for (const [id, value] of Object.entries(legacy ?? {})) {
    if (value !== null && typeof value === 'object' && 'on' in value) {
      out[id] = value as BookmarkState;
    } else if (value) {
      out[id] = { on: true, at: 0 };
    }
  }
  return out;
}
