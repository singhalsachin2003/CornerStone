-- Cornerstone — Supabase schema.
--
-- Paste this into the SQL editor of a new project. It is written to be run whole
-- and to be safe to run twice, so a half-applied attempt can be re-run rather
-- than unpicked.
--
-- The design is ported from OTC Learn, whose schema solved the same problem for
-- the same owner. What is ported is the *reasoning*, not the tables: Cornerstone
-- studies topic areas rather than products, keys questions by their index in a
-- canonical bank, and has no notes, achievements or practice exams.
--
-- Three decisions shape everything below.
--
-- **The app stays offline-first.** Nothing here is a source of truth for a
-- running app: the device already has every answer in AsyncStorage, and these
-- tables exist so progress survives an uninstall or a new phone. A failed sync
-- must never block anything, which is why no table is required for the app to
-- function. A free-tier project pauses after a week of inactivity, so "the
-- server is unreachable" is the *expected* case, not the exceptional one.
--
-- **One row per thing, not one JSON blob per user.** A blob is last-write-wins
-- across the whole account: study on a tablet, then open a phone that has not
-- synced since yesterday, and the phone's stale blob erases the tablet's
-- session. Per-row lets each kind of state merge on terms that suit it —
-- counters take the greater, study days union, everything else takes the later
-- timestamp. Those rules live in `supabase/sync.md`.
--
-- That matters most for mastery. `useStudyStore.recordSession` moves a score
-- *toward* each session's result at a 0.35 learning rate precisely so one bad
-- sitting cannot undo weeks. A merge resolving the wrong way would do exactly
-- the damage the learning rate exists to prevent.
--
-- **Entitlement is deliberately absent.** There is no table here for the
-- subscription, the grandfathered flag or a promotional grant, and there must
-- not be. Row level security lets a user write their own rows — so a synced
-- `grandfathered` column would be a premium switch every user can flip for
-- themselves with the publishable key that ships in the bundle. Cross-device
-- subscription already works: RevenueCat restores it from the Play account.
-- Grandfathering stays what it says it is, a property of an install.

-- ---------------------------------------------------------------------------
-- Identity and where the candidate is in the syllabus

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Null is the unnamed state and is distinct from an empty string: `setName`
  -- treats blank input as unnamed and shows the guest placeholder.
  display_name text check (display_name is null or length(display_name) <= 40),
  onboarded boolean not null default false,
  -- 'CFA' or 'FRM'. Not an enum: a future exam must not require a migration on
  -- a database the owner applies by hand.
  exam text check (exam is null or length(exam) <= 8),
  -- 'L1'|'L2'|'L3'|'P1'|'P2'.
  level text check (level is null or length(level) <= 4),
  -- The level last studied in each exam, so switching exam restores it. A small
  -- map that only ever moves as a whole, so it is one jsonb rather than a table.
  level_by_exam jsonb not null default '{}'::jsonb,
  -- The Level III pathway, and the topic-list style. Both are preferences.
  pathway text check (pathway is null or length(pathway) <= 24),
  variant text check (variant is null or length(variant) <= 2),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Preferences

create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  spaced_repetition boolean not null default true,
  -- Synced for completeness, but the device is authoritative: the OS can revoke
  -- notification permission at any time, and `syncDailyReminder` reconciles
  -- against the OS on launch. A device that pulls `true` from here still ends up
  -- `false` if permission is gone, which is correct.
  daily_reminder boolean not null default false,
  timed_quizzes boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Progress

create table if not exists public.topic_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- A topic key such as 'cfa-l1-ethics'. Deliberately not a foreign key: the
  -- syllabus ships inside the app, and a server that rejected a key from a newer
  -- release would break sync for anyone who updated early.
  topic_key text not null,
  mastery smallint not null check (mastery between 0 and 100),
  -- Highest snapshot card reached, an index into the topic's canonical deck.
  -- Never revised down by the app, so the merge takes the greater.
  card_progress integer not null default 0 check (card_progress >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_key)
);

-- Two running totals the profile screen shows. One row, because they only ever
-- move together and neither is meaningful without the other.
create table if not exists public.stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Both take the greater on merge, never the sum: each device counts the same
  -- local history, so adding them inflates the figures on every re-sync.
  questions_answered integer not null default 0 check (questions_answered >= 0),
  questions_correct integer not null default 0 check (questions_correct >= 0),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Review queue
--
-- Promotion out of the queue is a deletion in the app, and a deletion cannot be
-- represented by an absent row: a device that has not synced since before the
-- promotion would see its own copy as new and put the question back. `retired_at`
-- is the tombstone that stops that.

