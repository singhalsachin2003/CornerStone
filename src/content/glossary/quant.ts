/** Quantitative methods, statistics and the time value of money. CFA L1–L2, FRM P1. */
import { GlossaryTerm } from './types';

export const QUANT_TERMS: GlossaryTerm[] = [
  {
    key: 'time-value-of-money',
    term: 'Time value of money',
    aka: ['TVM'],
    definition:
      'The principle that a sum available today is worth more than the same sum later, because today’s sum can be invested. Every discounting and compounding formula in the curriculum is an application of it.',
    topics: ['cfa-l1-quant'],
  },
  {
    key: 'present-value',
    term: 'Present value',
    aka: ['PV', 'discounted value'],
    definition:
      'What a future cash flow is worth today, found by discounting it at a rate that reflects its risk and timing.',
    formula: 'PV = FV / (1 + r)^n',
    note: 'Match the rate to the period. A quarterly cash flow discounted at an annual rate is the single most common arithmetic slip in the exam.',
    topics: ['cfa-l1-quant'],
  },
  {
    key: 'future-value',
    term: 'Future value',
    aka: ['FV'],
    definition: 'What a sum invested today grows to by a stated date at a stated rate.',
    formula: 'FV = PV × (1 + r)^n',
    topics: ['cfa-l1-quant'],
  },
  {
    key: 'annuity',
    term: 'Annuity',
    definition:
      'A series of equal cash flows at equal intervals. An ordinary annuity pays at the end of each period; an annuity due pays at the beginning.',
    note: 'An annuity due is worth exactly (1 + r) times the ordinary annuity of the same flows — one extra period of compounding on every payment.',
    topics: ['cfa-l1-quant'],
  },
  {
    key: 'perpetuity',
    term: 'Perpetuity',
    definition: 'An annuity with no end date — a level cash flow received forever.',
    formula: 'PV = C / r',
    note: 'Only valid where r > 0 and the payment is level. A growing perpetuity uses C / (r − g), and requires r > g or the value is meaningless.',
    topics: ['cfa-l1-quant', 'cfa-l1-equity'],
  },
  {
    key: 'effective-annual-rate',
    term: 'Effective annual rate',
    aka: ['EAR', 'annual equivalent rate'],
    definition:
      'The rate that, compounded once a year, gives the same growth as a stated nominal rate compounded more often.',
    formula: 'EAR = (1 + r_nominal / m)^m − 1',
    note: 'EAR rises with compounding frequency and converges on e^r − 1 under continuous compounding. Comparing two quoted rates of different frequencies without converting to EAR is a trap.',
    topics: ['cfa-l1-quant'],
  },
  {
    key: 'continuous-compounding',
    term: 'Continuous compounding',
    definition:
      'Compounding over infinitely small intervals. The limit of periodic compounding as the number of periods per year goes to infinity.',
    formula: 'FV = PV × e^(r × t)',
    note: 'The default convention in derivatives pricing and in most FRM formulas, which is why the same position can look differently priced in two parts of the curriculum.',
    topics: ['cfa-l1-quant', 'frm-p1-quant', 'frm-p1-valuation'],
  },
  {
    key: 'net-present-value',
    term: 'Net present value',
    aka: ['NPV'],
    definition:
      'The present value of a project’s cash inflows less the present value of its outflows. A positive NPV adds to shareholder wealth.',
    note: 'NPV and IRR agree on accept/reject for a conventional independent project, and can disagree on ranking mutually exclusive ones. Where they disagree, NPV wins.',
    topics: ['cfa-l1-quant', 'cfa-l1-corp'],
  },
  {
    key: 'internal-rate-of-return',
    term: 'Internal rate of return',
    aka: ['IRR'],
    definition: 'The discount rate at which a project’s NPV is zero.',
    note: 'A cash flow stream that changes sign more than once can have more than one IRR, or none. That is the whole reason NPV is the preferred rule.',
    topics: ['cfa-l1-quant', 'cfa-l1-corp'],
  },
  {
    key: 'money-weighted-return',
    term: 'Money-weighted return',
    aka: ['MWR', 'dollar-weighted return'],
    definition:
      'The IRR of a portfolio including the timing and size of every contribution and withdrawal.',
    note: 'Measures the investor’s experience, not the manager’s skill, because the client controls the cash flows. Use it to judge an account, never to compare managers.',
    topics: ['cfa-l1-quant', 'cfa-l3-performance'],
  },
  {
    key: 'time-weighted-return',
    term: 'Time-weighted return',
    aka: ['TWR'],
    definition:
      'The compound growth of one unit of currency in a portfolio, with the effect of external cash flows removed by chain-linking sub-period returns.',
    note: 'The GIPS-required basis for comparing managers, precisely because it is immune to client cash flow timing.',
    topics: ['cfa-l1-quant', 'cfa-l3-performance'],
  },
  {
    key: 'mean',
    term: 'Arithmetic mean',
    aka: ['average'],
    definition: 'The sum of the observations divided by their number.',
    note: 'The right estimate of a single future period’s return. For growth already achieved over several periods, the geometric mean is the honest number.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'geometric-mean',
    term: 'Geometric mean',
    definition:
      'The constant rate that would produce the observed compound growth over the whole period.',
    formula: 'Geometric mean = [(1 + r₁)(1 + r₂)…(1 + rₙ)]^(1/n) − 1',
    note: 'Always ≤ the arithmetic mean, and strictly less whenever returns vary. The gap widens with volatility — which is why volatile strategies advertise the arithmetic figure.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'harmonic-mean',
    term: 'Harmonic mean',
    definition:
      'The reciprocal of the average of reciprocals. Used for averaging ratios over a fixed money amount, such as the cost of shares bought at different prices.',
    note: 'Harmonic ≤ geometric ≤ arithmetic, always. Cost averaging is the standard exam application.',
    topics: ['cfa-l1-quant'],
  },
  {
    key: 'variance',
    term: 'Variance',
    definition: 'The average squared deviation from the mean — the standard measure of dispersion.',
    note: 'A sample variance divides by n − 1, not n. Dividing by n gives a biased estimate, and the correction is examined directly.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'standard-deviation',
    term: 'Standard deviation',
    aka: ['volatility', 'vol', 'sigma'],
    definition:
      'The square root of variance, in the same units as the data. In finance it is the usual proxy for total risk.',
    note: 'Penalises upside and downside equally, which is its main criticism and the motivation for downside measures like semi-deviation and VaR.',
    topics: ['cfa-l1-quant', 'cfa-l1-pm', 'frm-p1-quant', 'frm-p2-market'],
  },
  {
    key: 'covariance',
    term: 'Covariance',
    definition:
      'A measure of how two variables move together. Positive means they tend to move the same way; its size depends on the units of both variables.',
    note: 'Unbounded and therefore hard to interpret on its own. Correlation is covariance scaled to [−1, 1], which is why correlation is what gets quoted.',
    topics: ['cfa-l1-quant', 'cfa-l1-pm', 'frm-p1-quant'],
  },
  {
    key: 'correlation',
    term: 'Correlation',
    aka: ['correlation coefficient'],
    definition:
      'Covariance divided by the product of the two standard deviations, giving a unit-free number between −1 and +1.',
    formula: 'ρ = Cov(X, Y) / (σₓ × σᵧ)',
    note: 'Measures linear association only. A perfect non-linear relationship can show near-zero correlation, and correlation tends to rise sharply in a crisis — exactly when diversification was being relied on.',
    topics: ['cfa-l1-quant', 'cfa-l1-pm', 'frm-p1-quant', 'frm-p2-market'],
  },
  {
    key: 'skewness',
    term: 'Skewness',
    definition:
      'The asymmetry of a distribution. Positive skew has a long right tail; negative skew has a long left tail.',
    note: 'Returns on short-volatility and credit strategies are negatively skewed: many small gains, occasional large losses. Mean and standard deviation alone hide that.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'kurtosis',
    term: 'Kurtosis',
    aka: ['excess kurtosis', 'fat tails'],
    definition:
      'The weight of a distribution’s tails. Excess kurtosis is kurtosis minus 3, so a normal distribution has excess kurtosis of zero.',
    note: 'Leptokurtic — positive excess kurtosis — means extreme outcomes are likelier than normal. Financial returns are reliably leptokurtic, which is why normal-based VaR understates the tail.',
    topics: ['cfa-l1-quant', 'frm-p1-quant', 'frm-p2-market'],
  },
  {
    key: 'normal-distribution',
    term: 'Normal distribution',
    aka: ['Gaussian distribution', 'bell curve'],
    definition: 'A symmetric, bell-shaped distribution fully described by its mean and variance.',
    note: 'Approximately 68% of outcomes fall within one standard deviation, 95% within two and 99% within 2.58. Those three numbers appear constantly in VaR and confidence-interval questions.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'lognormal-distribution',
    term: 'Lognormal distribution',
    definition:
      'The distribution of a variable whose natural logarithm is normally distributed. Bounded below by zero and right-skewed.',
    note: 'Used for asset prices because a price cannot go negative, while continuously compounded returns can be modelled as normal. That pairing is the basis of Black–Scholes–Merton.',
    topics: ['cfa-l1-quant', 'cfa-l1-deriv', 'frm-p1-valuation'],
  },
  {
    key: 'central-limit-theorem',
    term: 'Central limit theorem',
    aka: ['CLT'],
    definition:
      'For a large enough sample, the distribution of the sample mean approaches normal regardless of the shape of the underlying population.',
    note: 'Thirty observations is the conventional threshold. It justifies using normal-based confidence intervals on means — not on individual observations.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'standard-error',
    term: 'Standard error',
    definition: 'The standard deviation of a sample statistic, usually of the sample mean.',
    formula: 'SE = σ / √n',
    note: 'Falls with the square root of sample size, so quartering the standard error needs sixteen times the data.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'confidence-interval',
    term: 'Confidence interval',
    definition:
      'A range that will contain the true parameter in a stated proportion of repeated samples.',
    note: 'It is a statement about the procedure, not about this one interval. "95% probability the mean is in this range" is the classic misreading.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'null-hypothesis',
    term: 'Null hypothesis',
    aka: ['H0'],
    definition:
      'The statement a test assumes true until the data give sufficient reason to reject it. Always the one containing equality.',
    note: 'Failing to reject is not the same as proving. The null survives for want of evidence, not because it was shown to be true.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'type-i-error',
    term: 'Type I error',
    aka: ['false positive', 'alpha error'],
    definition: 'Rejecting a true null hypothesis. Its probability is the significance level, α.',
    note: 'Type I and Type II trade off against each other at a fixed sample size. Only more data improves both.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'type-ii-error',
    term: 'Type II error',
    aka: ['false negative', 'beta error'],
    definition:
      'Failing to reject a false null hypothesis. One minus its probability is the power of the test.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'p-value',
    term: 'p-value',
    definition:
      'The smallest significance level at which the null could be rejected — the probability of a result at least this extreme if the null were true.',
    note: 'Not the probability the null is true. Reject when p < α.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'linear-regression',
    term: 'Linear regression',
    aka: ['ordinary least squares', 'OLS'],
    definition:
      'Fitting a straight line through data by minimising the sum of squared residuals, to explain a dependent variable by one or more independent variables.',
    topics: ['cfa-l1-quant', 'cfa-l2-quant', 'frm-p1-quant'],
  },
  {
    key: 'r-squared',
    term: 'Coefficient of determination',
    aka: ['R-squared', 'R2'],
    definition: 'The fraction of the dependent variable’s variation explained by the regression.',
    note: 'Never falls when a variable is added, however useless that variable is. Adjusted R² penalises extra regressors and is the honest comparison between models of different size.',
    topics: ['cfa-l1-quant', 'cfa-l2-quant', 'frm-p1-quant'],
  },
  {
    key: 'heteroskedasticity',
    term: 'Heteroskedasticity',
    definition: 'Regression errors whose variance is not constant across observations.',
    note: 'Coefficients stay unbiased; the standard errors do not. So t-statistics are wrong and inference is unreliable — the fix is robust standard errors, not a different slope.',
    topics: ['cfa-l2-quant', 'frm-p1-quant'],
  },
  {
    key: 'serial-correlation',
    term: 'Serial correlation',
    aka: ['autocorrelation'],
    definition: 'Regression errors correlated with their own past values.',
    note: 'Common in time series. Positive serial correlation deflates standard errors, which inflates t-statistics and manufactures significance that is not there.',
    topics: ['cfa-l2-quant', 'frm-p1-quant'],
  },
  {
    key: 'multicollinearity',
    term: 'Multicollinearity',
    definition: 'Two or more independent variables in a regression that are highly correlated.',
    note: 'The giveaway is a high R² with individually insignificant t-statistics. The regression as a whole explains plenty; it cannot attribute the explanation.',
    topics: ['cfa-l2-quant', 'frm-p1-quant'],
  },
  {
    key: 'monte-carlo-simulation',
    term: 'Monte Carlo simulation',
    definition:
      'Estimating a distribution of outcomes by repeatedly drawing random inputs from assumed distributions and recomputing the result.',
    note: 'The output is only as good as the assumed input distributions and correlations. It generates precision, not accuracy.',
    topics: ['cfa-l1-quant', 'frm-p1-quant', 'frm-p2-market'],
  },
  {
    key: 'bootstrapping-statistics',
    term: 'Bootstrap',
    definition:
      'Resampling the observed data with replacement to estimate the sampling distribution of a statistic, without assuming a parametric form.',
    note: 'Distinct from bootstrapping a spot curve in fixed income, which is a different operation entirely under the same word.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
  {
    key: 'survivorship-bias',
    term: 'Survivorship bias',
    definition:
      'Distortion caused by studying only the entities that lasted long enough to appear in the sample.',
    note: 'Inflates measured fund returns, because closed and merged funds drop out of the index. A staple of both ethics and quant questions.',
    topics: ['cfa-l1-quant', 'cfa-l1-alt', 'frm-p1-quant'],
  },
  {
    key: 'data-mining',
    term: 'Data mining',
    aka: ['data snooping'],
    definition:
      'Searching a dataset repeatedly until a relationship appears, then presenting it as though it had been hypothesised in advance.',
    note: 'Test on out-of-sample data. A relationship with no economic rationale that only shows up after many passes is the definition of the problem.',
    topics: ['cfa-l1-quant', 'frm-p1-quant'],
  },
];
