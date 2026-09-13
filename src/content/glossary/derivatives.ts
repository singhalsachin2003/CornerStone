/** Derivatives: forwards, futures, swaps, options and the Greeks. */
import { GlossaryTerm } from './types';

export const DERIVATIVES_TERMS: GlossaryTerm[] = [
  {
    key: 'derivative',
    term: 'Derivative',
    definition:
      'A contract whose value depends on the price of something else — an asset, a rate, an index or an event.',
    topics: ['cfa-l1-deriv', 'frm-p1-markets'],
  },
  {
    key: 'forward-contract',
    term: 'Forward contract',
    definition:
      'A private agreement to buy or sell an asset at a set price on a future date. Customisable, and settled once at expiry.',
    note: 'Carries counterparty risk that builds over the life of the contract, because nothing is exchanged until the end.',
    topics: ['cfa-l1-deriv', 'frm-p1-markets'],
  },
  {
    key: 'futures-contract',
    term: 'Futures contract',
    definition:
      'A standardised, exchange-traded forward, marked to market daily through a clearing house.',
    note: 'Daily settlement is the whole difference: it strips out counterparty risk and it makes the cash flow timing different from an otherwise identical forward.',
    topics: ['cfa-l1-deriv', 'frm-p1-markets'],
  },
  {
    key: 'margin-futures',
    term: 'Initial and variation margin',
    definition:
      'Initial margin is the good-faith deposit required to open a futures position; variation margin is the daily cash transfer that settles the day’s gain or loss.',
    note: 'Falling below the maintenance margin triggers a call back to the initial level, not to the maintenance level.',
    topics: ['cfa-l1-deriv', 'frm-p1-markets', 'frm-p2-liquidity'],
  },
  {
    key: 'contango-backwardation',
    term: 'Contango and backwardation',
    definition:
      'Contango is a futures price above the spot price; backwardation is a futures price below it.',
    note: 'A long roll in contango loses as the contract converges to spot. This is why commodity index returns diverge so far from spot commodity prices.',
    topics: ['cfa-l1-deriv', 'cfa-l1-alt', 'frm-p1-markets'],
  },
  {
    key: 'swap',
    term: 'Swap',
    definition: 'An agreement to exchange one stream of cash flows for another over time.',
    note: 'A plain vanilla interest rate swap is a series of forward rate agreements, and can also be read as being long one bond and short another.',
    topics: ['cfa-l1-deriv', 'frm-p1-markets'],
  },
  {
    key: 'call-option',
    term: 'Call option',
    definition: 'The right, without the obligation, to buy an asset at the strike price by expiry.',
    note: 'The buyer’s loss is capped at the premium; the naked writer’s loss is unbounded. That asymmetry drives most option exam questions.',
    topics: ['cfa-l1-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'put-option',
    term: 'Put option',
    definition:
      'The right, without the obligation, to sell an asset at the strike price by expiry.',
    topics: ['cfa-l1-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'moneyness',
    term: 'Moneyness',
    definition:
      'Whether exercising an option now would pay: in-the-money, at-the-money or out-of-the-money.',
    note: 'Intrinsic value is what exercise would yield today; time value is everything else in the premium, and it decays to zero at expiry.',
    topics: ['cfa-l1-deriv'],
  },
  {
    key: 'put-call-parity',
    term: 'Put–call parity',
    definition:
      'The no-arbitrage relationship linking a European call, a European put, the underlying and a risk-free bond of the same strike and expiry.',
    formula: 'c + PV(X) = p + S₀',
    note: 'Rearranging it constructs synthetic positions, and a violation is a textbook arbitrage. European options only.',
    topics: ['cfa-l1-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'black-scholes',
    term: 'Black–Scholes–Merton model',
    aka: ['BSM', 'Black-Scholes'],
    definition:
      'A closed-form model for European option prices, assuming lognormal prices, constant volatility and continuous frictionless trading.',
    note: 'Its assumptions are known to be wrong — constant volatility most obviously, which is why the implied volatility smile exists at all.',
    topics: ['cfa-l1-deriv', 'cfa-l2-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'implied-volatility',
    term: 'Implied volatility',
    definition:
      'The volatility that, put into an option pricing model, returns the option’s observed market price.',
    note: 'A price quoted in volatility units rather than a forecast. Plotting it against strike gives the smile or skew.',
    topics: ['cfa-l2-deriv', 'frm-p1-valuation', 'frm-p2-market'],
  },
  {
    key: 'delta',
    term: 'Delta',
    definition: 'The change in an option’s value for a small change in the underlying price.',
    note: 'Ranges 0 to 1 for a call and −1 to 0 for a put. Roughly the hedge ratio, and loosely read as the risk-neutral probability of finishing in the money.',
    topics: ['cfa-l1-deriv', 'frm-p1-valuation', 'frm-p2-market'],
  },
  {
    key: 'gamma',
    term: 'Gamma',
    definition: 'The rate at which delta changes as the underlying moves.',
    note: 'Highest at the money and near expiry. High gamma means a delta hedge goes stale quickly and must be rebalanced more often.',
    topics: ['cfa-l2-deriv', 'frm-p1-valuation', 'frm-p2-market'],
  },
  {
    key: 'vega',
    term: 'Vega',
    definition: 'The change in an option’s value for a one point change in implied volatility.',
    note: 'Always positive for a plain long option, call or put. Long options are long volatility.',
    topics: ['cfa-l2-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'theta',
    term: 'Theta',
    definition: 'The change in an option’s value from the passage of one day, all else equal.',
    note: 'Negative for a long option: time decay works against the buyer and accelerates into expiry.',
    topics: ['cfa-l2-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'rho',
    term: 'Rho',
    definition: 'The sensitivity of an option’s value to a change in the risk-free rate.',
    topics: ['cfa-l2-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'delta-hedging',
    term: 'Delta hedging',
    definition:
      'Offsetting an option position with the underlying so the combined position is insensitive to small price moves.',
    note: 'Only holds locally and only for an instant. Gamma is precisely the reason it has to be rebalanced, and rebalancing is what costs money.',
    topics: ['cfa-l2-deriv', 'frm-p2-market'],
  },
  {
    key: 'credit-default-swap',
    term: 'Credit default swap',
    aka: ['CDS'],
    definition:
      'A contract in which the buyer pays a periodic premium and receives compensation if a specified borrower suffers a credit event.',
    note: 'Buying protection is economically like shorting the credit. The spread is a market-implied view of default probability and recovery together, not of default alone.',
    topics: ['cfa-l1-deriv', 'frm-p2-credit'],
  },
  {
    key: 'notional-principal',
    term: 'Notional principal',
    definition:
      'The reference amount used to compute a derivative’s payments, which is usually never exchanged.',
    note: 'Notional wildly overstates economic exposure. Comparing a derivatives book’s notional with a balance sheet is a category error.',
    topics: ['cfa-l1-deriv', 'frm-p1-markets'],
  },
];
