/**
 * The merge rules are where sync is either correct or quietly destructive.
 * Nothing here throws when it gets it wrong — a bad merge silently rewinds
 * someone's progress — so every rule in `supabase/sync.md` has a case, and the
 * cases are written as the disagreements that actually happen between two
 * devices rather than as abstract table tests.
 */
import { ReviewItem } from '@/store/review';
import {
  BookmarkRow,
  TopicProgressRow,
  mergeBookmarks,
  mergeProfile,
  mergeReviewQueue,
  mergeSettings,
  mergeStats,
  mergeStudyDays,
  mergeSyncMeta,
  mergeTopicProgress,
} from '@/sync/merge';

describe('topic progress', () => {
  const local = {
    mastery: { ethics: 70, quant: 40 },
    masteryUpdatedAt: { ethics: 200, quant: 200 },
    cardProgress: { ethics: 5, quant: 2 },
  };

  it('takes the remote mastery when the remote stamp is later', () => {
    const remote: TopicProgressRow[] = [
      { topicKey: 'ethics', mastery: 85, cardProgress: 5, updatedAt: 300 },
    ];
    const out = mergeTopicProgress(local, remote);
    expect(out.mastery.ethics).toBe(85);
    expect(out.masteryUpdatedAt.ethics).toBe(300);
  });

  it('keeps local mastery when the remote is stale', () => {
    const remote: TopicProgressRow[] = [
      { topicKey: 'ethics', mastery: 12, cardProgress: 5, updatedAt: 100 },
    ];
    expect(mergeTopicProgress(local, remote).mastery.ethics).toBe(70);
  });

  /**
   * Mastery can legitimately fall — a bad sitting moves it down — so it follows
   * the stamp. Card progress is the furthest card ever reached and the app never
   * revises it down, so "later wins" would let a stale device rewind someone's
   * place in the deck. That is why they merge differently despite sharing a row.
   */
  it('takes the greater card progress even when the remote row is stale', () => {
    const remote: TopicProgressRow[] = [
      { topicKey: 'ethics', mastery: 12, cardProgress: 9, updatedAt: 100 },
    ];
    const out = mergeTopicProgress(local, remote);
    expect(out.mastery.ethics).toBe(70);
    expect(out.cardProgress.ethics).toBe(9);
  });

  it('never lowers card progress from a remote that is behind', () => {
    const remote: TopicProgressRow[] = [
      { topicKey: 'ethics', mastery: 90, cardProgress: 1, updatedAt: 900 },
    ];
    expect(mergeTopicProgress(local, remote).cardProgress.ethics).toBe(5);
  });

  it('adds topics the device has never seen', () => {
    const remote: TopicProgressRow[] = [
      { topicKey: 'fixed', mastery: 33, cardProgress: 2, updatedAt: 50 },
    ];
    const out = mergeTopicProgress(local, remote);
    expect(out.mastery.fixed).toBe(33);
    expect(out.cardProgress.fixed).toBe(2);
  });

  it('leaves local-only topics alone', () => {
    expect(mergeTopicProgress(local, []).mastery).toEqual(local.mastery);
  });
});

describe('review queue', () => {
  const mk = (over: Partial<ReviewItem>): ReviewItem => ({
    id: 'ethics#1',
    topicKey: 'ethics',
    qIdx: 1,
    step: 0,
    dueOn: '2026-10-01',
    lapses: 1,
    updatedAt: 100,
    ...over,
  });

  it('takes the later item', () => {
    const out = mergeReviewQueue([mk({ step: 0 })], [mk({ step: 3, updatedAt: 200 })]);
    expect(out[0].step).toBe(3);
  });

  it('keeps the local item when the remote is older', () => {
    const out = mergeReviewQueue([mk({ step: 5, updatedAt: 300 })], [mk({ step: 0 })]);
    expect(out[0].step).toBe(5);
  });

  it('adds items this device has never seen', () => {
    const out = mergeReviewQueue([mk({})], [mk({ id: 'quant#2', qIdx: 2 })]);
    expect(out.map((i) => i.id).sort()).toEqual(['ethics#1', 'quant#2']);
  });

  // The point of the tombstone: without it the stale device's live copy wins by
  // simply existing, and the graduated question comes back.
  it('lets a newer remote tombstone retire a locally live item', () => {
    const out = mergeReviewQueue([mk({})], [mk({ retiredAt: 200, updatedAt: 200 })]);
    expect(out[0].retiredAt).toBe(200);
  });

  it('lets a newer local lapse un-retire a remotely retired item', () => {
    const out = mergeReviewQueue(
      [mk({ updatedAt: 300, retiredAt: undefined })],
      [mk({ retiredAt: 200, updatedAt: 200 })],
    );
    expect(out[0].retiredAt).toBeUndefined();
  });
});

