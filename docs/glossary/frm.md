---
title: "FRM glossary: risk management terms defined"
description: "126 FRM terms defined in plain English, with formulas and the exam angle."
permalink: /glossary/frm/
---

# FRM® glossary

126 terms, each written to be read cold. The same glossary is free in the app, with search.

### Adverse selection {#adverse-selection}

The problem that arises when the party with better information self-selects into a transaction, leaving the counterparty with the worse risks.

**Exam angle:** Distinct from moral hazard: adverse selection happens before the contract, moral hazard after it.

### Agency problem {#agency-problem}

The conflict that arises when managers act in their own interest rather than that of the owners who employ them.

**Exam angle:** Also runs between shareholders and bondholders — asset substitution after a leveraged deal is the classic case.

### Arbitrage pricing theory {#arbitrage-pricing-theory}

*Also: APT*

A model deriving expected returns from exposures to multiple systematic factors, assuming no arbitrage rather than a single market portfolio.

**Exam angle:** More general than CAPM but silent about what the factors are. That silence is both its strength and its practical weakness.

### Arithmetic mean {#mean}

*Also: average*

The sum of the observations divided by their number.

**Exam angle:** The right estimate of a single future period’s return. For growth already achieved over several periods, the geometric mean is the honest number.

### Backtesting {#backtesting}

Comparing realised losses with the VaR forecasts that preceded them, to check that breaches occur about as often as the confidence level implies.

**Exam angle:** Basel’s traffic light approach escalates the capital multiplier as exceptions accumulate. Too few breaches signals an over-conservative model, not a good one.

### Bank run {#bank-run}

A self-fulfilling withdrawal of funding from an institution, where the rational individual choice to withdraw first makes failure certain collectively.

**Exam angle:** Modern runs happen through wholesale funding and uninsured deposits, at digital speed. Solvency does not prevent one.

### Basel Accords {#basel-accords}

The international framework for bank capital and liquidity regulation, issued by the Basel Committee on Banking Supervision.

**Exam angle:** Basel I set risk-weighted capital, Basel II added three pillars and internal models, Basel III added leverage and liquidity ratios after 2008.

### Basis risk {#basis-risk}

The risk that a hedge and the exposure it hedges do not move together, leaving a residual.

**Exam angle:** Arises from mismatched underlying, maturity or location. A hedge is a swap of price risk for basis risk, not an elimination of risk.

### Beta {#beta}

The sensitivity of an asset’s return to the market’s return — its share of systematic risk.

```
β = Cov(R_i, R_m) / Var(R_m)
```

**Exam angle:** A beta above one amplifies market moves in both directions. Estimated betas are unstable and are often adjusted toward one.

### Black–Scholes–Merton model {#black-scholes}

*Also: BSM, Black-Scholes*

A closed-form model for European option prices, assuming lognormal prices, constant volatility and continuous frictionless trading.

**Exam angle:** Its assumptions are known to be wrong — constant volatility most obviously, which is why the implied volatility smile exists at all.

### Bootstrap {#bootstrapping-statistics}

Resampling the observed data with replacement to estimate the sampling distribution of a statistic, without assuming a parametric form.

**Exam angle:** Distinct from bootstrapping a spot curve in fixed income, which is a different operation entirely under the same word.

### Bootstrapping (yield curve) {#bootstrapping-curve}

Deriving spot rates sequentially from the prices of coupon bonds, using each solved rate to strip the next.

**Exam angle:** A different operation from the statistical bootstrap, which resamples data. Same word, unrelated technique.

### Business risk {#business-risk}

The uncertainty in operating income arising from the nature of the business itself, before any financing decision.

**Exam angle:** Financial risk is what leverage adds on top. Keeping the two separate is the point of the distinction.

### Call option {#call-option}

The right, without the obligation, to buy an asset at the strike price by expiry.

**Exam angle:** The buyer’s loss is capped at the premium; the naked writer’s loss is unbounded. That asymmetry drives most option exam questions.

### Capital asset pricing model {#capm}

*Also: CAPM*

A model stating that an asset’s expected return equals the risk-free rate plus beta times the equity risk premium.

```
E(R) = R_f + β × [E(R_m) − R_f]
```

