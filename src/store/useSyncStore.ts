import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getSyncClient, isSyncConfigured } from '@/sync/client';
import { runSync } from '@/sync/engine';
import { currentEmail } from '@/sync/auth';
import { storage } from './persistence';

/**
 * What the account screen shows, in its own store under its own key.
 *
 * Separate from the study store for the same reason the access store is: this is
 * not study data, and `resetProgress` must not touch it. A candidate who resets
 * their progress has not signed out.
 *
 * Only `lastSyncedAt` is persisted. Status and error are about the run that just
 * happened and would be misleading restored from disk a week later.
 */
export interface SyncState {
  hydrated: boolean;
  /** The signed-in address, or null. Mirrors the Supabase session. */
  email: string | null;
  status: 'idle' | 'syncing' | 'ok' | 'error';
  /** Epoch ms of the last successful sync, or null if there has never been one. */
  lastSyncedAt: number | null;
  message: string | null;

  setHydrated: () => void;
  refreshSession: () => Promise<void>;
  sync: () => Promise<void>;
  clearAfterSignOut: () => void;
}

export const SYNC_STORAGE_KEY = 'cornerstone.sync.v1';

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      email: null,
      status: 'idle',
      lastSyncedAt: null,
      message: null,

      setHydrated: () => set({ hydrated: true }),

      refreshSession: async () => {
        set({ email: await currentEmail() });
      },

      sync: async () => {
        if (!isSyncConfigured()) return;
        // Two syncs at once would each pull, merge and push independently, and
        // the second would overwrite the first's push with a snapshot taken
        // before it.
        if (get().status === 'syncing') return;
        set({ status: 'syncing', message: null });

        const outcome = await runSync(getSyncClient());
        if (outcome.kind === 'synced') {
          set({ status: 'ok', lastSyncedAt: outcome.at, message: null });
        } else if (outcome.kind === 'failed') {
          // Deliberately not alarming. A paused free-tier project and a tunnel
          // look identical from here, and neither has lost anything.
          set({ status: 'error', message: 'Could not reach the server. Your progress is safe on this device.' });
        } else {
          set({ status: 'idle', message: null });
        }
      },

      clearAfterSignOut: () =>
        set({ email: null, status: 'idle', lastSyncedAt: null, message: null }),
    }),
    {
      name: SYNC_STORAGE_KEY,
      storage: createJSONStorage(() => storage),
      partialize: ({ lastSyncedAt }) => ({ lastSyncedAt }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          useSyncStore.setState({ hydrated: true });
          return;
        }
        state.setHydrated();
      },
    },
  ),
);
