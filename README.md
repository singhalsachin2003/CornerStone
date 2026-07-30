# Cornerstone

An Android-first study app for CFA and FRM candidates. Pick an exam → pick a level → pick a
topic → read a swipeable snapshot card set → take a quiz → see results. Missed questions feed a
spaced-repetition review queue.

Built from the design handoff in `design_handoff_frm_cfa_study_flow/`, with content derived from
`CFA-and-FRM-Topicwise-Syllabus.pdf` in that same folder.

## Stack

- **Expo SDK 57** / React Native 0.86 / React 19, TypeScript strict
- **expo-router** file-based routing, with the headless `expo-router/ui` Tabs API so the tab bar
  matches the design exactly rather than being themed around a stock component
- **zustand + AsyncStorage** for persistence, behind a swappable adapter (`src/store/persistence.ts`)
- **react-native-gesture-handler + reanimated** for the snapshot card drag/flip
- **react-native-svg** for the progress rings (React Native has no conic gradient)
- **Source Serif 4** and **Archivo** via `@expo-google-fonts`

No backend, no auth, no API keys. Everything runs on-device.

## Running

```bash
npm install
npm start          # Expo dev server — press 'a' for Android, 'w' for web
npm run android    # straight to a connected device or emulator
npm run web
```

## Checks

```bash
npm run typecheck        # tsc --noEmit
npm test                 # Jest — scheduling, streaks, progress, shuffling (47 tests)
npm run check:content    # every topic has cards + questions; every question is well-formed
npm run check:syllabus   # topic areas, weights and module counts match the syllabus PDF
```

Tests target the pure logic rather than components, because that logic is what fails
*silently*: a wrong review interval, an off-by-one streak or a shuffle that loses the answer
index corrupts a candidate's data without ever throwing.

`check:content` fails the build if a topic area has no content, if a question does not have
exactly four distinct options with a valid answer index, or if a content bank is keyed to a topic
that does not exist.

`check:syllabus` is the independent one: its expected topic names, weight bands and
learning-module counts are transcribed from the PDF rather than read from the app, so it catches
drift between the two. Run it whenever CFA Institute or GARP publish a new outline.

### A note on dates and Hermes

Exam dates in `src/content/syllabus.ts` must be ISO-8601 (`YYYY-MM-DD`). React Native's Hermes
engine only parses ISO, so a human-readable date like `"17 May 2027"` becomes `Invalid Date` on
device and renders as "NaN days to exam day" — while working fine on web under V8. `check:content`
asserts the format. For the same reason, parse date-only strings with `parseISODate` rather than
`new Date(iso)`: the latter is UTC midnight, which then reads back a day early in any timezone
behind UTC and would miscount study streaks.

## Building for release

**Android APK / AAB** — via EAS (`eas.json` is configured):

```bash
npm i -g eas-cli
eas login
eas build:configure        # first time only, links the project to your Expo account
npm run build:android      # preview profile → installable APK
eas build -p android --profile production   # AAB for the Play Store
```

The `production` profile produces an app bundle with `autoIncrement` on the version code.
`android.package` is `io.cornerstone.study` — change it in `app.json` before your first Play
Store submission, since the package name is permanent.

**Web / PWA** — a static export, deployable to any static host:

```bash
npm run build:web          # → dist/
npx serve dist             # local check
```

## Project layout

```
app/                       expo-router routes
  _layout.tsx              fonts, gesture root, splash, stack
  index.tsx                entry router — resumes wherever the user stopped
  onboarding.tsx
  setup/exam.tsx           step 1 of 2
  setup/level.tsx          step 2 of 2 + L3 pathway picker + placement quiz
  (tabs)/_layout.tsx       custom tab bar
  (tabs)/home.tsx          dashboard: ring, week strip, resume card
  (tabs)/topics.tsx        all three treatments (Ledger / Ring tiles / Index)
  (tabs)/review.tsx        spaced-repetition queue
  (tabs)/profile.tsx       stats, settings, appearance, account
  switch.tsx               modal: every exam + level, one tap each
  snapshot.tsx             card stack — drag to move, tap to reveal
  quiz.tsx                 instant feedback, session clock
  results.tsx              score, breakdown, mastery delta, queue additions

src/
  theme/tokens.ts          colours, radii, shadows — transcribed from the handoff
  theme/type.ts            the handoff's type scale as named styles
  components/              Ring, TabBar, primitives (buttons, toggle, bars)
  content/syllabus.ts      topic areas, official weights, learning modules
  content/cards/           152 snapshot cards
  content/questions/       190 questions
  store/useStudyStore.ts   persisted progress, streak, bookmarks, settings
  store/useSessionStore.ts in-flight quiz session (not persisted)
  store/review.ts          SM-2 style scheduling
scripts/check-content.ts
```

