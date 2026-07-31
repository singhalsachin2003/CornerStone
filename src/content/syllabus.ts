/**
 * Topic areas, official exam weights and learning modules.
 *
 * Source: CFA-and-FRM-Topicwise-Syllabus.pdf in design_handoff_frm_cfa_study_flow/
 *   · CFA Program — 2027 curriculum (Level II shown for 2026, the newest published outline)
 *   · FRM — 2026 curriculum
 *
 * Weights are the published bands, not point estimates. `weightMid` is the band's
 * midpoint and is only used for ordering and for the "weighted as in the real exam"
 * progress arithmetic — never shown to the candidate.
 */

export type ExamKey = 'CFA' | 'FRM';
export type LevelKey = 'L1' | 'L2' | 'L3' | 'P1' | 'P2';
export type PathwayKey = 'portfolio' | 'private-markets' | 'private-wealth';

export interface TopicArea {
  /** Stable, globally unique key — also the content lookup key and the route param. */
  key: string;
  name: string;
  /** Published band exactly as the outline states it, e.g. "15–20%". */
  weight: string;
  weightMid: number;
  /** One-line editorial summary, shown on the index variant and the review queue. */
  blurb: string;
  /** Official learning modules / subject coverage for this area. */
  modules: string[];
}

export interface Level {
  key: LevelKey;
  short: string;
  name: string;
  note: string;
  /** Level III only — the pathway block sits on top of the core topics. */
  hasPathway?: boolean;
  topics: TopicArea[];
}

export interface Exam {
  key: ExamKey;
  name: string;
  fullName: string;
  description: string;
  levelWord: string;
  /**
   * Next published sitting as an ISO date (YYYY-MM-DD).
   *
   * Must stay ISO: Hermes only parses ISO-8601, so a human-readable string like
   * "17 May 2027" yields Invalid Date on device even though V8 accepts it on web.
   * Use `formatExamDate` for display.
   */
  date: string;
  levels: Level[];
}

/** Parse an ISO date as local midnight — avoids the UTC off-by-one on day counts. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2027-05-17" → "17 May 2027". */
export function formatExamDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export interface Pathway {
  key: PathwayKey;
  name: string;
  short: string;
  weight: string;
  weightMid: number;
  blurb: string;
  modules: string[];
}

// ---------------------------------------------------------------------------
// CFA Level I — 2027 curriculum
// ---------------------------------------------------------------------------

