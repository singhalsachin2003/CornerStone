/** Economics: micro, macro, monetary policy and currencies. */
import { GlossaryTerm } from './types';

export const ECONOMICS_TERMS: GlossaryTerm[] = [
  {
    key: 'elasticity',
    term: 'Price elasticity of demand',
    aka: ['elasticity'],
    definition: 'The percentage change in quantity demanded for a one percent change in price.',
    note: 'Demand is elastic when the magnitude exceeds one. Revenue rises with a price cut only where demand is elastic — the standard exam application.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'gdp',
    term: 'Gross domestic product',
    aka: ['GDP'],
    definition:
      'The market value of all final goods and services produced within a country in a period.',
    note: 'Final goods only. Counting intermediate output as well is double-counting, which is exactly what the value-added method exists to avoid.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'real-vs-nominal',
    term: 'Real versus nominal',
    definition:
      'A nominal figure is measured in current prices; a real figure has been adjusted for inflation and so measures actual volume or purchasing power.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'inflation',
    term: 'Inflation',
    definition:
      'A sustained rise in the general price level, reducing the purchasing power of money.',
    note: 'Distinguish demand-pull from cost-push: the policy response differs, and a central bank tightening into a supply shock is a recognised error.',
    topics: ['cfa-l1-econ', 'frm-p1-foundations'],
  },
  {
    key: 'core-inflation',
    term: 'Core inflation',
    definition:
      'Inflation excluding food and energy prices, which are volatile and often driven by supply rather than demand.',
    note: 'Central banks watch core for the signal and headline for the mandate.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'monetary-policy',
    term: 'Monetary policy',
    definition:
      'A central bank’s management of money supply and interest rates to pursue price stability and, in some mandates, employment.',
    note: 'Works with long and variable lags, which is why policy is set on forecasts rather than on today’s data.',
    topics: ['cfa-l1-econ', 'frm-p1-foundations'],
  },
  {
    key: 'fiscal-policy',
    term: 'Fiscal policy',
    definition: 'Government use of spending and taxation to influence aggregate demand.',
    note: 'Faster to take effect than monetary policy once enacted, but slower to enact. That asymmetry is the usual discussion point.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'neutral-rate',
    term: 'Neutral rate',
    aka: ['natural rate of interest', 'r-star'],
    definition:
      'The real policy rate that neither stimulates nor restrains the economy when output is at potential.',
    note: 'Unobservable and estimated. Most arguments about whether policy is tight are really arguments about where neutral sits.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'yield-curve-econ',
    term: 'Yield curve',
    definition: 'The relationship between yield and maturity for bonds of the same credit quality.',
    note: 'Inversion — short rates above long — has preceded most recent recessions and is treated as a leading indicator rather than a cause.',
    topics: ['cfa-l1-econ', 'cfa-l1-fixed', 'frm-p1-valuation'],
  },
  {
    key: 'purchasing-power-parity',
    term: 'Purchasing power parity',
    aka: ['PPP'],
    definition:
      'The proposition that exchange rates adjust so that identical goods cost the same across countries.',
    note: 'A long-run anchor, badly violated in the short run. Relative PPP — that the exchange rate moves with the inflation differential — is the testable version.',
    topics: ['cfa-l1-econ', 'cfa-l2-econ'],
  },
  {
    key: 'interest-rate-parity',
    term: 'Interest rate parity',
    aka: ['covered interest rate parity', 'IRP'],
    definition:
      'The condition that the forward exchange rate differs from the spot rate by exactly the interest rate differential, so hedged returns are equal across currencies.',
    note: 'Covered parity is an arbitrage relationship and holds tightly. Uncovered parity is an expectation and does not — that gap is what the carry trade harvests.',
    topics: ['cfa-l1-econ', 'cfa-l2-econ', 'frm-p1-valuation'],
  },
  {
    key: 'carry-trade',
    term: 'Carry trade',
    definition:
      'Borrowing in a low interest rate currency to invest in a high interest rate one, profiting if the exchange rate does not move against you.',
    note: 'Returns are negatively skewed: long stretches of small gains punctuated by sharp unwinds. A textbook case of a strategy whose Sharpe ratio flatters it.',
    topics: ['cfa-l2-econ', 'frm-p2-market'],
  },
  {
    key: 'business-cycle',
    term: 'Business cycle',
    definition:
      'The recurring pattern of expansion, peak, contraction and trough in economic activity.',
    note: 'Sector rotation questions follow directly from cycle position — defensives late, cyclicals early.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'output-gap',
    term: 'Output gap',
    definition: 'The difference between actual and potential output, as a percentage of potential.',
    note: 'A positive gap signals inflationary pressure. Potential output is estimated, so the gap is revised heavily after the fact.',
    topics: ['cfa-l1-econ'],
  },
  {
    key: 'moral-hazard',
    term: 'Moral hazard',
    definition: 'The incentive to take more risk once someone else bears the consequences.',
    note: 'Central to both economics and risk management: deposit insurance, bailouts and bonus structures are the standard examples.',
    topics: ['cfa-l1-econ', 'frm-p1-foundations', 'frm-p2-current'],
  },
  {
    key: 'adverse-selection',
    term: 'Adverse selection',
    definition:
      'The problem that arises when the party with better information self-selects into a transaction, leaving the counterparty with the worse risks.',
    note: 'Distinct from moral hazard: adverse selection happens before the contract, moral hazard after it.',
    topics: ['cfa-l1-econ', 'frm-p1-foundations', 'frm-p2-credit'],
  },
];
