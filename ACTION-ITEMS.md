# Action items — OTC Learn & Cornerstone

Handoff for Claude Code. Written 18 September 2026, after a marketing review, a
code review and a UX review of both apps. Twelve findings are already fixed and
committed; what follows is everything still outstanding, in the order it should
be done.

> **Updated 22 September 2026.** Dark mode is done in **both** apps, along with
> the store screenshots, the marketing housekeeping and the crawler-facing half
> of the SEO bullet in both repos — plus a rules-of-hooks error that was
> reddening `npm run lint` on Cornerstone's branch. Each is marked below.
>
> Both branches are pushed with a PR open, and `npm run verify` is green in both
> (Cornerstone 16 suites / 217 tests, OTC Learn 72 / 1,146).
>
> What is left is item 1, item 4, item 5 and the verification halves of the
> Search Console bullet — all of which need the Play Console, a Supabase
> credential, or an account only you can sign into. The contrast findings in
> section 8 were taken rather than filed.

Two repos are involved:

| App | Repo | Package | Branch to work on |
| --- | --- | --- | --- |
| OTC Learn | `~/otc-learning-app` | `com.otclearn.app` | `feat/ux-and-compliance` |
| Cornerstone | `~/CornerStone` | `io.cornerstone.study` | `feat/ux-and-compliance` |

`main` is untouched in both. Both branches are pushed and carry an open PR as of
22 September 2026.

---

## 0. Read before touching anything

**Check out the right branch first.** Everything below builds on work already
committed there. Do not start from `main`.

```bash
cd ~/otc-learning-app && git checkout feat/ux-and-compliance
cd ~/CornerStone      && git checkout feat/ux-and-compliance
```

**What is already committed on those branches** — do not redo any of it:

- `34c4a9e` (OTC) in-app account deletion, human error messages, promo grant
  clamped at redemption, notes sync keeping both sides of a conflict
- `1a07d28` (OTC) reduce-motion on the lesson card, rings and toggle
- `be19a6e` (CS) in-app account deletion, topic search, "worth an hour next" on
  Home, Guest greeting removed, reduce-motion, offline error copy

**Verify gates.** Both are green. OTC Learn is 72 suites / 1,146 tests, up from
71 / 1,142 — four new tests for the theme preference.
Cornerstone: the full `npm run verify` now passes (16 suites, 217 tests) — it
could not be run in the previous session for environment reasons, and when it
finally ran it surfaced one real error: a `useMemo` on Home declared *after* an
early return, so a render that bailed out ran one fewer hook. Fixed in `62923fb`.

**Do not** start the shared-package refactor that extracts review scheduling,
mastery, shuffle, promo and access into a workspace shared by both apps. It was
considered and deliberately deferred — high blast radius, no user-visible
benefit. Leave the duplication alone until you are next in that code anyway.

---

## 1. Deploy the `delete_account` SQL — blocking, still open

**Needs you.** There is no `.env` in either repo, the Supabase CLI is not
installed, and the function has to be applied with a credential that cannot live
in the tree. Nothing here can be done from a session.

**Why it is first:** the Delete account button now exists in both apps and calls
`rpc('delete_account')`. That function is written into each repo's
`supabase/schema.sql` but **has not been applied to either live project**. Until
it is, the button fails with a Postgres error for every user. Shipping the UI
without the function is worse than not shipping the UI.

Files: `~/otc-learning-app/supabase/schema.sql` and
`~/CornerStone/supabase/schema.sql` — the function is appended at the end of
each, under an `-- Account deletion` heading.

Apply the tail of each file to the matching Supabase project (SQL editor, or
`supabase db push` if the CLI is linked). The block is idempotent — `create or
replace` plus `revoke`/`grant` — so running it twice is safe.

**Acceptance:**

- `select proname, prosecdef from pg_proc where proname = 'delete_account';`
  returns one row with `prosecdef = true` in both projects.