const CFA_L1: TopicArea[] = [
  {
    key: 'cfa-l1-ethics',
    name: 'Ethical & Professional Standards',
    weight: '15–20%',
    weightMid: 17.5,
    blurb: 'The Code, the seven Standards, and how examiners phrase violations.',
    modules: [
      'Ethics and Trust in the Investment Profession',
      'Code of Ethics and Standards of Professional Conduct',
      'Guidance for Standard I: Professionalism',
      'Guidance for Standard II: Integrity of Capital Markets',
      'Guidance for Standard III: Duties to Clients',
      'Guidance for Standard IV: Duties to Employers',
      'Guidance for Standard V: Investment Analysis, Recommendations, and Actions',
      'Guidance for Standard VI: Conflicts of Interest',
      'Guidance for Standard VII: Responsibilities as a CFA Institute Member or Candidate',
      'Application of the Code and Standards: Level I',
    ],
  },
  {
    key: 'cfa-l1-quant',
    name: 'Quantitative Methods',
    weight: '6–9%',
    weightMid: 7.5,
    blurb: 'Returns, time value, distributions, hypothesis tests, simple regression.',
    modules: [
      'Rates and Returns',
      'Time Value of Money in Finance',
      'Statistical Measures of Asset Returns',
      'Probability Trees and Conditional Expectations',
      'Portfolio Mathematics',
      'Simulation Methods',
      'Estimation and Inference',
      'Hypothesis Testing',
      'Parametric and Non-Parametric Tests of Independence',
      'Simple Linear Regression',
      'Introduction to Big Data Techniques',
    ],
  },
  {
    key: 'cfa-l1-econ',
    name: 'Economics',
    weight: '6–9%',
    weightMid: 7.5,
    blurb: 'Market structures, business cycles, policy, trade and exchange rates.',
    modules: [
      'The Firm and Market Structures',
      'Understanding Business Cycles',
      'Fiscal Policy',
      'Monetary Policy',
      'Introduction to Geopolitics',
      'International Trade',
      'Capital Flows and the FX Market',
      'Exchange Rate Calculations',
    ],
  },
  {
    key: 'cfa-l1-fsa',
    name: 'Financial Statement Analysis',
    weight: '11–14%',
    weightMid: 12.5,
    blurb: 'The three statements, inventories, long-lived assets, quality of earnings.',
    modules: [
      'Introduction to Financial Statement Analysis',
      'Analyzing Income Statements',
      'Analyzing Balance Sheets',
      'Analyzing Statements of Cash Flows I',
      'Analyzing Statements of Cash Flows II',
      'Analysis of Inventories',
      'Analysis of Long-Term Assets',
      'Topics in Long-Term Liabilities and Equity',
      'Analysis of Income Taxes',
      'Financial Reporting Quality',
      'Financial Analysis Techniques',
      'Introduction to Financial Statement Modeling',
    ],
  },
  {
    key: 'cfa-l1-corp',
    name: 'Corporate Issuers',
    weight: '6–9%',
    weightMid: 7.5,
    blurb: 'Governance, working capital, capital allocation, capital structure.',
    modules: [
      'Organizational Forms, Corporate Issuer Features, and Ownership',
      'Investors and Other Stakeholders',
      'Corporate Governance: Conflicts, Mechanisms, Risks, and Benefits',
      'Working Capital and Liquidity',
      'Capital Investments and Capital Allocation',
      'Capital Structure',
      'Business Models',
    ],
  },
  {
    key: 'cfa-l1-equity',
    name: 'Equity Investments',
    weight: '11–14%',
    weightMid: 12.5,
    blurb: 'Market organisation, indexes, industry analysis, dividend models.',
    modules: [
      'Equity Instrument Features',
      'Equity Jurisdictions, Classes, and the Voting Process',
      'Equity Issuance and Trading',
      'Sources of Equity Returns',
      'Introduction to Equity Valuation',
      'Discounted Cash Flow (DCF) and Growth Models',
      'Relative Value Equity Valuation Approaches',
      'Financial Statement Forecasting in Equity Valuation',
      'Industry and Competitive Analysis',
      'Company Analysis: Past, Present, and Future',
      'Equity Analyst Research Reports',
      'The CAPM, Market Model, and Other Factor-Based Equity Models',
    ],
  },
  {
    key: 'cfa-l1-fixed',
    name: 'Fixed Income',
    weight: '11–14%',
    weightMid: 12.5,
    blurb: 'Pricing, yield measures, duration, convexity, credit spreads.',
    modules: [
      'Fixed-Income Instrument Features',
      'Fixed-Income Cash Flows and Types',
      'Fixed-Income Issuance and Trading',
      'Fixed-Income Markets for Corporate Issuers',
      'Fixed-Income Markets for Government Issuers',
      'Fixed-Income Bond Valuation: Prices and Yields',
      'Yield and Yield Spread Measures for Fixed-Rate Bonds',
      'Yield and Yield Spread Measures for Floating-Rate Instruments',
      'The Term Structure of Interest Rates: Spot, Par, and Forward Curves',
      'Interest Rate Risk and Return',
      'Yield-Based Bond Duration Measures and Properties',
      'Yield-Based Bond Convexity and Portfolio Properties',
      'Curve-Based and Empirical Fixed-Income Risk Measures',
      'Credit Risk',
      'Credit Analysis for Government Issuers',
      'Credit Analysis for Corporate Issuers',
      'Fixed-Income Securitization',
      'Asset-Backed Security (ABS) Instrument and Market Features',
      'Mortgage-Backed Security (MBS) Instrument and Market Features',
    ],
  },
  {
    key: 'cfa-l1-deriv',
    name: 'Derivatives',
    weight: '5–8%',
    weightMid: 6.5,
    blurb: 'Forwards, futures, swaps, options and arbitrage-free pricing.',
    modules: [
      'Derivative Instrument and Derivative Market Features',
      'Forward Commitment and Contingent Claim Features and Instruments',
      'Derivative Benefits, Risks, and Issuer and Investor Uses',
      'Arbitrage, Replication, and the Cost of Carry in Pricing Derivatives',
      'Pricing and Valuation of Forward Contracts',
      'Pricing and Valuation of Futures Contracts',
      'Pricing and Valuation of Interest Rate and Other Swaps',
      'Pricing and Valuation of Options',
      'Option Replication Using Put–Call Parity',
      'Valuing a Derivative Using a One-Period Binomial Model',
    ],
  },
  {
    key: 'cfa-l1-alt',
    name: 'Alternative Investments',
    weight: '7–10%',
    weightMid: 8.5,
    blurb: 'Private capital, real estate, natural resources, hedge funds, digital assets.',
    modules: [
      'Alternative Investment Features, Methods, and Structures',
      'Alternative Investment Performance and Returns',
      'Investments in Private Capital: Equity and Debt',
      'Real Estate and Infrastructure',
      'Natural Resources',
      'Hedge Funds',
      'Introduction to Digital Assets',
    ],
  },
  {
    key: 'cfa-l1-pm',
    name: 'Portfolio Management',
    weight: '8–12%',
    weightMid: 10,
    blurb: 'Risk and return, the CAPM, IPS construction, behavioural biases.',
    modules: [
      'Portfolio Risk and Return: Part I',
      'Portfolio Risk and Return: Part II',
      'Portfolio Management: An Overview',
      'Basics of Portfolio Planning and Construction',
      'The Behavioral Biases of Individuals',
      'Introduction to Risk Management',
    ],
  },
];

