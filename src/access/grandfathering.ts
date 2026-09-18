/**
 * Who was already here when the paywall arrived.
 *
 * Pure, and separate from the store on purpose: the store reaches the purchases
 * facade, which reaches a native module, and this rule has to be testable without
 * any of that. It is also the rule with the least tolerance for being wrong —
 * getting it wrong takes content away from somebody who already had it.
 */

export interface InstallEvidence {
  onboarded: boolean;
  questionsAnswered: number;
  studyDays: string[];
  mastery: Record<string, number>;
}

/**
 * Does this install show evidence of use before the paywall build?
 *
 * Read from the study store's hydrated state at first run, before the first screen
 * paints. Onboarding completed, any question answered, any study day recorded or
 * any mastery earned all mean the app was in use already — and none can be true on
 * a genuinely fresh install at the moment this runs.
 */
export function isPreExistingInstall(state: InstallEvidence): boolean {
  return (
    state.onboarded ||
    state.questionsAnswered > 0 ||
    state.studyDays.length > 0 ||
    Object.keys(state.mastery).length > 0
  );
}
