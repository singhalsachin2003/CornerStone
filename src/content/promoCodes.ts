/**
 * Promotional codes, and the single hard fact that shapes all of them: **every
 * code in this table is public.**
 *
 * The table compiles into the JavaScript bundle, and `strings` on the extracted
 * bundle will list it. That is not a flaw to be fixed — there is nowhere else to
 * put it in an offline-first app with no backend — but it does dictate the design:
 *
 * - **Every grant is time-limited.** Expiry is the only thing that bounds what a
 *   leaked code costs. A permanent grant cannot be expressed here at all.
 * - **`redeemableUntil` retires a campaign on its own**, which matters because an
 *   offline device may be weeks behind the latest bundle.
 * - **Retiring a code is an OTA**, minutes rather than a store build. What an OTA
 *   cannot do is take back a grant already made — the other reason nothing here
 *   is permanent.
 *
 * Play's own promotional codes are not an alternative: they grant free *trials*
 * of a subscription, are redeemable only inside Google's payment sheet, and have
 * no API an app can call. What this table does instead is give the content away
 * for a fixed window with no payment involved at all, which is why it sits
 * outside Play's billing policy rather than against it.
 */

export interface PromoCode {
  /** Compared case-insensitively, after trimming. Stored upper-case. */
  code: string;
  /**
   * What the code is for. Analytics carries the campaign and never the code — a
   * telemetry sink holding live codes is a published list of ways to get the paid
   * segments for nothing.
   */
  campaign: string;
  /** Days of premium access granted. Capped at 365 by the redeem module. */
  days: number;
  /** ISO date after which the code stops working, whatever else is true. */
  redeemableUntil: string;
  /** Shown on redemption, so the candidate knows what they were given. */
  label: string;
}

export const PROMO_CODES: PromoCode[] = [
  {
    // What the Play Console's "Sign-in details" declaration hands the reviewer.
    // Once anything sits behind a paywall, Play requires a way through it, and a
    // promo code is what this app has instead of a demo account. Retiring this
    // code silently breaks the next submission — keep it and the declaration in
    // step.
    code: 'PLAYREVIEW',
    campaign: 'play-review',
    days: 90,
    redeemableUntil: '2028-12-31',
    label: 'Reviewer access',
  },
  {
    // For the people who installed, studied, and wrote in before any of this
    // existed. Grandfathering covers installs; this covers the ones who came back.
    code: 'CORNERSTONE30',
    campaign: 'launch-2026',
    days: 30,
    redeemableUntil: '2027-06-30',
    label: '30 days of full access',
  },
  {
    code: 'CFACLASS',
    campaign: 'study-group-2026',
    days: 60,
    redeemableUntil: '2027-06-30',
    label: '60 days of full access',
  },
];
