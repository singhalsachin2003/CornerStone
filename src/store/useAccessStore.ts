import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { hasPremiumContent } from '@/content';
import { EntitlementSnapshot, configured, fetchEntitlement, restorePurchases } from '@/purchases';
import { storage } from './persistence';

/**
 * Entitlement state, deliberately in its own store under its own storage key.
 *
 * Not a slice of the study store, for one concrete reason: `resetProgress` wipes
 * that store's fields, and a candidate who resets their progress must not lose a
 * subscription or a promotional grant they cannot earn again. Keeping the two in
 * separate stores makes that a structural guarantee rather than a line in
 * `resetProgress` that somebody later forgets to maintain.
 */

export interface AccessState {
  hydrated: boolean;

  /**
   * Whether this install predates the paywall. `null` until determined, and the
   * access rule grants nothing on `null`.
   *
   * Determined exactly once, from the study store's own hydrated state, and never
   * recomputed — otherwise a candidate who resets their progress would stop
   * looking pre-existing and silently lose permanent access.
   */
  grandfathered: boolean | null;

  /**
   * Last known entitlement, persisted on purpose.
   *
   * A subscriber opening the app on a train has no network, so RevenueCat cannot
   * answer and a non-persisted flag would read false and lock the content they
   * paid for. Last-known-good is the right answer offline; the next successful
   * refresh corrects it.
   */
  subscriptionActive: boolean;
  /** Guard 2: whether the offering actually contained something buyable. */
  productAvailable: boolean;
  /** Localised plan rows from the last successful offering fetch. */
  products: EntitlementSnapshot['products'];

  /** Epoch ms when the current promotional grant lapses, or null. */
  promoGrantUntil: number | null;
  /** The campaign, never the code — see `src/content/promoCodes.ts`. */
  promoCampaign: string | null;

  setHydrated: () => void;
  determineGrandfathering: (preExisting: boolean) => void;
  applySnapshot: (snapshot: EntitlementSnapshot) => void;
  grantPromo: (until: number, campaign: string) => void;
  refresh: () => Promise<void>;
  restore: () => Promise<EntitlementSnapshot>;
}

export const ACCESS_STORAGE_KEY = 'cornerstone.access.v1';

export const useAccessStore = create<AccessState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      grandfathered: null,
      subscriptionActive: false,
      productAvailable: false,
      products: [],
      promoGrantUntil: null,
      promoCampaign: null,

      setHydrated: () => set({ hydrated: true }),

      // Set once. A second call is ignored, which is what makes grandfathering
      // permanent rather than a property of the current state of the app.
      determineGrandfathering: (preExisting) =>
        set((s) => (s.grandfathered === null ? { grandfathered: preExisting } : {})),

      applySnapshot: (snapshot) =>
        set({
          subscriptionActive: snapshot.active,
          productAvailable: snapshot.productAvailable,
          products: snapshot.products,
        }),

      grantPromo: (until, campaign) =>
        set((s) =>
          // Guarded here as well as in the pure redeem module: two paths into the
          // same field is two chances to shorten somebody's access by accident.
          s.promoGrantUntil !== null && s.promoGrantUntil >= until
            ? {}
            : { promoGrantUntil: until, promoCampaign: campaign },
        ),

      refresh: async () => {
        // Nothing to ask, and nothing to sell: skip the call entirely rather than
        // waking a native module that this build has no key for.
        if (!configured || !hasPremiumContent()) return;
        get().applySnapshot(await fetchEntitlement());
      },

      restore: async () => {
        const snapshot = await restorePurchases();
        // A failed restore must not clear a known-good entitlement — that would
        // lock out a subscriber whose network dropped mid-tap.
        if (snapshot.productAvailable || snapshot.active) get().applySnapshot(snapshot);
        return snapshot;
      },
    }),
    {
      name: ACCESS_STORAGE_KEY,
      storage: createJSONStorage(() => storage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        // Unreadable persisted JSON must not strand the app: the route tree waits
        // on `hydrated`, so start fresh rather than never starting.
        if (!state) {
          useAccessStore.setState({ hydrated: true });
          return;
        }
        state.setHydrated();
      },
    },
  ),
);