## Content coverage

Every topic area in both programmes has 4 hand-written snapshot cards and a 5-question bank —
**38 areas, 152 cards, 190 questions**. There is no generic filler.

| Programme | Level | Areas | Source |
| --- | --- | --- | --- |
| CFA | Level I | 10 | 2027 topic outline |
| CFA | Level II | 10 | 2026 topic outline (newest published) |
| CFA | Level III | 5 core + 1 pathway | 2027 topic outline |
| CFA | L III pathways | 3 (Portfolio Mgmt, Private Markets, Private Wealth) | 2027 pathway outlines |
| FRM | Part I | 4 | 2026 curriculum |
| FRM | Part II | 6 | 2026 curriculum |

Exam weights are the published **bands** (e.g. Ethics at Level I is "15–20%", not a point
estimate). The band midpoint is used internally to weight syllabus progress — the home screen's
"weighted as in the real exam" figure is a genuine weighted average, not a flat mean.

Counts shown in the UI ("4 cards · 5 questions", "10 topic areas · 140 practice questions") are
derived from the content banks at runtime, so the copy cannot drift from what actually ships.

### Keeping content current

CFA Institute publishes new topic outlines annually and GARP revises the FRM curriculum every
December. When weights change, edit `src/content/syllabus.ts` only — the UI reads weights from
there. Adding a topic area without adding content will fail `npm run check:content`.

## Review scheduling

`src/store/review.ts`. The product copy promises "tomorrow, then in four days, then in ten", so
the first three intervals are fixed at 1 / 4 / 10 days; beyond that the interval grows by an
SM-2 style ease factor of 2.3, capped at 120 days. A wrong answer resets an item to the start and
increments its lapse count; three clean passes retire it from the queue.

## Design decisions worth knowing

- **All three topic treatments ship.** Ring tiles (B) is the default; Ledger (A) and Index (C) are
  switchable in Profile → Appearance. Index also switches snapshot cards to the dark treatment.
  Drop the two you don't want by deleting their components in `app/(tabs)/topics.tsx` and the
  Appearance section in `app/(tabs)/profile.tsx`.
- **Level III adds a pathway.** The syllabus defines Level III as "5 core + 1 pathway" worth
  30–35%, so the chosen pathway appears as a sixth topic area. It is picked on the level screen
  and changeable from Profile.
- **Both programmes run side by side.** Plenty of candidates sit CFA and FRM in the same year, so
  the two are fully independent: all progress is keyed by exam-prefixed topic keys
  (`cfa-l1-fixed`, `frm-p1-markets`), giving each exam its own mastery, bookmarks and review
  queue. `levelByExam` remembers the level you were on in each.
- **One switcher for exam and level** (`app/switch.tsx`, presented as a modal). Tapping the exam
  title on Home — the brass ⌄ — or Profile → Switch exam or level lists all five levels across
  both programmes with per-level weighted progress, current one highlighted. **Any level of any
  exam is one tap**, including CFA Level I → FRM Part II. Nothing is reset; the two-step setup
  flow is only for first run.
- **Progress is earned, not seeded.** The prototype shipped hard-coded mastery percentages; here
  every topic starts at 0 and mastery moves toward each session's score at a 0.35 learning rate.
  The results screen reports the actual delta rather than the prototype's fixed "+8".
- **Tab-bar icons are placeholders**, as the handoff specifies. They are bordered squares and
  circles. Swap in a real icon set (Lucide: home, layers, repeat, user) by editing
  `src/components/TabBar.tsx` only.
- **Ring progress uses SVG arcs**, not conic gradients, which React Native does not support. The
  visual result is the same and anti-aliases better.

## Release readiness