describe('bookmarks', () => {
  it('takes the later toggle', () => {
    const local = { 'a#1': { on: true, at: 100 } };
    const remote: BookmarkRow[] = [{ itemKey: 'a#1', bookmarked: false, updatedAt: 200 }];
    expect(mergeBookmarks(local, remote)['a#1']).toEqual({ on: false, at: 200 });
  });

  // A removal has to be able to win. With presence-as-truth it never could.
  it('lets a remote removal beat a stale local bookmark', () => {
    const local = { 'a#1': { on: true, at: 10 } };
    const remote: BookmarkRow[] = [{ itemKey: 'a#1', bookmarked: false, updatedAt: 20 }];
    expect(mergeBookmarks(local, remote)['a#1'].on).toBe(false);
  });

  it('lets a newer local re-bookmark beat a remote removal', () => {
    const local = { 'a#1': { on: true, at: 50 } };
    const remote: BookmarkRow[] = [{ itemKey: 'a#1', bookmarked: false, updatedAt: 20 }];
    expect(mergeBookmarks(local, remote)['a#1'].on).toBe(true);
  });

  it('adds remote bookmarks the device has never seen', () => {
    expect(mergeBookmarks({}, [{ itemKey: 'b#2', bookmarked: true, updatedAt: 5 }])['b#2']).toEqual(
      { on: true, at: 5 },
    );
  });
});

describe('study days', () => {
  it('unions, because a day studied on either device was studied', () => {
    expect(mergeStudyDays(['2026-09-01', '2026-09-03'], ['2026-09-02', '2026-09-03'])).toEqual([
      '2026-09-01',
      '2026-09-02',
      '2026-09-03',
    ]);
  });

  it('caps at the same limit the store keeps, retaining the most recent', () => {
    const many = Array.from(
      { length: 450 },
      (_, i) => `2020-01-${String((i % 28) + 1).padStart(2, '0')}-${i}`,
    );
    expect(mergeStudyDays(many, []).length).toBe(400);
  });
});

describe('counters', () => {
  /**
   * Summing is the obvious first instinct and it is wrong: both devices count
   * the same local history, so every re-sync would inflate the totals again.
   * Taking the greater is stable under the repeated retries sync actually sees.
   */
  it('takes the greater, never the sum', () => {
    const out = mergeStats(
      { questionsAnswered: 200, questionsCorrect: 150 },
      { questionsAnswered: 180, questionsCorrect: 170 },
    );
    expect(out).toEqual({ questionsAnswered: 200, questionsCorrect: 170 });
  });

  it('is idempotent — merging the same remote twice changes nothing', () => {
    const remote = { questionsAnswered: 300, questionsCorrect: 200 };
    const once = mergeStats({ questionsAnswered: 10, questionsCorrect: 5 }, remote);
    expect(mergeStats(once, remote)).toEqual(once);
  });

  it('leaves local alone when there is no remote row', () => {
    const local = { questionsAnswered: 7, questionsCorrect: 3 };
    expect(mergeStats(local, null)).toEqual(local);
  });
});

describe('whole-row state', () => {
  const local = {
    name: 'Local',
    onboarded: true,
    exam: 'CFA' as string | null,
    level: 'L1' as string | null,
    levelByExam: { CFA: 'L1' },
    pathway: 'portfolio',
    variant: 'b',
  };
  const remote = { ...local, name: 'Remote', exam: 'FRM', level: 'P1' };

  /**
   * The profile moves as one row because its fields are not independent: an exam
   * from one device with a level from another is a state the app can never
   * produce, and would render as "FRM Level I".
   */
  it('takes the whole remote profile when it is newer, never field by field', () => {
    const out = mergeProfile(local, remote, 100, 200);
    expect(out.profile.exam).toBe('FRM');
    expect(out.profile.level).toBe('P1');
    expect(out.updatedAt).toBe(200);
  });

  it('keeps the whole local profile on a tie, so a resync does not flap', () => {
    expect(mergeProfile(local, remote, 200, 200).profile.name).toBe('Local');
  });

  it('keeps local settings when the remote is older', () => {
    const out = mergeSettings(
      { spacedRepetition: true, dailyReminder: false, timedQuizzes: true },
      { spacedRepetition: false, dailyReminder: true, timedQuizzes: false },
      500,
      400,
    );
    expect(out.settings.timedQuizzes).toBe(true);
    expect(out.updatedAt).toBe(500);
  });

  it('advances each sync stamp to the later of the two', () => {
    expect(mergeSyncMeta({ profile: 10, settings: 90 }, 50, 20)).toEqual({
      profile: 50,
      settings: 90,
    });
  });
});
