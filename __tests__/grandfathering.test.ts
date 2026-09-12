/**
 * Grandfathering is a promise to people who were already here: they keep the
 * whole app, permanently. It is decided once, from the study store's hydrated
 * state, before the first screen paints — so the only thing worth pinning down is
 * what counts as evidence of a pre-existing install.
 */
import { isPreExistingInstall } from '@/access/grandfathering';

function state(over: Partial<Parameters<typeof isPreExistingInstall>[0]> = {}) {
  return {
    onboarded: false,
    questionsAnswered: 0,
    studyDays: [] as string[],
    mastery: {} as Record<string, number>,
    ...over,
  };
}

describe('what counts as a pre-existing install', () => {
  it('a genuinely fresh install does not qualify', () => {
    expect(isPreExistingInstall(state())).toBe(false);
  });

  it('completed onboarding qualifies', () => {
    expect(isPreExistingInstall(state({ onboarded: true }))).toBe(true);
  });

  it('any answered question qualifies', () => {
    expect(isPreExistingInstall(state({ questionsAnswered: 1 }))).toBe(true);
  });

  // Someone who onboarded, studied, then reinstalled from a backup arrives with
  // study days and no onboarding flag. They were here; they qualify.
  it('a recorded study day qualifies on its own', () => {
    expect(isPreExistingInstall(state({ studyDays: ['2026-08-01'] }))).toBe(true);
  });

  it('earned mastery qualifies on its own', () => {
    expect(isPreExistingInstall(state({ mastery: { 'cfa-l1-ethics': 40 } }))).toBe(true);
  });
});
