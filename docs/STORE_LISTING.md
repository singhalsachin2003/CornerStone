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

**Do not put CFA or FRM in the title.** A trademark in an app _name_ reads as a claim to the
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
Snapshot cards and quizzes for CFA® and FRM® candidates. Fifteen honest minutes
```

(79 characters)

The ® symbols matter more here than anywhere else in the listing: the short description and
the feature graphic are the two places a reviewer or a trademark agent sees the marks first,
and they were the only marketing surfaces carrying them bare. The trailing full stop is gone
to keep a character in hand — with it the line is exactly 80 and any future tweak overflows.

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
organised by the published topic outlines and exam weight bands. Each area is divided into
segments that follow the official learning modules, so you can line the app up against the
curriculum you were given.

A GLOSSARY THAT IS ALWAYS FREE

260 terms across both programmes, searchable by name or abbreviation — type "var" and you
get Value at Risk. Each entry gives the definition, the formula where there is one, and the
distinction that actually gets tested. It is free for everyone, permanently, whether or not
you ever subscribe.

SITTING BOTH?

Plenty of candidates do. CFA and FRM run side by side with completely separate progress,
bookmarks and review queues, and any exam or level is one tap away.

FREE, AND WHAT IS NOT

Everything Cornerstone shipped before the subscription existed is free, permanently —
all 38 topic areas, their snapshot cards and their question banks. Anyone who installed
the app before the subscription existed keeps every paid segment too, permanently.

Cornerstone Plus opens the segments written since: deeper coverage drawn along named
clusters of the official learning modules, with new segments added to the same
subscription as they are written. That is what the subscription buys — the next ones.

BUILT TO RESPECT YOUR TIME

• Works fully offline — all content ships with the app
• No ads, and no sign-up required to use any of it
• An optional account backs your progress up, so a new phone does not start you over
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

| Asset                     | Spec                         | Status                                                         |
| ------------------------- | ---------------------------- | -------------------------------------------------------------- |
| App icon                  | 512×512 PNG, 32-bit          | ✅ `assets/icon.png` (1024², downscale on upload)              |
| Feature graphic           | 1024×500 PNG/JPG, no alpha   | ✅ `store/feature-graphic.png` — verified 24-bit RGB, no alpha |
| Phone screenshots         | 2–8, min 320px, 16:9 or 9:16 | ✅ `store/screenshots/` — 8 at 1080×1920                       |
| 7"/10" tablet screenshots | optional, improves ranking   | Not created — reuse phone shots or skip                        |

Regenerate the feature graphic after a brand change with `npm run store:graphic`
(then `sips -z 500 1024 store/feature-graphic@2x.png --out store/feature-graphic.png`).

**Every shot is regenerated, none is hand-staged.** Hand-staging is why four of them spent a
release advertising the placeholder square-and-circle tab glyphs that `02c4bcc` had already
replaced with Lucide icons — nothing connected a UI change to the pictures in the listing:

```bash
npx expo export --platform web --output-dir .expo-web
npm run store:screenshot
```

The seeded state lives at the top of `scripts/capture-store-screenshots.mjs` — the date is
pinned so the countdown, streak and week strip stay consistent with each other and rerunning
next month produces the same images. The two screens that need a tap — the revealed exam angle
and quiz feedback — are driven by clicking coordinates, because React Native Web renders a
`Pressable` as a div with no role and Playwright's element clicks do not reliably fire its press
handler.

Re-run it after any change to a screen that appears in the set, and after a palette change.

Screenshots are ordered to lead with the product's actual idea rather than the dashboard —
upload them in this order:

1. `01-snapshot-card` — the snapshot card with its formula block
2. `02-snapshot-revealed` — the "in the exam" angle revealed on tap
3. `03-quiz-feedback` — instant feedback with the explanation and LOS reference
4. `04-home-dashboard` — progress ring, streak, resume card
5. `05-topics-weights` — the topic grid showing published exam weights
6. `06-review-queue` — spaced repetition
7. `07-exam-switcher` — both programmes side by side
8. `08-home-dark` — the same dashboard in dark mode

The eighth is new and optional: Play allows eight phone shots, and dark mode is a differentiator
worth showing to somebody who studies on a commute or in the evening. Upload it last so the
seven that carried the listing keep their positions.

## Content rating questionnaire

Answer honestly; this app should land at **Everyone / PEGI 3**.

- No violence, sexuality, profanity, controlled substances, gambling
- No user-generated content, no user interaction, no location sharing
- **Purchases: yes** — from version 1.1 there is a subscription. This answer changed;
  the rating itself does not.

## Other Play Console fields

- **App category** — Education
- **Tags** — Education, Test Prep
- **Contains ads** — No
- **In-app purchases** — **Yes**, from version 1.1. `cornerstone_premium:monthly` at
  INR 29/month and `cornerstone_premium:yearly` at INR 199/year. Play derives the
  displayed price range from the products themselves, so this line never needs editing to
  match — but **the range widens the moment a second region is priced**, which is the open
  decision in [`PRICING.md`](PRICING.md). Read it before creating the products.
- **Target audience** — 18+ (professional certification candidates)
- **Data safety** — see `docs/PRIVACY.md`. **This form must be corrected before the
  subscription products go live**, not before the build ships: publishing a Play product
  needs no new binary, so nothing else will ever force it to be revisited. It changed
  again when optional accounts were added — email address, name and study progress all
  became collected data types, each marked optional.
- **Sign-in details** (formerly "App access") — **Yes, some functionality is restricted.**
  The reviewer route is the `PLAYREVIEW` promotional code; the exact wording to paste is in
  `docs/PRIVACY.md`.
- **Privacy policy URL** — host `docs/PRIVACY.md` at a public URL (GitHub Pages works) and
  paste the link
- **Government app** — No
- **Financial features** — **None.** This is study content about finance, not a financial
  product; do not tick any of the financial-features boxes.

---

## Release notes ("What's new")

**The production track currently carries Expo's placeholder — "First release of this
awesome app."** That string is live on the store listing today, read by anyone who taps
What's new. It was never written; it is what `eas submit` puts there when nothing is
supplied. Replacing it is free and needs no binary.

Play caps this field at **500 characters**, and `npm run promote` reads the block
below — so the text here is the text that ships, and the count here is the count that
is enforced. **The marker it searches for is the sentence directly above the fence**;
keep it version-free, because a "v1.1" in it made the script break on the first release
that was not v1.1.

The current text, at 447:

```
Dark mode. Profile → Appearance offers System, Light or Dark; System follows your phone, so it dims in the evening on its own.