// ---------------------------------------------------------------------------
// CFA Level II — 2026 curriculum
// ---------------------------------------------------------------------------

const CFA_L2: TopicArea[] = [
  {
    key: 'cfa-l2-ethics',
    name: 'Ethical & Professional Standards',
    weight: '10–15%',
    weightMid: 12.5,
    blurb: 'The same Standards, applied to dense vignettes with competing duties.',
    modules: [
      'Code of Ethics and Standards of Professional Conduct',
      'Guidance for Standards I–VII',
      'Application of the Code and Standards: Level II',
    ],
  },
  {
    key: 'cfa-l2-quant',
    name: 'Quantitative Methods',
    weight: '5–10%',
    weightMid: 7.5,
    blurb: 'Multiple regression, misspecification, time series, machine learning.',
    modules: [
      'Basics of Multiple Regression and Underlying Assumptions',
      'Evaluating Regression Model Fit and Interpreting Model Results',
      'Model Misspecification',
      'Extensions of Multiple Regression',
      'Time-Series Analysis',
      'Machine Learning',
      'Big Data Projects',
    ],
  },
  {
    key: 'cfa-l2-econ',
    name: 'Economics',
    weight: '5–10%',
    weightMid: 7.5,
    blurb: 'Two dense modules: currency equilibrium value and economic growth.',
    modules: [
      'Currency Exchange Rates: Understanding Equilibrium Value',
      'Economic Growth',
    ],
  },
  {
    key: 'cfa-l2-fsa',
    name: 'Financial Statement Analysis',
    weight: '10–15%',
    weightMid: 12.5,
    blurb: 'Intercorporate investments, pensions, multinationals, report quality.',
    modules: [
      'Intercorporate Investments',
      'Employee Compensation: Post-Employment and Share-Based',
      'Multinational Operations',
      'Analysis of Financial Institutions',
      'Evaluating Quality of Financial Reports',
      'Integration of Financial Statement Analysis Techniques',
    ],
  },
  {
    key: 'cfa-l2-corp',
    name: 'Corporate Issuers',
    weight: '5–10%',
    weightMid: 7.5,
    blurb: 'Dividends and buybacks, ESG, advanced cost of capital, restructuring.',
    modules: [
      'Analysis of Dividends and Share Repurchases',
      'ESG Considerations in Investment Analysis',
      'Cost of Capital: Advanced Topics',
      'Corporate Restructuring',
    ],
  },
  {
    key: 'cfa-l2-equity',
    name: 'Equity Valuation',
    weight: '10–15%',
    weightMid: 12.5,
    blurb: 'DDM, free cash flow, multiples, residual income, private companies.',
    modules: [
      'Equity Valuation: Applications and Processes',
      'Discounted Dividend Valuation',
      'Free Cash Flow Valuation',
      'Market-Based Valuation: Price and Enterprise Value Multiples',
      'Residual Income Valuation',
      'Private Company Valuation',
    ],
  },
  {
    key: 'cfa-l2-fixed',
    name: 'Fixed Income',
    weight: '10–15%',
    weightMid: 12.5,
    blurb: 'Term structure dynamics, arbitrage-free valuation, embedded options, CDS.',
    modules: [
      'The Term Structure and Interest Rate Dynamics',
      'The Arbitrage-Free Valuation Framework',
      'Valuation and Analysis of Bonds with Embedded Options',
      'Credit Analysis Models',
      'Credit Default Swaps',
    ],
  },
  {
    key: 'cfa-l2-deriv',
    name: 'Derivatives',
    weight: '5–10%',
    weightMid: 7.5,
    blurb: 'Forward commitments and contingent claims — binomial, BSM, the Greeks.',
    modules: [
      'Pricing and Valuation of Forward Commitments',
      'Valuation of Contingent Claims',
    ],
  },
  {
    key: 'cfa-l2-alt',
    name: 'Alternative Investments',
    weight: '5–10%',
    weightMid: 7.5,
    blurb: 'Commodities, real estate direct and listed, hedge fund strategies.',
    modules: [
      'Introduction to Commodities and Commodity Derivatives',
      'Overview of Types of Real Estate Investment',
      'Investments in Real Estate through Publicly Traded Securities',
      'Hedge Fund Strategies',
    ],
  },
  {
    key: 'cfa-l2-pm',
    name: 'Portfolio Management',
    weight: '10–15%',
    weightMid: 12.5,
    blurb: 'Active management, ETFs, multifactor models, market risk, backtesting.',
    modules: [
      'Economics and Investment Markets',
      'Analysis of Active Portfolio Management',
      'Exchange-Traded Funds: Mechanics and Applications',
      'Using Multifactor Models',
      'Measuring and Managing Market Risk',
      'Backtesting and Simulation',
    ],
  },
];

