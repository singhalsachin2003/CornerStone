/**
 * The review queue stores items as `topicKey#index` into a topic's canonical
 * question bank — free core first, then premium segments in the order
 * `segments/index.ts` merges them. A segment's `questionOffset` is therefore a
 * function of its *position*, and moving it repoints every queued review at a
 * different question. Silently: nothing throws, nothing looks wrong, a candidate
 * simply starts being asked things they never got wrong.
 *
 * So the offsets are pinned. Appending a tranche adds entries and leaves these
 * alone; inserting one anywhere else changes them and fails here, loudly, with
 * the segment named.
 *
 * **If this test fails, do not update the fixture to match.** Move the new
 * segments to the end of the merge list instead. The fixture may only gain
 * entries.
 */
import pinned from './fixtures/segment-offsets.json';
import { ALL_TOPICS, premiumSegmentsFor } from '@/content';

const actual: Record<string, number> = {};
for (const topic of ALL_TOPICS) {
  for (const segment of premiumSegmentsFor(topic.key)) actual[segment.key] = segment.questionOffset;
}

describe('segment question offsets', () => {
  it('has not moved any segment that was already shipped', () => {
    const moved = Object.entries(pinned as Record<string, number>)
      .filter(([key, offset]) => actual[key] !== offset)
      .map(([key, offset]) => `${key}: pinned ${offset}, now ${actual[key]}`);
    expect(moved).toEqual([]);
  });

  it('still contains every pinned segment', () => {
    const missing = Object.keys(pinned).filter((key) => !(key in actual));
    expect(missing).toEqual([]);
  });

  // Offsets must tile the premium range of each topic with no gap and no overlap,
  // which is what makes an index unambiguous in the first place.
  it('tiles each topic contiguously, starting where the free core ends', () => {
    for (const topic of ALL_TOPICS) {
      const segments = premiumSegmentsFor(topic.key);
      for (let i = 1; i < segments.length; i++) {
        expect(segments[i].questionOffset).toBe(
          segments[i - 1].questionOffset + segments[i - 1].questions.length,
        );
      }
    }
  });
});
