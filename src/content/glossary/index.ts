/**
 * The glossary, assembled.
 *
 * Free for both exams and every level — see `types.ts` for why. Nothing in this
 * module imports `src/access`, and `check:glossary` fails the build if it ever
 * does, because a reference that can be taken away is not a reference.
 */
import { GlossaryTerm } from './types';

import { ADVANCED_TERMS } from './advanced';
import { ALTERNATIVES_TERMS } from './alternatives';
import { CORPORATE_TERMS } from './corporate';
import { DERIVATIVES_TERMS } from './derivatives';
import { ECONOMICS_TERMS } from './economics';
import { EQUITY_TERMS } from './equity';
import { ETHICS_TERMS } from './ethics';
import { FIXED_INCOME_TERMS } from './fixedIncome';
import { FSA_TERMS } from './financialStatements';
import { PORTFOLIO_TERMS } from './portfolio';
import { QUANT_TERMS } from './quant';
import { RISK_TERMS } from './risk';

export * from './types';
export * from './search';

/**
 * Every term, in a fixed source order. The UI sorts alphabetically for display;
 * keeping the authored order here makes a diff readable when a file changes.
 */
export const GLOSSARY: GlossaryTerm[] = [
  ...ETHICS_TERMS,
  ...QUANT_TERMS,
  ...ECONOMICS_TERMS,
  ...FSA_TERMS,
  ...CORPORATE_TERMS,
  ...EQUITY_TERMS,
  ...FIXED_INCOME_TERMS,
  ...DERIVATIVES_TERMS,
  ...ALTERNATIVES_TERMS,
  ...PORTFOLIO_TERMS,
  ...RISK_TERMS,
  ...ADVANCED_TERMS,
];

export const GLOSSARY_COUNT = GLOSSARY.length;

const BY_KEY = new Map(GLOSSARY.map((t) => [t.key, t]));

export function termByKey(key: string): GlossaryTerm | undefined {
  return BY_KEY.get(key);
}

/** Terms tagged to a topic area, alphabetically — used by the topic screen. */
export function termsForTopic(topicKey: string): GlossaryTerm[] {
  return GLOSSARY.filter((t) => t.topics.includes(topicKey));
}