Also new:
• Delete your account, and everything backed up under it, from Profile → Account
• Search topics and segments by name
• Home suggests the three areas worth an hour next, weighted by exam weight
• Smaller text reads more clearly throughout, in both themes
• Animations honour your phone's reduce-motion setting
```

### Superseded: the v1.1 text, at 404

Kept because the reasoning under it still applies to any release that touches the
subscription.

```
Cornerstone Plus: the study segments written since launch, across all 38 topic areas.
Everything that shipped before stays free, permanently — and if you already had the app,
you keep all of it too.

Also new:
• A glossary — 260 CFA and FRM terms, free for everyone
• An optional account, so a reinstall or a new phone no longer starts you over
• Numeric answer options now always read in ascending order
```

Leading with what stays free is deliberate. The one thing an existing user wants to know
when a study app they already paid attention to adds a subscription is whether the thing
they were using is about to be taken away. It is not, and saying so first is worth more
than the feature list underneath.

---

## Custom store listing — CFA and FRM search keywords

Created 2026-09-26 under Grow users → Store presence → Store listings. Reference name
**`CFA and FRM search keywords`** — Play does not let that name be changed afterwards, which
is why it is not the `Copy of Default store listing` the duplicate flow proposes.

It exists because of the title rule above. The app name cannot carry the marks, so a candidate
searching "cfa level 2" lands on "Cornerstone: Exam Study" with nothing confirming they are in
the right place. A search-keyword listing cannot change the title either — but it can change the
two lines underneath it, which is where the confirmation has to happen.

**Targeting** — 18 keywords, no country filter:

```
cfa, cfa prep, cfa exam, cfa level 1, cfa level 2, cfa level 3, cfa study,
cfa practice questions, cfa question bank, cfa mock exam, chartered financial analyst,
frm, frm exam, frm prep, frm part 1, frm part 2, financial risk manager, frm question bank
```

**Rollout 100%**, no end date. Play proposes 50% for a first trial and the percentage
**cannot be decreased once published** — only raised — so 100% is a one-way door, taken
deliberately on 2026-09-26. It costs the head-to-head comparison against the default listing
for these keywords, and buys the thing that comparison would have been for: A/B experiments
require 100%, so `Set up experiment` on the listing is now live. Test copy there, not by
splitting traffic between two listings.

**What differs from the default listing.** Everything else — title, icon, feature graphic, all
eight screenshots — is duplicated from the default and must stay in step with it. Only two
strings are different, both leading with the term the candidate searched for:

Short description (75 chars):

```
CFA® Levels I–III and FRM® Parts I–II: cards, quizzes and spaced repetition
```

Full description: identical to the default, with one line prepended before
"Fifteen honest minutes…":

```
CFA® Level I, Level II and Level III. FRM® Part I and Part II. All of it, offline, in one app.
```

The trademark position is unchanged and deliberate: marks out of the title, marks in the body,
disclaimer at the bottom. The disclaimer paragraph carries over intact — check it is still there
after any edit, because it is the thing that makes the rest nominative fair use.

**AI asset declaration: "Don't label assets."** The screenshots are deterministic renders of the
running app from `npm run store:screenshot` and the feature graphic comes from
`npm run store:graphic`; neither is generative output. Re-answer this honestly if that changes.

**When the default listing changes, this one does not follow.** A custom listing is a full copy,
not an overlay — a new screenshot set or a reworded paragraph in the default leaves this listing
on the old text silently. Re-run the duplicate, or edit both.

**Submitted for review 2026-09-26, and live the same day.** One change went to Google:
"English (United Kingdom) – en-GB — add language". The rollout percentage is not part of that
submission — Play applies it to the listing directly, which is why the queue dropped from two
changes to one after it was set to 100%. Play quotes up to seven days for review; this cleared
in under an hour, so do not plan around the seven-day figure in either direction.

Status now reads **Live**, 18 search keywords, 100%, no end date. Conversion data will appear
under Grow users → Store performance; there is no default-listing comparison to read at 100%,
so judge it against the default listing's own 33.3% rather than against a split.
