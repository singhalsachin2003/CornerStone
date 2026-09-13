/**
 * The areas the other files do not reach: CFA Level II portfolio management,
 * Level III derivatives and risk management, the three Level III pathways, and
 * FRM Part II risk and investment management.
 *
 * These sit together because they overlap heavily — factor investing, risk
 * budgeting and attribution turn up in all of them under slightly different
 * names, and a candidate looking one up does not care which paper it came from.
 */
import { GlossaryTerm } from './types';

export const ADVANCED_TERMS: GlossaryTerm[] = [
  // --- factors and active management -----------------------------------------
  {
    key: 'multifactor-model',
    term: 'Multifactor model',
    definition:
      'A model explaining returns by exposure to several systematic factors rather than to the market alone.',
    note: 'Fama–French adds size and value to the market factor; Carhart adds momentum. Each factor is a claim that a risk is priced, and each is contested.',
    topics: ['cfa-l2-pm', 'frm-p2-investment', 'cfa-l1-pm'],
  },
  {
    key: 'factor-investing',
    term: 'Factor investing',
    aka: ['smart beta'],
    definition:
      'Building portfolios around systematic return drivers — value, size, momentum, quality, low volatility — rather than around individual security selection.',
    note: 'Factor premia are long-horizon and endure long stretches of underperformance. A factor that never hurts is usually a factor that has been fitted.',
    topics: ['cfa-l2-pm', 'frm-p2-investment'],
  },
  {
    key: 'arbitrage-pricing-theory',
    term: 'Arbitrage pricing theory',
    aka: ['APT'],
    definition:
      'A model deriving expected returns from exposures to multiple systematic factors, assuming no arbitrage rather than a single market portfolio.',
    note: 'More general than CAPM but silent about what the factors are. That silence is both its strength and its practical weakness.',
    topics: ['cfa-l2-pm', 'frm-p2-investment'],
  },
  {
    key: 'active-share',
    term: 'Active share',
    definition:
      'The proportion of a portfolio’s holdings that differs from its benchmark, from 0% for an index fund to 100% for no overlap.',
    note: 'Measures how different a portfolio is; tracking error measures how differently it behaves. A high active share with low tracking error means many small off-benchmark bets that cancel.',
    topics: ['cfa-l2-pm', 'cfa-l3-pathway-portfolio'],
  },
  {
    key: 'fundamental-law',
    term: 'Fundamental law of active management',
    definition:
      'Expected active return is a function of skill, the number of independent decisions taken, and how fully those decisions are expressed in the portfolio.',
    formula: 'IR ≈ IC × √Breadth × Transfer coefficient',
    note: 'Breadth must be independent bets. Applying the same macro view to two hundred stocks is one decision, not two hundred.',
    topics: ['cfa-l2-pm', 'cfa-l3-pathway-portfolio'],
  },
  {
    key: 'risk-budgeting',
    term: 'Risk budgeting',
    definition:
      'Allocating a portfolio’s total risk across strategies or managers, rather than allocating its capital.',
    note: 'Two managers with equal capital rarely consume equal risk. Budgeting by capital and reviewing by risk is how concentration arrives unnoticed.',
    topics: ['frm-p2-investment', 'cfa-l3-allocation', 'cfa-l3-pathway-portfolio'],
  },
  {
    key: 'marginal-var',
    term: 'Marginal VaR',
    definition:
      'The change in portfolio VaR from a small increase in one position — the position’s contribution to total risk at the margin.',
    note: 'Component VaR sums to total VaR and is what risk budgeting allocates. Standalone VaR does not sum, and using it overstates the whole.',
    topics: ['frm-p2-investment', 'frm-p2-market'],
  },
  {
    key: 'performance-attribution',
    term: 'Performance attribution',
    definition:
      'Decomposing a portfolio’s return relative to its benchmark into the decisions that produced it — typically allocation, selection and interaction.',
    note: 'Brinson attribution is the standard framework. Returns-based attribution infers exposures from return series; holdings-based uses the actual positions.',
    topics: ['cfa-l3-performance', 'frm-p2-investment'],
  },
  {
    key: 'style-drift',
    term: 'Style drift',
    definition: 'A manager gradually moving away from the strategy the mandate describes.',
    note: 'Often invisible in returns until the market turns, because drifting toward whatever is working flatters performance while it lasts.',
    topics: ['frm-p2-investment', 'cfa-l2-pm'],
  },

  // --- Level III derivatives and risk management ------------------------------
  {
    key: 'covered-call',
    term: 'Covered call',
    definition:
      'Holding the underlying and writing a call against it, collecting the premium in exchange for capping the upside.',
    note: 'Not a hedge. It gives up the right tail to earn income and leaves the downside almost fully intact.',
    topics: ['cfa-l3-derivatives', 'cfa-l1-deriv'],
  },
  {
    key: 'protective-put',
    term: 'Protective put',
    definition:
      'Holding the underlying and buying a put, which sets a floor under the position at the cost of the premium.',
    note: 'Economically insurance. The premium is a certain cost paid to remove an uncertain one, and over time it is a drag.',
    topics: ['cfa-l3-derivatives', 'cfa-l1-deriv'],
  },
  {
    key: 'collar',
    term: 'Collar',
    definition:
      'Holding the underlying, buying a put and writing a call, bounding the outcome between a floor and a cap.',
    note: 'A zero-cost collar chooses strikes so the premiums offset. Nothing is free — the cost is the upside given away.',
    topics: ['cfa-l3-derivatives'],
  },
  {
    key: 'straddle',
    term: 'Straddle',
    definition:
      'Buying a call and a put at the same strike and expiry — a position on the size of a move rather than its direction.',
    note: 'A long straddle needs a move larger than the combined premium. Buying one into an announcement usually means buying already-elevated implied volatility.',
    topics: ['cfa-l3-derivatives', 'cfa-l1-deriv'],
  },
  {
    key: 'currency-hedging',
    term: 'Currency hedging',
    definition:
      'Using forwards, futures or options to reduce a portfolio’s exposure to exchange rate movements on foreign assets.',
    note: 'The hedge ratio is a deliberate choice, not a binary. Hedging cost is driven by the interest rate differential, not by any view on the currency.',
    topics: ['cfa-l3-derivatives', 'cfa-l3-allocation', 'cfa-l2-econ'],
  },
  {
    key: 'overlay',
    term: 'Derivatives overlay',
    definition:
      'Adjusting a portfolio’s exposures with derivatives while leaving the underlying holdings untouched.',
    note: 'Cheaper and faster than trading the physicals, and it keeps the manager’s selection intact. It introduces basis risk and a margin obligation.',
    topics: ['cfa-l3-derivatives', 'cfa-l3-pathway-portfolio'],
  },

  // --- Level III pathway: portfolio management --------------------------------
  {
    key: 'implementation-shortfall',
    term: 'Implementation shortfall',
    definition:
      'The difference between the return on a paper portfolio and the return actually achieved, capturing delay, market impact, commissions and unfilled orders.',
    note: 'The honest measure of execution cost, because it counts the trades that never happened at the price that was wanted.',
    topics: ['cfa-l3-pathway-portfolio', 'cfa-l3-performance'],
  },
  {
    key: 'market-impact',
    term: 'Market impact',
    definition: 'The adverse price move caused by the act of trading itself.',
    note: 'Rises with order size relative to normal volume. Trading more slowly reduces impact and increases the risk of the price moving away meanwhile.',
    topics: ['cfa-l3-pathway-portfolio', 'frm-p2-liquidity'],
  },
  {
    key: 'yield-curve-strategy',
    term: 'Yield curve strategy',
    definition:
      'Positioning a bond portfolio for an expected change in the shape of the curve — bullet, barbell or ladder structures expressing different views.',
    note: 'A barbell outperforms a duration-matched bullet when the curve flattens, and has more convexity. Duration alone cannot express a curve view.',
    topics: ['cfa-l3-pathway-portfolio', 'cfa-l2-fixed'],
  },

  // --- Level III pathway: private markets -------------------------------------
  {
    key: 'general-partner',
    term: 'General partner',
    aka: ['GP'],
    definition:
      'The manager of a private fund, responsible for investment decisions and bearing unlimited liability for the partnership.',
    note: 'Limited partners commit capital and are liable only for their commitment. The split of economics between them is the fund’s central negotiation.',
    topics: ['cfa-l3-pathway-private-markets', 'cfa-l1-alt'],
  },
  {
    key: 'waterfall',
    term: 'Distribution waterfall',
    definition:
      'The agreed order in which a private fund’s proceeds are shared between limited and general partners.',
    note: 'European waterfalls return all capital before any carry is paid; American ones pay deal by deal. The difference is worth a great deal to the GP and is what clawbacks correct.',
    topics: ['cfa-l3-pathway-private-markets', 'cfa-l1-alt'],
  },
  {
    key: 'private-credit',
    term: 'Private credit',
    aka: ['direct lending'],
    definition:
      'Lending to companies outside the public bond and syndicated loan markets, usually at floating rates with bespoke covenants.',
    note: 'Return comes from illiquidity and complexity as much as from credit risk. Marks are infrequent, so reported volatility understates the real thing.',
    topics: ['cfa-l3-pathway-private-markets', 'frm-p2-credit'],
  },
  {
    key: 'special-situations',
    term: 'Special situations',
    definition:
      'Investing around a specific corporate event — restructuring, distress, spin-off or litigation — where the outcome depends more on the event than on the market.',
    topics: ['cfa-l3-pathway-private-markets'],
  },
  {
    key: 'vintage-year',
    term: 'Vintage year',
    definition:
      'The year a private fund makes its first investment, and the basis on which its performance is compared with peers.',
    note: 'Comparing across vintages compares market conditions, not skill. Entry valuations dominate private returns.',
    topics: ['cfa-l3-pathway-private-markets', 'cfa-l1-alt'],
  },

  // --- Level III pathway: private wealth --------------------------------------
  {
    key: 'goals-based-investing',
    term: 'Goals-based investing',
    definition:
      'Structuring wealth into separate portfolios for separate objectives, each with its own horizon and risk tolerance, rather than one portfolio for one risk number.',
    note: 'Mentally sub-optimal by mean-variance standards and behaviourally far more durable, because clients abandon a plan they cannot connect to anything.',
    topics: ['cfa-l3-pathway-private-wealth', 'cfa-l3-construction'],
  },
  {
    key: 'human-capital',
    term: 'Human capital',
    definition:
      'The present value of an individual’s expected future earnings, treated as an asset alongside their financial wealth.',
    note: 'Bond-like for a tenured professional and equity-like for a commission earner. The financial portfolio should lean against it, which is why concentration in an employer’s stock is doubly wrong.',
    topics: ['cfa-l3-pathway-private-wealth', 'cfa-l3-construction'],
  },
  {
    key: 'tax-loss-harvesting',
    term: 'Tax-loss harvesting',
    definition:
      'Realising losses deliberately to offset gains elsewhere, while keeping the portfolio’s economic exposure broadly intact.',
    note: 'Defers tax rather than avoiding it, because the replacement asset carries a lower basis. Wash-sale rules restrict repurchasing the same security.',
    topics: ['cfa-l3-pathway-private-wealth'],
  },
  {
    key: 'asset-location',
    term: 'Asset location',
    definition:
      'Deciding which account type holds which asset, so that heavily taxed returns sit in tax-sheltered accounts.',
    note: 'Distinct from asset allocation, and one of the few reliably free sources of after-tax return.',
    topics: ['cfa-l3-pathway-private-wealth'],
  },
  {
    key: 'wealth-transfer',
    term: 'Wealth transfer',
    definition:
      'Moving assets to the next generation or to charity, structured for tax efficiency and for the family’s intentions.',
    note: 'Lifetime gifting transfers future growth out of the estate. The trade-off is control, and it is usually the real obstacle rather than the tax.',
    topics: ['cfa-l3-pathway-private-wealth'],
  },

  // --- FRM Part II risk and investment management -----------------------------
  {
    key: 'hedge-fund-replication',
    term: 'Hedge fund replication',
    definition:
      'Reproducing hedge fund returns using liquid instruments and factor exposures, rather than by paying for the funds themselves.',
    note: 'Works to the extent returns come from factors rather than skill. The residual is what the fee was supposedly buying.',
    topics: ['frm-p2-investment'],
  },
  {
    key: 'smoothed-returns',
    term: 'Return smoothing',
    definition:
      'Understated volatility caused by infrequent or appraisal-based valuations rather than by genuinely stable prices.',
    note: 'Inflates Sharpe ratios and depresses measured correlation with public markets. Unsmoothing the series usually removes most of the apparent diversification benefit.',
    topics: ['frm-p2-investment', 'frm-p2-liquidity', 'cfa-l1-alt'],
  },
  {
    key: 'liquidity-adjusted-var',
    term: 'Liquidity-adjusted VaR',
    definition:
      'VaR extended to include the cost of closing the position — the bid–ask spread and the market impact of exiting at size.',
    note: 'The gap between VaR and its liquidity-adjusted version widens sharply for concentrated or illiquid books, which is exactly when it matters.',
    topics: ['frm-p2-investment', 'frm-p2-liquidity', 'frm-p2-market'],
  },
];