**Exam angle:** Prices systematic risk only. Its empirical record is poor, which is why multifactor models exist — but it remains the exam’s default.

### Carry trade {#carry-trade}

Borrowing in a low interest rate currency to invest in a high interest rate one, profiting if the exchange rate does not move against you.

**Exam angle:** Returns are negatively skewed: long stretches of small gains punctuated by sharp unwinds. A textbook case of a strategy whose Sharpe ratio flatters it.

### Central counterparty {#clearing-house}

*Also: CCP, clearing house*

An entity that interposes itself between the two sides of a trade, becoming buyer to the seller and seller to the buyer.

**Exam angle:** Concentrates counterparty risk rather than removing it. A CCP is itself systemically important, which is why its default waterfall and margin model matter.

### Central limit theorem {#central-limit-theorem}

*Also: CLT*

For a large enough sample, the distribution of the sample mean approaches normal regardless of the shape of the underlying population.

**Exam angle:** Thirty observations is the conventional threshold. It justifies using normal-based confidence intervals on means — not on individual observations.

### Coefficient of determination {#r-squared}

*Also: R-squared, R2*

The fraction of the dependent variable’s variation explained by the regression.

**Exam angle:** Never falls when a variable is added, however useless that variable is. Adjusted R² penalises extra regressors and is the honest comparison between models of different size.

### Coherent risk measure {#coherent-risk-measure}

A risk measure satisfying monotonicity, subadditivity, positive homogeneity and translation invariance.

**Exam angle:** Subadditivity is the one VaR fails — and it is the property that says diversification should never increase measured risk.

### Collateral {#collateral-margin}

Assets pledged to secure an exposure, reducing loss if the counterparty defaults.

**Exam angle:** Converts credit risk into liquidity and operational risk — the obligation to post more collateral at short notice is itself a failure mode.

### Confidence interval {#confidence-interval}

A range that will contain the true parameter in a stated proportion of repeated samples.

**Exam angle:** It is a statement about the procedure, not about this one interval. "95% probability the mean is in this range" is the classic misreading.

### Contango and backwardation {#contango-backwardation}

Contango is a futures price above the spot price; backwardation is a futures price below it.

**Exam angle:** A long roll in contango loses as the contract converges to spot. This is why commodity index returns diverge so far from spot commodity prices.

### Continuous compounding {#continuous-compounding}

Compounding over infinitely small intervals. The limit of periodic compounding as the number of periods per year goes to infinity.

```
FV = PV × e^(r × t)
```

**Exam angle:** The default convention in derivatives pricing and in most FRM formulas, which is why the same position can look differently priced in two parts of the curriculum.

### Convexity {#convexity}

The curvature of the price–yield relationship — how duration itself changes as yields move.

**Exam angle:** Positive convexity is good for the holder: prices rise more than duration predicts and fall less. Callable bonds and MBS exhibit negative convexity as rates fall.

### Correlation {#correlation}

*Also: correlation coefficient*

Covariance divided by the product of the two standard deviations, giving a unit-free number between −1 and +1.

```
ρ = Cov(X, Y) / (σₓ × σᵧ)
```

**Exam angle:** Measures linear association only. A perfect non-linear relationship can show near-zero correlation, and correlation tends to rise sharply in a crisis — exactly when diversification was being relied on.

### Counterparty credit risk {#counterparty-credit-risk}

The risk that the other side of a derivative defaults before settling, when the contract has positive value to you.

**Exam angle:** Two-sided and stochastic, unlike a loan: exposure moves with the market, so it must be modelled over time rather than measured once.

### Covariance {#covariance}

A measure of how two variables move together. Positive means they tend to move the same way; its size depends on the units of both variables.

**Exam angle:** Unbounded and therefore hard to interpret on its own. Correlation is covariance scaled to [−1, 1], which is why correlation is what gets quoted.

### Credit default swap {#credit-default-swap}

*Also: CDS*

A contract in which the buyer pays a periodic premium and receives compensation if a specified borrower suffers a credit event.

**Exam angle:** Buying protection is economically like shorting the credit. The spread is a market-implied view of default probability and recovery together, not of default alone.