- Signed in as a throwaway account in a debug build, Profile → Account → Delete
  account → confirm removes the row from `auth.users` and returns the app to the
  signed-out state with local progress intact.
- Signed out, calling the RPC is refused.

---

## 2. Dark mode — DONE in both

Neither app had it. Both hard-set `"userInterfaceStyle": "light"` in `app.json`
and neither reads `useColorScheme`. This matters more than it would for most
apps because the whole pitch is studying on a commute and in the evening, and a
full-screen `#EAE8E0` / `#f7f4ee` at 11pm is the most common one-star complaint
category for study apps.

**Agreed behaviour:** a three-way setting — System / Light / Dark — defaulting
to System, in Profile → Appearance.

Do the two apps as **two separate commits**. OTC Learn is the easier of the two
and is the better one to do first, because its type scale is already colour-free.

### 2a. OTC Learn — DONE (`c1131b4`)

Shipped as planned, with the same two deviations Cornerstone needed and one of
its own:

1. **`colors.dark` does not invert; `primaryFill` does.** `dark` fills the
   resume card and the profile avatar as well as the primary button, and
   `text.onDark` sits on the success, error and category fills too — so a single
   inverting token would have needed white text in one place and near-black in
   another. A new `primaryFill` / `text.onPrimary` pair carries the "on" states
   (primary button, selected chip, earned badge), which on a dark ground are
   pale; `dark` stays a raised warm fill for the cards.
2. **`masteryFill` now requires the bands** rather than defaulting to the light
   ones — the contrast walk caught it drawing light-palette bands on a dark
   screen.
3. **`useThemedStyles` caches per factory, not per component.** Fifty style
   sheets × every mounted row is a lot of `StyleSheet.create`; keyed on the
   factory, each is built at most twice for the life of the process.

`npm run check:contrast` walks seventeen screens in both themes and is green.
It needs a web export (`npx expo export --platform web --output-dir .expo-web`)
and is deliberately outside `npm run verify`.

The original plan, for reference:

Scope: 56 files reference `colors.`, all through `StyleSheet.create` at module
scope. `src/theme/typography.ts` contains **no** colour references, which is the
thing that makes this tractable — only colour needs threading.

1. `src/theme/colors.ts` — keep the existing object as the light palette and add
   a dark one with exactly the same shape. Export a `ColorTokens` type derived
   from the light palette so the dark one cannot drift. Keep the existing
   accessibility reasoning in that file intact: the comments explaining why
   `text.tertiary` was darkened for WCAG AA, and why `line.soft`/`base`/`strong`
   are separate, apply to the dark palette too and should be re-derived rather
   than eyeballed. `categoryColors` needs a dark variant as well — the five
   asset-class hues at `oklch(55% .13 h)` are tuned for a light ground.
2. Add a theme context and a `useColors()` hook. Persist the preference through
   the existing settings slice (`src/store/slices/settingsSlice.ts` +
   `src/utils/storage.ts`), so it syncs with everything else and survives a
   reinstall for signed-in users.
3. Convert each screen and component from a module-scope
   `const styles = StyleSheet.create({...})` to a memoised factory —
   `const styles = useMemo(() => makeStyles(c), [c])` — where `makeStyles` takes
   the palette. This is the mechanical bulk of the work. Do it file by file and
   keep the diff to colour only; do not reflow layout at the same time.
4. `app.json`: change `userInterfaceStyle` to `"automatic"`, and give the splash
   and adaptive-icon backgrounds a dark counterpart.
5. Add a Theme row to Profile with the three options.

### 2b. Cornerstone — DONE (`f0c5e48`)

Shipped as described below, with three deviations worth knowing:

1. **`ink` became "the maximum-contrast colour", not "navy".** It is navy on
   cream and cream on navy, with `onInk` as its opposite, so the primary button
   inverts without touching a call site. What could not follow that rule is the
   ink feature card — Home's resume card and the avatars — because inverting it
   puts the brightest block on the screen exactly where the eye lands first.
   Those use a new `emphasis` token: a dark card in light, a raised one in dark.
