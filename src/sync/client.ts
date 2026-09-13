/**
 * The Supabase client, or `null` when this build is not configured for sync.
 *
 * Null is a first-class state, not a failure — the same shape as
 * `src/purchases/config.ts`. Cornerstone shipped with no account and no server,
 * every screen reads zustand, and zustand is hydrated from AsyncStorage. A build
 * with no credentials is a working app, not a broken one, and every caller has
 * to handle `null`, which is what stops sync from becoming load-bearing.
 *
 * The defaults come from `EXPO_PUBLIC_*`, which Babel inlines at build time —
 * they are literals by the time this runs, not lookups. That is why the config is
 * injectable rather than read at the point of use: a test cannot exercise this by
 * mutating `process.env`.
 *
 * The publishable key is meant to ship inside the bundle. It grants only what row
 * level security allows, and every table in `supabase/schema.sql` restricts every
 * row to `auth.uid() = user_id`. The `sb_secret_` key is a server credential and
 * must never appear in a build.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

export interface SyncConfig {
  url?: string;
  publishableKey?: string;
}

/**
 * A key that still carries a placeholder or a secret prefix is treated as no key
 * at all. Shipping `sb_secret_` would hand every installer a server credential;
 * failing closed is the only safe reading of an unexpected value.
 */
function usableKey(key: string | undefined): key is string {
  if (typeof key !== 'string' || key.length === 0) return false;
  return !key.startsWith('sb_secret_');
}

export function createSyncClient({
  url = process.env.EXPO_PUBLIC_SUPABASE_URL,
  publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
}: SyncConfig = {}): SupabaseClient | null {
  if (typeof url !== 'string' || url.length === 0) return null;
  if (!usableKey(publishableKey)) return null;

  return createClient(url, publishableKey, {
    auth: {
      // The session has to outlive the process, or the candidate signs in on
      // every launch — for a study app that is worse than not syncing at all.
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // There is no browser and no redirect to parse a session out of.
      detectSessionInUrl: false,
    },
  });
}

/**
 * The process-wide client.
 *
 * Built once and cached, because `createClient` starts a token-refresh timer and
 * two clients would race each other refreshing the same session. `reset` exists
 * for tests, which need a fresh one per case.
 */
let cached: SupabaseClient | null | undefined;

export function getSyncClient(config?: SyncConfig): SupabaseClient | null {
  if (cached === undefined) cached = createSyncClient(config);
  return cached;
}

export function resetSyncClient(): void {
  cached = undefined;
}

/** Whether this build can sync at all. Screens use it to hide the account UI. */
export function isSyncConfigured(config?: SyncConfig): boolean {
  return getSyncClient(config) !== null;
}
