# Handoff: FRM & CFA Prep — Study Flow (Cornerstone)

## Overview
A mobile (Android-first) study app for candidates preparing for the CFA charter or the FRM
certification. Core loop: pick exam → pick level/part → pick a topic → read a short swipeable
"snapshot" card set → take a 5-question quiz → see results; missed questions feed a spaced-repetition
review queue. Supporting screens: onboarding, home dashboard (streak + syllabus progress), profile/settings.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype that shows
intended look, copy and behaviour. They are **not production code to copy directly**.
The task is to **recreate these designs in the target codebase's existing environment** (React Native,
Jetpack Compose, Flutter, SwiftUI, web React, …) using its established patterns, component library and
navigation. If no environment exists yet, choose the most appropriate framework for an Android-first
mobile app and implement the designs there.

`FRM CFA Prep.dc.html` is a streaming-HTML component: markup lives in the `<x-dc>` template, all state
and content data live in the `class Component` script at the bottom of the file (topic lists, snapshot
card copy, quiz banks). Read that class for the exact content model.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy and interaction states are final-intent. Recreate
pixel-faithfully using the codebase's own primitives. The two side panels (left "Flow" rail, right
"Notes for review") and the Android device bezel are **prototype scaffolding only — do not build them**.
The phone screen content is the deliverable.

## Design tokens

Colors
| Token | Hex | Use |
| --- | --- | --- |
| paper | #f7f4ee | app background |
| paper-alt | #f2eee5 | snapshot screen background (variants B) |
| surface | #fffdfa | cards, list rows, inputs |
| ink | #16233b | primary text, primary button fill, active states |
| ink-hover | #26365a | primary button hover/press |
| ink-body | #3d4a63 | body copy on cards |
| muted | #6f7a90 | secondary text |
| meta | #8c8578 | monospace labels / eyebrows |
| brass (accent) | #9a6b2f | accent, streaks, formulas eyebrow, progress mid |
| brass-tint bg | #f3ead9 | review-queue / placement callout fill |
| brass-tint border | rgba(154,107,47,.42) | same callout border |
| brass-on-dark | #e0b26a | accent on dark cards (variant C) |
| sage (correct) | #3f6b57 | correct answers, high mastery, toggles on |
| rust (wrong) | #9b3b34 | wrong answers, over-time clock |
| rule | rgba(22,35,59,.10–.16) | hairlines and borders |
| dark card bg | #1c2740 | variant C snapshot card |
| dark screen bg | #131c2e | variant C snapshot screen |
| tab inactive | #9aa1af | bottom-tab inactive icon/label |

Typography — two families:
- **Source Serif 4** (Google Fonts, 400/600/700) — all headings, big numerals, card titles, score numbers.
- **Archivo** (Google Fonts, 400/500/600/700) — all UI text, body copy, buttons, labels.
- **ui-monospace / Menlo** — small uppercase eyebrows (9–12px, letter-spacing .06–.16em) and formulas.

Type scale in use (px/line-height): 38/1.1 serif (onboarding hero) · 30/1.15 serif (screen titles) ·
27/1.15 · 25/1.2 · 24/1.15 (snapshot card title, 27 on dark) · 21/1.2 · 20.5/1.35 serif (quiz stem) ·
19/1.2 · 15.5/1.25 Archivo 500 (list row title) · 15/1 (buttons, 600) · 14.5/1.6 (card body) ·
14/1.45 (options) · 13.5/1.55 · 12.5/1.5 (secondary) · 11.5/1.4 (meta) · 9–10 mono eyebrows.

Spacing: 20px screen gutter (24px on onboarding/exam/level), 14–18px card padding (20px snapshot A,
24px B/C), 9–14px gaps between stacked cards, 26px between sections.

Radius: 4px buttons · 5px list cards/options · 6px feature cards · snapshot card 2px (A) / 10px (B) / 6px (C) ·
50% avatars and rings · 13px toggle track.

Shadow: only variant B snapshot card — `0 8px 26px rgba(22,35,59,.12)`. Toggle knob `0 1px 3px rgba(22,35,59,.3)`.

Hit targets: all buttons ≥44px tall; nav/back links 12.5px Archivo 500 in muted.

## Screens