// ---------------------------------------------------------------------------
// CFA Level III — 2027 core topics
// ---------------------------------------------------------------------------

const CFA_L3_CORE: TopicArea[] = [
  {
    key: 'cfa-l3-allocation',
    name: 'Asset Allocation',
    weight: '15–20%',
    weightMid: 17.5,
    blurb: 'Capital market expectations, allocation principles, real-world constraints.',
    modules: [
      'Capital Market Expectations, Part 1: Framework and Macro Considerations',
      'Capital Market Expectations, Part 2: Forecasting Asset Class Returns',
      'Overview of Asset Allocation',
      'Principles of Asset Allocation',
      'Asset Allocation with Real-World Constraints',
    ],
  },
  {
    key: 'cfa-l3-construction',
    name: 'Portfolio Construction',
    weight: '15–20%',
    weightMid: 17.5,
    blurb: 'Equity and fixed-income portfolios, alternatives, institutions, trading costs.',
    modules: [
      'Overview of Equity Portfolio Management',
      'Overview of Fixed-Income Portfolio Management',
      'Asset Allocation to Alternative Investments',
      'An Overview of Private Wealth Management',
      'Portfolio Management for Institutional Investors',
      'Trading Costs and Electronic Markets',
      'Case Study in Portfolio Management: Institutional (SWF)',
    ],
  },
  {
    key: 'cfa-l3-performance',
    name: 'Performance Measurement',
    weight: '5–10%',
    weightMid: 7.5,
    blurb: 'Attribution, appraisal, manager selection and the GIPS standards.',
    modules: [
      'Portfolio Performance Evaluation',
      'Investment Manager Selection',
      'Overview of the Global Investment Performance Standards (GIPS)',
    ],
  },
  {
    key: 'cfa-l3-derivatives',
    name: 'Derivatives & Risk Management',
    weight: '10–15%',
    weightMid: 12.5,
    blurb: 'Options strategies, swaps/forwards/futures strategies, currency management.',
    modules: [
      'Options Strategies',
      'Swaps, Forwards, and Futures Strategies',
      'Currency Management: An Introduction',
    ],
  },
  {
    key: 'cfa-l3-ethics',
    name: 'Ethical & Professional Standards',
    weight: '10–15%',
    weightMid: 12.5,
    blurb: 'The Standards plus the Asset Manager Code — which appears only at Level III.',
    modules: [
      'Code of Ethics and Standards of Professional Conduct',
      'Guidance for Standards I–VII (seven separate modules)',
      'Application of the Code and Standards: Level III',
      'Asset Manager Code of Professional Conduct',
    ],
  },
];