### Credit spread {#credit-spread}

The extra yield a borrower pays over a risk-free benchmark of the same maturity, compensating for default and liquidity risk.

**Exam angle:** Widening spreads hurt even when the issuer never defaults, and spread duration measures that exposure separately from rate duration.

### Credit valuation adjustment {#cva}

*Also: CVA*

The reduction in a derivative’s value to reflect the possibility that the counterparty defaults.

**Exam angle:** DVA is the mirror image for your own default risk, and has the uncomfortable property that your deteriorating credit produces a profit.

### Data mining {#data-mining}

*Also: data snooping*

Searching a dataset repeatedly until a relationship appears, then presenting it as though it had been hypothesised in advance.

**Exam angle:** Test on out-of-sample data. A relationship with no economic rationale that only shows up after many passes is the definition of the problem.

### Delta {#delta}

The change in an option’s value for a small change in the underlying price.

**Exam angle:** Ranges 0 to 1 for a call and −1 to 0 for a put. Roughly the hedge ratio, and loosely read as the risk-neutral probability of finishing in the money.

### Delta hedging {#delta-hedging}

Offsetting an option position with the underlying so the combined position is insensitive to small price moves.

**Exam angle:** Only holds locally and only for an instant. Gamma is precisely the reason it has to be rebalanced, and rebalancing is what costs money.

### Derivative {#derivative}

A contract whose value depends on the price of something else — an asset, a rate, an index or an event.

### Diversification {#diversification}

Combining imperfectly correlated assets so that portfolio risk falls below the weighted average of the individual risks.

**Exam angle:** The benefit comes from correlation below one, not from the number of holdings. Twenty correlated positions diversify less than five uncorrelated ones.

### Duration {#duration}

The sensitivity of a bond’s price to a change in yield, and equivalently the weighted average time to receiving its cash flows.

**Exam angle:** Macaulay duration is in years; modified duration is the percentage price change per one percent yield move. Effective duration is the one to use when cash flows are not fixed.

### DV01 {#dv01}

*Also: PV01, basis point value, BPV*

The change in a position’s value for a one basis point change in yield, expressed in currency.

**Exam angle:** The practitioner’s hedging unit: hedge ratios are DV01 of the exposure divided by DV01 of the hedge. FRM uses it far more than duration.

### Economic capital {#economic-capital}

The capital a firm judges it needs to absorb unexpected losses at a chosen confidence level, computed internally.

**Exam angle:** Distinct from regulatory capital, which is prescribed. Where the two differ materially, that difference is itself a signal.

### Effective duration {#effective-duration}

Duration measured by repricing the bond under small parallel shifts in the benchmark curve, so that changes in cash flows are captured.

**Exam angle:** The only valid duration for callable, putable and mortgage-backed bonds, where the cash flows themselves depend on rates.

### Expected loss {#expected-loss}

*Also: EL*

The average credit loss anticipated over a horizon.

```
EL = PD × LGD × EAD
```

**Exam angle:** Covered by provisions and priced into the spread. Capital exists for unexpected loss — the variation around this mean — not for this.

### Expected shortfall {#expected-shortfall}

*Also: ES, conditional VaR, CVaR, expected tail loss*

The average loss in the cases where the VaR threshold is breached — the expected size of a bad day, given that it is a bad day.

**Exam angle:** Coherent, unlike VaR, and therefore subadditive. Basel’s market risk framework moved from 99% VaR to 97.5% expected shortfall for exactly this reason.

### Exposure at default {#exposure-at-default}

*Also: EAD*

The amount outstanding when default occurs.

**Exam angle:** Higher than current drawings for revolving facilities: distressed borrowers draw their lines before they fail.

### Factor investing {#factor-investing}

*Also: smart beta*

Building portfolios around systematic return drivers — value, size, momentum, quality, low volatility — rather than around individual security selection.

**Exam angle:** Factor premia are long-horizon and endure long stretches of underperformance. A factor that never hurts is usually a factor that has been fitted.

### Forward contract {#forward-contract}

A private agreement to buy or sell an asset at a set price on a future date. Customisable, and settled once at expiry.