### 1. Onboarding
Purpose: state the value proposition and start setup.
Layout: single column, 26/24px padding. "CORNERSTONE" mono eyebrow (brass, 10px, .16em) top-left; a
64×64 square with a 2px ink border containing a serif "C"; 38px serif headline
("Fifteen honest minutes beats three distracted hours."); 15px/1.6 muted paragraph capped at 31ch;
three numbered rows (01/02/03 brass mono + 13.5px Archivo copy, 12px gap). Bottom: full-width ink
primary button "Get started" (16px padding, 4px radius), then a 12px centered line
"Already studying with us? Sign in" with the link in brass.

### 2. Exam picker (step 1 of 2)
Eyebrow "STEP 1 OF 2"; 30px serif title "Which exam are you sitting?"; 14px muted subtitle
"You can switch any time from your profile."
Two selectable cards (20px padding, 5px radius, 1px rule border; when selected: border ink + surface fill;
hover: border ink):
- **CFA** — serif 22px title, right-aligned brass mono "3 LEVELS"; 13.5px description
  ("Chartered Financial Analyst — investment analysis, valuation, portfolio management, ethics.");
  11.5px meta "10 topic areas · 1,240 practice questions".
- **FRM** — "2 PARTS"; "Financial Risk Manager — market, credit, operational and liquidity risk
  measurement."; "10 topic areas · 890 practice questions".
Footer: full-width "Continue" — disabled state is `rgba(22,35,59,.14)` fill with #8c8578 label and
`not-allowed` cursor until an exam is chosen.

### 3. Level picker (step 2 of 2)
"← Change exam" back link; eyebrow "STEP 2 OF 2 · {exam}"; title "Where are you in the programme?".
Rows (16/18px padding, 5px radius): 34px circle with roman numeral (selected = ink fill, paper numeral;
unselected = 1px .2 border, muted numeral), then 15.5px name + 12.5px muted note.
- CFA: Level I "Tools and concepts — 10 topic areas, 180 questions" · Level II "Asset valuation — item
  sets (vignettes)" · Level III "Portfolio management — essay + item sets".
- FRM: Part I "Tools — 100 questions, four topic areas" · Part II "Application — 80 questions, six topic areas".
Below (pushed to bottom): **placement-quiz callout** — brass-tint fill #f3ead9, 1px rgba(154,107,47,.42),
eyebrow "NOT SURE WHERE TO START?" + right-aligned "6 MIN", 18px serif "Take the placement quiz",
12.5px "Five questions across the {exam} syllabus. We'll recommend a level and pre-fill your topic progress."
Tapping it defaults the level to the first one and launches the quiz flow.
Then full-width "Start studying" (disabled until a level is selected).

### 4. Home dashboard
Header row: 13px "Good evening, Anaya" + 25px serif "{exam} · {level}"; right 38px ink circle avatar "AK"
(→ profile).
**Progress card** (surface, 6px radius, 18px padding, 18px gap): 82px conic-gradient ring
(`conic-gradient(brass {pct*3.6}deg, rgba(22,35,59,.10) 0)`) with a 64px paper inner circle showing
"{pct}%" serif 19px over mono "SYLLABUS"; right column: 15px "112 days to exam day",
12.5px muted "You're pacing ahead of plan. Two topics left this week.", then two stats separated by a
1px vertical rule — "9 DAY STREAK" (brass serif 17px) and "14 CARDS DUE".
**Week strip**: 7 equal cells, 30px tall, 3px radius — filled brass for completed days, `rgba(154,107,47,.35)`
for today, transparent with a 1px rule for future; mono day initials beneath.
**Resume card**: ink fill, paper text, 6px radius, 18px padding — mono "IN PROGRESS" + right "{pct}%",
20px serif topic name, 12.5px "{n} snapshot cards · quiz unlocked", 3px progress track
`rgba(247,244,238,.22)` with a #e0b26a fill. Chooses the first topic with 0 < progress < 60%.
**Two half-width cards**: "All topics / {n} areas" (surface) and "Review queue / 14 due today" (brass tint).
Bottom tab bar (see Shared).

### 5. Topics — three treatments (pick one; all three are built)
Shared sticky header: "← Home", right mono variant tag, 27px serif "Topics", 12.5px muted
"{exam} {level} · {n} areas, weighted as in the real exam".
- **A · Ledger** — full-bleed rows divided by 1px rules: brass mono index (01…), 15.5px name, 11.5px meta
  "{weight} of exam · {cards} cards · {qs} questions", right-aligned mono percentage colored by mastery
  (sage ≥70, brass ≥35, muted below); 2px progress bar under each row. Hover fills with surface.
