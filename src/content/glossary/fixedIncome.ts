/** Fixed income: bond mechanics, the curve, duration and securitisation. */
import { GlossaryTerm } from './types';

export const FIXED_INCOME_TERMS: GlossaryTerm[] = [
  {
    key: 'par-value',
    term: 'Par value',
    aka: ['face value', 'principal'],
    definition:
      'The amount a bond repays at maturity, and the base on which the coupon is calculated.',
    topics: ['cfa-l1-fixed'],
  },
  {
    key: 'coupon-rate',
    term: 'Coupon rate',
    definition: 'The annual interest a bond pays, as a percentage of par.',
    note: 'Fixed for the life of a plain vanilla bond. A floater resets against a reference rate plus a quoted margin.',
    topics: ['cfa-l1-fixed'],
  },
  {
    key: 'yield-to-maturity',
    term: 'Yield to maturity',
    aka: ['YTM', 'redemption yield'],
    definition:
      'The single discount rate that equates a bond’s price to the present value of its cash flows.',
    note: 'Assumes every coupon is reinvested at the YTM and the bond is held to maturity. Both assumptions usually fail, which is why realised return differs from YTM.',
    topics: ['cfa-l1-fixed', 'frm-p1-valuation'],
  },
  {
    key: 'current-yield',
    term: 'Current yield',
    definition:
      'A bond’s annual coupon divided by its current market price — the cash income it throws off this year per unit invested.',
    note: 'Ignores any pull to par, so it overstates return on a premium bond and understates it on a discount bond.',
    topics: ['cfa-l1-fixed'],
  },
  {
    key: 'spot-rate',
    term: 'Spot rate',
    aka: ['zero rate', 'zero-coupon rate'],
    definition:
      'The yield on a single cash flow received at one future date, with no intervening coupons.',
    note: 'Valuing a bond off the spot curve rather than a single YTM is what removes the reinvestment assumption.',
    topics: ['cfa-l1-fixed', 'cfa-l2-fixed', 'frm-p1-valuation'],
  },
  {
    key: 'forward-rate',
    term: 'Forward rate',
    definition:
      'The interest rate agreed today for borrowing or lending over a future period, implied by today’s spot curve.',
    note: 'Implied forwards are break-even rates, not forecasts. A curve that implies rising rates is telling you what must happen for two strategies to tie, not what the market predicts.',
    topics: ['cfa-l1-fixed', 'cfa-l2-fixed', 'frm-p1-valuation'],
  },
  {
    key: 'bootstrapping-curve',
    term: 'Bootstrapping (yield curve)',
    definition:
      'Deriving spot rates sequentially from the prices of coupon bonds, using each solved rate to strip the next.',
    note: 'A different operation from the statistical bootstrap, which resamples data. Same word, unrelated technique.',
    topics: ['cfa-l2-fixed', 'frm-p1-valuation'],
  },
  {
    key: 'duration',
    term: 'Duration',
    definition:
      'The sensitivity of a bond’s price to a change in yield, and equivalently the weighted average time to receiving its cash flows.',
    note: 'Macaulay duration is in years; modified duration is the percentage price change per one percent yield move. Effective duration is the one to use when cash flows are not fixed.',
    topics: ['cfa-l1-fixed', 'cfa-l2-fixed', 'frm-p1-valuation', 'frm-p2-market'],
  },
  {
    key: 'modified-duration',
    term: 'Modified duration',
    definition:
      'The approximate percentage change in a bond’s price for a one percentage point change in yield.',
    formula: 'Modified duration = Macaulay duration / (1 + y/m)',
    note: 'A linear approximation. It always overstates the loss from a rise in yields and understates the gain from a fall, because the true relationship is convex.',
    topics: ['cfa-l1-fixed', 'frm-p1-valuation'],
  },
  {
    key: 'effective-duration',
    term: 'Effective duration',
    definition:
      'Duration measured by repricing the bond under small parallel shifts in the benchmark curve, so that changes in cash flows are captured.',
    note: 'The only valid duration for callable, putable and mortgage-backed bonds, where the cash flows themselves depend on rates.',
    topics: ['cfa-l1-fixed', 'cfa-l2-fixed', 'frm-p2-market'],
  },
  {
    key: 'convexity',
    term: 'Convexity',
    definition:
      'The curvature of the price–yield relationship — how duration itself changes as yields move.',
    note: 'Positive convexity is good for the holder: prices rise more than duration predicts and fall less. Callable bonds and MBS exhibit negative convexity as rates fall.',
    topics: ['cfa-l1-fixed', 'cfa-l2-fixed', 'frm-p1-valuation', 'frm-p2-market'],
  },
  {
    key: 'dv01',
    term: 'DV01',
    aka: ['PV01', 'basis point value', 'BPV'],
    definition:
      'The change in a position’s value for a one basis point change in yield, expressed in currency.',
    note: 'The practitioner’s hedging unit: hedge ratios are DV01 of the exposure divided by DV01 of the hedge. FRM uses it far more than duration.',
    topics: ['frm-p1-valuation', 'frm-p2-market', 'cfa-l2-fixed'],
  },
  {
    key: 'key-rate-duration',
    term: 'Key rate duration',
    aka: ['partial duration'],
    definition:
      'Sensitivity to a change in one segment of the yield curve, holding the other segments fixed.',
    note: 'Needed because real curves twist and steepen. A portfolio can be duration-neutral overall and still lose heavily on a curve reshaping.',
    topics: ['cfa-l2-fixed', 'frm-p2-market'],
  },
  {
    key: 'credit-spread',
    term: 'Credit spread',
    definition:
      'The extra yield a borrower pays over a risk-free benchmark of the same maturity, compensating for default and liquidity risk.',
    note: 'Widening spreads hurt even when the issuer never defaults, and spread duration measures that exposure separately from rate duration.',
    topics: ['cfa-l1-fixed', 'frm-p2-credit'],
  },
  {
    key: 'oas',
    term: 'Option-adjusted spread',
    aka: ['OAS'],
    definition:
      'The spread over the benchmark curve once the value of any embedded option has been stripped out, making bonds with and without options comparable.',
    note: 'Model-dependent: it moves with the volatility assumption. Two desks can compute different OAS on the same bond and both be right.',
    topics: ['cfa-l2-fixed', 'frm-p1-valuation'],
  },
  {
    key: 'callable-bond',
    term: 'Callable bond',
    definition: 'A bond the issuer may redeem early, usually when rates have fallen.',
    formula: 'Value of callable = Value of straight bond − Value of call',
    note: 'The investor is short the option, so a callable bond yields more and its upside is capped near the call price.',
    topics: ['cfa-l1-fixed', 'cfa-l2-fixed'],
  },
  {
    key: 'putable-bond',
    term: 'Putable bond',
    definition:
      'A bond the holder may sell back to the issuer early, usually when rates have risen.',
    formula: 'Value of putable = Value of straight bond + Value of put',
    topics: ['cfa-l1-fixed'],
  },
  {
    key: 'reinvestment-risk',
    term: 'Reinvestment risk',
    definition:
      'The risk that coupons and principal must be reinvested at a lower rate than expected.',
    note: 'Moves opposite to price risk. Setting a horizon equal to Macaulay duration is what makes the two offset — the basis of immunisation.',
    topics: ['cfa-l1-fixed', 'cfa-l3-allocation'],
  },
  {
    key: 'immunisation',
    term: 'Immunisation',
    definition:
      'Structuring a bond portfolio so that price and reinvestment effects cancel, locking in a return over a horizon.',
    note: 'Requires matching duration to the horizon and rebalancing as time passes and yields move. It protects against parallel shifts, not twists.',
    topics: ['cfa-l3-allocation', 'cfa-l2-fixed'],
  },
  {
    key: 'securitisation',
    term: 'Securitisation',
    definition:
      'Pooling loans and issuing securities backed by their cash flows, usually through a bankruptcy-remote special purpose vehicle.',
    topics: ['cfa-l1-fixed', 'frm-p2-credit'],
  },
  {
    key: 'tranche',
    term: 'Tranche',
    definition:
      'One slice of a securitisation with a defined priority of payment, so that losses hit the junior slices before the senior ones.',
    note: 'Subordination is the credit enhancement. Correlation between the underlying loans is what determines whether the senior tranche is really safe.',
    topics: ['cfa-l1-fixed', 'frm-p2-credit'],
  },
  {
    key: 'prepayment-risk',
    term: 'Prepayment risk',
    definition:
      'The risk that borrowers repay mortgage principal early, most often when rates fall and refinancing becomes attractive.',
    note: 'The cause of negative convexity in MBS: exactly when a normal bond would rally, the cash flows come back to be reinvested at the new lower rate.',
    topics: ['cfa-l1-fixed', 'frm-p2-credit'],
  },
];
