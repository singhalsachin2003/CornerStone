import { PremiumSegmentBank } from '../types';

import { CFA_L1_SEGMENTS } from './cfaL1';
import { CFA_L2_SEGMENTS } from './cfaL2';
import { CFA_L3_SEGMENTS } from './cfaL3';
import { FRM_P1_SEGMENTS } from './frmP1';
import { FRM_P2_SEGMENTS } from './frmP2';

/**
 * Premium segments, keyed by topic area.
 *
 * Nothing in here existed before the paywall. That is the whole rule: the free
 * core segment of every topic is derived from the banks that shipped in
 * versionCode 5, and everything added since lives here. Moving an entry out of
 * this file is the only way to make paid content free again, and there is no way
 * at all to make already-shipped content paid.
 */
export const PREMIUM_SEGMENTS: PremiumSegmentBank = {
  ...CFA_L1_SEGMENTS,
  ...CFA_L2_SEGMENTS,
  ...CFA_L3_SEGMENTS,
  ...FRM_P1_SEGMENTS,
  ...FRM_P2_SEGMENTS,
};