2. **`masteryColor`, `masteryTextColor` and `eyebrow` now require the palette**
   rather than defaulting to the light one. A default is precisely how a
   light-palette brass ends up on a dark screen, which is what happened to the
   exam switcher until the contrast walk caught it.
3. **`npm run check:contrast`** walks all sixteen screens in both themes against
   the web export and measures what actually rendered, failing on anything below
   AA that is not on a commented accepted list. It needs a web export, so it is
   not in `verify`. Run it after touching the palette or any screen's colours.

The original plan, for reference:


Scope: 24 files, 341 `color.` references, mostly inline styles — which is easier
— **but** `src/theme/type.ts` bakes `color.ink` / `color.inkBody` / `color.meta`
into 28 of its named text styles. That is the part to plan around.

1. `src/theme/tokens.ts` — export `lightColor` and `darkColor` of the same shape
   plus a `ColorTokens` type. The brass-on-cream identity needs a real dark
   counterpart, not an inversion: `brass #9a6b2f` is unreadable on a dark ground
   and wants lifting toward the existing `brassOnDark #e0b26a`, and `sage` and
   `rust` need the same treatment. The `darkCardBg` / `darkScreenBg` / `darkFg`
   tokens that already exist for the variant-C snapshot card are a reasonable
   starting point and were designed for this palette.
2. `src/theme/type.ts` — convert `export const type = {...}` to
   `export const makeType = (c: ColorTokens) => ({...})`, and provide the built
   scale through the same context as the colours so a component does
   `const { c, type } = useTheme()`.
3. Thread the hook through all 24 files. `app/snapshot.tsx`'s variant-C dark
   treatment is a *card style*, not a theme — keep the two concepts separate or
   the Index treatment will look wrong in dark mode.
4. Persist the preference in `useStudyStore` (`src/store/useStudyStore.ts`,
   already zustand + AsyncStorage with `partialize`) as `themePreference:
   'system' | 'light' | 'dark'`.
5. `app.json`: `userInterfaceStyle` to `"automatic"`, dark splash background.
6. Add the setting to the existing APPEARANCE section in
   `app/(tabs)/profile.tsx` (around line 309), beside "Topic list style", using
   the same three-button radio pattern already there.

### Acceptance for both

- Every screen legible in dark mode with no light-on-light or dark-on-dark.
  Walk all of them: home, category/topics, product/snapshot, lesson, quiz,
  results, review, glossary, profile, account, paywall, achievements/insights,
  onboarding and setup.
- Text contrast meets WCAG AA in both themes. The existing light palette was
  contrast-checked and the comments record the ratios; do the same for dark.
- System / Light / Dark all work, the choice survives a restart, and switching
  does not lose in-progress quiz state.
- `npm run verify` green in both repos.

---

## 3. Re-shoot Cornerstone's store screenshots — DONE (`1bf2ecd`), upload needs you

All eight are regenerated and committed. Six of the seven used to be hand-staged,
which is *why* four of them spent a release showing the placeholder tab glyphs —
nothing connected a UI change to the pictures. `npm run store:screenshot` now
captures the whole set:

```bash
cd ~/CornerStone
npx expo export --platform web --output-dir .expo-web
npm run store:screenshot
```

An eighth shot is new — `08-home-dark.png`, the dashboard in dark mode. Play
allows eight; upload it last so the existing seven keep their positions.

**What needs you:** uploading them in Play Console, in the numbered order
`docs/STORE_LISTING.md` gives.

---

## 4. Play Console — two declarations — **needs you**

Both are console-only; no build required.

1. **Account deletion URL.** Data safety → "Can users request data deletion?"
   must now point at the published pages, and the in-app path exists as of the
   commits above:
   - OTC Learn: `https://singhalsachin2003.github.io/OTC_Learn/account-deletion/`
   - Cornerstone: `https://singhalsachin2003.github.io/CornerStone/DELETE-ACCOUNT.html`