Done:
- **Permissions** — verified from the built APK with `aapt2`, not from the config. The release
  build ships exactly three: `INTERNET`, `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`
  (plus an app-scoped `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` that AndroidX generates for
  runtime-registered receivers — it grants nothing and is invisible to users).

  Thirty-two others are stripped via `android.blockedPermissions`. Most came from
  `expo-notifications`, which bundles Firebase Cloud Messaging for remote push even though
  this app only schedules local notifications; that pulled in `c2dm.permission.RECEIVE`,
  `ACCESS_NETWORK_STATE`, `WAKE_LOCK`, the Play install-referrer binding and sixteen
  launcher-badge permissions. Exact-alarm permissions are blocked deliberately too: Play
  requires a justification form for them and a study reminder does not qualify.

  **`expo prebuild` cannot show you this** — library manifests merge during the Gradle build.
  Always check the artifact:
  `aapt2 dump permissions build.apk | grep uses-permission`.
- **Daily reminder** — a real scheduled local notification (`src/notifications.ts`), off by
  default so the OS prompt appears when the candidate asks for it rather than on first launch.
  Revoking permission in system settings is detected and reflected in the toggle.

  Verified on a release build: after granting permission the system reports
  `RTC_WAKEUP … origWhen=19:30:00 … io.cornerstone.study`, so blocking `WAKE_LOCK` does not
  break delivery — the system alarm holds the wakelock, not the app. The alarm carries
  `window=+1h`, meaning Android may batch it up to an hour late. That is the deliberate cost of
  not requesting exact-alarm permission, and is immaterial for a study nudge.
- **Error boundary** — `src/components/ErrorBoundary.tsx`, exported from the root layout, with
  a recovery path that states progress is safe.
- **Zero network egress** — v1.0 deliberately ships with no analytics, no crash reporting and
  no over-the-air updates. `expo-updates` was removed: it pings a remote server on every
  launch, which would have been the app's only outbound request. Nothing leaves the device, so
  the privacy claim holds without an asterisk and the Play Data Safety form is "no data
  collected". The cost is that fixing a content error needs a store release; re-add
  `expo-updates` when hotfix capability outweighs that.
- **About & legal** — in-app trademark and curriculum disclaimers at Profile → About & legal.
- **Store assets** — `store/feature-graphic.png` (1024×500, 24-bit, no alpha) and seven phone
  screenshots in `store/screenshots/`. Regenerate the graphic with `npm run store:graphic`.
- **Docs** — `docs/PRIVACY.md` (with Play Data Safety answers) and `docs/STORE_LISTING.md`
  (trademark-safe listing copy, asset status, content-rating guidance).
- **EAS project linked** — `@singhalsachin2003/cornerstone`; `owner` and `extra.eas.projectId`
  are in `app.json`, and `versionCode` is tracked remotely so it auto-increments.
- **Package name frozen** — `io.cornerstone.study`, confirmed final. Permanent from the first
  Play upload.
- **Privacy policy published** — <https://singhalsachin2003.github.io/CornerStone/PRIVACY.html>,
  served by GitHub Pages from `main` → `/docs`. This is the URL Play Console links to.

Still outstanding:
- **Signing keystore backup** — EAS generated and stores it, but export your own copy via
  `eas credentials --platform android`. Interactive only; see the release checklist. Losing this
  key means never being able to update the app.
- **Crash reporting** — none by design in v1.0. Play Console's Android vitals reports crashes
  and ANRs for Play-distributed apps with no SDK and no egress from the app itself, which
  covers this without compromising the privacy position. `ErrorBoundary.componentDidCatch` is
  where an SDK would go if one is ever wanted.
- **Analytics** — none by design.
- **iOS** — `bundleIdentifier` is set but the app has never been run on iOS.
- **Authentication and cross-device sync** — `src/store/persistence.ts` is the single seam;
  implement its `getItem`/`setItem`/`removeItem` against an API and nothing else changes.
- **Question bank depth** — 5 per topic area is thin for a paid public launch.

## Attribution

CFA®, Chartered Financial Analyst® and GIPS® are registered trademarks of CFA Institute. FRM® and
GARP® are trademarks of the Global Association of Risk Professionals. This app is an independent
study aid and is not endorsed by, affiliated with, or sponsored by either body. Always check
weights and readings against the official documents for your exam window.
