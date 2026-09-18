/**
 * Folding a store answer into held entitlement state.
 *
 * Pure and separate from the zustand store so it can be tested without a native
 * module — and because the rule it encodes is easy to get wrong in a way no
 * typecheck catches.
 */

export interface HeldEntitlement {
  subscriptionActive: boolean;
  productAvailable: boolean;
  products: {
    id: string;
    priceLabel: string;
    periodLabel: string;
    title: string;
    description: string;
  }[];
}

export interface SnapshotLike extends HeldEntitlement {
  reachable: boolean;
  active: boolean;
}

/**
 * Only an answer overwrites what is held.
 *
 * An unreachable store means "we could not ask", which is not the same as "you
 * have nothing". Writing the second over a known entitlement locks a paying
 * subscriber out of what they bought the moment their train enters a tunnel — and
 * that is exactly what the first version of this did.
 */
export function applyEntitlementSnapshot(
  held: HeldEntitlement,
  snapshot: {
    reachable: boolean;
    active: boolean;
    productAvailable: boolean;
    products: HeldEntitlement['products'];
  },
): HeldEntitlement {
  if (!snapshot.reachable) return held;
  return {
    subscriptionActive: snapshot.active,
    productAvailable: snapshot.productAvailable,
    products: snapshot.products,
  };
}