2. **Cornerstone Data safety** — confirm the corrected answers in
   `docs/PRIVACY.md` (lines 137–160) are what is actually filed and in review.
   The release checklist's contradicting rows were fixed in `4aac1ba`, but the
   *form itself* is the thing that gets enforced.

---

## 5. Regional pricing parity for OTC Learn — DONE (`96cd894`, `2b444c9`)

Applied to the live product on 23 September 2026. `otc_learn_pro`'s `monthly`
and `yearly` base plans are ACTIVE in **173 regions**, up from one, read back
from Play rather than trusted from the write.

| Band         | Monthly  | Yearly    | Regions                             |
| ------------ | -------- | --------- | ----------------------------------- |
| **Anchor**   | USD 3.99 | USD 24.99 | everywhere not listed below         |
| **Override** | INR 29   | INR 199   | IN PK BD LK NP NG KE GH EG VN PH ID |

The same bands, override list and safety rules as Cornerstone, from a script
ported into this repo as `npm run set:regions` (JavaScript, since this repo's
scripts are, so it needs no new dependency). India is pinned rather than
converted — conversion rounds ₹29 to ₹30 and Play restricts raising a live
price — and the script aborts if any already-priced region would change value.

**Until this ran the subscription was unavailable outside India**, so the app
never offered the upgrade anywhere else.

**The lifetime tier was deliberately not created.** This list asked for it, but
`docs/revenuecat.md` records the decision against it and the reasoning still
holds: under a content pipeline a ₹399 one-time unlock sells every future asset
class forever for under fourteen months of monthly, and **Play never revokes a
product from somebody who has bought it** — so it is the one pricing move here
that cannot be undone. It exists in RevenueCat's Test Store only, and no
one-time product exists in the Play Console. If it should exist, that is a
decision to take deliberately rather than as part of a regional-pricing job.

## 6. Housekeeping

Small, independent, do in any order.

- ~~**Push the branches.**~~ Both are pushed, each with a PR open.
- **`docs/get/` is committed but not live.** Two redirect pages were added so
  `…/OTC_Learn/get/` and `…/CornerStone/get/` become short install links for
  social bios. They go live on push.
- ~~**Delete `marketing/_superseded-v1/`**~~ — done in both (`962c81d`,
  `f3dd3e6`). In Cornerstone it was byte-identical to the tracked
  `marketing/social/`; in OTC Learn it was a mix of that and older renderings of
  posters whose current versions are in `social-v2/`, and those pre-v2
  renderings went with the folder. `social-v2/`, the profile assets and the
  handle sheet are tracked in both now; `Claude outputs/` is ignored rather than
  deleted, since it is where the posters arrived.
- **Google Search Console + Bing Webmaster.** Done in both repos (`988d405`,
  `5b4a5c6`): `jekyll-sitemap` now generates a sitemap on every Pages build, and
  each landing page carries `SoftwareApplication` and `FAQPage` JSON-LD over a
  visible five-question FAQ. OTC Learn's sitemap covers all seventy-odd product
  and category pages.

  The per-product pages carry no structured data of their own. `Article` or
  `DefinedTerm` markup on the sixty-six generated pages would mean changing
  `scripts/generate-site.js`, and is worth doing only once the properties are
  verified and there is something to measure it against.

  **What needs you:** verifying both properties and submitting the two sitemap
  URLs — `…/CornerStone/sitemap.xml` and `…/OTC_Learn/sitemap.xml`. Both need
  account access.

  A `robots.txt` could not be added here. It is only honoured at the *host* root,
  which is the separate `singhalsachin2003.github.io` repository — the same reason
  `assetlinks.json` has to be copied there. Add this file at that repo's root:

  ```
  User-agent: *
  Allow: /

  Sitemap: https://singhalsachin2003.github.io/CornerStone/sitemap.xml
  Sitemap: https://singhalsachin2003.github.io/OTC_Learn/sitemap.xml
  ```
