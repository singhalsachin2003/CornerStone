# TODO — read before the next push

Real work that is **not blocking anything**. Nothing here stops a release; everything here
is worth doing before or alongside the next one.

**What belongs here:** a genuine defect or improvement that nobody is waiting on. **What does
not:** anything blocking (say so in the moment instead), and anything already decided against
— that goes in the doc where the decision lives, with the reasoning.

**Deliberately at the repo root, not in `docs/`.** GitHub Pages serves `docs/` from `main`, so
a file there becomes a public web page. `PRICING.md` was published by accident for a day that
way. Working notes stay out of `docs/` unless they are also excluded in `docs/_config.yml`.

Last reviewed: **11 October 2026** · production **versionCode 13** (1.2.0), plus the OTA
published 9 October carrying reset-progress and the corrected FRM date · 6 open, none
blocking. Item 0 — the in-app account deletion Play requires — is closed and moved to
**Recently closed**; with it gone this file keeps its own "nothing blocking" rule again.

---

## 1. Three React Compiler lint findings, demoted to warnings

The SDK 57.0.24 upgrade brought newer `eslint-config-expo` with React Compiler rules, which
found three things and failed the build. **They are demoted to warnings in
`eslint.config.js`, not dismissed** — the reasoning is in the comment there. Demoting avoided
coupling a security patch to refactoring working, shipped code; the findings are real and
each should be dealt with on its own.

**Looked at again on 11 October and deliberately left alone.** The honest blocker is that
nothing can verify the change: `jest.config.js` is `ts-jest` on `testEnvironment: node`, the
suite is 219 pure domain tests, and **no test renders a component**. Restructuring the
commit-once effect in `app/results.tsx` means editing the path that writes every user's
mastery and review queue with no test that would notice a regression.

Adding `@testing-library/react-native` is not a free prerequisite either: dependency changes
feed the Expo fingerprint, and the OTA channel to versionCode 13 was only just restored in
`2105a3b` after one npm script severed it. Do this alongside the next store release, where a
new binary resets the runtime anyway and a device test is already planned — not before.

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

## 2. The testing tracks still serve versionCode 5, and open testing is *active*

Re-checked in the Console on **27 September 2026**. Nothing has moved since 18 September, and
one detail reads worse than it did then.

| Track | Serving | Status | Since |
| --- | --- | --- | --- |
| Production | **13** (1.2.0) | full roll-out, 177/177 | 25 Sept 2026 |
| Internal testing | 13 (1.2.0) | full roll-out | 25 Sept 2026 |
| Open testing | **5** (1.0.0) | **Active — available to unlimited testers**, 177 countries | 4 Sept 2026 |
| Closed testing · Alpha | **5** (1.0.0) | full roll-out | 11 Aug 2026 |

**Open testing is not dormant.** It is active and joinable by anyone holding the opt-in link,
and it serves v1.0 — no subscription, no glossary, no account, **no in-app account deletion**,
and the privacy copy corrected in `53792fa`, under Expo's `"First release of this awesome
app."` release note. Item 0 of this file is closed *in production*; a device that joins open
testing today still installs a build that does not satisfy the deletion requirement.

The fix is two clicks on the Open testing page: **Promote release** → versionCode 13, or
**Pause track**. Promoting is the better of the two — a testing track one version behind
production is useful, three versions behind is a liability. Closed testing · Alpha wants the
same.

**OTC Learn shows what the fix looks like, and needs half of it.** Its open testing track is
already **paused** (last release 4 / 1.1.0, superseded), so nothing serves from it; its
`Closed testing · Alpha` is still on **3 (1.0.0)** from 30 July and has had no attention.

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

## 4. OTC Learn's runtime policy is `appVersion`, which fails in the dangerous direction

Not the same trap Cornerstone had, and worth stating plainly because the obvious reading is
wrong. `otc-learning-app/app.json` sets `runtimeVersion.policy: "appVersion"`, so its runtime
is the literal string **`1.3.0`** — its production binary (versionCode 10) reports exactly
that. Adding an npm script there severs nothing, and **its `sync:listing` script is harmless
and was deliberately left in place**.

The exposure is the mirror image. Under `appVersion`, every 1.3.0 binary accepts every 1.3.0
update regardless of what changed natively. OTC Learn ships `react-native-purchases`,
`expo-notifications` and `expo-updates`, and **one OTA has already been published** to that
branch. So adding a native module without bumping `version` in `app.json` would push JS onto
binaries that cannot run it — a launch crash for every install, with no store rollback.
Cornerstone's `app.config.js` carries the comment explaining exactly this, which is why it
uses `fingerprint`.

