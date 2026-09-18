# TODO — read before the next push

Real work that is **not blocking anything**. Nothing here stops a release; everything here
is worth doing before or alongside the next one.

**What belongs here:** a genuine defect or improvement that nobody is waiting on. **What does
not:** anything blocking (say so in the moment instead), and anything already decided against
— that goes in the doc where the decision lives, with the reasoning.

**Deliberately at the repo root, not in `docs/`.** GitHub Pages serves `docs/` from `main`, so
a file there becomes a public web page. `PRICING.md` was published by accident for a day that
way. Working notes stay out of `docs/` unless they are also excluded in `docs/_config.yml`.

Last reviewed: **18 September 2026**, production on versionCode 11.

---

## 1. Hermes memory regression — ships in production today

`npx expo-doctor` fails on it:

```
✖ Check for Expo SDK versions affected by Hermes V1 regressions
  expo@57.0.8, Hermes V1 250829098.0.14
  ≤ .15 are affected; .16 is the first with the fix.
```

**Why it matters more here than in most apps.** It is a _memory_ regression, and this app
ships a ~7 MB Hermes bundle: 152 cards, 190 questions, 139 paid segments, 417 cards, 834
questions and a 260-term glossary. Low-end Android is where it would surface, as OOM crashes
or ANRs — so **Play Console → Android vitals is where to look for evidence**, not a local run.

It is a **patch bump inside SDK 57**, not a migration — currently 57.0.8 against ~57.0.24.

```bash
npx expo install expo@^57.0.9 --fix
npm ci                    # a dependency change needs a clean tree before EAS
npm run verify
npx expo-doctor           # the Hermes check must now pass
```

Then build and **verify the artifact rather than the upgrade**: `npm run check:aab` on the new
AAB, and confirm the Hermes version actually moved:

```bash
unzip -p store/cornerstone-versionCodeNN.aab base/assets/index.android.bundle | head -c 64 | xxd | head -2
```

**This also moves the OTA fingerprint**, which is fine and expected for a native change.

## 2. `beta` and `alpha` are stranded on versionCode 5

Both tracks still serve **v1.0** — no subscription, no glossary, no account, and the privacy
copy that was corrected in `53792fa`. Anyone opted into them is running a build from before
any of this existed, and they still carry Expo's `"First release of this awesome app."`

Either promote versionCode 11 to both, or close the tracks if nobody uses them. Harmless
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

## 5. `README.md` dismisses `expo-doctor` on out-of-date grounds

It says the output is _"8 packages a patch behind. Not a security finding; batch it with the
next functional change."_ That was fair when written. It is now **14 packages and a named
Hermes regression** (item 1), so the note argues for ignoring something that should not be
ignored. Fix the note when item 1 lands.

---

## Watching, not tasks

**No real purchase has ever been made.** Every part of the billing chain is verified
structurally — products ACTIVE in 173 regions, one offering current with both packages,
credentials valid, `Manage orders and subscriptions` granted — but Play Billing refuses on
emulators and sideloaded builds, so the `offer` state with real prices has never rendered for
anyone. The first real transaction is the test. Watch **Android vitals** and RevenueCat.

To try it: install from the internal-testing link on a device, **uninstalling any existing
Cornerstone first** — otherwise grandfathering marks it a pre-existing install and hides the
paywall entirely, which looks exactly like a bug.

## Decided, not pending

Recorded here only so they are not re-opened by accident. The reasoning lives in the linked
docs.

- **iOS: no, for now** — see `README.md`. A decision to revisit, with its cost stated.
- **Regions: two bands across 173 markets** — see `docs/PRICING.md`. India-only was tried and
  reversed the same hour, because guard 2 turns gating off wherever nothing can be bought,
  which would have given the entire paid catalogue away outside India.
- **No lifetime tier, and promo codes grant time rather than discount** — Play cannot express
  a discount code for a subscription.
