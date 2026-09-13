/**
 * The migration is the one part of sync that touches data already on people's
 * phones. Getting it wrong loses study history, so it is tested against the
 * exact shape earlier builds wrote rather than against a convenient fixture.
 */
import {
  BookmarkMap,
  bookmarkCount,
  isBookmarked,
  migrateToSyncable,
  toggleBookmark,
} from '@/store/syncMeta';

/** What `cornerstone.study.v1` held before sync existed. */
function legacyState(over: Record<string, unknown> = {}) {
  return {
    onboarded: true,
    name: 'Guest',
    exam: 'CFA',
    level: 'L1',
    mastery: { 'cfa-l1-ethics': 72, 'cfa-l1-quant': 40 },
    cardProgress: { 'cfa-l1-ethics': 3 },
    bookmarkedQuestions: { 'cfa-l1-fsa#1': true },
    bookmarkedCards: { 'cfa-l1-econ#1': true },
    reviewQueue: [
      {
        id: 'cfa-l1-fsa#2',
        topicKey: 'cfa-l1-fsa',
        qIdx: 2,
        step: 0,
        dueOn: '2026-09-20',
        lapses: 1,
      },
    ],
    studyDays: ['2026-09-01', '2026-09-11', '2026-09-05'],
    questionsAnswered: 214,
    questionsCorrect: 151,
    settings: { spacedRepetition: true, dailyReminder: false, timedQuizzes: false },
    ...over,
  };
}

describe('bookmarks as on/off rather than present/absent', () => {
  it('reads a live bookmark and ignores a removed one', () => {
    const map: BookmarkMap = { a: { on: true, at: 1 }, b: { on: false, at: 2 } };
    expect(isBookmarked(map, 'a')).toBe(true);
    expect(isBookmarked(map, 'b')).toBe(false);
    expect(isBookmarked(map, 'missing')).toBe(false);
  });

  // The entry has to stay so the removal can beat a stale device's copy, which
  // means a naive count of keys would count removals as bookmarks.
  it('counts only live bookmarks', () => {
    expect(bookmarkCount({ a: { on: true, at: 1 }, b: { on: false, at: 2 } })).toBe(1);
  });

  it('keeps the entry when a bookmark is removed, and stamps it', () => {
    const added = toggleBookmark({}, 'x', 100);
    expect(added.x).toEqual({ on: true, at: 100 });
    const removed = toggleBookmark(added, 'x', 200);
    expect(removed.x).toEqual({ on: false, at: 200 });
    expect('x' in removed).toBe(true);
  });
});

describe('migrating state written before sync existed', () => {
  it('leaves every field the app already relied on untouched', () => {
    const before = legacyState();
    const after = migrateToSyncable(before);
    expect(after.mastery).toEqual(before.mastery);
    expect(after.cardProgress).toEqual(before.cardProgress);
    expect(after.studyDays).toEqual(before.studyDays);
    expect(after.questionsAnswered).toBe(214);
    expect(after.questionsCorrect).toBe(151);
    expect(after.settings).toEqual(before.settings);
    expect(after.name).toBe('Guest');
  });

  it('converts bookmarks to the on/off shape without losing any', () => {
    const after = migrateToSyncable(legacyState());
    expect(after.bookmarkedQuestions).toEqual({ 'cfa-l1-fsa#1': { on: true, at: 0 } });
    expect(after.bookmarkedCards).toEqual({ 'cfa-l1-econ#1': { on: true, at: 0 } });
  });

  /**
   * Mastery is the field where losing a merge costs weeks rather than a
   * preference, so it gets a real stamp rather than 0 — the most recent study
   * day, which is a genuine statement about when the progress was last touched.
   * Day keys are ISO, so the lexical maximum is the latest even unsorted.
   */
  it('stamps mastery with the latest study day, not the migration clock', () => {
    const after = migrateToSyncable(legacyState());
    const expected = new Date('2026-09-11T00:00:00').getTime();
    expect(after.masteryUpdatedAt).toEqual({
      'cfa-l1-ethics': expected,
      'cfa-l1-quant': expected,
    });
  });

  it('stamps mastery 0 when the app has never been used', () => {
    const after = migrateToSyncable(legacyState({ studyDays: [], mastery: { 'cfa-l1-econ': 5 } }));
    expect(after.masteryUpdatedAt).toEqual({ 'cfa-l1-econ': 0 });
  });

  /**
   * A queue item has no date that says when it was last touched — `dueOn` is in
   * the future by construction. So it starts at 0 and loses its first merge,
   * which is correct: the winner is written back with a real stamp and both
   * devices converge.
   */
  it('stamps review items 0 rather than inventing a time', () => {
    const after = migrateToSyncable(legacyState());
    expect(after.reviewQueue).toEqual([
      expect.objectContaining({ id: 'cfa-l1-fsa#2', updatedAt: 0 }),
    ]);
  });

  it('adds whole-row timestamps for the profile and settings', () => {
    expect(migrateToSyncable(legacyState()).syncMeta).toEqual({ profile: 0, settings: 0 });
  });

  it('survives a completely empty state', () => {
    const after = migrateToSyncable({});
    expect(after.masteryUpdatedAt).toEqual({});
    expect(after.bookmarkedQuestions).toEqual({});
    expect(after.reviewQueue).toEqual([]);
  });

  // A migration that runs twice must not undo the first run — a crash between
  // writing and recording the version is not a hypothetical.
  it('is idempotent, preserving stamps the first run produced', () => {
    const once = migrateToSyncable(legacyState());
    (once.reviewQueue as { updatedAt: number }[])[0].updatedAt = 555;
    (once.bookmarkedQuestions as BookmarkMap)['cfa-l1-fsa#1'] = { on: false, at: 777 };
    const twice = migrateToSyncable(once);
    expect((twice.reviewQueue as { updatedAt: number }[])[0].updatedAt).toBe(555);
    expect((twice.bookmarkedQuestions as BookmarkMap)['cfa-l1-fsa#1']).toEqual({
      on: false,
      at: 777,
    });
  });
});
