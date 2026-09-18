/** FRM: market, credit, operational and liquidity risk, plus regulation. */
import { GlossaryTerm } from './types';

export const RISK_TERMS: GlossaryTerm[] = [
  {
    key: 'value-at-risk',
    term: 'Value at Risk',
    aka: ['VaR'],
    definition:
      'The loss that will not be exceeded over a stated horizon with a stated confidence — for example, a 1-day 99% VaR of £1m means losses should exceed £1m on about one day in a hundred.',
    note: 'Says nothing about how bad the breach is when it happens, and is not subadditive, so the VaR of a combined book can exceed the sum of its parts. Both failings motivate expected shortfall.',
    topics: ['frm-p1-foundations', 'frm-p2-market', 'cfa-l1-pm'],
  },
  {
    key: 'expected-shortfall',
    term: 'Expected shortfall',
    aka: ['ES', 'conditional VaR', 'CVaR', 'expected tail loss'],
    definition:
      'The average loss in the cases where the VaR threshold is breached — the expected size of a bad day, given that it is a bad day.',
    note: 'Coherent, unlike VaR, and therefore subadditive. Basel’s market risk framework moved from 99% VaR to 97.5% expected shortfall for exactly this reason.',
    topics: ['frm-p2-market', 'frm-p1-foundations'],
  },
  {
    key: 'coherent-risk-measure',
    term: 'Coherent risk measure',
    definition:
      'A risk measure satisfying monotonicity, subadditivity, positive homogeneity and translation invariance.',
    note: 'Subadditivity is the one VaR fails — and it is the property that says diversification should never increase measured risk.',
    topics: ['frm-p1-foundations', 'frm-p2-market'],
  },
  {
    key: 'historical-simulation',
    term: 'Historical simulation',
    definition:
      'Estimating VaR by revaluing the current portfolio using actual historical changes in risk factors.',
    note: 'Assumes no distribution and captures real fat tails, but can only produce losses that have already happened. A quiet lookback window understates risk.',
    topics: ['frm-p2-market'],
  },
  {
    key: 'parametric-var',
    term: 'Parametric VaR',
    aka: ['variance-covariance VaR', 'delta-normal VaR'],
    definition:
      'Estimating VaR from an assumed distribution, usually normal, using the portfolio’s volatility and correlations.',
    note: 'Fast and analytic, but wrong twice over for options books: returns are not normal, and a linear delta approximation ignores gamma.',
    topics: ['frm-p2-market'],
  },
  {
    key: 'backtesting',
    term: 'Backtesting',
    definition:
      'Comparing realised losses with the VaR forecasts that preceded them, to check that breaches occur about as often as the confidence level implies.',
    note: 'Basel’s traffic light approach escalates the capital multiplier as exceptions accumulate. Too few breaches signals an over-conservative model, not a good one.',
    topics: ['frm-p2-market', 'frm-p1-foundations'],
  },
  {
    key: 'stress-testing',
    term: 'Stress testing',
    definition:
      'Revaluing a portfolio under severe but plausible scenarios, rather than under the distribution of ordinary days.',
    note: 'Complements VaR instead of competing with it: VaR describes the usual, stress testing the unusual. Reverse stress testing starts from the failure and asks what would cause it.',
    topics: ['frm-p2-market', 'frm-p2-current', 'frm-p1-foundations'],
  },
  {
    key: 'probability-of-default',
    term: 'Probability of default',
    aka: ['PD'],
    definition:
      'The likelihood that a borrower fails to meet its obligations over a given horizon.',
    note: 'Through-the-cycle PDs are stable; point-in-time PDs move with conditions and make capital procyclical.',
    topics: ['frm-p2-credit'],
  },
  {
    key: 'loss-given-default',
    term: 'Loss given default',
    aka: ['LGD'],
    definition: 'The proportion of exposure lost when a borrower defaults, after recoveries.',
    formula: 'LGD = 1 − recovery rate',
    note: 'Correlated with PD: recoveries are worst in the downturns when defaults cluster, so multiplying independent averages understates loss.',
    topics: ['frm-p2-credit'],
  },
  {
    key: 'exposure-at-default',
    term: 'Exposure at default',
    aka: ['EAD'],
    definition: 'The amount outstanding when default occurs.',
    note: 'Higher than current drawings for revolving facilities: distressed borrowers draw their lines before they fail.',
    topics: ['frm-p2-credit'],
  },
  {
    key: 'expected-loss',
    term: 'Expected loss',
    aka: ['EL'],
    definition: 'The average credit loss anticipated over a horizon.',
    formula: 'EL = PD × LGD × EAD',
    note: 'Covered by provisions and priced into the spread. Capital exists for unexpected loss — the variation around this mean — not for this.',
    topics: ['frm-p2-credit', 'frm-p1-foundations'],
  },
  {
    key: 'unexpected-loss',
    term: 'Unexpected loss',
    aka: ['UL'],
    definition:
      'The volatility of credit losses around the expected level, which economic capital is held to absorb.',
    topics: ['frm-p2-credit'],
  },
  {
    key: 'wrong-way-risk',
    term: 'Wrong-way risk',
    definition:
      'Exposure to a counterparty that rises precisely as that counterparty’s creditworthiness falls.',
    note: 'Buying protection on a bank from that same bank is the canonical example. Right-way risk is the benign opposite.',
    topics: ['frm-p2-credit'],
  },
  {
    key: 'counterparty-credit-risk',
    term: 'Counterparty credit risk',
    definition:
      'The risk that the other side of a derivative defaults before settling, when the contract has positive value to you.',
    note: 'Two-sided and stochastic, unlike a loan: exposure moves with the market, so it must be modelled over time rather than measured once.',
    topics: ['frm-p2-credit', 'frm-p1-markets'],
  },
  {
    key: 'cva',
    term: 'Credit valuation adjustment',
    aka: ['CVA'],
    definition:
      'The reduction in a derivative’s value to reflect the possibility that the counterparty defaults.',
    note: 'DVA is the mirror image for your own default risk, and has the uncomfortable property that your deteriorating credit produces a profit.',
    topics: ['frm-p2-credit'],
  },
  {
    key: 'netting',
    term: 'Netting',
    definition:
      'Offsetting positive and negative exposures with the same counterparty so that only the net amount is at risk.',
    note: 'Only reduces exposure where the netting agreement is legally enforceable in the counterparty’s jurisdiction. That enforceability is the whole point.',
    topics: ['frm-p2-credit', 'frm-p1-markets'],
  },
  {
    key: 'collateral-margin',
    term: 'Collateral',
    definition: 'Assets pledged to secure an exposure, reducing loss if the counterparty defaults.',
    note: 'Converts credit risk into liquidity and operational risk — the obligation to post more collateral at short notice is itself a failure mode.',
    topics: ['frm-p2-credit', 'frm-p2-liquidity'],
  },
  {
    key: 'operational-risk',
    term: 'Operational risk',
    definition:
      'The risk of loss from failed internal processes, people and systems, or from external events. Includes legal risk; excludes strategic and reputational risk.',
    note: 'That exclusion is the Basel definition and is examined directly.',
    topics: ['frm-p2-operational'],
  },
  {
    key: 'rogue-trading',
    term: 'Rogue trading',
    definition:
      'Unauthorised positions concealed by an employee, typically enabled by weak separation between the front and back office.',
    note: 'Barings, Société Générale and UBS all trace to someone who had previously worked in settlement and knew which controls would not catch them.',
    topics: ['frm-p2-operational'],
  },
  {
    key: 'model-risk',
    term: 'Model risk',
    definition:
      'The risk of loss from using a model that is wrong, or right but used outside the conditions it was built for.',
    note: 'Independent validation and clear statements of limitation are the controls. LTCM is the standard case study.',
    topics: ['frm-p2-operational', 'frm-p2-current'],
  },
  {
    key: 'funding-liquidity-risk',
    term: 'Funding liquidity risk',
    definition:
      'The risk of being unable to meet obligations as they fall due without incurring unacceptable losses.',
    note: 'Distinct from market liquidity risk, and the two amplify each other: forced sales move prices, which triggers more margin calls.',
    topics: ['frm-p2-liquidity'],
  },
  {
    key: 'market-liquidity-risk',
    term: 'Market liquidity risk',
    definition:
      'The risk that a position cannot be sold quickly without moving the price against you.',
    note: 'Measured through bid–ask spread, market depth and resilience. Liquidity-adjusted VaR adds the cost of exiting to the price risk.',
    topics: ['frm-p2-liquidity', 'frm-p2-market'],
  },
  {
    key: 'bank-run',
    term: 'Bank run',
    definition:
      'A self-fulfilling withdrawal of funding from an institution, where the rational individual choice to withdraw first makes failure certain collectively.',
    note: 'Modern runs happen through wholesale funding and uninsured deposits, at digital speed. Solvency does not prevent one.',
    topics: ['frm-p2-liquidity', 'frm-p2-current'],
  },
  {
    key: 'basel-accords',
    term: 'Basel Accords',
    definition:
      'The international framework for bank capital and liquidity regulation, issued by the Basel Committee on Banking Supervision.',
    note: 'Basel I set risk-weighted capital, Basel II added three pillars and internal models, Basel III added leverage and liquidity ratios after 2008.',
    topics: ['frm-p2-current', 'frm-p1-foundations'],
  },
  {
    key: 'lcr',
    term: 'Liquidity coverage ratio',
    aka: ['LCR'],
    definition:
      'The requirement that a bank holds enough high-quality liquid assets to survive a thirty-day stress scenario.',
    note: 'The NSFR is its structural companion, requiring stable funding over a one-year horizon.',
    topics: ['frm-p2-liquidity', 'frm-p2-current'],
  },
  {
    key: 'leverage-ratio',
    term: 'Leverage ratio',
    definition:
      'Capital divided by total exposure, without risk weighting — a backstop to the risk-weighted requirement.',
    note: 'Exists because risk weights can be gamed and because a model that says an exposure is riskless has been wrong before.',
    topics: ['frm-p2-current'],
  },
  {
    key: 'economic-capital',
    term: 'Economic capital',
    definition:
      'The capital a firm judges it needs to absorb unexpected losses at a chosen confidence level, computed internally.',
    note: 'Distinct from regulatory capital, which is prescribed. Where the two differ materially, that difference is itself a signal.',
    topics: ['frm-p1-foundations', 'frm-p2-current'],
  },
  {
    key: 'raroc',
    term: 'RAROC',
    aka: ['risk-adjusted return on capital'],
    definition:
      'Risk-adjusted return divided by economic capital, used to compare business lines on a like-for-like basis and to price risk.',
    topics: ['frm-p1-foundations', 'frm-p2-current'],
  },
  {
    key: 'risk-appetite',
    term: 'Risk appetite',
    definition:
      'The amount and type of risk a firm is willing to take in pursuit of its objectives, set by the board and cascaded into limits.',
    note: 'Appetite is the choice; capacity is the maximum survivable. Confusing the two is a governance failure, not a semantic one.',
    topics: ['frm-p1-foundations'],
  },
  {
    key: 'systemic-risk',
    term: 'Systemic risk',
    definition:
      'The risk that the failure of one institution or market propagates through the system as a whole.',
    note: 'Interconnectedness and common exposures drive it. Each firm managing its own risk prudently does not make the system safe — it can synchronise behaviour and make it less so.',
    topics: ['frm-p2-current', 'frm-p1-foundations'],
  },
  {
    key: 'procyclicality',
    term: 'Procyclicality',
    definition:
      'The tendency of risk measures and capital requirements to loosen in booms and tighten in busts, amplifying the cycle.',
    note: 'Countercyclical capital buffers exist to offset it. Mark-to-market accounting and point-in-time PDs both contribute.',
    topics: ['frm-p2-current'],
  },
  {
    key: 'clearing-house',
    term: 'Central counterparty',
    aka: ['CCP', 'clearing house'],
    definition:
      'An entity that interposes itself between the two sides of a trade, becoming buyer to the seller and seller to the buyer.',
    note: 'Concentrates counterparty risk rather than removing it. A CCP is itself systemically important, which is why its default waterfall and margin model matter.',
    topics: ['frm-p1-markets', 'frm-p2-current'],
  },
  {
    key: 'basis-risk',
    term: 'Basis risk',
    definition:
      'The risk that a hedge and the exposure it hedges do not move together, leaving a residual.',
    note: 'Arises from mismatched underlying, maturity or location. A hedge is a swap of price risk for basis risk, not an elimination of risk.',
    topics: ['frm-p1-markets', 'frm-p2-market', 'cfa-l1-deriv'],
  },
];
