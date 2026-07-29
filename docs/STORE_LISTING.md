# Play Store listing — draft copy

Trademark-safe by construction: the marks are only used descriptively ("for CFA® candidates"),
never possessively or in a way that implies endorsement. Do **not** put "CFA" or "FRM" in the app
title — that is the single most common cause of a takedown request from either body.

---

## App title — DECIDED

Paste this verbatim into Play Console → Main store listing → App name:

```
Cornerstone: Exam Study
```
(23 of 30 characters)

**Do not put CFA or FRM in the title.** A trademark in an app *name* reads as a claim to the
mark and is the most common trigger for a takedown request from CFA Institute or GARP. Both
enforce actively.

Rejected for that reason: "CFA Prep", "FRM Exam App", "CFA & FRM Study", "Official CFA Trainer".

### The marks stay in the description, and that is deliberate

Using "for CFA and FRM candidates" in the description is **nominative fair use** — naming the
exam you help people prepare for, without implying you are the exam body. That is permitted and
it is also the only way candidates will ever find this app; nobody searches for "exam study".

So the rule is: **marks out of the title, marks in the body, disclaimer at the bottom.** Do not
strip them everywhere — that would make the listing undiscoverable while gaining nothing.

### The app's own name is different, and that is correct

`expo.name` in `app.json` is `Cornerstone` — that is the launcher label under the icon on the
device, and Android truncates long labels there. The Play listing title and the launcher label
do not need to match, and short is better on the home screen.

Unlike the package name, the store title **can** be changed later in Play Console at any time.

## Short description (80 chars max)

```
Snapshot cards and quizzes for CFA and FRM candidates. Fifteen honest minutes.
```
(77 characters)

## Full description (4000 chars max)

```
Fifteen honest minutes beats three distracted hours.

Cornerstone is a focused study companion for candidates preparing for the CFA® Program or
the FRM® certification. Pick a topic, read a short set of swipeable snapshot cards, then
prove it with five questions. That is a session.

HOW IT WORKS

• Snapshot cards — the core idea, the formula that does the work, and the angle the
  examiners actually test. Tap a card to reveal the exam angle.
• Five-question sessions — instant feedback with a written explanation and a curriculum
  reference for every question, right or wrong.
• Spaced repetition — anything you miss returns tomorrow, then in four days, then in ten,
  and less often as it sticks.
• Weighted progress — your syllabus percentage is weighted by published exam weights, so a
  15–20% topic counts for more than a 5–8% one.

WHAT IS COVERED

CFA Program
• Level I — all 10 topic areas
• Level II — all 10 topic areas
• Level III — 5 core topics plus your chosen pathway (Portfolio Management, Private
  Markets, or Private Wealth)

FRM
• Part I — all 4 topic areas
• Part II — all 6 topic areas

38 topic areas in total, each with hand-written snapshot cards and its own question bank,
organised by the published topic outlines and exam weight bands.

SITTING BOTH?

Plenty of candidates do. CFA and FRM run side by side with completely separate progress,
bookmarks and review queues, and any exam or level is one tap away.

BUILT TO RESPECT YOUR TIME

• Works fully offline — all content ships with the app
• No account, no sign-up, no ads
• Nothing you do leaves your device
• Optional daily reminder

IMPORTANT

Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed
by or sponsored by CFA Institute or the Global Association of Risk Professionals (GARP).
Questions are written to practise the reasoning these exams reward; they are not past papers
and are not taken from any official question bank.

Exam weights and readings are revised annually by both bodies. Always confirm against the
official outline for your exam window.

CFA®, Chartered Financial Analyst® and GIPS® are registered trademarks owned by CFA
Institute. FRM®, Financial Risk Manager® and GARP® are trademarks owned by the Global
Association of Risk Professionals.
```

---

## Assets

| Asset | Spec | Status |
| --- | --- | --- |
| App icon | 512×512 PNG, 32-bit | ✅ `assets/icon.png` (1024², downscale on upload) |
| Feature graphic | 1024×500 PNG/JPG, no alpha | ✅ `store/feature-graphic.png` — verified 24-bit RGB, no alpha |
| Phone screenshots | 2–8, min 320px, 16:9 or 9:16 | ✅ `store/screenshots/` — 7 at 1080×1920 |
| 7"/10" tablet screenshots | optional, improves ranking | Not created — reuse phone shots or skip |

Regenerate the feature graphic after a brand change with `npm run store:graphic`
(then `sips -z 500 1024 store/feature-graphic@2x.png --out store/feature-graphic.png`).

Screenshots are ordered to lead with the product's actual idea rather than the dashboard —
upload them in this order:

1. `01-snapshot-card` — the snapshot card with its formula block
2. `02-snapshot-revealed` — the "in the exam" angle revealed on tap
3. `03-quiz-feedback` — instant feedback with the explanation and LOS reference
4. `04-home-dashboard` — progress ring, streak, resume card
5. `05-topics-weights` — the topic grid showing published exam weights
6. `06-review-queue` — spaced repetition
7. `07-exam-switcher` — both programmes side by side

## Content rating questionnaire

Answer honestly; this app should land at **Everyone / PEGI 3**.
- No violence, sexuality, profanity, controlled substances, gambling
- No user-generated content, no user interaction, no location sharing
- No purchases

## Other Play Console fields

- **App category** — Education
- **Tags** — Education, Test Prep
- **Contains ads** — No
- **In-app purchases** — No
- **Target audience** — 18+ (professional certification candidates)
- **Data safety** — see `docs/PRIVACY.md`
- **Privacy policy URL** — host `docs/PRIVACY.md` at a public URL (GitHub Pages works) and
  paste the link
- **Government app** — No
- **Financial features** — **None.** This is study content about finance, not a financial
  product; do not tick any of the financial-features boxes.
