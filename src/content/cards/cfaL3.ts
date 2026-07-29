import { CardBank } from '../types';

/** CFA Level III — 2027 core topics plus the three specialised pathways. */
export const CFA_L3_CARDS: CardBank = {
  'cfa-l3-allocation': [
    {
      kicker: 'EXPECTATIONS',
      title: 'Capital market expectations come before allocation',
      body: 'Forecasts of return, risk and correlation drive every allocation decision. The reliable methods are anchored: the Grinold–Kroner decomposition for equities, building-block approaches for fixed income.',
      formula: 'E(R) ≈ D/P − ΔS + i + g + ΔP/E',
      exam: 'Know the forecasting pitfalls by name — status quo bias, data measurement error, survivorship, and the ex post risk trap.',
    },
    {
      kicker: 'FRAMEWORK',
      title: 'Asset-only, liability-relative and goals-based',
      body: 'Asset-only optimisation maximises risk-adjusted return with no liability. Liability-relative allocation manages surplus. Goals-based allocation builds sub-portfolios each matched to a goal and a horizon.',
      formula: null,
      exam: 'Identify the investor type in the first sentence. A defined benefit plan is liability-relative; an individual with named goals is goals-based.',
    },
    {
      kicker: 'OPTIMISATION',
      title: 'Mean–variance is right and fragile at the same time',
      body: 'MVO gives the efficient frontier but is highly sensitive to input error, especially expected returns. Resampling, Black–Litterman and constraints are the standard responses to that instability.',
      formula: 'U = E(R) − ½·λ·σ²',
      exam: 'The criticism is concentration driven by estimation error, not the mathematics. Black–Litterman starts from market equilibrium to fix it.',
    },
    {
      kicker: 'CONSTRAINTS',
      title: 'Rebalancing costs and taxes reshape the optimum',
      body: 'Real-world constraints — asset size, liquidity, time horizon, regulation and taxes — narrow the feasible set. Wider rebalancing corridors are justified by higher transaction costs and higher correlation with the rest of the portfolio.',
      formula: null,
      exam: 'Higher volatility argues for narrower corridors; higher transaction cost argues for wider ones. Stems give you both and ask for the net.',
    },
  ],

  'cfa-l3-construction': [
    {
      kicker: 'EQUITY',
      title: 'Active share and active risk measure different things',
      body: 'Active share measures how different the holdings are from the benchmark; active risk measures how differently the portfolio behaves. A high active share with low active risk describes a diversified stock-picker.',
      formula: null,
      exam: 'Active share is bounded 0–1 and ignores correlation. Active risk depends on covariance, so factor tilts raise it sharply.',
    },
    {
      kicker: 'FIXED INCOME',
      title: 'Liability-driven investing matches duration first',
      body: 'For a liability-relative mandate, the objective is to immunise: match the present value and the duration of the liability, and keep convexity as low as possible while still matching.',
      formula: 'Σ w·Dᵢ = D_liability',
      exam: 'Minimising convexity subject to matching duration minimises structural risk. Maximising convexity is the planted wrong answer.',
    },
    {
      kicker: 'INSTITUTIONS',
      title: 'Each institution has a signature constraint',
      body: 'Pensions face a liability; endowments face a spending rule and an infinite horizon; insurers face regulation and asset–liability matching; sovereign wealth funds face a public mandate.',
      formula: 'Spend = s·(smoothed asset value)',
      exam: 'A long horizon plus a spending rule points to an endowment, which supports higher equity and illiquid allocation.',
    },
    {
      kicker: 'EXECUTION',
      title: 'Implementation shortfall captures the whole cost',
      body: 'Explicit commissions are the visible part. Implementation shortfall also counts delay cost, realised price impact and the opportunity cost of the portion never filled.',
      formula: 'IS = paper return − actual return',
      exam: 'An unfilled order still has a cost. Forgetting the opportunity-cost component is the standard omission.',
    },
  ],

  'cfa-l3-performance': [
    {
      kicker: 'DECOMPOSITION',
      title: 'Attribution separates allocation from selection',
      body: 'Brinson attribution splits active return into allocation — being overweight the right sectors — and selection — picking the right securities within them, plus an interaction term.',
      formula: 'Alloc = (w_p − w_b)(R_b − R̄_b)',
      exam: 'A manager who was right about sectors but wrong about stocks shows positive allocation and negative selection. Read the signs.',
    },
    {
      kicker: 'APPRAISAL',
      title: 'Match the risk measure to the mandate',
      body: 'The Sharpe ratio uses total risk and suits a whole portfolio. The information ratio uses active risk and suits a benchmarked mandate. Treynor and Jensen\'s alpha use beta and assume the rest is diversified away.',
      formula: 'IR = (R_p − R_b) / σ(R_p − R_b)',
      exam: 'If the portfolio is the investor\'s only holding, Sharpe. If it is one sleeve of many, the beta-based measures are appropriate.',
    },
    {
      kicker: 'SELECTION',
      title: 'Manager selection is due diligence plus type I and II error',
      body: 'The process covers investment due diligence and operational due diligence. Hiring a manager with no skill is a type I error; rejecting a genuinely skilled manager is a type II error.',
      formula: null,
      exam: 'Operational failures cause most catastrophic losses even though investment due diligence gets most of the attention.',
    },
    {
      kicker: 'GIPS',
      title: 'GIPS compliance is firm-wide or it is nothing',
      body: 'A firm must include all fee-paying discretionary portfolios in at least one composite, present a minimum of five years of history building to ten, and cannot claim partial compliance.',
      formula: null,
      exam: 'Composite construction is where items concentrate: every discretionary portfolio in, no cherry-picking, and defined in advance.',
    },
  ],

  'cfa-l3-derivatives': [
    {
      kicker: 'STRATEGY',
      title: 'A covered call sells upside for income',
      body: 'Long stock plus a short call caps the gain at the strike plus the premium and cushions losses by the premium. It is a view that the underlying will be flat to modestly higher, not a hedge.',
      formula: 'Max gain = X − S₀ + premium',
      exam: 'Breakeven for a covered call is the purchase price less the premium. Draw the payoff before you pick from the choices.',
    },
    {
      kicker: 'PROTECTION',
      title: 'A collar buys protection with someone else’s money',
      body: 'Long stock, long put, short call. The premium received on the call funds the put, so the position is cheap or zero-cost — at the price of surrendering the upside above the call strike.',
      formula: 'Payoff bounded by [X_put, X_call]',
      exam: 'Zero-cost collars are the common variant. The exam asks for the resulting maximum gain and loss, both of which are bounded.',
    },
    {
      kicker: 'OVERLAY',
      title: 'Derivatives change exposure without trading the portfolio',
      body: 'Futures and swaps rebalance beta or duration synthetically, at lower cost and faster than selling securities. The number of contracts follows from the target and current exposure divided by the contract exposure.',
      formula: 'N = [(β_T − β_P)/β_f]·(V_P/P_f)',
      exam: 'Watch the sign: a negative contract number means selling futures. Rounding to whole contracts is expected.',
    },
    {
      kicker: 'CURRENCY',
      title: 'Currency decisions sit on a spectrum, not a switch',
      body: 'From fully hedged to fully unhedged, with discretionary and active currency overlay in between. The strategic decision depends on horizon, correlation with the asset, and the cost of the hedge.',
      formula: 'R_DC = (1+R_FC)(1+R_FX) − 1',
      exam: 'A forward hedge locks the rate but creates roll risk. A long horizon and low correlation argue for hedging less.',
    },
  ],

  'cfa-l3-ethics': [
    {
      kicker: 'CONTINUITY',
      title: 'The Standards do not change; the stakes do',
      body: 'Level III applies the same Code and seven Standards to portfolio management decisions — suitability, fair dealing across accounts, and communication with clients about risk.',
      formula: null,
      exam: 'Suitability at Level III means suitability in the context of the total portfolio, not the individual security.',
    },
    {
      kicker: 'ASSET MANAGER CODE',
      title: 'The Asset Manager Code applies to firms',
      body: 'It sets six general principles covering loyalty to clients, investment process, trading, risk management and compliance, performance and disclosure. It is adopted by a firm, not by an individual.',
      formula: null,
      exam: 'Firms must adopt the Code in full — partial adoption cannot be claimed. This is the most examinable single fact in the reading.',
    },
    {
      kicker: 'SOFT DOLLARS',
      title: 'Brokerage is a client asset',
      body: 'Standard III(A) makes client brokerage the client\'s property. It may be used for research that benefits the client, but never to pay for the manager\'s own operating costs or to reward referrals.',
      formula: null,
      exam: 'Directed brokerage arranged by the client is permissible; the manager must still seek best execution and disclose the trade-off.',
    },
    {
      kicker: 'RISK DISCLOSURE',
      title: 'Communicate the process and its limits',
      body: 'Standard V(B) requires disclosure of the basic process, including significant limitations and the risks inherent in it. A model\'s assumptions are part of what must be communicated.',
      formula: null,
      exam: 'A change in investment process is a material change and must be promptly disclosed to all clients, not just new ones.',
    },
  ],

  'cfa-l3-pathway-portfolio': [
    {
      kicker: 'ACTIVE EQUITY',
      title: 'Bottom-up and top-down set different risk profiles',
      body: 'Fundamental strategies concentrate in fewer names with judgement-driven positions; quantitative strategies hold many names with modest tilts. The choice determines where active risk actually comes from.',
      formula: 'Active risk from tilts + selection',
      exam: 'A concentrated fundamental portfolio has high active share and high active risk. Quant strategies typically have lower active share.',
    },
    {
      kicker: 'YIELD CURVE',
      title: 'Match the trade to the curve view',
      body: 'Expect a parallel fall: extend duration. Expect steepening: buy the short end, sell the long. Expect a flattening: the reverse. Barbells gain from curvature; bullets lose to it.',
      formula: 'ΔP ≈ −D·Δy + ½C·Δy²',
      exam: 'A butterfly trade is a bet on curvature, not on direction. Identify which of the three moves the stem describes.',
    },
    {
      kicker: 'CREDIT',
      title: 'Credit strategy is spread duration management',
      body: 'The active decisions are spread duration, quality allocation and issuer selection. Excess return over the benchmark is spread carry less the expected credit loss less the change in spread times spread duration.',
      formula: 'EXR ≈ s·t − Δs·SD − t·p·L',
      exam: 'Bottom-up credit selection dominates in stable markets; top-down quality rotation dominates when spreads move sharply.',
    },
    {
      kicker: 'EXECUTION',
      title: 'The benchmark you choose defines the cost you report',
      body: 'Arrival price, VWAP and TWAP measure very different things. A benchmark that the trader can influence — VWAP over the trader\'s own participation — weakens the measurement.',
      formula: null,
      exam: 'Match algorithm to urgency: scheduled algorithms for low urgency and liquid names, liquidity-seeking for urgent or illiquid orders.',
    },
  ],

  'cfa-l3-pathway-private-markets': [
    {
      kicker: 'STRUCTURE',
      title: 'The GP–LP structure defines the economics',
      body: 'Limited partners commit capital; the general partner calls it over an investment period and returns it through distributions. Management fees are charged on committed capital early and invested capital later.',
      formula: null,
      exam: 'The waterfall matters: European (whole-fund) waterfalls pay carry later than American (deal-by-deal) ones. Clawbacks exist to correct the difference.',
    },
    {
      kicker: 'PERFORMANCE',
      title: 'Three multiples and one rate',
      body: 'DPI is realised — cash returned over paid-in. RVPI is unrealised value over paid-in. TVPI is their sum. IRR is money-weighted and can be manipulated by subscription-line facilities.',
      formula: 'TVPI = DPI + RVPI',
      exam: 'Early in a fund\'s life TVPI is mostly RVPI, so it depends on the GP\'s own marks. That dependence is the examinable weakness.',
    },
    {
      kicker: 'PRIVATE DEBT',
      title: 'Private debt trades liquidity for spread and covenants',
      body: 'Direct lending, mezzanine and unitranche structures earn an illiquidity premium and negotiate tighter covenants than public markets, at the price of concentration and workout risk.',
      formula: null,
      exam: 'Covenant-lite structures shift recovery risk to the lender. A stem describing weak covenants is describing lower expected recovery.',
    },
    {
      kicker: 'REAL ASSETS',
      title: 'Infrastructure returns follow the project life cycle',
      body: 'Greenfield projects carry construction and demand risk with equity-like returns; brownfield assets with contracted or regulated revenue behave closer to long-duration bonds.',
      formula: null,
      exam: 'Regulated or availability-based revenue means low correlation with the cycle. Demand-based revenue does not.',
    },
  ],

  'cfa-l3-pathway-private-wealth': [
    {
      kicker: 'PLANNING',
      title: 'Goals-based planning replaces one risk number with several',
      body: 'Each goal gets its own horizon, required probability of success and sub-portfolio. Aggregate risk is the result of the goal structure rather than a single stated risk tolerance.',
      formula: null,
      exam: 'A high-priority near-term goal is funded with low-risk assets regardless of the client\'s overall risk tolerance.',
    },
    {
      kicker: 'HUMAN CAPITAL',
      title: 'Human capital belongs in the balance sheet',
      body: 'The present value of future earnings is an asset. Bond-like human capital supports more financial equity; equity-like human capital, especially if correlated with the employer, argues for less.',
      formula: 'Total wealth = financial + human capital',
      exam: 'Concentrated employer stock alongside employment income is a correlation problem, and diversification is the answer.',
    },
    {
      kicker: 'TAX',
      title: 'Asset location is worth as much as asset allocation',
      body: 'Placing heavily taxed assets in tax-deferred accounts and tax-efficient assets in taxable accounts raises after-tax return without changing the allocation. Tax-loss harvesting defers, rather than eliminates, tax.',
      formula: 'FV = (1+r(1−t))ⁿ',
      exam: 'After-tax return calculations distinguish accrual, deferred capital gains and tax-exempt treatment. Identify the wrapper first.',
    },
    {
      kicker: 'TRANSFER',
      title: 'Lifetime gifts usually beat bequests',
      body: 'A gift made early removes future appreciation from the taxable estate and starts the recipient\'s compounding sooner. Relative tax rates and the time horizon determine the size of the advantage.',
      formula: 'RV_gift = FV_gift / FV_bequest',
      exam: 'If the recipient\'s tax rate is lower and the horizon is long, the gift dominates. Compute the ratio rather than reasoning qualitatively.',
    },
  ],
};