**Exam angle:** Carries counterparty risk that builds over the life of the contract, because nothing is exchanged until the end.

### Forward rate {#forward-rate}

The interest rate agreed today for borrowing or lending over a future period, implied by today’s spot curve.

**Exam angle:** Implied forwards are break-even rates, not forecasts. A curve that implies rising rates is telling you what must happen for two strategies to tie, not what the market predicts.

### Funding liquidity risk {#funding-liquidity-risk}

The risk of being unable to meet obligations as they fall due without incurring unacceptable losses.

**Exam angle:** Distinct from market liquidity risk, and the two amplify each other: forced sales move prices, which triggers more margin calls.

### Futures contract {#futures-contract}

A standardised, exchange-traded forward, marked to market daily through a clearing house.

**Exam angle:** Daily settlement is the whole difference: it strips out counterparty risk and it makes the cash flow timing different from an otherwise identical forward.

### Gamma {#gamma}

The rate at which delta changes as the underlying moves.

**Exam angle:** Highest at the money and near expiry. High gamma means a delta hedge goes stale quickly and must be rebalanced more often.

### Geometric mean {#geometric-mean}

The constant rate that would produce the observed compound growth over the whole period.

```
Geometric mean = [(1 + r₁)(1 + r₂)…(1 + rₙ)]^(1/n) − 1
```

**Exam angle:** Always ≤ the arithmetic mean, and strictly less whenever returns vary. The gap widens with volatility — which is why volatile strategies advertise the arithmetic figure.

### Hedge fund replication {#hedge-fund-replication}

Reproducing hedge fund returns using liquid instruments and factor exposures, rather than by paying for the funds themselves.

**Exam angle:** Works to the extent returns come from factors rather than skill. The residual is what the fee was supposedly buying.

### Heteroskedasticity {#heteroskedasticity}

Regression errors whose variance is not constant across observations.

**Exam angle:** Coefficients stay unbiased; the standard errors do not. So t-statistics are wrong and inference is unreliable — the fix is robust standard errors, not a different slope.

### Historical simulation {#historical-simulation}

Estimating VaR by revaluing the current portfolio using actual historical changes in risk factors.

**Exam angle:** Assumes no distribution and captures real fat tails, but can only produce losses that have already happened. A quiet lookback window understates risk.

### Illiquidity premium {#illiquidity-premium}

The extra expected return demanded for holding an asset that cannot be sold quickly at a fair price.

**Exam angle:** Reported private-market volatility is understated because valuations are smoothed and infrequent, which flatters risk-adjusted measures.

### Implied volatility {#implied-volatility}

The volatility that, put into an option pricing model, returns the option’s observed market price.

**Exam angle:** A price quoted in volatility units rather than a forecast. Plotting it against strike gives the smile or skew.

### Inflation {#inflation}

A sustained rise in the general price level, reducing the purchasing power of money.

**Exam angle:** Distinguish demand-pull from cost-push: the policy response differs, and a central bank tightening into a supply shock is a recognised error.

### Initial and variation margin {#margin-futures}

Initial margin is the good-faith deposit required to open a futures position; variation margin is the daily cash transfer that settles the day’s gain or loss.

**Exam angle:** Falling below the maintenance margin triggers a call back to the initial level, not to the maintenance level.

### Interest coverage ratio {#interest-coverage}

EBIT divided by interest expense — how many times earnings cover the interest bill.

**Exam angle:** A primary input to credit ratings and to covenant tests.

### Interest rate parity {#interest-rate-parity}

*Also: covered interest rate parity, IRP*

The condition that the forward exchange rate differs from the spot rate by exactly the interest rate differential, so hedged returns are equal across currencies.

**Exam angle:** Covered parity is an arbitrage relationship and holds tightly. Uncovered parity is an expectation and does not — that gap is what the carry trade harvests.

### Key rate duration {#key-rate-duration}

*Also: partial duration*

Sensitivity to a change in one segment of the yield curve, holding the other segments fixed.

**Exam angle:** Needed because real curves twist and steepen. A portfolio can be duration-neutral overall and still lose heavily on a curve reshaping.

### Kurtosis {#kurtosis}

*Also: excess kurtosis, fat tails*

