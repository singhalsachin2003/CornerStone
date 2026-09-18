# TODO — read before the next push

Real work that is **not blocking anything**. Nothing here stops a release; everything here
is worth doing before or alongside the next one.

**What belongs here:** a genuine defect or improvement that nobody is waiting on. **What does
not:** anything blocking (say so in the moment instead), and anything already decided against
— that goes in the doc where the decision lives, with the reasoning.

**Deliberately at the repo root, not in `docs/`.** GitHub Pages serves `docs/` from `main`, so
a file there becomes a public web page. `PRICING.md` was published by accident for a day that
way. Working notes stay out of `docs/` unless they are also excluded in `docs/_config.yml`.

Last reviewed: **18 September 2026** · production **versionCode 12** · 5 open, **1 of them
does not belong here** (item 0 — a live Play policy exposure, filed at the top so it is not
lost, but it breaks this file's own "nothing blocking" rule and should be treated as urgent).

---

## 0. NOT NON-BLOCKING — no in-app account deletion, and the app is live

**This breaks the inclusion rule at the top of this file and is recorded here anyway so it is
not lost. Treat it as urgent, not as backlog.**

Both Cornerstone and OTC Learn let users create accounts and neither offers an in-app way to
delete one. `app/account.tsx` has Sign in, Create account and Sign out — verified 18 Sept
2026 — and deletion is handed to an email address on
[the delete-account page](https://singhalsachin2003.github.io/CornerStone/DELETE-ACCOUNT.html)
published the same day.

**Play requires both halves.** Developers must provide an in-app path to delete the account
and its data, **and** a web link resource — the web page is explicitly not a substitute.
Exposure is update rejection or listing removal, and it lands on both apps at once.
([Play policy](https://support.google.com/googleplay/android-developer/answer/13327111))

Worse, the Data Safety declaration filed on 18 September answers **Yes** to "can users
request deletion", describing the route that does not satisfy the requirement.

**The fix is small because the schema already supports it.** RLS is per-user on every table,
so a Supabase RPC that deletes the caller's rows and their auth record is a short function; the
UI is a Delete account row behind a typed confirmation. **Keep the web page** — it is the other
half of the requirement, not a thing to replace.

**Timing matters:** a policy strike on a listing that has just started being promoted is the
worst possible moment, so do this before driving install traffic.

## 1. Three React Compiler lint findings, demoted to warnings

The SDK 57.0.24 upgrade brought newer `eslint-config-expo` with React Compiler rules, which
found three things and failed the build. **They are demoted to warnings in
`eslint.config.js`, not dismissed** — the reasoning is in the comment there. Demoting avoided
coupling a security patch to refactoring working, shipped code; the findings are real and
each should be dealt with on its own.

In the order worth fixing:

- **`react-hooks/set-state-in-effect` — `app/results.tsx:34`.** Commits mastery and the
  review queue from an effect, guarded by `committed.current` so it runs exactly once. The
  guard is correct and the code has shipped since v1.0; the _shape_ is what the rule objects
  to. Most worth restructuring of the three, because a commit-once effect is exactly where a
  cascading render would be expensive.
- **`react-hooks/purity` — `src/access/useAccess.ts:56`.** Passes `now: Date.now()` into the
  access rules inside a `useMemo`. Deliberate — `now` is injected precisely so the rules stay
  pure and testable. Real consequence: a promo grant expiring mid-session does not flip until
  something re-renders. That is acceptable, and arguably kinder than content vanishing while
  someone is studying.
- **`react-hooks/refs` — `src/components/primitives.tsx:157,167,168`.** Calls
  `anim.interpolate()` during render on an `Animated.Value` held in a ref. **This is how
  React Native's own documentation uses Animated**; the rule models the React Compiler, which
  does not know about it. Lowest priority, and possibly nothing to do.

Promote each back to `'error'` as its call sites are dealt with.

## 2. `beta` and `alpha` are stranded on versionCode 5

Both tracks still serve **v1.0** — no subscription, no glossary, no account, and the privacy
copy that was corrected in `53792fa`. Anyone opted into them is running a build from before
any of this existed, and they still carry Expo's `"First release of this awesome app."`

Either promote **versionCode 12** to both, or close the tracks if nobody uses them. Harmless
today only because nobody is known to be on them — which is itself worth confirming rather
than assuming.

## 3. The RevenueCat offering is named `Monthly` but holds both plans

Cosmetic — the app reads `offerings.current`, never the name — but it is **the exact
misreading that caused a real bug on 18 September**, when the setup came out as two offerings
named `Monthly` and `Annual` with one package each, leaving the yearly plan unbuyable. The
name now actively misleads the next person to look at it.

Renaming an offering identifier affects reporting continuity, so it is not free. Worth doing
while there are no subscribers, and much less attractive later.

Verify after any change with the endpoint the SDK itself calls:

```bash
curl -s -H "Authorization: Bearer goog_yDKSHtpPjEDkWdJxdjrnFZJjDyv" -H "X-Platform: android" \
  "https://api.revenuecat.com/v1/subscribers/anything-unique/offerings" | python3 -m json.tool
```

Correct is **one** entry whose `identifier` equals `current_offering_id`, holding both
`$rc_monthly` and `$rc_annual`.

## 4. `check:play` gives a stale next action

It still prints _"Check they are in a RevenueCat offering on `premium`"_ now that the offering
exists and is correct. The script reads the Android Publisher API and has no view of
RevenueCat, so it cannot know — but printing a step that is already done trains people to
ignore the line, which is worse than printing nothing.

Either drop the line once products exist, or have it say plainly that it cannot see
RevenueCat and name the curl above.

## 5. Cross-repo findings — raised against OTC Learn, NOT verified from this repo

From a review on 18 September 2026 covering both apps. **OTC Learn is not checked out on this
machine, so nothing below was verified here** — the Cornerstone half of each claim was, and is
noted. Verify against OTC Learn before acting.

- **`mergeNotes` is last-write-wins and silently drops one side.** A note is the only thing
  the user authors, and the only merge in that file that loses something unrecoverable —
  every other rule is safe by construction (counters take the max, sets union). Write offline
  on two phones, sync, and one version is gone with no record it existed. Suggested fix:
  when both sides changed since the last watermark, concatenate under a separator rather than
  dropping the loser. **Cornerstone is not affected — it has no notes**; `src/sync/` merges
  mastery, review queue, bookmarks, study days and settings only. Confirmed by grep.
- **OTC Learn has no runtime clamp on promo grant days.** Its test asserts `days <= 365` on
  the table, which catches a typo in CI — but the promo table ships by `eas update`, and an
  OTA push does not pass CI. A `days: 600` typo pushed over the air cannot be taken back once
  a device has made the grant. **Cornerstone already clamps at runtime**: `MAX_GRANT_DAYS =
365` and `Math.min(code.days, MAX_GRANT_DAYS)` in `src/access/promoCode.ts:17,73` —
  verified. The fix in OTC Learn is the same one `Math.min`.
- **~1,000 lines of identical domain logic exist in both repos and have already diverged.**
  `EASE = 2.3`, `MAX_INTERVAL = 120`, intervals `[1, 4, 10]`, `LEARNING_RATE = 0.35` are
  written out twice under different filenames. Cornerstone's `redeem` clamps the grant and
  refuses when no premium content exists; OTC Learn's `redeemPromoCode` does neither, and the
  outcome vocabularies differ (`campaign-ended` vs `expired`). **Recommendation was explicitly
  not to extract a shared package as a project in itself** — instead, the next time review
  scheduling or the access rules are touched, do it in a shared workspace package rather than
  twice.

---

## Watching, not tasks

**No real purchase has ever been made.** Every part of the billing chain is verified
structurally — products ACTIVE in 173 regions, one offering current with both packages,
credentials valid, `Manage orders and subscriptions` granted — but Play Billing refuses on
emulators and sideloaded builds, so the `offer` state with real prices has never rendered for
anyone. **The first real transaction is the test.**

To try it: install from the internal-testing link on a device, **uninstalling any existing
Cornerstone first** — otherwise grandfathering marks it a pre-existing install and hides the
paywall entirely, which looks exactly like a bug.

**Android vitals, read 18 September 2026: zero crashes and zero ANRs**, over 21 Aug – 18 Sept,
with the default "user-perceived" filter cleared so background crashes were included too.

**Do not read that as a clean bill of health.** Roughly 16 installs, and almost the whole
window is versionCode 5 — versionCode 10 through 12 have been live for hours, not weeks. A
memory regression needs sustained use on constrained devices to surface, so this window could
not have caught one. The useful comparison is crash and ANR rates over the coming weeks as
installs accumulate, against today's zero as the baseline.

At this install count Play may never show a meaningful crash _rate_ at all — the percentile
thresholds need volume. For now **any issue appearing is the signal**, not the rate.

---

## Recently closed

- **Hermes V1 memory regression** — shipped in versionCode 10 and 11, fixed in **12**
  (`expo` 57.0.24 / `react-native` 0.86.3, Hermes `250829098.0.17`). The technique that
  actually proved it — reading `libhermesvm.so` out of the AAB rather than trusting
  `expo-doctor` or the upgrade command — is written up in `docs/RELEASE_CHECKLIST.md`.
- **CI red for five days** while `npm run verify` passed locally: CI pinned Node 20 and
  `@supabase/realtime-js` needs the global `WebSocket` that arrives in 22.
- **`main` reddened twice by an unused variable** committed after running only `prettier` and
  `tsc`. Now structurally prevented: `.githooks/pre-commit` runs the full `npm run verify`
  (~11s), wired up by a `prepare` script so a fresh clone is covered.
- **Two Supabase test accounts** deleted; the project holds zero accounts.

## Decided, not pending

Recorded here only so they are not re-opened by accident. The reasoning lives in the linked
docs.

- **iOS: no, for now** — see `README.md`. A decision to revisit, with its cost stated.
- **Regions: two bands across 173 markets** — see `docs/PRICING.md`. India-only was tried and
  reversed the same hour, because guard 2 turns gating off wherever nothing can be bought,
  which would have given the entire paid catalogue away outside India.
- **No lifetime tier, and promo codes grant time rather than discount** — Play cannot express
  a discount code for a subscription.
