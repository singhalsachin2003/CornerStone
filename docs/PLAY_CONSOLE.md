# Play Console declarations — Cornerstone

Working notes, not published. Moved out of `PRIVACY.md` (which is a public page) on 2026-10-19
so the reviewer promo code is not shown on the website. Excluded in `docs/_config.yml`.

## Data Safety answers

These change with version 1.1. **The Data Safety form must be corrected before the
subscription products go live**, because publishing a Play product needs no new binary —
nothing else will ever force the form to be revisited.

| Question | Answer |
| --- | --- |
| Does your app collect or share any required user data types? | **Yes** |
| Data type collected | **Financial info → Purchase history** — optional, only if the user subscribes |
| Data type collected | **Personal info → Email address** — optional, only if the user creates an account |
| Data type collected | **Personal info → Name** — optional, only if the user sets a display name *and* has an account |
| Data type collected | **App activity → Other user-generated content** — the study progress that is backed up: mastery, review queue, bookmarks, study days, settings |
| Is any of it shared with third parties? | **No.** RevenueCat and Supabase are processors acting on our behalf, not recipients sharing data onward |
| Is collection optional? | **Yes**, all of it. The app is fully functional with no account and no subscription |
| Purpose | **App functionality** — unlocking purchased content, and restoring progress on a new device |
| Encrypted in transit? | **Yes** |
| Can users request deletion? | **Yes** — by email to the address above |

**Device or other IDs:** the identifier RevenueCat generates is created by the SDK for this
installation and is not an advertising ID, an Android ID or any device identifier. If the
Console's wording leaves this ambiguous at the time of filing, tick **Device or other IDs →
collected, not shared, app functionality** rather than leave it off; over-declaring is
survivable and under-declaring is not.

## Sign-in details (formerly "App access")

Answer **Yes, some functionality is restricted**, because a subscription tier now exists.
Leave username and password blank — there is no account — and put the promotional code route
in the free-text field (500 character limit):

```
No account is required. Some study segments are behind a subscription.
To reach them without paying: open the app, complete the short setup,
then go to Profile > Cornerstone Plus (or tap any locked segment),
enter the code PLAYREVIEW in the "Have a code?" field and tap Redeem.
This unlocks every paid segment for 90 days.
```

Tick **"provides full access to premium or paid content"**.

Keep that code and this declaration in step: `PLAYREVIEW` lives in
`src/content/promoCodes.ts` and a test fails the build if it is removed, but retiring it
through an update would silently break the next submission.