The weight of a distribution’s tails. Excess kurtosis is kurtosis minus 3, so a normal distribution has excess kurtosis of zero.

**Exam angle:** Leptokurtic — positive excess kurtosis — means extreme outcomes are likelier than normal. Financial returns are reliably leptokurtic, which is why normal-based VaR understates the tail.

### Leverage ratio {#leverage-ratio}

Capital divided by total exposure, without risk weighting — a backstop to the risk-weighted requirement.

**Exam angle:** Exists because risk weights can be gamed and because a model that says an exposure is riskless has been wrong before.

### Linear regression {#linear-regression}

*Also: ordinary least squares, OLS*

Fitting a straight line through data by minimising the sum of squared residuals, to explain a dependent variable by one or more independent variables.

### Liquidity coverage ratio {#lcr}

*Also: LCR*

The requirement that a bank holds enough high-quality liquid assets to survive a thirty-day stress scenario.

**Exam angle:** The NSFR is its structural companion, requiring stable funding over a one-year horizon.

### Liquidity-adjusted VaR {#liquidity-adjusted-var}

VaR extended to include the cost of closing the position — the bid–ask spread and the market impact of exiting at size.

**Exam angle:** The gap between VaR and its liquidity-adjusted version widens sharply for concentrated or illiquid books, which is exactly when it matters.

### Lock-up period {#lock-up}

The period during which an investor may not redeem from a fund.

**Exam angle:** Gates and side pockets do a similar job in a crisis, and all three are liquidity risk rather than fine print.

### Lognormal distribution {#lognormal-distribution}

The distribution of a variable whose natural logarithm is normally distributed. Bounded below by zero and right-skewed.

**Exam angle:** Used for asset prices because a price cannot go negative, while continuously compounded returns can be modelled as normal. That pairing is the basis of Black–Scholes–Merton.

### Loss given default {#loss-given-default}

*Also: LGD*

The proportion of exposure lost when a borrower defaults, after recoveries.

```
LGD = 1 − recovery rate
```

**Exam angle:** Correlated with PD: recoveries are worst in the downturns when defaults cluster, so multiplying independent averages understates loss.

### Margin (equity trading) {#margin-equity}

Borrowing from a broker to buy securities, using the securities as collateral.

**Exam angle:** A margin call comes when equity falls below the maintenance margin. Leverage magnifies both the return and the speed of the call.

### Marginal VaR {#marginal-var}

The change in portfolio VaR from a small increase in one position — the position’s contribution to total risk at the margin.

**Exam angle:** Component VaR sums to total VaR and is what risk budgeting allocates. Standalone VaR does not sum, and using it overstates the whole.

### Market impact {#market-impact}

The adverse price move caused by the act of trading itself.

**Exam angle:** Rises with order size relative to normal volume. Trading more slowly reduces impact and increases the risk of the price moving away meanwhile.

### Market liquidity risk {#market-liquidity-risk}

The risk that a position cannot be sold quickly without moving the price against you.

**Exam angle:** Measured through bid–ask spread, market depth and resilience. Liquidity-adjusted VaR adds the cost of exiting to the price risk.

### Model risk {#model-risk}

The risk of loss from using a model that is wrong, or right but used outside the conditions it was built for.

**Exam angle:** Independent validation and clear statements of limitation are the controls. LTCM is the standard case study.

### Modified duration {#modified-duration}

The approximate percentage change in a bond’s price for a one percentage point change in yield.

```
Modified duration = Macaulay duration / (1 + y/m)
```

**Exam angle:** A linear approximation. It always overstates the loss from a rise in yields and understates the gain from a fall, because the true relationship is convex.

### Monetary policy {#monetary-policy}

A central bank’s management of money supply and interest rates to pursue price stability and, in some mandates, employment.

**Exam angle:** Works with long and variable lags, which is why policy is set on forecasts rather than on today’s data.

### Monte Carlo simulation {#monte-carlo-simulation}

Estimating a distribution of outcomes by repeatedly drawing random inputs from assumed distributions and recomputing the result.

**Exam angle:** The output is only as good as the assumed input distributions and correlations. It generates precision, not accuracy.

### Moral hazard {#moral-hazard}

