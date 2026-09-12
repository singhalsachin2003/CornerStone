# Privacy Policy — Cornerstone

**Last updated: 12 September 2026**

Cornerstone is a study app for CFA® and FRM® candidates, published by Sachin Singhal.

## The short version

**Cornerstone has no account, no sign-in, no analytics, no crash reporting and no
advertising. Your study progress never leaves your device.**

Version 1.1 adds two things that do use the network, and only two: an optional
subscription, and over-the-air updates. Both are described in full below. If you never
subscribe, the only outbound request the app makes is a check for a content update.

## What the app stores on your device, and never sends anywhere

All of the following is written to your device's local application storage and never
leaves it:

| Data | Purpose |
| --- | --- |
| Chosen exam, level and Level III pathway | To show the right syllabus |
| Topic mastery percentages | To track progress |
| Review queue (question ids and due dates) | Spaced repetition scheduling |
| Bookmarked cards and questions | To let you find them again |
| Study day history | Streak counting |
| Question and accuracy counts | Profile statistics |
| Display name | Greeting on the home screen |
| App settings (reminder, timed quizzes, list style) | Preferences |
| Whether a subscription or promotional code is active | To unlock paid segments offline |

This data is removed when you uninstall the app or clear its storage from system settings.
Because nothing is transmitted, we cannot access, recover, export or delete it on your
behalf.

## Subscriptions

Cornerstone Plus is an optional subscription that opens the study segments added after the
subscription launched. Everything the app contained before that stays free permanently, and
anyone who had already installed the app keeps all of it permanently.

- **Payment is taken by Google Play.** We never see, receive or store your payment details.
  Billing, renewal and cancellation are handled entirely by Google under your Play account.
- **RevenueCat** (RevenueCat, Inc.) is used to check whether a subscription is active. When
  the app asks, it sends an anonymous identifier that RevenueCat itself generates for this
  installation, together with the purchase receipt Google issued and basic technical details
  such as the platform, app version and store country. **It is not linked to a name, an email
  address or a Google account**, and none of your study data is sent.
- **If you never open the subscription screen and never subscribe**, no purchase-related
  request is made at all.

**Promotional codes take no payment and involve no third party.** A code is checked against a
list inside the app and grants access for a fixed number of days. Nothing is transmitted when
you redeem one.

## Over-the-air updates

The app checks Expo's update service (Expo, operated by 650 Industries, Inc.) for a newer
version of its content and code. The request carries the app's version, update channel and
platform so that the right update is returned. No personal data and no study data is sent, and
nothing about you is stored by that service.

This is what lets a content correction or a retired promotional code reach you in minutes
rather than waiting for a store release.

## Permissions

- **Internet** — used for the two purposes above, and for nothing else. Study content is
  bundled with the app and works fully offline.
- **Notifications** — requested only if you switch on the daily study reminder in Profile. It
  schedules a notification locally on your device; nothing is sent to a server. Declining it,
  or revoking it later in system settings, leaves the rest of the app fully functional.
- **Billing** — declared so that Google Play can present the subscription purchase sheet.

## Third parties

Cornerstone contains no advertising SDKs, no analytics SDKs, no crash-reporting SDKs and no
social login. The only third parties that receive anything are Google Play (for payment),
RevenueCat (for entitlement checking) and Expo's update service (for updates), each strictly
as described above.

## Children

Cornerstone is intended for adult candidates pursuing professional finance certifications. It
is not directed at children.

## Trademarks and affiliation

Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed by
or sponsored by CFA Institute or the Global Association of Risk Professionals.

CFA®, Chartered Financial Analyst® and GIPS® are registered trademarks owned by CFA Institute.
FRM®, Financial Risk Manager® and GARP® are trademarks owned by the Global Association of Risk
Professionals.

## Contact

Questions about this policy: **singhalsachin2003@gmail.com**

---

### Play Console — Data Safety answers

These change with version 1.1. **The Data Safety form must be corrected before the
subscription products go live**, because publishing a Play product needs no new binary —
nothing else will ever force the form to be revisited.

| Question | Answer |
| --- | --- |
| Does your app collect or share any required user data types? | **Yes** |
| Data type collected | **Financial info → Purchase history** |
| Data type collected | **App info and performance → Other app performance data** — none; do not tick |
| Is it shared with third parties? | **No** — RevenueCat is a processor acting on our behalf, not a recipient sharing data onward |
| Is collection optional? | **Yes** — only if the user subscribes |
| Purpose | **App functionality** (unlocking purchased content) |
| Encrypted in transit? | **Yes** |
| Can users request deletion? | **Yes** — by email to the address above |

**Device or other IDs:** the identifier RevenueCat generates is created by the SDK for this
installation and is not an advertising ID, an Android ID or any device identifier. If the
Console's wording leaves this ambiguous at the time of filing, tick **Device or other IDs →
collected, not shared, app functionality** rather than leave it off; over-declaring is
survivable and under-declaring is not.

### Play Console — Sign-in details (formerly "App access")

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
