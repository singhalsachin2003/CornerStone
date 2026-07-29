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
npm run check:content    # every topic has cards + questions; every question is well-formed
npm run check:syllabus   # topic areas, weights and module counts match the syllabus PDF
```

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

## Not built

- Authentication and cross-device sync. `src/store/persistence.ts` is the single seam — implement
  its `getItem`/`setItem`/`removeItem` against an API and nothing else changes.
- Offline download management. The "Download over Wi-Fi only" toggle persists but has no
  downloader behind it; all content is bundled with the app, so nothing needs downloading yet.
- Push notifications for the daily reminder. The toggle and time persist; wiring
  `expo-notifications` is the remaining step.
- Loading and error states, which the handoff notes are not designed yet. Nothing fetches, so
  there is currently nothing to show them for.

## Attribution

CFA®, Chartered Financial Analyst® and GIPS® are registered trademarks of CFA Institute. FRM® and
GARP® are trademarks of the Global Association of Risk Professionals. This app is an independent
study aid and is not endorsed by, affiliated with, or sponsored by either body. Always check
weights and readings against the official documents for your exam window.