The incentive to take more risk once someone else bears the consequences.

**Exam angle:** Central to both economics and risk management: deposit insurance, bailouts and bonus structures are the standard examples.

### Multicollinearity {#multicollinearity}

Two or more independent variables in a regression that are highly correlated.

**Exam angle:** The giveaway is a high R² with individually insignificant t-statistics. The regression as a whole explains plenty; it cannot attribute the explanation.

### Multifactor model {#multifactor-model}

A model explaining returns by exposure to several systematic factors rather than to the market alone.

**Exam angle:** Fama–French adds size and value to the market factor; Carhart adds momentum. Each factor is a claim that a risk is priced, and each is contested.

### Netting {#netting}

Offsetting positive and negative exposures with the same counterparty so that only the net amount is at risk.

**Exam angle:** Only reduces exposure where the netting agreement is legally enforceable in the counterparty’s jurisdiction. That enforceability is the whole point.

### Normal distribution {#normal-distribution}

*Also: Gaussian distribution, bell curve*

A symmetric, bell-shaped distribution fully described by its mean and variance.

**Exam angle:** Approximately 68% of outcomes fall within one standard deviation, 95% within two and 99% within 2.58. Those three numbers appear constantly in VaR and confidence-interval questions.

### Notional principal {#notional-principal}

The reference amount used to compute a derivative’s payments, which is usually never exchanged.

**Exam angle:** Notional wildly overstates economic exposure. Comparing a derivatives book’s notional with a balance sheet is a category error.

### Null hypothesis {#null-hypothesis}

*Also: H0*

The statement a test assumes true until the data give sufficient reason to reject it. Always the one containing equality.

**Exam angle:** Failing to reject is not the same as proving. The null survives for want of evidence, not because it was shown to be true.

### Operational risk {#operational-risk}

The risk of loss from failed internal processes, people and systems, or from external events. Includes legal risk; excludes strategic and reputational risk.

**Exam angle:** That exclusion is the Basel definition and is examined directly.

### Option-adjusted spread {#oas}

*Also: OAS*

The spread over the benchmark curve once the value of any embedded option has been stripped out, making bonds with and without options comparable.

**Exam angle:** Model-dependent: it moves with the volatility assumption. Two desks can compute different OAS on the same bond and both be right.

### p-value {#p-value}

The smallest significance level at which the null could be rejected — the probability of a result at least this extreme if the null were true.

**Exam angle:** Not the probability the null is true. Reject when p < α.

### Parametric VaR {#parametric-var}

*Also: variance-covariance VaR, delta-normal VaR*

Estimating VaR from an assumed distribution, usually normal, using the portfolio’s volatility and correlations.

**Exam angle:** Fast and analytic, but wrong twice over for options books: returns are not normal, and a linear delta approximation ignores gamma.

### Performance attribution {#performance-attribution}

Decomposing a portfolio’s return relative to its benchmark into the decisions that produced it — typically allocation, selection and interaction.

**Exam angle:** Brinson attribution is the standard framework. Returns-based attribution infers exposures from return series; holdings-based uses the actual positions.

### Prepayment risk {#prepayment-risk}

The risk that borrowers repay mortgage principal early, most often when rates fall and refinancing becomes attractive.

**Exam angle:** The cause of negative convexity in MBS: exactly when a normal bond would rally, the cash flows come back to be reinvested at the new lower rate.

### Private credit {#private-credit}

*Also: direct lending*

Lending to companies outside the public bond and syndicated loan markets, usually at floating rates with bespoke covenants.

**Exam angle:** Return comes from illiquidity and complexity as much as from credit risk. Marks are infrequent, so reported volatility understates the real thing.

### Probability of default {#probability-of-default}

*Also: PD*

The likelihood that a borrower fails to meet its obligations over a given horizon.

**Exam angle:** Through-the-cycle PDs are stable; point-in-time PDs move with conditions and make capital procyclical.

### Procyclicality {#procyclicality}

The tendency of risk measures and capital requirements to loosen in booms and tighten in busts, amplifying the cycle.

**Exam angle:** Countercyclical capital buffers exist to offset it. Mark-to-market accounting and point-in-time PDs both contribute.

