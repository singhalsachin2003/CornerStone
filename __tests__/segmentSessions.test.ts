/**
 * The review queue keys every item as `topicKey#index` into the topic's question
 * bank. Adding paid segments doubled the size of several banks, so the thing worth
 * pinning down is that an index means the same question it always did — including
 * for somebody whose subscription starts, and for somebody whose subscription ends
 * while their queue still holds premium items.
 */
import {
  CORE_SLUG,
  accessibleQuestionEntries,
  allQuestionsFor,
  coreSegment,
  premiumSegmentsFor,
  questionsFor,
  segmentByKey,
  segmentsFor,
} from '@/content';
import { ALL_TOPICS } from '@/content/syllabus';
import {
  buildPlacementSession,
  buildReviewSession,
  buildSegmentSession,
} from '@/store/useSessionStore';

const WITH_PREMIUM = ALL_TOPICS.filter((t) => premiumSegmentsFor(t.key).length > 0);

describe('the canonical bank', () => {
  it('puts the free core first in every topic, so no shipped index moves', () => {
    for (const topic of ALL_TOPICS) {
      const core = questionsFor(topic.key);
      const all = allQuestionsFor(topic.key);
      expect(all.slice(0, core.length)).toEqual(core);
    }
  });

  it('gives every segment an offset that lands on its own first question', () => {
    for (const topic of WITH_PREMIUM) {
      const all = allQuestionsFor(topic.key);
      for (const segment of segmentsFor(topic.key)) {
        if (segment.questions.length === 0) continue;
        expect(all[segment.questionOffset]).toBe(segment.questions[0]);
        expect(all[segment.questionOffset + segment.questions.length - 1]).toBe(
          segment.questions[segment.questions.length - 1],
        );
      }
    }
  });

  it('reserves the core slug, so a premium segment can never shadow free content', () => {
    for (const topic of ALL_TOPICS) {
      expect(coreSegment(topic.key).slug).toBe(CORE_SLUG);
      for (const segment of premiumSegmentsFor(topic.key)) {
        expect(segment.slug).not.toBe(CORE_SLUG);
      }
    }
  });

  it('resolves every segment by its key', () => {
    for (const topic of ALL_TOPICS) {
      for (const segment of segmentsFor(topic.key)) {
        expect(segmentByKey(segment.key)?.key).toBe(segment.key);
      }
    }
  });
});

describe('what an install may study', () => {
  const topic = WITH_PREMIUM[0];

  it('without premium, exactly the free core', () => {
    const entries = accessibleQuestionEntries(topic.key, false);
    expect(entries.map((e) => e.question)).toEqual(questionsFor(topic.key));
    expect(entries.map((e) => e.qIdx)).toEqual(questionsFor(topic.key).map((_, i) => i));
  });

  it('with premium, the core plus the paid segments — and the free indices are unchanged', () => {
    const free = accessibleQuestionEntries(topic.key, false);
    const paid = accessibleQuestionEntries(topic.key, true);
    expect(paid.length).toBeGreaterThan(free.length);
    expect(paid.slice(0, free.length)).toEqual(free);
  });
});

describe('building a segment session', () => {
  it('tags every question with its index in the canonical bank, not in the segment', () => {
    const segment = premiumSegmentsFor(WITH_PREMIUM[0].key)[0];
    const session = buildSegmentSession(segment);
    const all = allQuestionsFor(segment.topicKey);
    expect(session.questions).toHaveLength(segment.questions.length);
    session.origins.forEach((origin, i) => {
      expect(origin.topicKey).toBe(segment.topicKey);
      // Shuffling reorders the pair together — and rewrites each question's option
      // order — so the origin must still point at the question beside it, matched
      // on its stem rather than on object identity.
      expect(all[origin.qIdx]?.text).toBe(session.questions[i].text);
    });
  });
});

describe('building a review session', () => {
  const topicKey = WITH_PREMIUM[0].key;
  const premiumIdx = premiumSegmentsFor(topicKey)[0].questionOffset;

  function due(qIdx: number) {
    return { id: `${topicKey}#${qIdx}`, topicKey, qIdx, step: 0, lapses: 1, dueOn: '2026-09-01' };
  }

  it('serves a premium item to somebody entitled to it', () => {
    const session = buildReviewSession([due(premiumIdx)], true);
    expect(session.questions).toHaveLength(1);
    expect(session.origins[0].qIdx).toBe(premiumIdx);
  });

  // The queue item is skipped, not deleted: access can come back, and the
  // schedule should survive the gap rather than restart.
  it('skips a premium item for somebody who is not entitled', () => {
    const session = buildReviewSession([due(premiumIdx)], false);
    expect(session.questions).toHaveLength(0);
  });

  it('keeps questions and origins aligned when an item is skipped', () => {
    const session = buildReviewSession([due(premiumIdx), due(0), due(1)], false);
    expect(session.questions).toHaveLength(2);
    const bank = allQuestionsFor(topicKey);
    session.origins.forEach((origin, i) => {
      expect(bank[origin.qIdx]?.text).toBe(session.questions[i].text);
    });
  });

  it('drops an index that no longer resolves to a question at all', () => {
    const session = buildReviewSession([due(9999)], true);
    expect(session.questions).toHaveLength(0);
  });

  it('still caps a session at ten', () => {
    const items = Array.from({ length: 30 }, (_, i) => due(i % questionsFor(topicKey).length));
    expect(buildReviewSession(items, false).questions).toHaveLength(10);
  });
});

/**
 * Placement always draws question 0 from the same five areas, so it is the one
 * session a candidate can see repeatedly in identical form. It was also the one
 * builder that never shuffled its options — and across the authored banks the
 * correct answer sits in the second slot about four times in five, because that
 * is how the questions were written. Every other session shuffles at build time,
 * which hides that; placement did not.
 */
describe('placement sessions', () => {
  const topics = ALL_TOPICS.slice(0, 10).map((t) => ({ key: t.key, name: t.name }));

  it('draws one question from up to five areas, deterministically', () => {
    const a = buildPlacementSession(topics, 'CFA');
    const b = buildPlacementSession(topics, 'CFA');
    expect(a.questions.length).toBeGreaterThan(0);
    expect(a.questions.length).toBeLessThanOrEqual(5);
    // Selection is stable: the same areas and the same bank indices every time.
    expect(a.origins).toEqual(b.origins);
  });

  it('serves each question with its options in some order, answer carried with them', () => {
    const session = buildPlacementSession(topics, 'CFA');
    session.questions.forEach((q, i) => {
      const source = questionsFor(session.origins[i].topicKey)[session.origins[i].qIdx];
      expect(q.text).toBe(source.text);
      expect([...q.opts].sort()).toEqual([...source.opts].sort());
      // Whatever the order, `a` must still point at the same option text.
      expect(q.opts[q.a]).toBe(source.opts[source.a]);
    });
  });

  it('does not leave every answer in the same slot across repeated builds', () => {
    // Prose options are shuffled per build, so over many builds the answer must
    // land in more than one slot. A single fixed slot would mean no shuffling.
    const slots = new Set<number>();
    for (let i = 0; i < 40; i++) {
      for (const q of buildPlacementSession(topics, 'CFA').questions) slots.add(q.a);
    }
    expect(slots.size).toBeGreaterThan(1);
  });
});