- **B · Ring tiles** (default) — 2-column grid, 10px gap, surface tiles with 1px rule and 6px radius:
  40px conic ring with the percentage in a 31px inner circle, brass mono weight top-right, 14px name,
  11px "{cards} cards · {mastery}" pinned to the bottom. Mastery words: strong / building / shaky / not started.
- **C · Index** — editorial rows: 40px serif numeral (brass when started, `rgba(22,35,59,.22)` when not),
  19px serif name, 11.5px blurb, then ten 12×5px pips (filled ink for each completed decile). Rows
  separated by 1px rules; hover drops opacity to .72.

Topic data (name · exam weight · progress · cards · questions) for both exams is in the logic class —
CFA has 10 areas (Ethics 15%, Quant 10%, Economics 10%, FSA 15%, Fixed Income 11%, Equity 11%,
Derivatives 6%, Alternatives 6%, Portfolio Mgmt 8%, Corporate Issuers 8%); FRM Part I has 4 areas
(Foundations, Quantitative Analysis, Markets & Products, Valuation & Risk Models) and Part II has 6
(Market, Credit, Operational, Liquidity, Risk & Investment Management, Current Issues).
Level filters the list: CFA L1 = all 10, L2 = items 2–9, L3 = items 5–10; FRM P1 = first 4, P2 = last 6.

