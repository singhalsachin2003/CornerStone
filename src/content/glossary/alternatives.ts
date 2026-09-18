/** Alternative investments: private markets, hedge funds, real assets. */
import { GlossaryTerm } from './types';

export const ALTERNATIVES_TERMS: GlossaryTerm[] = [
  {
    key: 'private-equity',
    term: 'Private equity',
    definition:
      'Equity investment in companies that are not publicly traded, typically through a closed-end fund with a fixed life.',
    topics: ['cfa-l1-alt', 'cfa-l2-alt'],
  },
  {
    key: 'leveraged-buyout',
    term: 'Leveraged buyout',
    aka: ['LBO'],
    definition:
      'Acquiring a company using a large proportion of borrowed money, secured against the target’s own assets and cash flows.',
    note: 'Returns come from deleveraging, operational improvement and multiple expansion. Separating the three is the standard analysis.',
    topics: ['cfa-l1-alt', 'cfa-l2-alt'],
  },
  {
    key: 'venture-capital',
    term: 'Venture capital',
    definition:
      'Equity investment in early-stage companies with high failure rates and highly skewed outcomes.',
    note: 'Returns are driven by a handful of holdings. Median fund performance is a poor guide to what a top-quartile fund does.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'hedge-fund',
    term: 'Hedge fund',
    definition:
      'A privately offered pooled vehicle with broad freedom over strategy, leverage and short selling.',
    note: 'A legal structure and fee model, not a strategy. "Hedge fund" says nothing about what the fund actually does.',
    topics: ['cfa-l1-alt', 'cfa-l2-alt'],
  },
  {
    key: 'two-and-twenty',
    term: 'Two and twenty',
    aka: ['management and incentive fee'],
    definition:
      'The classic alternative fee model: an annual management fee of around 2% of assets plus around 20% of profits.',
    note: 'Compounding fees matter enormously over a fund life. Whether the incentive fee is computed before or after the management fee changes the answer.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'high-water-mark',
    term: 'High-water mark',
    definition:
      'The highest value an investor’s holding has previously reached, above which incentive fees are charged.',
    note: 'Stops the manager charging twice for recovering the same losses. It does not stop them closing the fund and starting again.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'hurdle-rate',
    term: 'Hurdle rate',
    definition: 'The minimum return a fund must deliver before the manager earns an incentive fee.',
    note: 'A hard hurdle charges only on returns above it; a soft hurdle charges on the whole gain once it is cleared.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'carried-interest',
    term: 'Carried interest',
    aka: ['carry'],
    definition: 'The general partner’s share of a private fund’s profits, typically around 20%.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'capital-call',
    term: 'Capital call',
    aka: ['drawdown'],
    definition:
      'The general partner’s demand that limited partners transfer part of their committed capital.',
    note: 'Commitments are not investments. The gap between committed and drawn capital is the origin of the denominator problem and of the J-curve.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'j-curve',
    term: 'J-curve',
    definition:
      'The typical shape of a private fund’s returns: negative early, as fees are paid before value is realised, then rising.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'lock-up',
    term: 'Lock-up period',
    definition: 'The period during which an investor may not redeem from a fund.',
    note: 'Gates and side pockets do a similar job in a crisis, and all three are liquidity risk rather than fine print.',
    topics: ['cfa-l1-alt', 'frm-p2-liquidity'],
  },
  {
    key: 'reit',
    term: 'REIT',
    aka: ['real estate investment trust'],
    definition:
      'A listed vehicle holding income-producing property, generally required to distribute most of its income to keep favourable tax treatment.',
    note: 'Correlates with equities in the short run and with property in the long run — a recurring point in diversification questions.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'cap-rate',
    term: 'Capitalisation rate',
    aka: ['cap rate'],
    definition:
      'Net operating income divided by property value — a property’s unlevered income yield.',
    formula: 'Value = NOI / cap rate',
    note: 'Functions like the inverse of a P/E ratio. A falling cap rate means prices rising faster than income.',
    topics: ['cfa-l1-alt'],
  },
  {
    key: 'commodity-roll-yield',
    term: 'Roll yield',
    definition:
      'The return from rolling a futures position forward as contracts expire, positive in backwardation and negative in contango.',
    topics: ['cfa-l1-alt', 'cfa-l1-deriv'],
  },
  {
    key: 'illiquidity-premium',
    term: 'Illiquidity premium',
    definition:
      'The extra expected return demanded for holding an asset that cannot be sold quickly at a fair price.',
    note: 'Reported private-market volatility is understated because valuations are smoothed and infrequent, which flatters risk-adjusted measures.',
    topics: ['cfa-l1-alt', 'frm-p2-liquidity'],
  },
];
