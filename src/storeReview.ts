import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';

import { storage } from '@/store/persistence';

/**
 * The in-app review prompt.
 *
 * Play's review API tells you nothing: it never reports whether the sheet
 * appeared, and it silently does nothing once a device quota is exhausted. So
 * all this module can promise is that the app asks rarely, and at a moment the
 * reader is likely to feel well disposed — a session they nearly or entirely
 * got right. Never on launch, and never after a session that went badly.
 */

/** Web has no store review API; calling through would throw. */
const supported = Platform.OS === 'ios' || Platform.OS === 'android';

/** Its own key rather than a field on the study store: it is not study data,
 *  and it must survive anything that resets progress. */
const KEY = 'cornerstone.review-prompt.v1';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Ask at most this often. Play's own quota is stricter and unknowable here. */
export const REVIEW_PROMPT_INTERVAL_DAYS = 120;

/** A session worth asking after: everything right, or one away from it. */
export function sessionDeservesPrompt(correct: number, total: number): boolean {
  return total >= 5 && correct >= total - 1;
}

/** Pure, and takes `now`, so the cadence can be tested without waiting. */
export function shouldAskForReview(
  earned: boolean,
  lastPromptedAt: number | null,
  now: number,
): boolean {
  if (!earned) return false;
  if (lastPromptedAt === null) return true;
  // A clock corrected backwards would otherwise leave a stamp in its own
  // future and lock the prompt out for months.
  const elapsed = now - lastPromptedAt;
  return elapsed < 0 || elapsed >= REVIEW_PROMPT_INTERVAL_DAYS * DAY_MS;
}

async function lastPromptedAt(): Promise<number | null> {
  const raw = await storage.getItem(KEY);
  const value = raw === null ? NaN : Number(raw);
  return Number.isFinite(value) ? value : null;
}

/**
 * Asks, if the session earned it and the interval has passed.
 *
 * The stamp is written only when the request actually reached the OS, so a
 * device that cannot show the sheet — an emulator, a sideload — does not spend
 * four months on a prompt nobody ever saw. Swallows its own failures.
 */
export async function maybeAskForReview(
  correct: number,
  total: number,
): Promise<void> {
  if (!supported || !sessionDeservesPrompt(correct, total)) return;
  try {
    if (!shouldAskForReview(true, await lastPromptedAt(), Date.now())) return;
    if (!(await StoreReview.isAvailableAsync())) return;
    if (!(await StoreReview.hasAction())) return;
    await StoreReview.requestReview();
    await storage.setItem(KEY, String(Date.now()));
  } catch {
    // Nothing to do — a store that refuses is not the reader's problem.
  }
}
