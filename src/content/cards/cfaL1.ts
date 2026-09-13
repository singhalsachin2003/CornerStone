import { CardBank } from '../types';

/** CFA Level I — 2027 curriculum. Four snapshot cards per topic area. */
export const CFA_L1_CARDS: CardBank = {
  'cfa-l1-ethics': [
    {
      kicker: 'STRUCTURE',
      title: 'Six components of the Code, seven Standards',
      body: 'The Code states the aspirations; the Standards are enforceable. Standard I is Professionalism, II Integrity of Capital Markets, III Duties to Clients, IV Duties to Employers, V Investment Analysis and Recommendations, VI Conflicts of Interest, VII Responsibilities as a Member or Candidate.',
      formula: null,
      exam: 'Nearly every ethics question is "which Standard is violated". Learn the numbering — it turns recall into elimination.',
    },
    {
      kicker: 'PRIORITY',
      title: 'When laws conflict, follow the stricter one',
      body: 'Members must comply with the most strict of applicable law, the Code and the Standards. Less strict local law never excuses a Standards violation, and members must not knowingly assist anyone else in a violation.',
      formula: null,
      exam: 'Watch for a stem set in a jurisdiction with looser rules — the answer is almost always to apply the Code.',
    },
    {
      kicker: 'DISCLOSURE',
      title: 'Disclose conflicts prominently and in plain language',
      body: 'Standard VI(A) requires disclosure of anything that could reasonably impair independence: beneficial ownership, referral fees, board seats, additional compensation arrangements. Disclosure must be prominent and in language the client will actually understand.',
      formula: null,
      exam: 'Disclosure resolves most conflict scenarios. If an answer says "abstain" or "resign" where disclosure would do, be suspicious.',
    },
    {
      kicker: 'PROCESS',
      title: 'Diligence is about the basis, not the outcome',
      body: 'Standard V(A) asks for a reasonable and adequate basis supported by appropriate research. A recommendation that loses money is not a violation; a recommendation made without a defensible basis is one even if it makes money.',
      formula: null,
      exam: 'Ethics items describe a process, then a result. Judge the process — the result is usually a distractor.',
    },
  ],

  'cfa-l1-quant': [
    {
      kicker: 'CORE IDEA',
      title: 'Every yield question is a time-value question',
      body: 'Compounding frequency, effective annual rates and continuous compounding are the same machine with different exponents. Get comfortable moving between them before you compare any two rates.',
      formula: 'EAR = (1 + r/m)ᵐ − 1',
      exam: 'Convert to a common compounding basis before comparing two rates — that conversion is usually the whole question.',
    },
    {
      kicker: 'DISPERSION',
      title: 'Standard deviation is the unit risk is priced in',
      body: 'Variance is the average squared deviation; its square root returns you to the units of the return itself. Sample variance divides by n − 1 to correct the downward bias in the estimate.',
      formula: 's² = Σ(xᵢ − x̄)² / (n − 1)',
      exam: 'If a stem says "sample", the denominator is n − 1. Using n is the most reliably planted wrong answer in the topic.',
    },
    {
      kicker: 'INFERENCE',
      title: 'A hypothesis test is a distance in standard errors',
      body: 'Compute the test statistic, compare it with the critical value at your significance level, then reject or fail to reject. You never "accept" the null — failing to reject is a statement about evidence, not truth.',
      formula: 't = (x̄ − μ₀) / (s/√n)',
      exam: 'One-tailed versus two-tailed changes the critical value, not the statistic. Read the alternative hypothesis carefully.',
    },
    {
      kicker: 'REGRESSION',
      title: 'R² explains variation, not causation',
      body: 'The coefficient of determination is the explained sum of squares over the total sum of squares. In simple linear regression it equals the squared correlation between the two variables.',
      formula: 'R² = RSS / SST',
      exam: 'A high R² with an insignificant slope coefficient is a warning sign, not a result. Check the t-statistic before you interpret the fit.',
    },
  ],

  'cfa-l1-econ': [
    {
      kicker: 'STRUCTURE',
      title: 'Market structure is defined by pricing power',
      body: 'Perfect competition: price takers, no pricing power. Monopolistic competition: differentiated products, some power. Oligopoly: interdependent decisions. Monopoly: a single seller facing the whole demand curve.',
      formula: null,
      exam: 'The Herfindahl–Hirschman Index concentrates the answer choices. It ignores barriers to entry, which is exactly what stems exploit.',
    },
    {
      kicker: 'CYCLE',
      title: 'Inventories tell you where you are in the cycle',
      body: 'The inventory–sales ratio rises early in a downturn as sales fall before production adjusts, then falls in early recovery as sales outpace production. It is the classic leading read on the business cycle.',
      formula: null,
      exam: 'Distinguish leading, coincident and lagging indicators. Unemployment is lagging; the yield-curve slope is leading.',
    },
    {
      kicker: 'POLICY',
      title: 'Fiscal policy acts slowly, monetary policy acts indirectly',
      body: 'Fiscal policy has long recognition and legislative lags but a direct effect on demand. Monetary policy can be enacted quickly but works through rates, credit and expectations, so its impact lag is long and variable.',
      formula: null,
      exam: 'A question about "which policy responds faster" is asking about enactment lag, not impact lag. They point in opposite directions.',
    },
    {
      kicker: 'FX',
      title: 'Interest rate parity links spot, forward and rates',
      body: 'Covered interest rate parity holds by arbitrage: the forward premium or discount offsets the interest rate differential. The currency with the higher interest rate trades at a forward discount.',
      formula: 'F/S = (1 + i_d) / (1 + i_f)',
      exam: 'Quote conventions decide the sign. Write out which currency is the base before you touch the numbers.',
    },
  ],

  'cfa-l1-fsa': [
    {
      kicker: 'CORE IDEA',
      title: 'Three statements, one articulating system',
      body: 'The income statement explains the change in retained earnings, the cash flow statement explains the change in cash, and the balance sheet is the cumulative result. Any analysis that treats them separately misses the check.',
      formula: 'Assets = Liabilities + Equity',
      exam: 'Level I loves the articulation link: given two statements, derive the missing line on the third.',
    },
    {
      kicker: 'INVENTORY',
      title: 'LIFO versus FIFO is a story about rising prices',
      body: 'Under rising prices and stable quantities, FIFO gives higher ending inventory and higher income; LIFO gives higher cost of goods sold and lower income. IFRS prohibits LIFO altogether.',
      formula: 'COGS = Beginning + Purchases − Ending',
      exam: 'The LIFO reserve converts one to the other. Add it to LIFO inventory to get FIFO inventory, and adjust the tax effect on equity.',
    },
    {
      kicker: 'CASH FLOW',
      title: 'Indirect CFO starts at net income and undoes accruals',
      body: 'Add back non-cash charges, remove gains and losses that belong to investing, then adjust for changes in working capital. An increase in a current asset uses cash; an increase in a current liability provides it.',
      formula: 'CFO = NI + non-cash − ΔWC',
      exam: 'Depreciation is not a source of cash. It is only added back because it was subtracted from net income.',
    },
    {
      kicker: 'QUALITY',
      title: 'Earnings quality is about sustainability and cash backing',
      body: 'High-quality earnings are sustainable and supported by operating cash flow. A persistent gap between net income and CFO — an accruals build — is the single most useful red flag in the topic.',
      formula: 'Accruals = NI − CFO − CFI',
      exam: 'Reporting quality and results quality are different axes. A firm can report faithfully on a genuinely poor result.',
    },
  ],

  'cfa-l1-corp': [
    {
      kicker: 'GOVERNANCE',
      title: 'Governance is about who bears the consequences',
      body: 'The principal–agent problem sits between shareholders and managers, and between controlling and minority shareholders. Governance mechanisms — board independence, remuneration design, audit — exist to realign those incentives.',
      formula: null,
      exam: 'Stakeholder questions are conflict-identification questions. Name the two parties before you pick a mechanism.',
    },
    {
      kicker: 'CAPITAL BUDGETING',
      title: 'NPV decides; IRR ranks unreliably',
      body: 'Net present value adds value in currency terms and assumes reinvestment at the cost of capital. IRR assumes reinvestment at the IRR itself, which is why it can rank mutually exclusive projects incorrectly.',
      formula: 'NPV = Σ CFₜ/(1+r)ᵗ − Outlay',
      exam: 'When NPV and IRR disagree on mutually exclusive projects, NPV wins. That is the whole item.',
    },
    {
      kicker: 'COST OF CAPITAL',
      title: 'WACC weights by market value, after tax',
      body: 'Weights come from target market-value capital structure, not book values. Only the debt component is tax-affected, because interest is deductible while dividends are not.',
      formula: 'WACC = w_d·r_d(1−t) + w_e·r_e',
      exam: 'Using book weights or forgetting the (1 − t) term are the two planted errors. Check both before you commit.',
    },
    {
      kicker: 'WORKING CAPITAL',
      title: 'The cash conversion cycle is time, not money',
      body: 'Days of inventory plus days of receivables minus days of payables gives the number of days cash is tied up in operations. Shorter is generally better, but a very short cycle may signal stretched suppliers.',
      formula: 'CCC = DOH + DSO − DPO',
      exam: 'Improving the cycle by delaying payables is not automatically good. Stems often reward noticing the supplier-relationship cost.',
    },
  ],

  'cfa-l1-equity': [
    {
      kicker: 'MARKETS',
      title: 'Index construction determines index behaviour',
      body: 'Price-weighted indexes are driven by high-priced shares and need divisor adjustments for splits. Market-cap weighted indexes overweight what has already risen. Equal weighting requires periodic rebalancing.',
      formula: null,
      exam: 'A split changes a price-weighted index divisor but not a cap-weighted index. That contrast is a standard item.',
    },
    {
      kicker: 'VALUATION',
      title: 'The Gordon growth model in one line',
      body: "A stock is worth next year's dividend divided by the excess of the required return over the constant growth rate. It only works when g is genuinely constant and strictly less than r.",
      formula: 'V₀ = D₁ / (r − g)',
      exam: 'If the stem gives D₀, you must grow it one period first. Using D₀ directly is the most common wrong answer.',
    },
    {
      kicker: 'RELATIVE VALUE',
      title: 'Multiples embed the same assumptions, just hidden',
      body: 'The justified leading P/E equals the payout ratio divided by (r − g). Multiples are fast and comparable, but they inherit every assumption of the discounted model — they just do not state them.',
      formula: 'P/E = (1 − b) / (r − g)',
      exam: 'Trailing versus leading P/E changes the numerator of the payout term. Read which earnings the stem is using.',
    },
    {
      kicker: 'INDUSTRY',
      title: 'Industry structure sets the ceiling on returns',
      body: "Porter's five forces frame the analysis: rivalry, new entrants, substitutes, supplier power and buyer power. Barriers to entry and industry concentration are the two variables that most often move pricing power.",
      formula: null,
      exam: 'Industry life-cycle stage drives the forecast. Embryonic and growth stages justify high reinvestment and low payout.',
    },
  ],

  'cfa-l1-fixed': [
    {
      kicker: 'CORE IDEA',
      title: 'A bond’s price is just discounted cash flow',
      body: 'Price is the present value of every coupon plus the redemption amount, discounted at the market yield. Because the yield sits in the denominator, price and yield always move in opposite directions.',
      formula: 'P = Σ C/(1+r)ᵗ + FV/(1+r)ⁿ',
      exam: 'If a stem tells you the coupon exceeds the market yield, the bond trades at a premium — you can often answer without computing anything.',
    },
    {
      kicker: 'SENSITIVITY',
      title: 'Modified duration turns yield moves into price moves',
      body: 'Macaulay duration is the weighted-average time to receipt of cash flows. Divide it by (1 + periodic yield) and you get modified duration — an estimated percentage price change per 1% change in yield.',
      formula: '%ΔP ≈ −ModDur × Δy',
      exam: 'Duration is quoted in years but behaves as an elasticity. Watch for stems that give Macaulay and ask for the price effect.',
    },
    {
      kicker: 'SECOND ORDER',
      title: 'Convexity fixes what duration misses',
      body: 'Duration is a straight-line estimate of a curved relationship, so it understates price gains and overstates price losses. Convexity adds the curvature term back and is always beneficial for an option-free bond.',
      formula: '%ΔP ≈ −MD·Δy + ½·C·Δy²',
      exam: 'For large yield shocks the duration-only answer is a distractor. The convexity-adjusted price is always the higher one.',
    },
    {
      kicker: 'CREDIT',
      title: 'The spread is the price of default risk',
      body: 'A corporate yield decomposes into the benchmark rate plus a spread covering expected loss, liquidity and a risk premium. Spreads widen in stress, so credit bonds lose more than governments in a flight to quality.',
      formula: 'Spread = y(corp) − y(benchmark)',
      exam: 'Spread duration questions look like duration questions. Only the credit spread moves — the benchmark is held fixed.',
    },
  ],

  'cfa-l1-deriv': [
    {
      kicker: 'CORE IDEA',
      title: 'Pricing is arbitrage, not forecasting',
      body: 'A forward price is whatever makes the contract worth zero at inception. It is the spot price carried forward at the risk-free rate, adjusted for any benefit or cost of holding the underlying.',
      formula: 'F₀ = S₀(1+r)ᵀ − FV(benefits)',
      exam: 'Derivatives pricing never asks what you expect the asset to do. If an answer references an expected return, eliminate it.',
    },
    {
      kicker: 'PARITY',
      title: 'Put–call parity is a replication identity',
      body: 'A long call plus a bond maturing at the strike equals a long put plus the underlying. Rearranged, it lets you synthesise any of the four instruments from the other three.',
      formula: 'c + X/(1+r)ᵀ = p + S₀',
      exam: 'Most parity items are algebra: isolate the instrument the question asks for, then read the sign of each remaining term.',
    },
    {
      kicker: 'BINOMIAL',
      title: 'Risk-neutral probabilities are weights, not beliefs',
      body: 'In a one-period binomial model you value an option by weighting the up and down payoffs with risk-neutral probabilities and discounting at the risk-free rate. Those weights are pricing devices, not forecasts.',
      formula: 'π = (1 + r − d) / (u − d)',
      exam: 'The actual probability of an up move is irrelevant and is a standard distractor in the answer choices.',
    },
    {
      kicker: 'SWAPS',
      title: 'A plain vanilla swap is a strip of forwards',
      body: 'An interest rate swap can be decomposed into a series of forward rate agreements, or equivalently into a long position in one bond and a short position in another. At inception its value is zero.',
      formula: 'V_swap = B_fixed − B_floating',
      exam: 'A floating-rate note prices at par on every reset date. That single fact collapses most swap valuation items.',
    },
  ],

  'cfa-l1-alt': [
    {
      kicker: 'STRUCTURE',
      title: 'The fee structure is the return structure',
      body: 'Alternatives typically charge a management fee on committed or invested capital plus an incentive fee on profits, often subject to a hurdle rate and a high-water mark. Net-of-fee returns can diverge sharply from gross.',
      formula: 'Fee = m·AUM + p·max(0, gain)',
      exam: 'Watch whether the incentive fee is computed net or gross of the management fee. The two orders give different answers.',
    },
    {
      kicker: 'PRIVATE CAPITAL',
      title: 'Committed capital is not invested capital',
      body: 'Limited partners commit capital that the general partner draws down over an investment period. The J-curve — early negative returns from fees before exits arrive — is a structural feature, not underperformance.',
      formula: null,
      exam: "A question about early negative IRR in a fund's life is testing whether you recognise the J-curve.",
    },
    {
      kicker: 'REAL ASSETS',
      title: 'Real estate returns split into income and appreciation',
      body: 'Direct property yields a net operating income stream plus capital appreciation. The capitalisation rate is NOI divided by value, and it behaves like the inverse of a multiple.',
      formula: 'Value = NOI / cap rate',
      exam: 'A falling cap rate means rising values. Stems that describe cap-rate compression are describing a bull market.',
    },
    {
      kicker: 'MEASUREMENT',
      title: 'Illiquidity flatters reported risk',
      body: 'Appraisal-based and stale pricing smooths returns, which understates volatility and correlation with public markets. Reported Sharpe ratios for illiquid strategies are therefore biased upward.',
      formula: null,
      exam: 'If a stem highlights an unusually high Sharpe ratio on an illiquid strategy, smoothing is the answer they want.',
    },
  ],

  'cfa-l1-pm': [
    {
      kicker: 'DIVERSIFICATION',
      title: 'Correlation, not count, drives diversification',
      body: 'Portfolio variance depends on the covariances between holdings. Adding assets helps only to the extent they are imperfectly correlated; with a correlation of 1.0 there is no diversification benefit at all.',
      formula: 'σ²ₚ = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂',
      exam: 'Where correlation is exactly −1, a risk-free combination exists. Level I asks you to spot that special case.',
    },
    {
      kicker: 'PRICING',
      title: 'The CAPM prices only systematic risk',
      body: 'Expected return is the risk-free rate plus beta times the market risk premium. Unsystematic risk is diversifiable and therefore earns no premium — that is the whole economic claim of the model.',
      formula: 'E(Rᵢ) = R_f + βᵢ[E(R_m) − R_f]',
      exam: 'A stock plotting above the security market line is undervalued. Getting that direction backwards is the classic slip.',
    },
    {
      kicker: 'PLANNING',
      title: 'The IPS turns circumstances into constraints',
      body: 'Return and risk objectives come first, then the five constraints: liquidity, time horizon, taxes, legal and regulatory, and unique circumstances. The IPS is written before any security is selected.',
      formula: null,
      exam: 'Willingness and ability to take risk can conflict. The lower of the two governs, and you should educate the client.',
    },
    {
      kicker: 'BEHAVIOUR',
      title: 'Cognitive errors can be corrected; emotional biases must be adapted to',
      body: 'Cognitive errors stem from faulty reasoning and respond to information and process. Emotional biases arise from feeling and impulse, and are usually better accommodated than argued away.',
      formula: null,
      exam: 'Classify the bias first, then choose the remedy. "Moderate" belongs to emotional biases, "correct" to cognitive errors.',
    },
  ],
};