// ---------------------------------------------------------------------------
// CFA Level III — specialised pathways (30–35%, chosen at registration)
// ---------------------------------------------------------------------------

export const PATHWAYS: Pathway[] = [
  {
    key: 'portfolio',
    name: 'Portfolio Management',
    short: 'Portfolio Mgmt',
    weight: '30–35%',
    weightMid: 32.5,
    blurb: 'Active equity, yield-curve and credit strategy, LDI, trade execution.',
    modules: [
      'Index-Based Equity Strategies',
      'Active Equity Investing: Strategies',
      'Active Equity Investing: Portfolio Construction',
      'Liability-Driven and Index-Based Strategies',
      'Yield Curve Strategies',
      'Fixed-Income Active Management: Credit Strategies',
      'Trade Strategy and Execution',
      'Case Study in Portfolio Management: Institutional (Endowment)',
    ],
  },
  {
    key: 'private-markets',
    name: 'Private Markets',
    short: 'Private Markets',
    weight: '30–35%',
    weightMid: 32.5,
    blurb: 'GP/LP economics, private equity and debt, special situations, real assets.',
    modules: [
      'Private Investments and Structures',
      'General Partner and Investor Perspectives and the Investment Process',
      'Private Equity',
      'Private Debt',
      'Private Special Situations',
      'Private Real Estate Investments',
      'Infrastructure',
    ],
  },
  {
    key: 'private-wealth',
    name: 'Private Wealth',
    short: 'Private Wealth',
    weight: '30–35%',
    weightMid: 32.5,
    blurb: 'Goals-based planning, tax efficiency, human capital, wealth transfer.',
    modules: [
      'The Private Wealth Management Industry',
      'Working With the Wealthy',
      'Wealth Planning',
      'Investment Planning',
      'Preserving the Wealth',
      'Advising the Wealthy',
      'Transferring the Wealth',
    ],
  },
];

/** The chosen pathway becomes a sixth topic area on the Level III topic list. */
export function pathwayTopic(p: Pathway): TopicArea {
  return {
    key: `cfa-l3-pathway-${p.key}`,
    name: `${p.name} Pathway`,
    weight: p.weight,
    weightMid: p.weightMid,
    blurb: p.blurb,
    modules: p.modules,
  };
}

// ---------------------------------------------------------------------------
// FRM Part I — 2026
// ---------------------------------------------------------------------------

const FRM_P1: TopicArea[] = [
  {
    key: 'frm-p1-foundations',
    name: 'Foundations of Risk Management',
    weight: '20%',
    weightMid: 20,
    blurb: 'Risk taxonomy, governance, CAPM, multifactor models, financial disasters.',
    modules: [
      'Risk types, and the tools used to measure and manage them',
      'Risk governance: board and audit responsibilities, risk appetite, ERM',
      'Credit risk transfer mechanisms',
      'CAPM and risk-adjusted performance measurement',
      'Multifactor models',
      'Risk data aggregation and risk reporting',
      'Financial disasters and case studies; lessons of the global financial crisis',
      'GARP Code of Conduct',
    ],
  },
  {
    key: 'frm-p1-quant',
    name: 'Quantitative Analysis',
    weight: '20%',
    weightMid: 20,
    blurb: 'Probability, hypothesis testing, regression, time series, volatility, simulation.',
    modules: [
      "Probability, Bayes' rule, random variables and common distributions",
      'Sample moments and hypothesis testing',
      'Linear regression; multiple regression and regression diagnostics',
      'Stationary and non-stationary time series',
      'Measuring volatility and correlation',
      'Simulation methods and bootstrapping',
      'Machine learning and prediction',
    ],
  },
  {
    key: 'frm-p1-markets',
    name: 'Financial Markets & Products',
    weight: '30%',
    weightMid: 30,
    blurb: 'Institutions, market structure, futures, swaps, options, rates, FX, MBS.',
    modules: [
      'Financial institutions and their risks: banks, insurers, pension funds, mutual and hedge funds',
      'Economic vs regulatory capital; insurance company ratios',
      'Exchange-traded and OTC market structure, central counterparties',
      'Forwards and futures: mechanics, margin, hedge ratios, basis risk',
      'Swaps: cash flows and valuation',
      'Options: mechanics and payoffs',
      'Interest rates and interest-rate products',
      'Foreign exchange risk',
      'Corporate bonds; mortgages and mortgage-backed securities',
      'Commodity forwards and futures',
    ],
  },
  {
    key: 'frm-p1-valuation',
    name: 'Valuation & Risk Models',
    weight: '30%',
    weightMid: 30,
    blurb: 'VaR and ES, option valuation, bond risk, stress testing, credit and op risk.',
    modules: [
      'Value-at-Risk and Expected Shortfall; coherent risk measures',
      'Volatility and correlation estimation',
      'Economic and regulatory capital',
      'Stress testing and scenario analysis',
      'Option valuation; the binomial model and Black–Scholes–Merton',
      'Fixed-income valuation, duration, convexity and hedging',
      'Country and sovereign risk; external ratings and rating transition matrices',
      'Credit risk: expected loss, unexpected loss, credit VaR',
      'Operational risk: loss distributions, capital approaches, Monte Carlo estimation',
    ],
  },
];