### Put option {#put-option}

The right, without the obligation, to sell an asset at the strike price by expiry.

### Put–call parity {#put-call-parity}

The no-arbitrage relationship linking a European call, a European put, the underlying and a risk-free bond of the same strike and expiry.

```
c + PV(X) = p + S₀
```

**Exam angle:** Rearranging it constructs synthetic positions, and a violation is a textbook arbitrage. European options only.

### RAROC {#raroc}

*Also: risk-adjusted return on capital*

Risk-adjusted return divided by economic capital, used to compare business lines on a like-for-like basis and to price risk.

### Return smoothing {#smoothed-returns}

Understated volatility caused by infrequent or appraisal-based valuations rather than by genuinely stable prices.

**Exam angle:** Inflates Sharpe ratios and depresses measured correlation with public markets. Unsmoothing the series usually removes most of the apparent diversification benefit.

### Rho {#rho}

The sensitivity of an option’s value to a change in the risk-free rate.

### Risk appetite {#risk-appetite}

The amount and type of risk a firm is willing to take in pursuit of its objectives, set by the board and cascaded into limits.

**Exam angle:** Appetite is the choice; capacity is the maximum survivable. Confusing the two is a governance failure, not a semantic one.

### Risk budgeting {#risk-budgeting}

Allocating a portfolio’s total risk across strategies or managers, rather than allocating its capital.

**Exam angle:** Two managers with equal capital rarely consume equal risk. Budgeting by capital and reviewing by risk is how concentration arrives unnoticed.

### Rogue trading {#rogue-trading}

Unauthorised positions concealed by an employee, typically enabled by weak separation between the front and back office.

**Exam angle:** Barings, Société Générale and UBS all trace to someone who had previously worked in settlement and knew which controls would not catch them.

### Securitisation {#securitisation}

Pooling loans and issuing securities backed by their cash flows, usually through a bankruptcy-remote special purpose vehicle.

### Serial correlation {#serial-correlation}

*Also: autocorrelation*

Regression errors correlated with their own past values.

**Exam angle:** Common in time series. Positive serial correlation deflates standard errors, which inflates t-statistics and manufactures significance that is not there.

### Sharpe ratio {#sharpe-ratio}

Excess return over the risk-free rate, per unit of total risk.

```
Sharpe = (R_p − R_f) / σ_p
```

**Exam angle:** Uses total risk, so it judges a portfolio held on its own. It flatters strategies with negatively skewed returns, because standard deviation does not see the tail.

### Short selling {#short-selling}

Selling borrowed securities in the expectation of buying them back cheaper.

**Exam angle:** Loss is theoretically unlimited, and the borrow can be recalled at the worst moment. That asymmetry is what makes a short squeeze possible.

### Skewness {#skewness}

The asymmetry of a distribution. Positive skew has a long right tail; negative skew has a long left tail.

**Exam angle:** Returns on short-volatility and credit strategies are negatively skewed: many small gains, occasional large losses. Mean and standard deviation alone hide that.

### Spot rate {#spot-rate}

*Also: zero rate, zero-coupon rate*

The yield on a single cash flow received at one future date, with no intervening coupons.

**Exam angle:** Valuing a bond off the spot curve rather than a single YTM is what removes the reinvestment assumption.

### Standard deviation {#standard-deviation}

*Also: volatility, vol, sigma*

The square root of variance, in the same units as the data. In finance it is the usual proxy for total risk.

**Exam angle:** Penalises upside and downside equally, which is its main criticism and the motivation for downside measures like semi-deviation and VaR.

### Standard error {#standard-error}

The standard deviation of a sample statistic, usually of the sample mean.

```
SE = σ / √n
```

**Exam angle:** Falls with the square root of sample size, so quartering the standard error needs sixteen times the data.

### Stress testing {#stress-testing}

Revaluing a portfolio under severe but plausible scenarios, rather than under the distribution of ordinary days.

**Exam angle:** Complements VaR instead of competing with it: VaR describes the usual, stress testing the unusual. Reverse stress testing starts from the failure and asks what would cause it.

### Style drift {#style-drift}

A manager gradually moving away from the strategy the mandate describes.

