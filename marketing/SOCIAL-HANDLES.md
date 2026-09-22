# Social handles — setup sheet

Checked in a live browser on 18 September 2026. Everything below is paste-ready:
handle, display name, bio within that platform's character limit, link, and the
asset filenames to upload.

**Register the handles before any poster circulates.** The QR codes work
regardless, but a poster in the wild carrying a handle you then lose is the one
mistake here you cannot take back.

---

## OTC Learn — `otclearn` everywhere

Eight characters, matches the app name and the package `com.otclearn.app`
exactly, fits every platform's limit, and "OTC" is niche enough that nothing
else competes for it.

| Platform | Handle | Verified |
| --- | --- | --- |
| X | `@otclearn` | free — 404 |
| Instagram | `@otclearn` | free — profile not available |
| YouTube | `@otclearn` | free — 404 |
| GitHub org | `otclearn` | free — 404 |
| LinkedIn page | `linkedin.com/company/otclearn` | not checkable until creation |
| Reddit | `u/otclearn` | blocked, check manually |
| Threads / Bluesky | `@otclearn` | not checked |

Fallbacks in order if one has gone: `otclearnapp`, then `getotclearn`.

**Display name (all platforms):** `OTC Learn`

**Bios — copy whole:**

- **X** (158/160)
  > Over-the-counter derivatives, one product at a time. Swaps, forwards, credit, commodity — plus the collateral and clearing underneath. Free, offline, Android.

- **Instagram** (102/150)
  > OTC derivatives explained properly.
  > 36 products free · worked examples · no ads, no tracking
  > Android ↓

- **Threads / Bluesky** (244/256)
  > Over-the-counter derivatives, one product at a time. Swaps, forwards, options, credit and commodity — plus collateral, clearing, XVA and the ISDA architecture. 36 products free forever, worked examples with real numbers, works offline. Android.

- **LinkedIn tagline** (79/120)
  > OTC derivatives, one product at a time. 36 free, with worked examples. Android.

**Link in bio:** `https://singhalsachin2003.github.io/OTC_Learn/get/`
(commit and push `docs/get/` first — see ACTION-ITEMS.md item 6)

**Assets:** `otclearn-avatar-400.png` · `otclearn-header-x-1500x500.png` ·
`otclearn-banner-linkedin-1128x191.png` ·
`otclearn-banner-youtube-2560x1440.png` · `otclearn-avatar-800-youtube.png` ·
`otclearn-avatar-300-linkedin.png`

---

## Cornerstone — `getcornerstone` everywhere

This one needed work. "Cornerstone" is contested from three directions at once,
and the obvious handles are all gone:

| Candidate | What happened |
| --- | --- |
| `cornerstonestudy` | YouTube: **taken** by a Bible-study channel |
| `cornerstoneexam` | X: **taken** by *Cornerstone Exam Prep*, who sell PRINCE2 practice exams — a direct category collision |
| `cornerstoneexams` | 16 characters; X caps handles at 15, so it cannot be registered there at all. The 404 is not availability |
| `cornerstoneprep` | X: **taken** by a Memphis prep school |
| `cornerstoneapp` | X: **taken** (dormant account since 2013). Also the closest to *Cornerstone OnDemand*, a trademarked learning-software company with its own Play app — the collision most worth avoiding |
| `cornerstonehq` | X: **taken** by Cornerstone Studios |
| `cornerstone15` | X: **taken** by CornerstoneArchitect |

`getcornerstone` is 14 characters, free where it matters, and the `get` prefix
reads as a product rather than a church, a school or an enterprise LMS.

| Platform | Handle | Verified |
| --- | --- | --- |
| X | `@getcornerstone` | free — 404 |
| Instagram | `@getcornerstone` | free — profile not available |
| YouTube | `@getcornerstone` | free — 404 |
| LinkedIn page | `linkedin.com/company/getcornerstone` | not checkable until creation |
| Reddit | `u/getcornerstone` | blocked, check manually |
| Threads / Bluesky | `@getcornerstone` | not checked |
| GitHub | — | `getcornerstone` is **taken** by a home-inspection site. Leave the code under your existing `singhalsachin2003` account; a study app does not need a GitHub org |

