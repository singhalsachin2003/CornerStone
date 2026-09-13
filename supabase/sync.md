# Progress sync

How Cornerstone's on-device state maps onto the schema in `supabase/schema.sql`,
and what happens when two devices disagree.

Nothing here changes the app's character. It stays offline-first: every screen
reads zustand, zustand is hydrated from AsyncStorage, and the server is a backup
the app can lose contact with indefinitely without a user noticing. Sync failures
follow the same rule `src/store/persistence.ts` already does — they resolve to
nothing rather than throwing, because a study session must never be blocked by a
network.

That is not a theoretical concern here. **A free-tier Supabase project pauses
after one week of inactivity.** With the install base this app has, a quiet week
is ordinary, so "the server is unreachable" is the expected case rather than the
exceptional one. Sync is a best-effort backup, and the app has to be honest about
that on screen rather than implying a guarantee.

## What is not synced, and why

**Entitlement.** There is no table for the subscription, the grandfathered flag
or a promotional grant, and there must not be. Row level security lets a user
write their own rows, so a synced `grandfathered` column would be a premium
switch every user can flip for themselves using the publishable key that ships
inside the bundle.

Nothing is lost by leaving it out. A subscription already crosses devices:
RevenueCat restores it from the Play account, which is what `restorePurchases`
on the paywall does. Grandfathering stays what its name says — a property of an
install that was in use before the paywall existed.

## Why not one JSON blob per user

It is the obvious first design and it is wrong the moment a second device
exists. A blob is last-write-wins across the whole account, so a phone that has
not synced since yesterday will, on its next write, erase a session done on a
tablet this morning. Per-row storage lets each kind of state merge on terms that
actually fit it.

That matters most for mastery. `recordSession` in `src/store/useStudyStore.ts`
moves a score *toward* each session's result at a 0.35 learning rate precisely
so one bad sitting cannot undo weeks — a merge resolving the wrong way would do
exactly the damage the learning rate exists to prevent.

## Merge rules

| State | Table | Rule when two devices differ |
| --- | --- | --- |
| Display name, exam, level, pathway, list style | `profiles` | Later `updated_at` wins, as a whole row. |
| Settings | `settings` | Later `updated_at` wins, as a whole row. |
| Mastery | `topic_progress` | Later `updated_at` wins. |
| Card progress | `topic_progress` | Takes the greater — the app never revises it down, so a merge must not either. |
| Questions answered, correct | `stats` | Each takes the greater. Summing would double-count on any re-sync. |
| Review queue | `review_queue` | Later `updated_at` wins. A promotion out of the queue sets `retired_at`; an absent row is not a deletion. |
| Bookmarks | `bookmarks` | Later `updated_at` wins on the `bookmarked` flag. |
| Study days | `study_days` | Union. A day studied on either device was studied. |

Two rules carry the weight and are worth stating plainly:

- **Counters take the greater, never the sum.** Both devices count the same local
  history, so adding them together inflates every figure each time a device
  re-uploads. Taking the greater is stable under repeated sync, which is the
  property that matters — sync will be retried far more often than it succeeds
  cleanly.
- **Deletions need a tombstone.** Promoting a review item out of the queue and
  un-bookmarking are both deletions, and neither can be represented by an absent
  row. The device that still holds the row would otherwise treat its copy as
  newer and restore it. Both have an explicit column instead.

## Review queue indices are canonical, and that matters here too

The queue keys items as `topicKey#qIdx`, where `qIdx` indexes the topic's
**canonical** bank — free core first, then premium segments in the order
`src/content/segments/index.ts` merges them. Those offsets are pinned by
`__tests__/segmentOffsets.test.ts`, and the reason is now doubled: reordering
them would silently repoint every queued review *and* every synced row.

A premium item can legitimately arrive on a device with no entitlement — a
subscriber syncing to a second phone before restoring. `buildReviewSession`
already skips those rather than deleting them, so the row survives until access
comes back. No special handling is needed on the server.

## When sync runs

On launch once both stores have hydrated, and on demand from the Account screen.
Not on every write: quiz answers land in bursts, and a request per answer would
be a great deal of traffic to protect a few bytes the next sync carries anyway.

The launch call is fired and not awaited, and nothing that renders waits on it. A
device with no signal, an expired token or a paused free-tier project has to
behave exactly like the app did before any of this existed.

Order within one sync is pull, merge, **save**, push. Saving before the upload is
deliberate: if the push fails the device still holds everything the server had,
where losing the pull because the push failed would make a flaky network cost the
user data. What is pushed is the merged snapshot rather than what the device
started with, so a single round trip converges both sides.

## What has to exist locally before any of this can be written

**`updatedAt` is not tracked locally.** Cornerstone's stored state has no
timestamps at all: `mastery` is a bare number per topic, `reviewQueue` items
carry `dueOn` but no edit time, and settings carry nothing. Every merge rule in
the table above that says "later wins" needs one.

That is a storage migration, and what a record written *before* it gets matters,
because it decides which device wins the first disagreement. Stamping every
legacy record with the migration's own clock would make them all look equally
recent and would order two devices by which happened to open the app first.
Instead each falls back to something it already knows:

- topic progress → the latest `studyDays` entry, or 0 if the app has never been
  used,
- review items → 0, so a legacy item loses any merge against a stamped one
  (`dueOn` is in the future by construction and says nothing about when the item
  was last touched),
- profile, settings and bookmarks → 0, the same reasoning.

A zero stamp is not a problem: it loses the first merge, the winning value is
then written back with a real stamp, and both devices converge.

## Auth

**Email and password only, to begin with.** Google sign-in on Android needs the
release keystore's SHA-1 registered against an OAuth client, and EAS owns the
keystore rather than this repo — extra setup that cannot be done from here, for a
convenience rather than a capability. It can be added later without touching any
of the above, because the schema keys off `auth.users.id` however the user got
there.

### Email delivery is the blocker, not the auth code

This is unresolved on OTC Learn and will be identical here. Supabase's defaults
combine badly:

- **Confirm email is on.** Nobody can sign in until they click a link.
- **`RATE_LIMIT_EMAIL_SENT` is 2.** Two emails per hour for the whole project,
  from Supabase's built-in sender, which is documented as being for testing
  rather than production.

So the third person to sign up in any given hour never receives a confirmation
and cannot get in, with nothing on either side reporting why. This has to be
settled before accounts are offered to anyone:

- **Custom SMTP** — Resend, SES, Postmark or similar — is needed before launch in
  any case, because password reset is an email flow and hits the same limit
  whatever confirmation is set to.
- **Turning confirmation off** unblocks development and early users immediately,
  at the cost of accepting addresses nobody has proved they own. For an app with
  no social surface and nothing sensitive stored, that is a defensible trade.

**Confirmation was turned off on 2026-09-13**, on the owner's instruction. Verified
from outside the dashboard: a signup now returns a session immediately, so nobody
waits on an email that the built-in sender would rate limit away.

Two consequences worth stating plainly, because neither is visible from the app:

- **Addresses are unverified.** A candidate who mistypes theirs has an account they
  can sign into but can never recover, because password reset goes to the address
  they typed. Custom SMTP plus confirmation is still the right end state.
- **Password reset does not work yet**, for the same reason confirmation was
  blocking: it is an email flow against the built-in sender's 2-per-hour project
  limit. The app does not offer a reset link, which is honest, but it means a
  forgotten password currently means a new account.

## The project

**Created 2026-09-13.** `CornerStone`, free plan, ref `cxigwjqdoxeadkcndili`, region
**Northeast Asia (Seoul)**.

Seoul was the dashboard default rather than a choice, and it is further from a UK
or Indian user than it needs to be. Not worth recreating over, for the same reason
OTC Learn did not recreate its Tokyo project: sync is a background backup and
nothing on screen waits on it, so a hundred milliseconds either way is invisible.

Verified from outside the dashboard on the day it was applied:

- All seven tables exist, RLS enabled on each, four policies each.
- **Every table refuses an unauthenticated insert with `42501`**, "new row violates
  row-level security policy". That is the check that matters — the publishable key
  ships inside the app bundle, so anyone who installs the app has it. A `select`
  returning `[]` proves nothing on an empty database; a refused write proves the
  policy is live.

`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in
the **production** EAS environment only. Preview and development are deliberately
left unset, so an internal test build does not write test accounts and test
progress into the same database real users share.

Applying the schema through the SQL editor raises "Potential issue detected — this
query includes destructive operations". That is the `drop policy if exists` line
before each `create policy`, which is how the file stays safe to run twice; every
dropped policy is recreated in the same statement block and no data is touched.

### Notes for the next project

- The free plan allows **2 active projects** and this fills the allowance — OTC
  Learn holds the other.
- 500 MB database and 5 GB egress are irrelevant at this scale: a user's entire
  synced state is a few kilobytes.
- The URL and the **publishable** key are what the app needs. The publishable key
  is meant to ship in the bundle; it grants only what row level security allows.
  The `sb_secret_` key is a server credential and must never reach a build —
  `src/sync/client.ts` refuses one outright.
- Both are inlined by Babel at build time rather than read at runtime, so the
  client takes its configuration as an argument with the env values only as
  defaults, or it cannot be tested.

### The original notes, for reference

- The free plan allows **2 active projects** and OTC Learn already occupies one,
  so Cornerstone takes the second and fills the allowance.
- 500 MB database and 5 GB egress are irrelevant at this scale — a user's entire
  synced state is a few kilobytes.
- The URL and the **publishable** key go in `EXPO_PUBLIC_SUPABASE_URL` and
  `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The publishable key is meant to ship in
  the bundle; it grants only what row level security allows. The `sb_secret_` key
  is a server credential and must never reach a build.
- Both are inlined by Babel at build time rather than read at runtime, so the
  client must take its configuration as an argument with the env values only as
  defaults, or it cannot be tested.

**Verify the schema from outside the dashboard once applied**, because a schema
believed to be applied is not the same as one that is. The check that matters is
that every table *refuses* an unauthenticated insert with `42501`, "new row
violates row-level security policy". A `select` returning `[]` proves nothing on
an empty database; a refused write proves the policy is live.
