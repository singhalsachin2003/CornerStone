/**
 * Field mapping fails silently: the write succeeds, the read returns something
 * plausible, and the damage shows up on a second device weeks later. So every
 * type round-trips, and the two places where a naive mapping is actively wrong
 * — the guest name and the retirement tombstone — have their own cases.
 */
import { ReviewItem } from '@/store/review';
import {
  GUEST_NAME,
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
} from '@/sync/rows';

const USER = '00000000-0000-0000-0000-000000000001';

describe('profile', () => {
  const profile = {
    name: 'Anaya',
    onboarded: true,
    exam: 'CFA' as string | null,
    level: 'L2' as string | null,
    levelByExam: { CFA: 'L2', FRM: 'P1' },
    pathway: 'private-wealth',
    variant: 'c',
  };

  it('round-trips every field', () => {
    const row = profileToRow(USER, profile, 1_700_000_000_000);
    const back = rowToProfile(row);
    expect(back.profile).toEqual(profile);
    expect(back.updatedAt).toBe(1_700_000_000_000);
  });

  /**
   * 'Guest' is the store's placeholder for "no name given", not a name. Writing
   * it would make the placeholder look like a chosen name on every other device
   * — which is the exact bug the guest default was introduced to fix.
   */
  it('writes the guest placeholder as null, and reads null back as the placeholder', () => {
    const row = profileToRow(USER, { ...profile, name: GUEST_NAME }, 1);
    expect(row.display_name).toBeNull();
    expect(rowToProfile(row).profile.name).toBe(GUEST_NAME);
  });

  it('survives a row written by an older client with null preferences', () => {
    const row = profileToRow(USER, profile, 1);
    const sparse = { ...row, pathway: null, variant: null, level_by_exam: undefined as never };
    const back = rowToProfile(sparse);
    expect(back.profile.pathway).toBe('portfolio');
    expect(back.profile.variant).toBe('b');
    expect(back.profile.levelByExam).toEqual({});
  });
});

describe('settings and stats', () => {
  it('round-trips settings', () => {
    const settings = { spacedRepetition: false, dailyReminder: true, timedQuizzes: true };
    expect(rowToSettings(settingsToRow(USER, settings, 5)).settings).toEqual(settings);
  });

  it('round-trips stats', () => {
    const stats = { questionsAnswered: 214, questionsCorrect: 151 };
    expect(rowToStats(statsToRow(USER, stats, 5))).toEqual(stats);
  });
});

describe('topic progress', () => {
  /**
   * A topic with card progress but no mastery is real: the candidate read the
   * cards and has not taken the quiz. Keying rows off the mastery map alone
   * would drop their place in the deck.
   */
  it('emits a row for a topic that has card progress but no mastery', () => {
    const rows = topicProgressToRows(USER, {}, {}, { ethics: 4 });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ topic_key: 'ethics', mastery: 0, card_progress: 4 });
  });

  it('round-trips both values and the stamp', () => {
    const rows = topicProgressToRows(
      USER,
      { quant: 62 },
      { quant: 1_700_000_000_000 },
      { quant: 3 },
    );
    expect(rowsToTopicProgress(rows)).toEqual([
      { topicKey: 'quant', mastery: 62, cardProgress: 3, updatedAt: 1_700_000_000_000 },
    ]);
  });
});

describe('review queue', () => {
  const item: ReviewItem = {
    id: 'ethics#1',
    topicKey: 'ethics',
    qIdx: 1,
    step: 2,
    dueOn: '2026-10-01',
    lapses: 3,
    updatedAt: 1_700_000_000_000,
  };

  it('round-trips a live item', () => {
    expect(rowsToReview(reviewToRows(USER, [item]))).toEqual([{ ...item, retiredAt: undefined }]);
  });

  it('round-trips a tombstone', () => {
    const retired = { ...item, retiredAt: 1_700_000_005_000 };
    expect(rowsToReview(reviewToRows(USER, [retired]))[0].retiredAt).toBe(1_700_000_005_000);
  });

  /**
   * The server stores a missing tombstone as null. Reading it back as null would
   * make `retiredAt !== undefined` true and silently retire every live item in
   * the queue — the whole queue would vanish from the review screen.
   */
  it('reads a null retired_at back as undefined, not null', () => {
    const row = reviewToRows(USER, [item])[0];
    expect(row.retired_at).toBeNull();
    expect(rowsToReview([row])[0].retiredAt).toBeUndefined();
  });
});

describe('bookmarks', () => {
  it('round-trips both states, keeping removals', () => {
    const map = { 'a#1': { on: true, at: 100 }, 'a#2': { on: false, at: 200 } };
    const rows = bookmarksToRows(USER, 'question', map);
    expect(rowsToBookmarks(rows, 'question')).toEqual([
      { itemKey: 'a#1', bookmarked: true, updatedAt: 100 },
      { itemKey: 'a#2', bookmarked: false, updatedAt: 200 },
    ]);
  });

  // Questions and cards share the `topicKey#index` shape and the same index can
  // legitimately be both, so the kind has to separate them or one overwrites the
  // other.
  it('keeps question and card bookmarks apart even at the same key', () => {
    const rows = [
      ...bookmarksToRows(USER, 'question', { 'a#1': { on: true, at: 1 } }),
      ...bookmarksToRows(USER, 'card', { 'a#1': { on: false, at: 2 } }),
    ];
    expect(rowsToBookmarks(rows, 'question')).toEqual([
      { itemKey: 'a#1', bookmarked: true, updatedAt: 1 },
    ]);
    expect(rowsToBookmarks(rows, 'card')).toEqual([
      { itemKey: 'a#1', bookmarked: false, updatedAt: 2 },
    ]);
  });
});

describe('study days', () => {
  it('round-trips', () => {
    const days = ['2026-09-01', '2026-09-02'];
    expect(rowsToStudyDays(studyDaysToRows(USER, days))).toEqual(days);
  });
});
