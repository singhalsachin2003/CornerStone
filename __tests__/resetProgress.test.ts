/**
 * `resetProgress` clears studying and nothing else.
 *
 * Written on 2026-09-27, when wiring the store action into the account screen
 * turned up that it had never had a caller — it was declared, implemented and
 * dead, with two other stores carrying comments about what it must not touch
 * and nothing checking that it didn't.
 *
 * The entitlement half is the part worth a test. `useAccessStore` is a separate
 * store specifically so a reset cannot take away a subscription or a
 * promotional grant a candidate cannot earn again, and that separation is easy
 * to undo by accident later.
 */
import { useStudyStore } from '@/store/useStudyStore';

describe('resetProgress', () => {
  it('clears every field that records studying', () => {
    useStudyStore.setState({
      mastery: { 'cfa-l1-ethics': 62 },
      masteryUpdatedAt: { 'cfa-l1-ethics': 1756684800000 },
      cardProgress: { 'cfa-l1-ethics': 4 },
      bookmarkedQuestions: { 'cfa-l1-ethics#0': { on: true, at: 1756684800000 } },
      bookmarkedCards: { 'cfa-l1-ethics#1': { on: true, at: 1756684800000 } },
      reviewQueue: [
        {
          id: 'cfa-l1-ethics#0',
          topicKey: 'cfa-l1-ethics',
          qIdx: 0,
          step: 0,
          dueOn: '2026-09-02',
          lapses: 0,
          updatedAt: 1756684800000,
        },
      ],
      studyDays: ['2026-09-01'],
      questionsAnswered: 40,
      questionsCorrect: 31,
    });

    useStudyStore.getState().resetProgress();
    const after = useStudyStore.getState();

    expect(after.mastery).toEqual({});
    expect(after.masteryUpdatedAt).toEqual({});
    expect(after.cardProgress).toEqual({});
    expect(after.bookmarkedQuestions).toEqual({});
    expect(after.bookmarkedCards).toEqual({});
    expect(after.reviewQueue).toEqual([]);
    expect(after.studyDays).toEqual([]);
    expect(after.questionsAnswered).toBe(0);
    expect(after.questionsCorrect).toBe(0);
  });

  it('cannot reach the entitlement, because it is not in this store', () => {
    // The guarantee is structural rather than defensive: `useAccessStore` is a
    // separate store with its own storage key, so there is no subscription or
    // promotional grant here for `resetProgress` to clear even by accident.
    // Asserted on the store's own keys, which is what a future refactor would
    // have to change to break the promise. Importing the access store here
    // instead would drag the purchases SDK into a node-environment suite that
    // deliberately tests pure logic only.
    useStudyStore.setState({ questionsAnswered: 12 });
    useStudyStore.getState().resetProgress();

    const keys = Object.keys(useStudyStore.getState());
    expect(useStudyStore.getState().questionsAnswered).toBe(0);
    expect(keys).not.toContain('subscriptionActive');
    expect(keys).not.toContain('grandfathered');
    expect(keys).not.toContain('promoGrantUntil');
  });
});