**Exam angle:** Often invisible in returns until the market turns, because drifting toward whatever is working flatters performance while it lasts.

### Survivorship bias {#survivorship-bias}

Distortion caused by studying only the entities that lasted long enough to appear in the sample.

**Exam angle:** Inflates measured fund returns, because closed and merged funds drop out of the index. A staple of both ethics and quant questions.

### Swap {#swap}

An agreement to exchange one stream of cash flows for another over time.

**Exam angle:** A plain vanilla interest rate swap is a series of forward rate agreements, and can also be read as being long one bond and short another.

### Systematic risk {#systematic-risk}

*Also: market risk, non-diversifiable risk*

Risk affecting the whole market, which cannot be diversified away.

**Exam angle:** The only risk investors are compensated for. That claim is the foundation of CAPM.

### Systemic risk {#systemic-risk}

The risk that the failure of one institution or market propagates through the system as a whole.

**Exam angle:** Interconnectedness and common exposures drive it. Each firm managing its own risk prudently does not make the system safe — it can synchronise behaviour and make it less so.

### Theta {#theta}

The change in an option’s value from the passage of one day, all else equal.

**Exam angle:** Negative for a long option: time decay works against the buyer and accelerates into expiry.

### Tranche {#tranche}

One slice of a securitisation with a defined priority of payment, so that losses hit the junior slices before the senior ones.

**Exam angle:** Subordination is the credit enhancement. Correlation between the underlying loans is what determines whether the senior tranche is really safe.

### Type I error {#type-i-error}

*Also: false positive, alpha error*

Rejecting a true null hypothesis. Its probability is the significance level, α.

**Exam angle:** Type I and Type II trade off against each other at a fixed sample size. Only more data improves both.

### Type II error {#type-ii-error}

*Also: false negative, beta error*

Failing to reject a false null hypothesis. One minus its probability is the power of the test.

### Unexpected loss {#unexpected-loss}

*Also: UL*

The volatility of credit losses around the expected level, which economic capital is held to absorb.

### Unsystematic risk {#unsystematic-risk}

*Also: idiosyncratic risk, specific risk*

Risk specific to one company or sector, which diversification can remove.

**Exam angle:** Not rewarded, because it can be eliminated for free. Bearing it is a choice, not a risk premium.

### Value at Risk {#value-at-risk}

*Also: VaR*

The loss that will not be exceeded over a stated horizon with a stated confidence — for example, a 1-day 99% VaR of £1m means losses should exceed £1m on about one day in a hundred.

**Exam angle:** Says nothing about how bad the breach is when it happens, and is not subadditive, so the VaR of a combined book can exceed the sum of its parts. Both failings motivate expected shortfall.

### Variance {#variance}

The average squared deviation from the mean — the standard measure of dispersion.

**Exam angle:** A sample variance divides by n − 1, not n. Dividing by n gives a biased estimate, and the correction is examined directly.

### Vega {#vega}

The change in an option’s value for a one point change in implied volatility.

**Exam angle:** Always positive for a plain long option, call or put. Long options are long volatility.

### Wrong-way risk {#wrong-way-risk}

Exposure to a counterparty that rises precisely as that counterparty’s creditworthiness falls.

**Exam angle:** Buying protection on a bank from that same bank is the canonical example. Right-way risk is the benign opposite.

### Yield curve {#yield-curve-econ}

The relationship between yield and maturity for bonds of the same credit quality.

**Exam angle:** Inversion — short rates above long — has preceded most recent recessions and is treated as a leading indicator rather than a cause.

### Yield to maturity {#yield-to-maturity}

*Also: YTM, redemption yield*

The single discount rate that equates a bond’s price to the present value of its cash flows.

**Exam angle:** Assumes every coupon is reinvested at the YTM and the bond is held to maturity. Both assumptions usually fail, which is why realised return differs from YTM.

[Get Cornerstone on Google Play (Android)](/CornerStone/get/?c=web)

[Follow the daily questions on WhatsApp](https://whatsapp.com/channel/0029Vb9LcPUFXUudEZ6Hm61m)

[FRM topic map](/CornerStone/frm/)

*Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed by or sponsored by GARP.*
