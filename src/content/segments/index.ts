import { PremiumSegmentBank } from '../types';

import { CFA_L1_SEGMENTS } from './cfaL1';
import { CFA_L2_SEGMENTS } from './cfaL2';
import { CFA_L3_SEGMENTS } from './cfaL3';
import { FRM_P1_SEGMENTS } from './frmP1';
import { FRM_P2_SEGMENTS } from './frmP2';

import { CFA_L1_SEGMENTS_II } from './cfaL1b';
import { CFA_L2_SEGMENTS_II } from './cfaL2b';
import { CFA_L3_SEGMENTS_II } from './cfaL3b';
import { FRM_P1_SEGMENTS_II } from './frmP1b';
import { FRM_P2_SEGMENTS_II } from './frmP2b';

import { TRANCHE_III_SEGMENTS } from './tranche3';

/**
 * Merge banks by **concatenating** each topic's segments, not by replacing them.
 *
 * A spread — `{ ...a, ...b }` — would silently drop every segment in `a` for any
 * topic `b` also mentions, which is exactly what a second tranche does to the
 * first.
 */
function mergeBanks(...banks: PremiumSegmentBank[]): PremiumSegmentBank {
  const out: PremiumSegmentBank = {};
  for (const bank of banks) {
    for (const [topicKey, segments] of Object.entries(bank)) {
      out[topicKey] = [...(out[topicKey] ?? []), ...segments];
    }
  }
  return out;
}

/**
 * Premium segments, keyed by topic area.
 *
 * Nothing in here existed before the paywall. That is the whole rule: the free
 * core segment of every topic is derived from the banks that shipped in
 * versionCode 5, and everything added since lives here. Moving an entry out of
 * this file is the only way to make paid content free again, and there is no way
 * at all to make already-shipped content paid.
 *
 * **The order of this list is load-bearing — append, never insert.** A segment's
 * `questionOffset` into the topic's canonical bank is derived from its position,
 * and the review queue stores those offsets as `topicKey#index`. Putting a new
 * tranche anywhere but the end shifts every later segment's indices and silently
 * repoints every queued review at a different question. `__tests__/segmentOffsets`
 * pins the existing offsets so that cannot happen quietly.
 */
export const PREMIUM_SEGMENTS: PremiumSegmentBank = mergeBanks(
  // Tranche I — two segments per topic area.
  CFA_L1_SEGMENTS,
  CFA_L2_SEGMENTS,
  CFA_L3_SEGMENTS,
  FRM_P1_SEGMENTS,
  FRM_P2_SEGMENTS,
  // Tranche II — appended after everything above, per the note.
  CFA_L1_SEGMENTS_II,
  CFA_L2_SEGMENTS_II,
  CFA_L3_SEGMENTS_II,
  FRM_P1_SEGMENTS_II,
  FRM_P2_SEGMENTS_II,
  // Tranche III — a fourth segment, allocated by exam weight rather than evenly.
  TRANCHE_III_SEGMENTS,
);
