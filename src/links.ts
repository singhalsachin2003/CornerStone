/**
 * Every address this app hands to the outside world.
 *
 * The Play listing id is also in `app.json` as `android.playStoreUrl`, which is
 * what `expo-store-review` reads when it works out whether it can offer a review
 * flow at all; a test pins the two together.
 */

/** This app's Play listing. */
export const PLAY_LISTING_URL =
  'https://play.google.com/store/apps/details?id=io.cornerstone.study';

/**
 * The other app on the same developer account, offered from Profile.
 *
 * OTC Learn teaches over-the-counter derivatives — swaps, options, CDS — which
 * is a syllabus topic here rather than a different subject, so its readers and
 * this app's are close to the same people.
 */
export const OTC_LEARN_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.otclearn.app';
