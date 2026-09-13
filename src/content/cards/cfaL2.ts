import { CardBank } from '../types';

/** CFA Level II — 2026 curriculum. Four snapshot cards per topic area. */
export const CFA_L2_CARDS: CardBank = {
  'cfa-l2-ethics': [
    {
      kicker: 'APPLICATION',
      title: 'Level II ethics is the same Code in a longer vignette',
      body: 'The Standards do not change between levels; the volume of facts does. A Level II vignette layers several people, several duties and a timeline, then asks which action was permissible.',
      formula: null,
      exam: 'Read the question stem first, then mine the vignette for the two or three facts it actually needs.',
    },
    {
      kicker: 'RESEARCH',
      title: 'Material non-public information stops the trade, not the research',
      body: 'Standard II(A) prohibits acting or causing others to act on material non-public information. The mosaic theory expressly permits combining non-material non-public information with public information to reach a conclusion.',
      formula: null,
      exam: 'Mosaic-theory items reward noticing that each individual piece was immaterial. Materiality is judged by likely price impact.',
    },
    {
      kicker: 'ALLOCATION',
      title: 'Fair dealing is about process, not equal treatment',
      body: 'Standard III(B) requires members to deal fairly with all clients when disseminating recommendations and taking action. Different service levels are permissible if disclosed; simultaneous dissemination is the safe design.',
      formula: null,
      exam: '"Fair" does not mean "identical". A tiered service offering that is disclosed to all clients is not a violation.',
    },
    {
      kicker: 'PERFORMANCE',
      title: 'Presentation must be fair, accurate and complete',
      body: 'Standard III(D) covers performance presentation. Composites must not cherry-pick, simulated or model results must be labelled as such, and members should make the detail supporting a track record available on request.',
      formula: null,
      exam: 'GIPS compliance is voluntary but claiming it falsely is a Standard violation in its own right.',
    },
  ],

  'cfa-l2-quant': [
    {
      kicker: 'MODEL FIT',
      title: 'Adjusted R² penalises useless regressors',
      body: 'R² rises mechanically with every variable you add. Adjusted R² imposes a degrees-of-freedom penalty, so it can fall — and when it falls, the added variable is not earning its place.',
      formula: 'R̄² = 1 − (1−R²)·(n−1)/(n−k−1)',
      exam: 'If a stem adds a variable and R² rises but adjusted R² falls, that is the finding — say so and stop.',
    },
    {
      kicker: 'DIAGNOSTICS',
      title: 'Three violations, three different consequences',
      body: 'Heteroskedasticity and serial correlation leave coefficients unbiased but invalidate standard errors. Multicollinearity inflates standard errors, producing insignificant t-statistics alongside a significant F-statistic.',
      formula: null,
      exam: 'A significant F with all-insignificant t-statistics is the fingerprint of multicollinearity. It is a very frequent item.',
    },
    {
      kicker: 'TIME SERIES',
      title: 'Stationarity comes before estimation',
      body: 'An AR model requires covariance stationarity: constant mean, constant variance and constant autocovariance. A unit root breaks all three, and the Dickey–Fuller test is how you check for one.',
      formula: 'xₜ = b₀ + b₁xₜ₋₁ + εₜ',
      exam: 'The fix for a unit root is first differencing. Estimating an AR model on a non-stationary series produces spurious results.',
    },
    {
      kicker: 'MACHINE LEARNING',
      title: 'Overfitting is the central risk, not model choice',
      body: 'A model that fits the training sample perfectly has usually learned noise. Complexity is controlled by regularisation such as LASSO, and honesty is enforced by holding out a validation and a test sample.',
      formula: null,
      exam: 'Low training error with high validation error is overfitting; high error on both is underfitting. Name the gap, not the algorithm.',
    },
  ],

  'cfa-l2-econ': [
    {
      kicker: 'PARITY',
      title: 'The parity conditions rarely hold in the short run',
      body: 'Covered interest rate parity is enforced by arbitrage and holds. Uncovered parity, purchasing power parity and the international Fisher effect are equilibrium tendencies that fail over practical horizons.',
      formula: '%ΔS ≈ i_d − i_f',
      exam: 'The carry trade exists precisely because uncovered interest rate parity fails. Stems love that contradiction.',
    },
    {
      kicker: 'FLOWS',
      title: 'The current account and capital flows must offset',
      body: 'A current account deficit is financed by a capital account surplus. Over long horizons the flow approach dominates exchange rate determination; over short horizons capital flows and interest differentials dominate.',
      formula: null,
      exam: 'Identify the horizon in the stem before you choose a model. Short-run and long-run answers point in opposite directions.',
    },
    {
      kicker: 'GROWTH',
      title: 'Only technology sustains per-capita growth',
      body: 'In the neoclassical model, capital deepening raises output per worker but faces diminishing returns and cannot sustain growth. The steady-state growth rate of output per capita is set by technological progress alone.',
      formula: 'Y = A·f(K, L)',
      exam: 'Endogenous growth models remove diminishing returns to capital, so policy can affect the long-run rate. Know which model the stem uses.',
    },
    {
      kicker: 'CONVERGENCE',
      title: 'Convergence depends on the model you assume',
      body: 'Absolute convergence says poor countries catch up unconditionally; conditional convergence says they converge only to their own steady state; club convergence says only countries with similar institutions converge.',
      formula: null,
      exam: 'Match the convergence type to the evidence described. The word "institutions" in a stem usually points to club convergence.',
    },
  ],

  'cfa-l2-fsa': [
    {
      kicker: 'INVESTMENTS',
      title: 'Influence determines the accounting method',
      body: 'Below 20% is typically financial-asset treatment, 20–50% suggests significant influence and the equity method, and control triggers consolidation. Influence, not the raw percentage, is the actual test.',
      formula: null,
      exam: 'The equity method reports one line for income and one for the investment. Consolidation grosses up revenue and assets — ratios move sharply.',
    },
    {
      kicker: 'PENSIONS',
      title: 'The balance sheet shows only the funded status',
      body: 'A defined benefit plan reports the difference between plan assets and the projected benefit obligation. Where the components of periodic cost land — income statement or OCI — differs between IFRS and US GAAP.',
      formula: 'Funded status = Plan assets − PBO',
      exam: 'A lower discount rate raises the PBO and worsens funded status. Assumption changes are the standard lever in these items.',
    },
    {
      kicker: 'FX TRANSLATION',
      title: 'Functional currency decides the method',
      body: "If the functional currency is the local currency, use the current rate method and put the adjustment in equity. If it is the parent's currency, use the temporal method and run the gain or loss through income.",
      formula: null,
      exam: 'Current rate method translates all assets and liabilities at the current rate. Temporal keeps non-monetary items at historical rates.',
    },
    {
      kicker: 'QUALITY',
      title: 'Quality of reports and quality of results are separate',
      body: 'A report can be faithfully representative of genuinely poor results. Assess reporting quality first — GAAP conformity, decision usefulness — and only then assess whether the earnings themselves are sustainable.',
      formula: null,
      exam: 'The Beneish M-score and accrual-based measures are screening tools. Stems ask you to interpret a flag, not to compute the score.',
    },
  ],

  'cfa-l2-corp': [
    {
      kicker: 'PAYOUT',
      title: 'Buybacks and dividends are equivalent — before frictions',
      body: 'Under identical tax treatment and a buyback executed at market price, shareholder wealth is unchanged by the choice. Taxes, signalling and the buyback price relative to book value break that equivalence.',
      formula: null,
      exam: 'A buyback below book value raises book value per share; above book value it lowers it. That direction is a standard item.',
    },
    {
      kicker: 'SIGNAL',
      title: 'Dividend policy is read as a signal about persistence',
      body: 'Managers smooth dividends because cuts are punished. A dividend initiation or increase signals confidence in sustainable cash flows; the target payout adjustment model formalises the partial adjustment.',
      formula: 'ΔD = (EPS·target − D₀)·adj factor',
      exam: 'Compute the expected increase with the adjustment factor rather than jumping straight to the target payout.',
    },
    {
      kicker: 'COST OF CAPITAL',
      title: 'Beta must be relevered to the subject firm',
      body: "Take a comparable's equity beta, unlever it to remove that firm's capital structure, then relever using the subject firm's target debt-to-equity ratio. The pure-play method is this sequence.",
      formula: 'β_U = β_E / [1 + (1−t)·D/E]',
      exam: "Using the comparable's D/E in the relevering step is the planted error. Unlever with theirs, relever with the subject's.",
    },
    {
      kicker: 'RESTRUCTURING',
      title: 'Restructuring is evaluated like any other investment',
      body: 'Acquisitions, divestitures and spin-offs are assessed on whether the value created exceeds the price paid, including integration cost. Synergies must be identified specifically, not assumed as a percentage.',
      formula: null,
      exam: 'In a cash acquisition the acquirer bears all the risk; in a share exchange the risk is shared. That distinction drives several answers.',
    },
  ],

  'cfa-l2-equity': [
    {
      kicker: 'FRAMEWORK',
      title: 'Choose the model the cash flow can support',
      body: 'Dividend models suit stable payers, free cash flow models suit firms where dividends and cash generation diverge, and residual income suits firms with negative early free cash flow or no dividend.',
      formula: null,
      exam: 'A firm with negative FCFF and no dividend points to residual income. Model selection is itself a scored decision.',
    },
    {
      kicker: 'FREE CASH FLOW',
      title: 'FCFF is before financing, FCFE is after',
      body: 'FCFF is available to all capital providers and is discounted at WACC to give firm value. FCFE is after interest and debt flows and is discounted at the cost of equity to give equity value directly.',
      formula: 'FCFF = NI + NCC + Int(1−t) − FCInv − WCInv',
      exam: 'Mismatching the discount rate to the cash flow is the single most common error. FCFF never pairs with the cost of equity.',
    },
    {
      kicker: 'RESIDUAL INCOME',
      title: 'Residual income charges for equity capital',
      body: 'Value equals current book value plus the present value of future residual income — net income less a charge for the equity used. Much of the value is recognised immediately, which reduces terminal-value dependence.',
      formula: 'RI = NIₜ − r·B₍ₜ₋₁₎',
      exam: 'Residual income requires clean surplus accounting. Items bypassing the income statement into OCI violate the assumption.',
    },
    {
      kicker: 'PRIVATE COMPANY',
      title: 'Discounts and premiums are applied in sequence',
      body: 'A control premium is added when moving from a minority to a controlling basis; a discount for lack of control and a discount for lack of marketability are applied to move the other way. The order matters.',
      formula: 'DLOC = 1 − 1/(1 + control premium)',
      exam: 'Apply DLOC first, then DLOM, multiplicatively. Adding the two percentages together is the planted shortcut.',
    },
  ],

  'cfa-l2-fixed': [
    {
      kicker: 'TERM STRUCTURE',
      title: 'Forward rates are breakeven rates, not forecasts',
      body: "The forward curve is implied by today's spot curve under no-arbitrage. If your rate view matches the forwards, every riding-the-curve strategy earns the same return — a view only pays if it differs from the forwards.",
      formula: '(1+z₂)² = (1+z₁)(1+f₁,₁)',
      exam: '"Will outperform if rates evolve as implied by forwards" is almost always false. That is the definition of no advantage.',
    },
    {
      kicker: 'ARBITRAGE-FREE',
      title: 'Value each cash flow at its own spot rate',
      body: 'Using a single yield to maturity for every cash flow is an approximation. Arbitrage-free valuation discounts each payment at the spot rate for its own maturity, which is what a binomial interest rate tree generalises.',
      formula: 'P = Σ CFₜ/(1+zₜ)ᵗ',
      exam: 'A tree must be calibrated to reproduce the benchmark bond prices before it can value anything else.',
    },
    {
      kicker: 'EMBEDDED OPTIONS',
      title: 'The option belongs to whoever benefits',
      body: 'A callable bond gives the issuer an option, so it is worth less than an otherwise identical straight bond. A putable bond gives the investor the option and is worth more.',
      formula: 'V_callable = V_straight − V_call',
      exam: 'Callable bonds show negative convexity as rates fall. Effective duration, not modified duration, is the right measure.',
    },
    {
      kicker: 'CREDIT',
      title: 'Structural and reduced-form models ask different questions',
      body: "Structural models treat equity as a call on the firm's assets and derive default from the capital structure. Reduced-form models take default as an exogenous jump process estimated from observable data.",
      formula: 'CVA = Σ PD·LGD·discount',
      exam: 'Structural models need unobservable asset values; reduced-form models need a stable estimation sample. Know the criticism of each.',
    },
  ],

  'cfa-l2-deriv': [
    {
      kicker: 'FORWARDS',
      title: 'Value and price are different questions',
      body: 'The forward price is set at inception so the contract is worth zero. Value afterwards is the present value of the difference between the current forward price and the contracted price.',
      formula: 'Vₜ = (Fₜ − F₀)/(1+r)^(T−t)',
      exam: 'Asked for price, solve the no-arbitrage relation. Asked for value, discount the difference between two forward prices.',
    },
    {
      kicker: 'BSM',
      title: 'Black–Scholes–Merton is a replicating portfolio',
      body: 'The model expresses a call as a leveraged position in the underlying: N(d₁) units of stock financed by borrowing the present value of the strike times N(d₂). N(d₂) is the risk-neutral probability of exercise.',
      formula: 'c = S·N(d₁) − X·e^(−rT)·N(d₂)',
      exam: 'The assumptions are the item: constant volatility, continuous trading, no jumps. Volatility smiles are the evidence they fail.',
    },
    {
      kicker: 'GREEKS',
      title: 'Delta hedging leaves gamma and vega behind',
      body: 'Delta is the first-order sensitivity to spot, gamma the curvature of delta, vega the sensitivity to volatility. A delta-neutral book still loses on a large move if it is short gamma.',
      formula: 'ΔP ≈ δ·ΔS + ½γ·ΔS² + ν·Δσ',
      exam: 'If a stem says the hedger rebalances infrequently, gamma risk is the answer. Frequency of rebalancing is the tell.',
    },
    {
      kicker: 'SWAPS',
      title: 'The swap fixed rate makes both legs equal at inception',
      body: 'Solve for the fixed rate that equates the present value of the fixed leg with the present value of the floating leg, using discount factors from the spot curve. That is one formula for every plain vanilla swap.',
      formula: 'r_fixed = (1 − B_n) / Σ Bᵢ',
      exam: 'After inception, value the swap as the difference between a fixed-rate bond and a floating-rate note priced at par on the reset date.',
    },
  ],

  'cfa-l2-alt': [
    {
      kicker: 'COMMODITIES',
      title: 'The shape of the futures curve decides roll return',
      body: 'In backwardation the futures price is below spot and rolling forward earns a positive roll return. In contango it is above spot and rolling costs money. Total return is spot plus roll plus collateral.',
      formula: 'Total = spot + roll + collateral',
      exam: 'The insurance and hedging-pressure theories explain backwardation; the theory of storage explains contango. Match theory to curve.',
    },
    {
      kicker: 'REAL ESTATE',
      title: 'Three approaches, one property',
      body: 'The income approach capitalises NOI, the cost approach values replacement less depreciation, and the sales comparison approach uses transactions. Appraisals reconcile them rather than choosing one.',
      formula: 'Value = NOI / cap rate',
      exam: 'Direct capitalisation assumes constant NOI in perpetuity. If growth is stated, discounted cash flow is the correct approach.',
    },
    {
      kicker: 'LISTED',
      title: 'REITs trade like equities in the short run',
      body: 'Publicly traded real estate offers liquidity and transparency but higher short-run correlation with equities than direct property. Net asset value per share is the anchor; funds from operations is the earnings measure.',
      formula: 'FFO = NI + depreciation − gains',
      exam: 'AFFO subtracts recurring maintenance capital expenditure from FFO. AFFO is the better proxy for distributable cash.',
    },
    {
      kicker: 'HEDGE FUNDS',
      title: 'Strategy determines the risk you are actually buying',
      body: 'Equity market neutral targets low beta with leverage; merger arbitrage sells deal-break insurance; global macro is directional. Fund-of-funds add diversification at a second layer of fees.',
      formula: null,
      exam: 'Merger arbitrage has a payoff resembling a short put — small steady gains and occasional large losses. That shape is examinable.',
    },
  ],

  'cfa-l2-pm': [
    {
      kicker: 'ACTIVE RETURN',
      title: 'The information ratio is the honest scorecard',
      body: 'Active return divided by active risk measures skill per unit of tracking error. The fundamental law decomposes it into the information coefficient, the breadth of independent bets and the transfer coefficient.',
      formula: 'IR ≈ IC·√BR·TC',
      exam: 'Breadth means independent decisions. Holding 500 stocks with one macro view is breadth of one, not five hundred.',
    },
    {
      kicker: 'FACTORS',
      title: 'Multifactor models decompose the return you earned',
      body: 'Macroeconomic, fundamental and statistical factor models all attribute return to systematic exposures plus an idiosyncratic residual. Active risk comes from deliberate factor tilts and from security selection.',
      formula: 'Rᵢ = a + Σ βₖFₖ + εᵢ',
      exam: 'An arbitrage opportunity requires zero net investment, no factor risk and positive expected return. All three must hold.',
    },
    {
      kicker: 'MARKET RISK',
      title: 'VaR is a quantile, not a worst case',
      body: 'Value at Risk states a loss that will not be exceeded over a horizon at a confidence level. Parametric, historical simulation and Monte Carlo differ in what they assume, not in what they mean.',
      formula: 'VaR = −(μ + z·σ)·V',
      exam: 'Calling VaR a maximum loss is the classic trap. It is silent about the size of losses beyond the quantile.',
    },
    {
      kicker: 'BACKTESTING',
      title: 'Survivorship and look-ahead bias flatter every backtest',
      body: 'Rolling-window backtesting must use only information available at the time. Survivorship bias, look-ahead bias and data snooping all inflate reported performance, and none of them show up in the result itself.',
      formula: null,
      exam: 'Using restated financial data in a backtest is look-ahead bias. Naming the specific bias is what earns the mark.',
    },
  ],
};
