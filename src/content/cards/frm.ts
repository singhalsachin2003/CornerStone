import { CardBank } from '../types';

/** FRM Part I and Part II — 2026 curriculum. Four snapshot cards per topic area. */
export const FRM_CARDS: CardBank = {
  // -------------------------------------------------------------------------
  // Part I
  // -------------------------------------------------------------------------
  'frm-p1-foundations': [
    {
      kicker: 'TAXONOMY',
      title: 'Risk is only manageable once it is named',
      body: 'Market, credit, operational, liquidity, business and legal risk each have their own measurement tools. The first job of a risk function is classification, because the wrong taxonomy hides exposures.',
      formula: null,
      exam: 'Known risks, known unknowns and unknown unknowns map to hedging, capital and scenario analysis respectively.',
    },
    {
      kicker: 'GOVERNANCE',
      title: 'Risk appetite links the board to the trading desk',
      body: 'The board sets risk appetite; management translates it into limits; the risk function monitors them. Enterprise risk management fails when this chain has no enforcement at the point of decision.',
      formula: null,
      exam: 'Case studies — Barings, LTCM, Metallgesellschaft, Société Générale — are examined for the governance failure, not the trade.',
    },
    {
      kicker: 'PERFORMANCE',
      title: 'Risk-adjusted measures differ in the risk they charge for',
      body: 'The Sharpe ratio charges total risk, Treynor charges systematic risk, and the information ratio charges tracking error. Jensen\'s alpha is a return in excess of the CAPM prediction.',
      formula: 'Sharpe = (R_p − R_f)/σ_p',
      exam: 'For a fully diversified portfolio, Sharpe and Treynor rank identically. Divergent rankings imply undiversified specific risk.',
    },
    {
      kicker: 'CONDUCT',
      title: 'The GARP Code of Conduct is examinable in its own right',
      body: 'It covers professional integrity, conflicts of interest, confidentiality and the fundamental responsibilities of a risk professional to the profession and the public.',
      formula: null,
      exam: 'A Part I item usually presents a conflict and asks whether disclosure or refusal is required. Disclosure is the usual answer.',
    },
  ],

  'frm-p1-quant': [
    {
      kicker: 'PROBABILITY',
      title: 'Bayes’ rule updates a prior with evidence',
      body: 'The posterior probability is the likelihood times the prior, normalised by the total probability of the evidence. Most FRM applications are default screening and model-signal reliability.',
      formula: 'P(A|B) = P(B|A)·P(A)/P(B)',
      exam: 'Base rates dominate when the event is rare. A test with 95% accuracy on a 1% event still produces mostly false positives.',
    },
    {
      kicker: 'INFERENCE',
      title: 'A hypothesis test compares a statistic with a critical value',
      body: 'Set the null, compute the test statistic, compare with the critical value at your significance level. Type I error is rejecting a true null; type II is failing to reject a false one.',
      formula: 't = (x̄ − μ₀)/(s/√n)',
      exam: 'Lowering the significance level reduces type I error and raises type II. The trade-off is the item, not the arithmetic.',
    },
    {
      kicker: 'VOLATILITY',
      title: 'EWMA and GARCH both weight recent data more heavily',
      body: 'EWMA applies a decay factor λ to past squared returns. GARCH(1,1) adds a long-run variance term with weight γ, which is why GARCH mean-reverts and EWMA does not.',
      formula: 'σ²ₜ = ω + α·r²ₜ₋₁ + β·σ²ₜ₋₁',
      exam: 'EWMA is GARCH(1,1) with ω = 0 and α + β = 1. Persistence is α + β; values near one mean slow mean reversion.',
    },
    {
      kicker: 'TIME SERIES',
      title: 'Non-stationary series produce spurious regressions',
      body: 'Covariance stationarity requires a constant mean, variance and autocovariance. A unit root breaks it; the Dickey–Fuller test detects it, and first differencing usually cures it.',
      formula: 'yₜ = φ·yₜ₋₁ + εₜ, |φ| < 1',
      exam: 'Two independent random walks will show a high R² when regressed against each other. That is the definition of spurious.',
    },
  ],

  'frm-p1-markets': [
    {
      kicker: 'STRUCTURE',
      title: 'Central clearing moves risk, it does not delete it',
      body: 'A CCP novates the trade and becomes counterparty to both sides, backed by initial margin, variation margin and a default fund. The result concentrates risk in the CCP itself.',
      formula: null,
      exam: 'Initial margin covers potential future exposure; variation margin settles current mark-to-market. Do not swap the two.',
    },
    {
      kicker: 'HEDGING',
      title: 'The minimum variance hedge ratio is a regression slope',
      body: 'It is the correlation between spot and futures price changes times the ratio of their standard deviations. A perfect hedge requires ρ = 1 and matching volatility, which almost never happens.',
      formula: 'h* = ρ·(σ_S/σ_F)',
      exam: 'Basis risk is what remains after hedging. Cross-hedging and maturity mismatch are the two sources stems describe.',
    },
    {
      kicker: 'SWAPS',
      title: 'A swap is two bonds, or a strip of forwards',
      body: 'Value the fixed leg as a coupon bond and the floating leg as a note that prices at par on each reset date. The difference is the swap\'s value, which is zero at inception.',
      formula: 'V = B_fixed − B_floating',
      exam: 'Between resets the floating leg is worth par plus the accrued next coupon, discounted. That is the step candidates skip.',
    },
    {
      kicker: 'OPTIONS',
      title: 'Payoff diagrams answer most options questions',
      body: 'Calls give the right to buy, puts the right to sell. Draw the payoff, subtract the premium to get profit, and identify the breakeven before you evaluate any answer choice.',
      formula: 'Breakeven_call = X + premium',
      exam: 'Maximum loss for a long option is the premium. For a short option it is unbounded on a call, and strike less premium on a put.',
    },
  ],

  'frm-p1-valuation': [
    {
      kicker: 'CORE IDEA',
      title: 'VaR is a quantile, not a worst case',
      body: 'Value at Risk is the loss that will not be exceeded over a stated horizon at a stated confidence. A 99%/1-day VaR of $4m means: on one day in a hundred, expect to lose more than $4m.',
      formula: 'VaR = −(μ + z·σ)·V',
      exam: 'The classic trap is calling VaR a maximum loss. It says nothing about the size of the tail beyond the quantile.',
    },
    {
      kicker: 'BEYOND VAR',
      title: 'Expected shortfall averages the tail',
      body: 'ES, or conditional VaR, is the mean loss given that the VaR threshold has been breached. It is sub-additive and therefore coherent, which is why Basel moved market risk capital to ES at 97.5%.',
      formula: 'ES = E[L | L > VaR]',
      exam: 'ES ≥ VaR always. If an answer choice gives ES below VaR at the same confidence, eliminate it immediately.',
    },
    {
      kicker: 'CREDIT',
      title: 'Expected loss has three inputs',
      body: 'Probability of default, loss given default and exposure at default. Multiply them for expected loss; unexpected loss is the volatility around it, and capital exists to cover the unexpected part.',
      formula: 'EL = PD × LGD × EAD',
      exam: 'Provisions cover expected loss; capital covers unexpected loss. Mixing those up is the most common wrong answer.',
    },
    {
      kicker: 'OPTIONS',
      title: 'Greeks decompose an option’s risk',
      body: 'Delta is sensitivity to spot, gamma to delta, vega to volatility, theta to time, rho to rates. A delta-hedged book is still fully exposed to gamma and vega.',
      formula: 'ΔP ≈ δ·ΔS + ½γ·ΔS² + ν·Δσ',
      exam: 'Long gamma benefits from large moves in either direction. If a stem says the hedger rebalances rarely, gamma risk is the answer.',
    },
  ],

  // -------------------------------------------------------------------------
  // Part II
  // -------------------------------------------------------------------------
  'frm-p2-market': [
    {
      kicker: 'PARAMETRIC',
      title: 'Delta-normal VaR scales with the square root of time',
      body: 'Assume returns are normal and you need only mean, volatility and a z-score. Horizon scaling uses √T, which is why a 10-day VaR is roughly 3.16 times the 1-day figure.',
      formula: 'VaR(T) = VaR(1) × √T',
      exam: 'Scaling holds only under i.i.d. returns. If the stem mentions autocorrelation or fat tails, √T understates the risk.',
    },
    {
      kicker: 'VALIDATION',
      title: 'Backtesting counts exceptions',
      body: 'Compare realised losses with the VaR forecast and count breaches. Too many and the model understates risk; the Basel traffic-light zones set green, yellow and red bands on the exception count.',
      formula: 'Expected breaches = (1 − a) × N',
      exam: 'Kupiec tests unconditional coverage. Clustering of breaches is a conditional coverage failure, which Christoffersen\'s test detects.',
    },
    {
      kicker: 'TAILS',
      title: 'Extreme value theory models only the tail',
      body: 'The peaks-over-threshold approach fits a generalised Pareto distribution above a chosen threshold. The shape parameter ξ governs tail fatness — positive ξ means heavier tails than the normal.',
      formula: 'GPD: F(x) = 1 − (1 + ξx/β)^(−1/ξ)',
      exam: 'Threshold choice is the practical trade-off: too high and you have no data, too low and the asymptotic result does not apply.',
    },
    {
      kicker: 'DEPENDENCE',
      title: 'Copulas separate marginals from dependence',
      body: 'A copula joins arbitrary marginal distributions into a joint distribution with a specified dependence structure. The Gaussian copula has zero tail dependence, which is why it failed in 2008.',
      formula: 'C(u₁,…,uₙ) = P(U₁≤u₁,…)',
      exam: 'Student t copulas exhibit tail dependence; Gaussian copulas do not. That single contrast carries most copula items.',
    },
  ],

  'frm-p2-credit': [
    {
      kicker: 'STRUCTURAL',
      title: 'Merton treats equity as a call on the firm’s assets',
      body: 'Shareholders hold a call on the firm\'s assets struck at the face value of debt. Default occurs when asset value falls below that strike at maturity, and distance to default measures how far away that is.',
      formula: 'DD = [ln(V/D) + (μ−½σ²)T] / (σ√T)',
      exam: 'Higher asset volatility raises equity value and raises default probability at the same time. That is the model\'s key insight.',
    },
    {
      kicker: 'PORTFOLIO',
      title: 'Default correlation drives credit portfolio loss',
      body: 'Individual PDs set expected loss, but correlation sets the shape of the tail. Credit VaR is the unexpected loss at a confidence level, and it is highly sensitive to the correlation assumption.',
      formula: 'UL = Credit VaR − EL',
      exam: 'Raising default correlation leaves expected loss unchanged and fattens the tail. Stems test exactly that asymmetry.',
    },
    {
      kicker: 'COUNTERPARTY',
      title: 'CVA is the market price of counterparty default risk',
      body: 'Credit valuation adjustment is the expected loss from a counterparty defaulting on a derivative, computed over the exposure profile. Wrong-way risk is when exposure rises as the counterparty deteriorates.',
      formula: 'CVA ≈ Σ EE(t)·PD(t)·LGD·DF(t)',
      exam: 'A bank selling protection on its own sovereign is the textbook wrong-way risk example. Netting and collateral reduce CVA.',
    },
    {
      kicker: 'STRUCTURED',
      title: 'Tranching redistributes loss, it does not remove it',
      body: 'The equity tranche absorbs first losses, then mezzanine, then senior. Correlation transfers value between tranches: higher correlation helps equity and hurts senior.',
      formula: null,
      exam: 'Senior tranches are short a correlation option. That is why AAA ratings on CDO seniors proved so fragile.',
    },
  ],

  'frm-p2-operational': [
    {
      kicker: 'MEASUREMENT',
      title: 'Frequency and severity are modelled separately',
      body: 'A loss distribution approach fits a frequency distribution — typically Poisson — and a severity distribution, then convolves them by Monte Carlo to produce the aggregate annual loss distribution.',
      formula: 'Agg loss = Σᵢ₌₁ᴺ Xᵢ',
      exam: 'Internal loss data is scarce in the tail, so external data and scenario analysis fill it. Know why each source is needed.',
    },
    {
      kicker: 'GOVERNANCE',
      title: 'Three lines of defence assign ownership',
      body: 'The business owns and manages its risk; the risk and compliance function sets the framework and challenges; internal audit provides independent assurance. Blurring the second and third lines is the classic failure.',
      formula: null,
      exam: 'If risk management designs a control and then audits it, independence is lost. Stems describe exactly that arrangement.',
    },
    {
      kicker: 'MODEL RISK',
      title: 'Validation covers concept, implementation and outcome',
      body: 'Model risk arises from a fundamentally wrong model or from correct models used incorrectly. Effective validation tests conceptual soundness, ongoing monitoring and outcomes analysis.',
      formula: null,
      exam: 'A model performing well in backtest but failing in a new regime is a conceptual soundness failure, not an implementation error.',
    },
    {
      kicker: 'RESILIENCE',
      title: 'Resilience assumes the disruption will happen',
      body: 'Business continuity plans for recovery; operational resilience plans for continuing to deliver critical services through a disruption. Impact tolerances make that difference concrete and measurable.',
      formula: null,
      exam: 'Third-party concentration is the most examined resilience gap. Outsourcing an activity never outsources the accountability.',
    },
  ],

  'frm-p2-liquidity': [
    {
      kicker: 'DEFINITION',
      title: 'Funding liquidity and market liquidity are different risks',
      body: 'Funding liquidity risk is the inability to meet obligations as they fall due. Market liquidity risk is the inability to sell without moving the price. They reinforce each other in a spiral.',
      formula: null,
      exam: 'A forced sale that depresses prices and triggers further margin calls is the liquidity spiral. Name the direction of causation.',
    },
    {
      kicker: 'MEASUREMENT',
      title: 'Liquidity-adjusted VaR adds the cost of exit',
      body: 'LVaR augments VaR with the expected transaction cost of unwinding — half the bid–ask spread on the position, and more where the spread itself is volatile.',
      formula: 'LVaR = VaR + ½·spread·V',
      exam: 'Using an exogenous spread ignores your own market impact. Endogenous liquidity matters when the position is large relative to volume.',
    },
    {
      kicker: 'REGULATION',
      title: 'LCR is 30 days, NSFR is one year',
      body: 'The liquidity coverage ratio requires high-quality liquid assets to cover 30 days of stressed net outflows. The net stable funding ratio requires stable funding for assets over a one-year horizon.',
      formula: 'LCR = HQLA / net outflows(30d) ≥ 100%',
      exam: 'Level 1 HQLA takes no haircut; Level 2A and 2B do and are capped. Both ratios must be at least 100%.',
    },
    {
      kicker: 'PRICING',
      title: 'Transfer pricing puts liquidity cost where it is created',
      body: 'Funds transfer pricing charges business lines for the liquidity they consume and credits them for the stable funding they raise. Without it, long-dated lending looks artificially profitable.',
      formula: null,
      exam: 'A contingency funding plan is tested for triggers and governance, not just for the list of available sources.',
    },
  ],

  'frm-p2-investment': [
    {
      kicker: 'FACTORS',
      title: 'Assets are bundles of factor exposures',
      body: 'Factor theory says returns compensate exposure to bad times, not to asset labels. Value, momentum, carry and volatility are the persistent factors, and they can be accessed across asset classes.',
      formula: 'Rᵢ = α + Σ βₖFₖ + εᵢ',
      exam: 'Two portfolios with different holdings but identical factor exposures should earn similar returns. Stems test that equivalence.',
    },
    {
      kicker: 'BUDGETING',
      title: 'Risk budgeting allocates risk, not capital',
      body: 'Marginal contribution to risk tells you how total portfolio risk changes with a small increase in a position. An optimal portfolio equalises the ratio of marginal contribution to expected excess return.',
      formula: 'MCR = ∂σ_p/∂wᵢ',
      exam: 'A small dollar allocation to a high-volatility, high-correlation asset can dominate the risk budget. That is the point of the measure.',
    },
    {
      kicker: 'HEDGE FUNDS',
      title: 'Hedge fund indices are biased upward',
      body: 'Self-selected reporting, backfill and survivorship all inflate reported hedge fund index returns, while smoothing of illiquid marks understates volatility and correlation.',
      formula: null,
      exam: 'Name the specific bias the stem describes. Backfill bias comes from adding a fund\'s prior history when it joins the index.',
    },
    {
      kicker: 'ILLIQUID ASSETS',
      title: 'Reported returns are smoothed, not stable',
      body: 'Appraisal-based valuation induces positive autocorrelation in reported returns. Unsmoothing raises the estimated volatility and correlation and lowers the apparent Sharpe ratio.',
      formula: 'r*ₜ = α·rₜ + (1−α)·r*ₜ₋₁',
      exam: 'If a stem gives an implausibly high Sharpe ratio on private assets, smoothing is the explanation they are looking for.',
    },
  ],

  'frm-p2-current': [
    {
      kicker: 'THE TOPIC',
      title: 'This is the one topic you cannot study from last year',
      body: 'Current Issues is a rotating reading list replaced substantially each cycle. Pull the current year\'s readings directly from GARP rather than relying on any third-party summary.',
      formula: null,
      exam: 'Items are comprehension-level on the assigned readings. Reading them once carefully beats memorising a summary.',
    },
    {
      kicker: 'AI IN FINANCE',
      title: 'Model risk scales with model opacity',
      body: 'Machine learning improves prediction but weakens explainability, and supervisors expect firms to explain credit and pricing decisions. Data quality, drift and third-party model dependence are the recurring concerns.',
      formula: null,
      exam: 'The examinable point is governance: who validates a model nobody in the firm fully understands, and against what benchmark.',
    },
    {
      kicker: 'CLIMATE',
      title: 'Physical risk and transition risk move differently',
      body: 'Physical risk comes from the events themselves; transition risk comes from policy, technology and sentiment shifting. Scenario analysis, not VaR, is the tool — the horizon is far longer than any historical sample.',
      formula: null,
      exam: 'A rapid, orderly transition raises transition risk and lowers physical risk. The scenarios are deliberately constructed to trade off.',
    },
    {
      kicker: 'BANKING STRESS',
      title: 'The 2023 episode was duration plus deposit behaviour',
      body: 'Unrealised losses on held-to-maturity portfolios combined with concentrated, uninsured and digitally mobile deposits. Interest rate risk in the banking book met a funding run faster than the LCR assumed.',
      formula: null,
      exam: 'The lesson examined is that deposit-run speed assumptions embedded in the LCR were calibrated before instant transfers.',
    },
  ],
};