Switching OTC Learn to `fingerprint` is the fix, and it is **not** free: it changes the
runtime, so the 1.3.0 binaries already out there stop receiving updates until a store release
replaces them. That is a release-planning decision, not a code change — do it as part of the
next OTC Learn release, never on its own.

## 4a. `?c=web` is not in the `/get/` allowlist, so the FRM pages attribute nothing

`docs/get/index.html` routes `?c=<channel>` to a Play custom store listing from the allowlist
`ig, x, yt, wa, mail`. The generated FRM pages all link through `/get/` with no channel, so
every install that starts on the website lands on the default listing and is indistinguishable
from direct traffic.

`install()` originally passed `'web'`, which is not in the allowlist and was silently dropped;
the dead argument was removed in `df68856` rather than guessed at, because **adding a channel
means creating a custom store listing in the Console** and the Play API cannot read or write
them (`docs/STORE_LISTING.md`). Decide whether a `web` listing should exist; if it should,
add it in the Console first, then to the allowlist and to `install()` together.

Worth confirming while in there that `ig, x, yt, wa, mail` each correspond to a listing that
actually exists. An unknown `listing=` value falls back to the default rather than erroring,
so five broken channels would look exactly like five working ones.

## 5. Cross-repo duplication — ~1,000 lines of identical domain logic

`EASE = 2.3`, `MAX_INTERVAL = 120`, intervals `[1, 4, 10]` and `LEARNING_RATE = 0.35` are
written out twice, in both repos, under different filenames — and they have already diverged:
Cornerstone's `redeem` refuses when no premium content exists and OTC Learn's `redeemPromoCode`
does not, and the two outcome vocabularies differ (`campaign-ended` vs `expired`).

**Extracting a shared package is explicitly not the recommendation** — high blast radius, no
user-visible benefit. Instead, the next time review scheduling or the access rules are touched,
do that change in a shared workspace package rather than twice.

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

- **`check:play` printed a step that was already done** — *"Check they are in a RevenueCat
  offering on `premium`"*, every run, long after the offering was correct. It now says plainly
  that it reads the Android Publisher API, cannot see RevenueCat, and names the exact curl that
  can — with the key taken from `eas env:list` rather than written into the repo. A check that
  prints a stale instruction teaches people to skip the line, which costs more than silence.

- **No in-app account deletion, with the app live** — item 0 of this file, and the only live
  Play policy exposure it ever carried. Shipped in `0019c90`: a **Delete account** row in
  `app/account.tsx` behind a typed confirmation, calling a `delete_account` Supabase RPC that
  removes the caller's `auth.users` row and cascades every table through the existing foreign
  keys. The function went to the live project on 23 September (`a6531dd`, verified in
  `0088cf4`) and the UI reached production in **1.2.0 / versionCode 13** on 25 September. The
  [delete-account page](https://singhalsachin2003.github.io/CornerStone/DELETE-ACCOUNT.html)
  stays — Play wants both halves, and the web link is the other one.

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
- **The other two cross-repo findings**, both raised against OTC Learn on 18 September and
  both **verified fixed in `otc-learning-app` on `main`, 27 September 2026**. `mergeNotes` no
  longer drops a side: `src/utils/sync.ts:312` defines `NOTE_CONFLICT_MARKER` and line 414
  concatenates both versions under it. The promo grant is clamped at redemption, not only in
  the table test: `src/utils/promoCode.ts:83,151`, `Math.min(match.days, MAX_GRANT_DAYS)` with
  `MAX_GRANT_DAYS = 365` — which matters because the promo table ships by `eas update` and an
  OTA push does not pass CI. Cornerstone was never affected by either.

## Decided, not pending

Recorded here only so they are not re-opened by accident. The reasoning lives in the linked
docs.

- **iOS: no, for now** — see `README.md`. A decision to revisit, with its cost stated.
- **Regions: two bands across 173 markets** — see `docs/PRICING.md`. India-only was tried and
  reversed the same hour, because guard 2 turns gating off wherever nothing can be bought,
  which would have given the entire paid catalogue away outside India.
- **No lifetime tier, and promo codes grant time rather than discount** — Play cannot express
  a discount code for a subscription.