### 6. Snapshot (swipeable card stack)
Header: "← Topics" · mono "SNAPSHOT · {n}/{total}" · bookmark toggle ("☆ Save" / "★ Saved" in brass).
Below: 21px serif topic name and a segmented progress bar (one 3px segment per card; filled ink, or
#e0b26a on dark).
Card stack: two offset ghost cards behind (inset 32px/26px, offset 8px/13px top) then the live card —
1px border, surface (or #1c2740 in variant C), radius per variant, 20–24px padding. Contents:
mono kicker (brass / #e0b26a) + large muted numeral (30px, 52px on dark); serif title (24px, 27px dark);
14.5px/1.6 body; optional **formula block** (1px border, #f5f1e7 fill, "FORMULA" eyebrow, 15.5px monospace);
and — only after tapping the card — an "IN THE EXAM" section above a 1px divider (brass eyebrow, 14px copy).
Footer hint line: "Tap the card for the exam angle" / "Tap to hide · drag to move on".
Controls: 46px square "←" button + full-width primary "Next card", which becomes "Start the quiz →"
on the last card.
Gestures: pointer drag translates the card and rotates it `dragX/40` degrees; release beyond ±70px
advances/retreats; a tap (drag < 4px) flips to reveal. `touch-action: pan-y`.
Card copy is written for Fixed Income, Market Risk, Ethics, Quantitative Methods and Valuation & Risk
Models (4 cards each with formulas); every other topic falls back to a 3-card generic orientation set.

### 7. Quiz
Header: "← Snapshot" and a **per-session clock** — mono "SESSION" eyebrow + mm:ss, turning rust past 5:00.
Segmented progress (one 3px segment per question: ink = current, sage = answered correct,
rust = answered wrong, rule = upcoming). Row: "QUESTION {n} OF {total} · {topic}" and a bookmark toggle.
Stem: 20.5px serif; optional **given-data block** — 2px brass left border, 12px inset, 13.5px monospace.
Options: 5px-radius surface buttons, 14px padding, min-height 44px, 22px circle bearing A/B/C/D.
On answer (instant feedback, single-select, locked afterwards): correct option → sage border,
`rgba(63,107,87,.08)` fill, filled sage "✓" circle; the wrong pick → rust border, `rgba(155,59,52,.07)`
fill, filled rust "✕".
Feedback panel: tinted sage/rust card with eyebrow "CORRECT — NICE WORK" or "NOT QUITE", 13.5px
explanation, and 12.5px "Reading: {curriculum reference}".
Footer button: "Choose an answer" (disabled) → "Next question" → "See results" on the last item.
Question banks (5 each) exist for Fixed Income, Market Risk and Ethics (4); other topics get a 3-question
generic set. Each question carries `opts`, correct index, `why` explanation and `ref`.

### 8. Results
Eyebrow "SESSION COMPLETE"; 29px serif headline that varies by score (≥80 "That topic is holding up
well." / ≥50 "Solid — two ideas need another pass." / else "Worth a second run at this one.") plus a
13.5px note.
Score card: 88px conic ring (sage ≥70, brass ≥40, else rust) with "{correct}/{total}" serif 21px over
"{pct}%"; right column three label/value rows — Time on task, Avg per question, Topic mastery (brass,
"{pct+8}% (+8)").
"QUESTION BREAKDOWN" list: 20px ✓/✕/– status circle, truncated stem (74 chars), note
"Correct · {ref}" / "Missed · {ref}", right-aligned per-question seconds.
Brass-tint callout: "{n} questions added to your review queue" + "They'll resurface tomorrow, then in
four days, then in ten."
Footer: outlined "Retake" + ink "Next topic".

### 9. Profile
"← Home"; 56px ink avatar, 22px serif name, 12.5px "{exam} {level} · sitting {date}" (CFA 17 May 2027,
FRM 15 Nov 2026). Three stat tiles (9 day streak / 412 questions / 72% accuracy).
"STUDY" section — four rows with 44×26px pill toggles (track sage when on, `rgba(22,35,59,.2)` off;
20px knob animating left 3px→21px over 180ms): Spaced repetition ("Resurface missed questions on a
schedule", on) · Daily reminder ("19:30 — after work, before dinner", on) · Timed quizzes
("Show a per-session clock while answering", off) · Download over Wi-Fi only
("Keeps snapshots available offline", on).
"ACCOUNT" section — three disclosure rows: Switch exam, Downloads (3 topics offline), Bookmarks ({n} saved).

### Shared: bottom tab bar
Only on Home, Topics and Profile. 1px top rule, paper fill; four items, each an 18px 1.5px-border
square/circle glyph + 10px label: Home, Topics, Review, Profile. Active = ink border and fill;
inactive = #9aa1af. (Icons are deliberate placeholders — swap in the codebase's real icon set;
Lucide equivalents: home, layers, repeat, user.)

## Interactions & behavior
- Exam and level "Continue" CTAs stay visually disabled until a choice is made.
- Placement quiz from the level screen: sets a provisional level, resets quiz state, opens the quiz.
  In production it should score the run and then recommend a level and seed topic progress.
- Snapshot: drag to move between cards (±70px commit, rotation follows the drag), tap to reveal the
  "in the exam" note, arrow/primary buttons as accessible equivalents; the last card's CTA starts the quiz.
- Quiz: one answer per question, locked after selection, instant feedback with explanation; per-session
  timer ticks every second while the quiz screen is mounted.
- Results: wrong answers count into the review queue; "Retake" resets the same bank, "Next topic" returns
  to the topic list.
- Hover states: primary buttons darken ink → #26365a; cards and rows move their border to ink; ledger
  rows fill with surface; index rows fade to .72 opacity. Transitions used: 180ms on toggle track/knob.
- No loading or error states are designed yet — add them per codebase convention (skeletons for topic
  and question fetches; a retry state for offline snapshot downloads).

## State management
Prototype state (see `class Component`):
`screen`, `exam` ('CFA'|'FRM'), `level` ('L1'|'L2'|'L3'|'P1'|'P2'), `topicKey`,
`cardIdx`, `revealed`, `dragX`, `dragging`,
`qIdx`, `chosen`, `answers[{i, ok}]`, `qTimes[]`, `elapsed` (seconds, per session),
`bookmarks{}` (question), `cardBookmarks{}` (snapshot card), `settings[bool×4]`.
Production additions expected: authenticated user, server-held topic mastery, review-queue schedule
(SM-2 style intervals — the copy promises 1 / 4 / 10 days), offline download manifest, exam date.
Data fetching: topic list per exam+level; snapshot card set per topic; question bank per topic
(paged, with correct answer withheld until the answer is submitted if cheating matters).

## Assets
None. No image or icon files are used — glyphs are text (←, ✓, ✕, ★, ☆) and shapes are CSS. Fonts are
Google Fonts (Source Serif 4, Archivo). `android-frame.jsx` is prototype-only device chrome.
Replace placeholder tab icons with the codebase's icon set.

## Files
- `FRM CFA Prep.dc.html` — the full prototype: template markup + logic class with all content data
  (topics, snapshot cards, quiz banks, copy).
- `android-frame.jsx` — device bezel used to present the prototype. **Not part of the product.**

## Screenshots
`screens/` — rendered states of the prototype (2x, phone frame only):
01 onboarding · 02 exam picker · 03 level picker with placement quiz · 04 home dashboard ·
05 topics (B · ring tiles) · 06 topics (A · ledger) · 07 topics (C · index) ·
08 snapshot card (C · dark) · 09 snapshot card (B) · 10 snapshot revealed ("in the exam") ·
11 quiz with instant feedback · 12 results · 13 profile.
The Android bezel and status bar in these images are prototype chrome, not part of the design.