create table if not exists public.review_queue (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- `topicKey#qIdx`, exactly as the app keys it.
  item_id text not null,
  topic_key text not null,
  -- Index into the topic's *canonical* bank — free core first, then premium in
  -- merge order. Those indices are pinned by a test in the app repo, because a
  -- reordering would silently repoint every queued review here as well.
  q_idx integer not null check (q_idx >= 0),
  -- Position on the interval ladder. See `src/store/review.ts`.
  step smallint not null default 0 check (step >= 0),
  due_on date not null,
  lapses integer not null default 0 check (lapses >= 0),
  retired_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists review_queue_due_idx
  on public.review_queue (user_id, due_on)
  where retired_at is null;

-- ---------------------------------------------------------------------------
-- Bookmarks
--
-- A bookmark carries a boolean rather than existing or not, for the same reason
-- the review queue carries a tombstone: un-bookmarking has to survive a merge
-- with a device that still thinks the item is saved.

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- 'question' or 'card'. The app keeps two separate maps and the same
  -- `topicKey#index` can legitimately appear in both, so the kind is part of the
  -- key rather than a column.
  kind text not null check (kind in ('question', 'card')),
  item_key text not null,
  bookmarked boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, item_key)
);

-- ---------------------------------------------------------------------------
-- Streak
--
-- The day list is the record; the streak figures are derived from it on the
-- device and are not stored. Cornerstone computes `currentStreak` from
-- `studyDays` on every render and keeps no longest-streak figure, so there is
-- nothing here that recomputation could silently shorten.

create table if not exists public.study_days (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  primary key (user_id, day)
);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Nothing in this app is shared between users, so every table gets the same
-- treatment: you may do anything to your own rows and nothing to anyone else's.
--
-- The `enable` statements are written out one per table rather than looped, even
-- though the policies below are generated. Static analysis — including the
-- Supabase SQL editor's own pre-flight check — cannot see inside
-- `execute format(...)`, so a looped version reads to every tool, and to a
-- reviewer skimming the file, as seven tables created with no RLS at all. Being
-- greppable matters more here than being short: this is the block that stands
-- between a publishable key and everyone's data.

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.topic_progress enable row level security;
alter table public.stats enable row level security;
alter table public.review_queue enable row level security;
alter table public.bookmarks enable row level security;
alter table public.study_days enable row level security;

-- The policies are generated, because seven tables x four verbs is twenty-eight
-- near-identical statements and a hand-written set is where one eventually goes
-- missing. `with check` as well as `using` on the write policies, or a client
-- could update a row of its own into someone else's user_id.

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles',
    'settings',
    'topic_progress',
    'stats',
    'review_queue',
    'bookmarks',
    'study_days'
  ]
  loop
    -- Idempotent by dropping first: Postgres has no `create policy if not
    -- exists`, and this file has to survive being run twice.
    execute format('drop policy if exists own_rows_select on public.%I', t);
    execute format(
      'create policy own_rows_select on public.%I for select using (auth.uid() = user_id)', t);

    execute format('drop policy if exists own_rows_insert on public.%I', t);
    execute format(
      'create policy own_rows_insert on public.%I for insert with check (auth.uid() = user_id)', t);

    execute format('drop policy if exists own_rows_update on public.%I', t);
    execute format(
      'create policy own_rows_update on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);

    execute format('drop policy if exists own_rows_delete on public.%I', t);
    execute format(
      'create policy own_rows_delete on public.%I for delete using (auth.uid() = user_id)', t);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- Account deletion
--
-- Google Play requires an *in-app* path to delete an account and its data for
-- any app that lets people create one. The published page at
-- /CornerStone/DELETE-ACCOUNT.html is the other half of that rule; email alone
-- satisfies neither half on its own.
--
-- Every table above carries `references auth.users (id) on delete cascade`, so
-- removing the auth row removes the lot. That is deliberately the only
-- statement in the function: listing the tables here would mean quietly missing
-- whichever one is added next, and a cascade cannot miss one.
--
-- `security definer` is required because `auth.users` is not writable by the
-- `authenticated` role. The function is written so that privilege cannot be
-- turned against anyone: it takes no arguments, reads its caller from
-- `auth.uid()`, and can therefore only ever delete that caller. `set
-- search_path` is what stops a caller shadowing `auth.users` with their own.
create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'delete_account requires an authenticated caller'
      using errcode = '28000';
  end if;

  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;