- **Decide the iOS answer.** Neither app has ever been built for iOS. Every post
  and review reply will ask. Pick "not planned" or "later" and say the same
  thing everywhere.
- **Ask fifteen people for an honest review.** Still the single highest-value
  thirty minutes available — a listing with no ratings suppresses Play ranking
  and conversion at once. Never offer a promo code in the same message; Play
  treats that as an incentivised review and it is grounds for removal.

---

## 7. Known environment traps

These cost time in the previous session.

- **Cornerstone's `node_modules` is macOS-built.** Running its tooling from a
  Linux shell fails on native bindings — esbuild (`@esbuild/darwin-arm64` vs
  `linux-arm64`) and eslint's parser. On your Mac it is fine. If you ever see
  "Cannot find native binding", check which machine you are on before deleting
  `node_modules`.
- **`npm audit` in both repos** reports ~20 advisories. All are build tooling and
  none ships in the bundle — Cornerstone's release checklist explains the chains.
  Do **not** run `npm audit fix --force`; it downgrades Expo and breaks the app.
- **Cornerstone's pre-commit hook runs `npm run verify`** (about 11 seconds).
  That is correct and should stay. The previous session bypassed it with
  `-c core.hooksPath=/dev/null` only because it could not run lint in that
  environment; do not make bypassing a habit.

---

## 8. Light-palette contrast — DONE (`e097c24`, `9b0ccf2`)

Both apps' light palettes carried values below WCAG AA for small text, inherited
from the handoffs and shipped in every version. `npm run check:contrast` found
them; they are fixed rather than filed.

**Cornerstone** — five tokens walked down in lightness only, same hue and
chroma, all now clearing 4.5:1 on paper, surface and the brass tint:

| Token | Was | Now | Was at |
| --- | --- | --- | --- |
| `tabInactive` | `#9aa1af` | `#677082` | **2.36:1** — every screen's tab labels |
| `meta` | `#8c8578` | `#716c61` | 3.33:1 — every monospace eyebrow |
| `muted` | `#6f7a90` | `#636d80` | 3.93:1 — row subtitles |
| `brass` | `#9a6b2f` | `#8c612b` | 4.23:1 |
| `brassBody` | `#8a6a3c` | `#846539` | 4.18:1 on its own tint |

**OTC Learn** — the category accents drawn as small text now use the `.text`
variant that `theme/colors.ts` always carried for exactly this, at eleven call
sites that had never moved across; where a component only ever coloured text
with it, the prop is renamed `accentText` so the next one cannot get it wrong.
`text.tertiary` is one step darker, clearing 4.52:1 on `track` as well as on the
three surfaces the original check covered. The row chevron went from 2.18:1 to
3.00:1 and stays on the accepted list: it is an affordance rather than prose, so
3:1 for non-text contrast is the applicable bar, and it should stay lighter than
body text.

Both walkers are green — every screen, both themes. What is still accepted is
decorative by intent: Cornerstone's snapshot watermark and Index card, OTC
Learn's chevron and the week strip's future-day initials.

Cornerstone's store screenshots were regenerated, since the palette moved.

## 9. Deliberately not doing

Recorded so nobody re-opens them:

- **Shared package across the two apps.** ~1,000 lines of duplicated domain
  logic with identical constants (`EASE = 2.3`, `MAX_INTERVAL = 120`, intervals
  `[1, 4, 10]`, `LEARNING_RATE = 0.35`). Real, and deferred on purpose.
- **OTC Learn's lesson-card whitespace.** Looks like dead space; it is
  deliberate optical centring of short steps, documented in
  `src/screens/Lesson/components/LessonStep.tsx`. Leave it.
- **Cornerstone's question-bank depth.** Five per topic area is thin and the
  README says so. That is a content problem, not an engineering one.