// ---------------------------------------------------------------------------
// FRM Part II — 2026
// ---------------------------------------------------------------------------

const FRM_P2: TopicArea[] = [
  {
    key: 'frm-p2-market',
    name: 'Market Risk Measurement & Management',
    weight: '20%',
    weightMid: 20,
    blurb: 'VaR and ES estimation, backtesting, EVT, GARCH, copulas, FRTB.',
    modules: [
      'VaR estimation approaches and their limitations; backtesting VaR',
      'Expected Shortfall and other coherent measures; parametric and non-parametric estimation',
      'Extreme value theory and tail risk',
      'Volatility modelling: GARCH, EWMA, implied volatility surfaces',
      'Correlation and copulas',
      'Fixed-income and term-structure models; interest rate risk hedging',
      'Volatility smiles; exotic and mortgage-backed products',
      'Fundamental Review of the Trading Book (FRTB)',
    ],
  },
  {
    key: 'frm-p2-credit',
    name: 'Credit Risk Measurement & Management',
    weight: '20%',
    weightMid: 20,
    blurb: 'Merton and reduced-form models, credit VaR, counterparty risk, CVA, CDOs.',
    modules: [
      'Credit analysis and the credit process; ratings and rating transitions',
      'Structural and reduced-form default models; Merton model',
      'Portfolio credit risk, default correlation and credit VaR',
      'Counterparty risk, CVA/DVA/FVA and wrong-way risk',
      'Netting, collateral and margining',
      'Credit derivatives and credit default swaps',
      'Securitisation, structured credit and CDOs',
      'Basel credit risk capital frameworks; stress testing credit portfolios',
    ],
  },
  {
    key: 'frm-p2-operational',
    name: 'Operational Risk & Resilience',
    weight: '20%',
    weightMid: 20,
    blurb: 'RCSA and loss data, model risk, cyber, third parties, financial crime, Basel.',
    modules: [
      'Operational risk taxonomy, RCSA and loss data collection',
      'Modelling operational risk loss distributions; capital approaches',
      'Risk governance, risk appetite and the three lines of defence',
      'Model risk management and validation',
      'Cyber risk and information security; third-party and outsourcing risk',
      'Business continuity and operational resilience',
      'Financial crime: money laundering, sanctions and fraud',
      'Basel operational risk framework; regulation and supervision',
      'Stress testing and enterprise risk management',
    ],
  },
  {
    key: 'frm-p2-liquidity',
    name: 'Liquidity & Treasury Risk',
    weight: '15%',
    weightMid: 15,
    blurb: 'Funding vs market liquidity, LVaR, transfer pricing, IRRBB, LCR and NSFR.',
    modules: [
      'Liquidity risk: funding vs market liquidity',
      'Liquidity-adjusted VaR and transaction cost measurement',
      'Cash flow modelling and liquidity stress testing',
      'Intraday, collateral and contingent liquidity management',
      'Deposit and wholesale funding structures; transfer pricing',
      'Balance sheet management; repo markets',
      'Interest rate risk in the banking book (IRRBB)',
      'LCR, NSFR and the Basel liquidity framework',
      'Contingency funding plans',
    ],
  },
  {
    key: 'frm-p2-investment',
    name: 'Risk & Investment Management',
    weight: '15%',
    weightMid: 15,
    blurb: 'Factor theory, risk budgeting, attribution, hedge funds, illiquid assets.',
    modules: [
      'Factor theory and portfolio construction',
      'Risk budgeting and risk monitoring for investment portfolios',
      'Portfolio performance measurement and attribution',
      'Hedge fund strategies, structures and risks',
      'Illiquid assets and valuation of private holdings',
      'Risk-adjusted performance measures',
      'Portfolio VaR and risk decomposition',
    ],
  },
  {
    key: 'frm-p2-current',
    name: 'Current Issues in Financial Markets',
    weight: '10%',
    weightMid: 10,
    blurb: "This cycle's readings — AI in finance, climate risk, digital assets, bank stress.",
    modules: [
      'A rotating set of readings, replaced substantially each year',
      'Artificial intelligence and machine learning in finance',
      'Climate and transition risk',
      'Digital assets and stablecoins',
      'Cyber and operational resilience',
      'Post-2023 banking-stress lessons',
    ],
  },
];