**Display name (all platforms):** `Cornerstone — Exam Study`

Marks stay out of the handle *and* the display name. A display name reads as a
title, and your own `STORE_LISTING.md` rule is marks out of the title, marks in
the body. Descriptive use in the bio is nominative fair use and is the only way
candidates find you.

**Bios — copy whole:**

- **X** (128/160)
  > Snapshot cards and five-question sessions for CFA® and FRM® candidates. 260-term glossary, free. Independent study aid. Android.

- **Instagram** (120/150)
  > Fifteen honest minutes beats three distracted hours.
  > CFA® & FRM® study cards + spaced repetition
  > Independent · Android ↓

- **Threads / Bluesky** (255/256)
  > Fifteen honest minutes beats three distracted hours. Snapshot cards and five-question sessions for CFA® and FRM® candidates, with spaced repetition and a 260-term glossary free permanently. Independent study aid, not affiliated with CFA Institute or GARP.

- **LinkedIn tagline** (95/120)
  > Study cards and spaced repetition for CFA® and FRM® candidates. Independent study aid. Android.

**Link in bio:** `https://singhalsachin2003.github.io/CornerStone/get/`

**Assets:** `getcornerstone-avatar-400.png` ·
`getcornerstone-header-x-1500x500.png` ·
`getcornerstone-banner-linkedin-1128x191.png` ·
`getcornerstone-banner-youtube-2560x1440.png` ·
`getcornerstone-avatar-800-youtube.png` ·
`getcornerstone-avatar-300-linkedin.png`

**The disclaimer is not optional.** "Independent study aid, not affiliated with
CFA Institute or GARP" belongs in every Cornerstone bio, every YouTube
description and every email — not just the Play listing. It costs a line and it
is what makes the descriptive use of the marks defensible.

---

## Asset specs, and why each size

| File | Size | Used for |
| --- | --- | --- |
| `*-avatar-400.png` | 400×400 | X, Instagram, Threads, Bluesky, Reddit |
| `*-avatar-800-youtube.png` | 800×800 | YouTube channel picture |
| `*-avatar-300-linkedin.png` | 300×300 | LinkedIn page logo |
| `*-header-x-1500x500.png` | 1500×500 | X header |
| `*-banner-linkedin-1128x191.png` | 1128×191 | LinkedIn page banner |
| `*-banner-youtube-2560x1440.png` | 2560×1440 | YouTube banner |

The avatars are the shipped app icons resized — the mark someone taps on their
home screen and the avatar they see in a feed should be the same one.

The YouTube banner is composed against its **safe area**, the middle 1546×423.
The full 2560×1440 is only ever shown on a TV; phones and desktop crop to that
box, so anything outside it is decoration. Everything readable sits inside.

Regenerate any of these with `python3 marketing/profiles.py` after
`./fetch-fonts.sh`.

---

## Order of setup, per platform

Roughly two minutes each once you have this sheet open.

1. Create the account with your own email and password.
2. Set the handle and display name from the table above.
3. Upload the avatar, then the banner.
4. Paste the bio.
5. Add the link.
6. **Post once immediately** — an empty profile reads as abandoned and some
   platforms suppress reach on accounts with no content. Use the first post
   from the post bank; for OTC Learn the twelve-failures carousel, for
   Cornerstone the glossary post.

## What I could not verify

Reddit blocks automated access entirely, and Bluesky and Telegram return
valid-looking pages for names that do not exist, so their results would have
been meaningless. LinkedIn company vanity URLs cannot be checked before
creation. Confirm those four by hand — a namechecking site does all of them in
one pass.

Everything marked "verified" above was checked by loading the real profile URL
and reading what came back.
