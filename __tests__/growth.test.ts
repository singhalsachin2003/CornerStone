import appConfig from '../app.json';

// Neither module needs a device, but both import from `react-native` at the top
// level, which this node-environment suite cannot load. The mocks stand in for
// the two things that are actually reached: the platform check and the sheet.
jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  Share: { share: jest.fn() },
  Linking: { openURL: jest.fn() },
}));
jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  hasAction: jest.fn(),
  requestReview: jest.fn(),
}));

import { PLAY_LISTING_URL } from '@/links';
import { resultShareMessage } from '@/share';
import {
  REVIEW_PROMPT_INTERVAL_DAYS,
  sessionDeservesPrompt,
  shouldAskForReview,
} from '@/storeReview';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-09-06T10:00:00Z');

describe('when a session has earned a review prompt', () => {
  it('asks after five out of five and four out of five', () => {
    expect(sessionDeservesPrompt(5, 5)).toBe(true);
    expect(sessionDeservesPrompt(4, 5)).toBe(true);
  });

  // Never after a session that went badly — the whole point of choosing the
  // moment is that the reader is well disposed when the sheet appears.
  it('says nothing after three out of five', () => {
    expect(sessionDeservesPrompt(3, 5)).toBe(false);
  });

  // A two-question run is not an achievement, however it went.
  it('ignores a session too short to mean anything', () => {
    expect(sessionDeservesPrompt(2, 2)).toBe(false);
  });
});

describe('how often it may ask', () => {
  it('asks the first time', () => {
    expect(shouldAskForReview(true, null, NOW)).toBe(true);
  });

  it('does not ask again inside the interval', () => {
    const recent = NOW - (REVIEW_PROMPT_INTERVAL_DAYS - 1) * DAY_MS;
    expect(shouldAskForReview(true, recent, NOW)).toBe(false);
  });

  it('asks again once the interval has passed', () => {
    const old = NOW - REVIEW_PROMPT_INTERVAL_DAYS * DAY_MS;
    expect(shouldAskForReview(true, old, NOW)).toBe(true);
  });

  // A clock corrected backwards leaves a stamp in its own future, which would
  // otherwise lock the prompt out for months.
  it('asks when the stamp is in the future', () => {
    expect(shouldAskForReview(true, NOW + 30 * DAY_MS, NOW)).toBe(true);
  });
});

describe('what a shared result says', () => {
  it('carries the score, the topic and a link that works', () => {
    const message = resultShareMessage('Quantitative Methods', 4, 5);
    expect(message).toContain('4/5');
    expect(message).toContain('Quantitative Methods');
    expect(message).toContain(PLAY_LISTING_URL);
  });
});

/**
 * The listing URL exists twice: in `links.ts` for anything shared, and in
 * `app.json` as `android.playStoreUrl`, which is what `expo-store-review` reads
 * when deciding whether it can offer a review flow at all. Nothing in the build
 * makes them agree.
 */
it('shares the same listing the review flow is pointed at', () => {
  expect(appConfig.expo.android.playStoreUrl).toBe(PLAY_LISTING_URL);
  expect(PLAY_LISTING_URL).toContain(appConfig.expo.android.package);
});