// ---------------------------------------------------------------------------

export const EXAMS: Record<ExamKey, Exam> = {
  CFA: {
    key: 'CFA',
    name: 'CFA',
    fullName: 'Chartered Financial Analyst®',
    // The setup screen is the first prominent use of the marks in the app, and both
    // bodies' trademark guidelines ask for the symbol there. The bare "CFA" used as
    // a label elsewhere stays bare on purpose — it reads as the exam being studied,
    // which is what nominative use is, and ® on every screen would be noise.
    description:
      'Chartered Financial Analyst® — investment analysis, valuation, portfolio management, ethics.',
    levelWord: '3 LEVELS',
    date: '2027-05-17',
    levels: [
      {
        key: 'L1',
        short: 'I',
        name: 'Level I',
        note: 'Tools and concepts — 10 topic areas, 180 questions',
        topics: CFA_L1,
      },
      {
        key: 'L2',
        short: 'II',
        name: 'Level II',
        note: 'Asset valuation — 22 item sets (vignettes)',
        topics: CFA_L2,
      },
      {
        key: 'L3',
        short: 'III',
        name: 'Level III',
        note: 'Portfolio management — essay + item sets, plus a pathway',
        hasPathway: true,
        topics: CFA_L3_CORE,
      },
    ],
  },
  FRM: {
    key: 'FRM',
    name: 'FRM',
    fullName: 'Financial Risk Manager®',
    description:
      'Financial Risk Manager® — market, credit, operational and liquidity risk measurement.',
    levelWord: '2 PARTS',
    date: '2026-11-15',
    levels: [
      {
        key: 'P1',
        short: 'I',
        name: 'Part I',
        note: 'Tools — 100 questions, four topic areas',
        topics: FRM_P1,
      },
      {
        key: 'P2',
        short: 'II',
        name: 'Part II',
        note: 'Application — 80 questions, six topic areas',
        topics: FRM_P2,
      },
    ],
  },
};

export const EXAM_KEYS: ExamKey[] = ['CFA', 'FRM'];

export function getExam(key: ExamKey): Exam {
  return EXAMS[key];
}

export function getLevel(exam: ExamKey, level: LevelKey): Level | undefined {
  return EXAMS[exam].levels.find((l) => l.key === level);
}

export function getPathway(key: PathwayKey): Pathway {
  return PATHWAYS.find((p) => p.key === key) ?? PATHWAYS[0];
}

/**
 * The topic list for a given exam + level. Level III appends the chosen pathway
 * as a sixth area, matching the outline's "5 core + 1 pathway" topic count.
 */
export function topicsFor(
  exam: ExamKey,
  level: LevelKey,
  pathway: PathwayKey = 'portfolio',
): TopicArea[] {
  const lvl = getLevel(exam, level);
  if (!lvl) return [];
  if (lvl.hasPathway) return [...lvl.topics, pathwayTopic(getPathway(pathway))];
  return lvl.topics;
}

/** Every topic area in the app, used for content-coverage checks and lookups. */
export const ALL_TOPICS: TopicArea[] = [
  ...CFA_L1,
  ...CFA_L2,
  ...CFA_L3_CORE,
  ...PATHWAYS.map(pathwayTopic),
  ...FRM_P1,
  ...FRM_P2,
];

const TOPIC_INDEX = new Map(ALL_TOPICS.map((t) => [t.key, t]));

export function topicByKey(key: string): TopicArea | undefined {
  return TOPIC_INDEX.get(key);
}
