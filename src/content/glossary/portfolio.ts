/** Portfolio management: risk, return, allocation and performance. */
import { GlossaryTerm } from './types';

export const PORTFOLIO_TERMS: GlossaryTerm[] = [
  {
    key: 'diversification',
    term: 'Diversification',
    definition:
      'Combining imperfectly correlated assets so that portfolio risk falls below the weighted average of the individual risks.',
    note: 'The benefit comes from correlation below one, not from the number of holdings. Twenty correlated positions diversify less than five uncorrelated ones.',
    topics: ['cfa-l1-pm', 'frm-p1-foundations'],
  },
  {
    key: 'systematic-risk',
    term: 'Systematic risk',
    aka: ['market risk', 'non-diversifiable risk'],
    definition: 'Risk affecting the whole market, which cannot be diversified away.',
    note: 'The only risk investors are compensated for. That claim is the foundation of CAPM.',
    topics: ['cfa-l1-pm', 'frm-p1-foundations'],
  },
  {
    key: 'unsystematic-risk',
    term: 'Unsystematic risk',
    aka: ['idiosyncratic risk', 'specific risk'],
    definition: 'Risk specific to one company or sector, which diversification can remove.',
    note: 'Not rewarded, because it can be eliminated for free. Bearing it is a choice, not a risk premium.',
    topics: ['cfa-l1-pm', 'frm-p1-foundations'],
  },
  {
    key: 'efficient-frontier',
    term: 'Efficient frontier',
    definition:
      'The set of portfolios offering the highest expected return for each level of risk.',
    note: 'Estimated from expected returns, variances and covariances — all of which are noisy. Small input changes produce wildly different "optimal" portfolios.',
    topics: ['cfa-l1-pm', 'cfa-l3-allocation'],
  },
  {
    key: 'capital-allocation-line',
    term: 'Capital allocation line',
    aka: ['CAL'],
    definition:
      'The set of risk–return combinations available by mixing a risky portfolio with the risk-free asset.',
    note: 'Its slope is the Sharpe ratio of the risky portfolio, so the steepest CAL identifies the optimal risky portfolio for everyone.',
    topics: ['cfa-l1-pm'],
  },
  {
    key: 'capm',
    term: 'Capital asset pricing model',
    aka: ['CAPM'],
    definition:
      'A model stating that an asset’s expected return equals the risk-free rate plus beta times the equity risk premium.',
    formula: 'E(R) = R_f + β × [E(R_m) − R_f]',
    note: 'Prices systematic risk only. Its empirical record is poor, which is why multifactor models exist — but it remains the exam’s default.',
    topics: ['cfa-l1-pm', 'cfa-l1-equity', 'frm-p1-foundations'],
  },
  {
    key: 'beta',
    term: 'Beta',
    definition:
      'The sensitivity of an asset’s return to the market’s return — its share of systematic risk.',
    formula: 'β = Cov(R_i, R_m) / Var(R_m)',
    note: 'A beta above one amplifies market moves in both directions. Estimated betas are unstable and are often adjusted toward one.',
    topics: ['cfa-l1-pm', 'cfa-l1-equity', 'frm-p1-foundations'],
  },
  {
    key: 'alpha',
    term: 'Alpha',
    definition: 'Return in excess of what the asset’s risk exposures would predict.',
    note: 'Alpha is defined relative to a model. Change the benchmark or add a factor and alpha frequently disappears, which is the whole argument about active management.',
    topics: ['cfa-l1-pm', 'cfa-l3-performance'],
  },
  {
    key: 'sharpe-ratio',
    term: 'Sharpe ratio',
    definition: 'Excess return over the risk-free rate, per unit of total risk.',
    formula: 'Sharpe = (R_p − R_f) / σ_p',
    note: 'Uses total risk, so it judges a portfolio held on its own. It flatters strategies with negatively skewed returns, because standard deviation does not see the tail.',
    topics: ['cfa-l1-pm', 'cfa-l3-performance', 'frm-p1-foundations'],
  },
  {
    key: 'treynor-ratio',
    term: 'Treynor ratio',
    definition: 'Excess return per unit of systematic risk, using beta in the denominator.',
    note: 'The right measure when the portfolio is one component of a diversified whole, where only its beta matters.',
    topics: ['cfa-l1-pm', 'cfa-l3-performance'],
  },
  {
    key: 'information-ratio',
    term: 'Information ratio',
    definition:
      'Active return divided by tracking error — value added per unit of benchmark-relative risk.',
    note: 'The natural measure for a benchmarked active manager, where the Sharpe ratio would mostly reflect the benchmark.',
    topics: ['cfa-l3-performance', 'cfa-l1-pm'],
  },
  {
    key: 'tracking-error',
    term: 'Tracking error',
    aka: ['active risk'],
    definition: 'The standard deviation of the difference between portfolio and benchmark returns.',
    note: 'A mandate constraint as much as a statistic. A tight tracking error budget limits how much a manager can differ from the index at all.',
    topics: ['cfa-l3-performance', 'cfa-l3-construction'],
  },
  {
    key: 'strategic-asset-allocation',
    term: 'Strategic asset allocation',
    aka: ['SAA', 'policy portfolio'],
    definition:
      'The long-run target mix of asset classes, set from the investor’s objectives and constraints.',
    note: 'Explains the large majority of the variation in a portfolio’s returns over time — far more than security selection.',
    topics: ['cfa-l3-allocation', 'cfa-l1-pm'],
  },
  {
    key: 'tactical-asset-allocation',
    term: 'Tactical asset allocation',
    aka: ['TAA'],
    definition:
      'Short-term deliberate deviation from the strategic allocation to exploit a perceived opportunity.',
    topics: ['cfa-l3-allocation'],
  },
  {
    key: 'rebalancing',
    term: 'Rebalancing',
    definition: 'Trading back to target weights after market moves have shifted them.',
    note: 'Mechanically it sells what rose and buys what fell. Calendar and percentage-band rules trade off transaction costs against drift.',
    topics: ['cfa-l3-allocation', 'cfa-l1-pm'],
  },
  {
    key: 'ips',
    term: 'Investment policy statement',
    aka: ['IPS'],
    definition:
      'The written agreement setting out an investor’s objectives, constraints and the rules the portfolio will be run by.',
    note: 'Objectives are return and risk. Constraints are liquidity, time horizon, tax, legal and regulatory, and unique circumstances — memorise the five.',
    topics: ['cfa-l3-construction', 'cfa-l3-ethics', 'cfa-l1-pm'],
  },
  {
    key: 'risk-tolerance',
    term: 'Risk tolerance',
    definition:
      'How much risk an investor is both able and willing to take. Ability comes from the balance sheet and horizon; willingness comes from temperament.',
    note: 'Where the two conflict, the prudent course is the lower of them, plus client education. That is an examinable judgement.',
    topics: ['cfa-l3-construction', 'cfa-l1-pm'],
  },
  {
    key: 'liability-driven-investing',
    term: 'Liability-driven investing',
    aka: ['LDI'],
    definition:
      'Managing a portfolio against the liabilities it must fund rather than against a market index.',
    note: 'Risk becomes the mismatch between asset and liability sensitivities, so a "safe" cash portfolio can be highly risky against long-dated liabilities.',
    topics: ['cfa-l3-allocation', 'cfa-l3-construction'],
  },
  {
    key: 'behavioural-bias',
    term: 'Behavioural bias',
    definition:
      'A systematic departure from rational decision-making, either cognitive — an error of reasoning that education can correct — or emotional, which usually has to be accommodated.',
    note: 'The cognitive/emotional split determines the adviser’s response, and that distinction is what gets tested rather than the list of bias names.',
    topics: ['cfa-l3-construction', 'cfa-l1-pm'],
  },
];
