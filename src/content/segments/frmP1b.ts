import { PremiumSegmentBank } from '../types';

/**
 * FRM Part I — premium segments, tranche II.
 *
 * A third segment per topic area, drawn from the modules the first two did not
 * reach. Part I's outline lists probability, option mechanics, FX risk and
 * corporate bonds as separate readings and tranche I touched none of them.
 */
export const FRM_P1_SEGMENTS_II: PremiumSegmentBank = {
  'frm-p1-foundations': [
    {
      slug: 'risk-types-and-transfer',
      name: 'Risk Types & Credit Transfer',
      blurb: 'The taxonomy that organises everything else, and how credit risk is moved.',
      modules: [
        'Risk types, and the tools used to measure and manage them',
        'Credit risk transfer mechanisms',
      ],
      cards: [
        {
          kicker: 'TAXONOMY',
          title: 'Market, credit, liquidity, operational — and the boundaries leak',
          body: 'Market risk is price movement; credit risk is counterparty failure; liquidity risk splits into funding and market; operational risk is people, process, systems and external events. Most large losses cross two or more categories, which is why enterprise risk management exists.',
          formula: null,
          exam: 'A trading loss that could not be closed out is market risk crystallised through market liquidity risk. Name both.',
        },
        {
          kicker: 'TRANSFER',
          title: 'Four ways to move a credit exposure, with different residuals',
          body: 'Sell the loan outright; buy a credit derivative; securitise a pool; or buy insurance or a guarantee. Each leaves something behind — counterparty risk on the protection seller, basis risk against the reference obligation, or retained first-loss in a securitisation.',
          formula: null,
          exam: 'Buying protection converts credit risk on the borrower into credit risk on the protection seller. It does not remove it.',
        },
        {
          kicker: 'MEASURE',
          title: 'Expected loss is a cost; unexpected loss is why capital exists',
          body: 'Expected loss belongs in the price and in provisions. Unexpected loss — the dispersion around it — is what economic capital absorbs. A business priced only for expected loss is a business with no buffer against a normal bad year.',
          formula: 'EL = PD × LGD × EAD',
          exam: 'Risk-adjusted return measures divide by capital, which is unexpected loss, not by expected loss.',
        },
      ],
      questions: [
        {
          text: 'A hedge fund cannot exit a large position and is forced to sell over several days at successively worse prices. The loss is best attributed to:',
          given: null,
          opts: [
            'Credit risk alone',
            'Market risk crystallised through market liquidity risk',
            'Operational risk',
            'Funding liquidity risk alone',
          ],
          a: 1,
          why: 'The position lost value because prices moved, and the loss was magnified because the market could not absorb the size. Both categories are needed to describe it.',
          ref: 'Risk types, and the tools used to measure and manage them',
        },
        {
          text: 'A bank buys credit protection on a corporate borrower from a dealer. Its remaining credit exposure is:',
          given: null,
          opts: [
            'Nil',
            'To the dealer, and to the risk that the two default together',
            'To the borrower only',
            'To the clearing house only',
          ],
          a: 1,
          why: 'Protection converts exposure to the borrower into exposure to the seller, plus the wrong-way risk that both fail in the same scenario.',
          ref: 'Credit risk transfer mechanisms',
        },
        {
          text: 'An originator securitises a loan pool and retains the first-loss tranche. Its position is best described as:',
          given: null,
          opts: [
            'Fully transferred, since the loans are off balance sheet',
            'Retaining the most concentrated credit exposure in the pool',
            'Transferring only operational risk',
            'Holding the senior claim',
          ],
          a: 1,
          why: 'The first-loss piece absorbs early defaults, so the originator keeps the most credit-sensitive part while moving the rest. Retention requirements exist precisely to keep that alignment.',
          ref: 'Credit risk transfer mechanisms',
        },
        {
          text: 'A loan portfolio has expected loss of 40 million a year and a 99.9% worst-case loss of 310 million. Economic capital is closest to:',
          given: 'expected loss 40m; 99.9% loss 310m',
          opts: ['270 million', '310 million', '350 million', '40 million'],
          a: 0,
          why: 'Capital covers the unexpected part: 310 − 40 = 270 million. Expected loss is priced and provisioned rather than capitalised.',
          ref: 'Risk types, and the tools used to measure and manage them',
        },
        {
          text: 'An exposure of 50 million has a probability of default of 1.5% and a recovery rate of 35%. Expected loss is:',
          given: 'EAD 50m; PD 1.5%; recovery 35%',
          opts: ['262,500', '487,500', '750,000', '175,000'],
          a: 1,
          why: 'LGD = 65%. EL = 0.015 × 0.65 × 50,000,000 = 487,500.',
          ref: 'Risk types, and the tools used to measure and manage them',
        },
        {
          text: 'A guarantee from a parent company covering a subsidiary’s borrowings is weakest as a credit mitigant when:',
          given: null,
          opts: [
            'The guarantee is unlimited in amount',
            'The parent’s creditworthiness is highly correlated with the subsidiary’s',
            'The guarantee is governed by local law',
            'The subsidiary is profitable',
          ],
          a: 1,
          why: 'A guarantee is worth what the guarantor is worth when it is called. High correlation means the guarantee fails in exactly the scenario that triggers it.',
          ref: 'Credit risk transfer mechanisms',
        },
      ],
    },
  ],

  'frm-p1-quant': [
    {
      slug: 'probability-and-inference',
      name: 'Probability & Inference',
      blurb: 'Bayes, the distributions that matter, and testing a sample moment.',
      modules: [
        "Probability, Bayes' rule, random variables and common distributions",
        'Sample moments and hypothesis testing',
      ],
      cards: [
        {
          kicker: 'BAYES',
          title: 'The base rate is what people leave out',
          body: 'Bayes updates a prior with evidence. When the event is rare, a test with a low false positive rate still produces mostly false positives, because the base rate dominates. This is why a 99% accurate fraud flag on a 0.1% fraud rate is mostly noise.',
          formula: 'P(A|B) = P(B|A)P(A) / P(B)',
          exam: 'Write the two-way table. It converts every Bayes question into arithmetic.',
        },
        {
          kicker: 'DISTRIBUTIONS',
          title: 'Four that carry most of the syllabus',
          body: 'Binomial for a fixed number of independent trials; Poisson for counts in an interval, which is why it models operational loss frequency; normal for sums of many small effects; and the t distribution when the variance is estimated from a small sample.',
          formula: 'Poisson: P(X = k) = λ^k e^(−λ)/k!',
          exam: 'For a Poisson variable the mean and the variance are both λ. That identity is examined directly.',
        },
        {
          kicker: 'TESTS',
          title: 'A test is a statistic, a distribution and a decision rule',
          body: 'Compute the statistic, compare it with the critical value from the right distribution, and state the conclusion in terms of the null. Failing to reject is never proof of the null; it is a failure to find evidence against it at the chosen level.',
          formula: 't = (x̄ − μ₀)/(s/√n)',
          exam: 'One-tailed and two-tailed critical values differ. Read the alternative hypothesis before looking anything up.',
        },
      ],
      questions: [
        {
          text: 'A screening test flags 95% of fraudulent transactions and falsely flags 2% of legitimate ones. Fraud occurs in 0.5% of transactions. The probability that a flagged transaction is actually fraudulent is closest to:',
          given: 'sensitivity 95%; false positive rate 2%; base rate 0.5%',
          opts: ['0.19', '0.50', '0.95', '0.02'],
          a: 0,
          why: 'True positives = 0.005 × 0.95 = 0.00475. False positives = 0.995 × 0.02 = 0.0199. P = 0.00475/(0.00475 + 0.0199) = 0.193.',
          ref: "Probability, Bayes' rule, random variables and common distributions",
        },
        {
          text: 'Operational loss events at a bank occur at an average rate of 3 a year. Under a Poisson model, the probability of exactly 5 events next year is closest to:',
          given: 'λ = 3; k = 5',
          opts: ['0.050', '0.101', '0.168', '0.224'],
          a: 1,
          why: 'P = 3⁵ e⁻³/5! = 243 × 0.049787 / 120 = 0.1008.',
          ref: "Probability, Bayes' rule, random variables and common distributions",
        },
        {
          text: 'For a Poisson-distributed loss count with λ = 4, the variance is:',
          given: 'λ = 4',
          opts: ['2', '4', '8', '16'],
          a: 1,
          why: 'A Poisson variable has mean and variance both equal to λ, so the variance is 4.',
          ref: "Probability, Bayes' rule, random variables and common distributions",
        },
        {
          text: 'A sample of 25 monthly returns has a mean of 1.1% and a standard deviation of 3.0%. Testing whether the true mean is zero, the t-statistic is closest to:',
          given: 'n = 25; x̄ = 1.1%; s = 3.0%',
          opts: ['0.37', '1.83', '2.75', '9.17'],
          a: 1,
          why: 't = 0.011/(0.03/5) = 0.011/0.006 = 1.833.',
          ref: 'Sample moments and hypothesis testing',
        },
        {
          text: 'At the 5% level with 24 degrees of freedom, a two-tailed critical value is about 2.06. Based on the previous question, the analyst should:',
          given: 't = 1.83; critical value 2.06; two-tailed at 5%',
          opts: [
            'Reject the null and conclude the mean is positive',
            'Fail to reject the null of a zero mean',
            'Conclude the mean is zero',
            'Use a one-tailed test to reach significance',
          ],
          a: 1,
          why: '1.83 is below 2.06, so the null is not rejected. Failing to reject is not proof that the mean is zero, and switching to a one-tailed test after seeing the data is not legitimate.',
          ref: 'Sample moments and hypothesis testing',
        },
        {
          text: 'A portfolio manager reports that a strategy is profitable at the 5% significance level, having tested forty strategies and reported the best. The reported significance is:',
          given: '40 strategies tested; best reported at 5%',
          opts: [
            'Valid, since the test was correctly specified',
            'Overstated — with 40 tests, about two significant results are expected by chance',
            'Understated',
            'Valid only if the strategies are independent',
          ],
          a: 1,
          why: 'A 5% threshold applied forty times produces roughly two false positives on average. The reported p-value describes a single test, not a search.',
          ref: 'Sample moments and hypothesis testing',
        },
      ],
    },
  ],

  'frm-p1-markets': [
    {
      slug: 'options-fx-and-corporate-bonds',
      name: 'Options, FX & Corporate Bonds',
      blurb: 'Payoff diagrams, translation against transaction exposure, and bond covenants.',
      modules: [
        'Options: mechanics and payoffs',
        'Foreign exchange risk',
        'Corporate bonds; mortgages and mortgage-backed securities',
      ],
      cards: [
        {
          kicker: 'PAYOFFS',
          title: 'Draw the diagram before answering',
          body: 'Long call: unlimited upside, loss capped at the premium. Long put: gain capped at the strike less premium, loss capped at the premium. Short positions mirror them, and the short call is the one with unbounded loss.',
          formula: 'call payoff = max(0, S − X);  put payoff = max(0, X − S)',
          exam: 'Payoff excludes the premium; profit includes it. Items are usually asking about profit.',
        },
        {
          kicker: 'FX EXPOSURE',
          title: 'Transaction, translation, economic — three different problems',
          body: 'Transaction exposure is a contracted cash flow in a foreign currency and is hedged with forwards. Translation exposure is an accounting consolidation effect. Economic exposure is the effect of currency moves on future competitiveness, and it cannot be hedged with a forward.',
          formula: null,
          exam: 'Hedging translation exposure creates real cash flow risk to fix an accounting number. That trade-off is examined.',
        },
        {
          kicker: 'BONDS',
          title: 'A corporate bond is a package of promises with a recovery attached',
          body: 'Seniority and security determine recovery; covenants determine what the issuer may do beforehand; the call or put determines who owns the optionality. Rating agencies rate the issuer and separately notch the instrument for its position in the structure.',
          formula: null,
          exam: 'Secured bank debt typically recovers far more than senior unsecured, which recovers far more than subordinated.',
        },
      ],
      questions: [
        {
          text: 'An investor writes a put struck at 40 for a premium of 2.50. The underlying finishes at 33. The investor’s profit is:',
          given: 'short put; strike 40; premium 2.50; final price 33',
          opts: ['−4.50', '2.50', '−7.00', '4.50'],
          a: 0,
          why: 'The put is exercised against the writer for 40 − 33 = 7.00. Profit = 2.50 − 7.00 = −4.50.',
          ref: 'Options: mechanics and payoffs',
        },
        {
          text: 'Which position has theoretically unlimited loss?',
          given: null,
          opts: ['Long call', 'Long put', 'Short call', 'Short put'],
          a: 2,
          why: 'A naked short call loses without bound as the underlying rises. The short put’s loss is capped at the strike less the premium, since the price cannot fall below zero.',
          ref: 'Options: mechanics and payoffs',
        },
        {
          text: 'A UK exporter has agreed to receive 12 million euros in six months. This is best described as:',
          given: null,
          opts: [
            'Translation exposure',
            'Transaction exposure, hedgeable with a forward sale of euros',
            'Economic exposure',
            'Basis risk',
          ],
          a: 1,
          why: 'A contracted future foreign currency cash flow is transaction exposure, and a forward matching the amount and date removes it.',
          ref: 'Foreign exchange risk',
        },
        {
          text: 'A company hedges the translation exposure arising from consolidating a foreign subsidiary by selling the foreign currency forward. The principal criticism is that it:',
          given: null,
          opts: [
            'Is prohibited by accounting standards',
            'Creates a real cash flow exposure in order to smooth an accounting figure',
            'Cannot be executed in liquid currencies',
            'Increases translation exposure',
          ],
          a: 1,
          why: 'The forward settles in cash while the exposure being hedged is a consolidation entry. The firm has taken on real risk to manage a reported number.',
          ref: 'Foreign exchange risk',
        },
        {
          text: 'Ranked from highest to lowest expected recovery in default, the usual ordering is:',
          given: null,
          opts: [
            'Subordinated, senior unsecured, secured bank debt',
            'Secured bank debt, senior unsecured, subordinated',
            'Senior unsecured, secured bank debt, subordinated',
            'All rank equally in a liquidation',
          ],
          a: 1,
          why: 'Security and seniority both improve the claim on the estate, so secured bank debt recovers most and subordinated claims least.',
          ref: 'Corporate bonds; mortgages and mortgage-backed securities',
        },
        {
          text: 'A manufacturer sells only domestically but competes with importers. A sustained appreciation of the domestic currency harms it. This is:',
          given: null,
          opts: [
            'Transaction exposure',
            'Economic exposure, which a currency forward cannot hedge',
            'Translation exposure',
            'Not a currency exposure at all',
          ],
          a: 1,
          why: 'There is no foreign currency cash flow to hedge. The damage runs through competitiveness, which is economic exposure and is managed operationally rather than financially.',
          ref: 'Foreign exchange risk',
        },
      ],
    },
  ],

  'frm-p1-valuation': [
    {
      slug: 'option-and-bond-valuation',
      name: 'Option & Bond Valuation',
      blurb: 'Binomial and Black–Scholes, duration hedging, and estimating the inputs.',
      modules: [
        'Volatility and correlation estimation',
        'Option valuation; the binomial model and Black–Scholes–Merton',
        'Fixed-income valuation, duration, convexity and hedging',
      ],
      cards: [
        {
          kicker: 'INPUTS',
          title: 'Five of the six Black–Scholes inputs are observable; the sixth is the model',
          body: 'Spot, strike, time, rate and dividend yield are read off the market. Volatility is not — it is either estimated from history or implied from another option’s price, and every disagreement about an option’s value is a disagreement about it.',
          formula: null,
          exam: 'Implied volatility is the number that makes the model return the observed price. It is an output being used as an input.',
        },
        {
          kicker: 'HEDGE',
          title: 'Match money duration, then worry about convexity',
          body: 'A duration hedge equates the basis point value of the position and the hedge. It protects against a small parallel shift and nothing else: a large move needs the convexity term, and a twist needs key rate durations.',
          formula: 'BPV = D_mod × price × 0.0001;  hedge ratio = BPV_position / BPV_hedge',
          exam: 'The hedge instrument’s own duration changes as rates move, so a duration hedge is rebalanced, not set.',
        },
        {
          kicker: 'ESTIMATE',
          title: 'Correlation estimates are less stable than volatility estimates',
          body: 'Volatility clusters and mean-reverts in a way EWMA and GARCH capture reasonably. Correlation moves with the regime and jumps in a crisis, which is why a hedge calibrated on calm-period correlation fails in the episode it was bought for.',
          formula: 'ρ = Cov(x,y)/(σx σy)',
          exam: 'Correlations rising toward one in a stress is the single most examined empirical fact in risk management.',
        },
      ],
      questions: [
        {
          text: 'Which Black–Scholes–Merton input cannot be observed directly in the market?',
          given: null,
          opts: [
            'The risk-free rate',
            'Time to expiry',
            'Volatility of the underlying',
            'The strike price',
          ],
          a: 2,
          why: 'Volatility must be estimated from history or implied from an observed option price. Everything else is read off a screen or written in the contract.',
          ref: 'Option valuation; the binomial model and Black–Scholes–Merton',
        },
        {
          text: 'A bond portfolio worth 60 million has modified duration of 6.5. Its basis point value is closest to:',
          given: 'value 60m; D_mod 6.5',
          opts: ['39,000', '3,900', '390,000', '65,000'],
          a: 0,
          why: 'BPV = 6.5 × 60,000,000 × 0.0001 = 39,000 per basis point.',
          ref: 'Fixed-income valuation, duration, convexity and hedging',
        },
        {
          text: 'Hedging that portfolio with a futures contract whose BPV is 78 per contract requires:',
          given: 'portfolio BPV 39,000; futures BPV 78',
          opts: ['500 contracts', '390 contracts', '780 contracts', '50 contracts'],
          a: 0,
          why: '39,000 / 78 = 500 contracts, sold to offset a long bond position.',
          ref: 'Fixed-income valuation, duration, convexity and hedging',
        },
        {
          text: 'A share is 40, u = 1.15, d = 0.87 and the periodic risk-free rate is 1.5%. The risk-neutral probability of an up move is closest to:',
          given: 'u 1.15; d 0.87; r 1.5%',
          opts: ['0.46', '0.52', '0.58', '0.64'],
          a: 1,
          why: 'π = (1.015 − 0.87)/(1.15 − 0.87) = 0.145/0.28 = 0.52.',
          ref: 'Option valuation; the binomial model and Black–Scholes–Merton',
        },
        {
          text: 'A hedge calibrated on two years of calm-market correlation fails badly during a market dislocation. The most likely explanation is:',
          given: null,
          opts: [
            'The volatility estimate was too low',
            'Correlations rose sharply in the stress, so the hedge instrument stopped offsetting the position',
            'The hedge ratio was computed with the wrong sign',
            'Transaction costs consumed the gain',
          ],
          a: 1,
          why: 'Correlation is regime-dependent and rises toward one in a crisis. A hedge relying on a low correlation is a hedge relying on the crisis not happening.',
          ref: 'Volatility and correlation estimation',
        },
        {
          text: 'A duration hedge protects a bond portfolio against:',
          given: null,
          opts: [
            'Any change in the yield curve',
            'A small parallel shift only, with convexity and curve twists left unhedged',
            'Credit spread widening',
            'Prepayment risk',
          ],
          a: 1,
          why: 'Duration is a first-order sensitivity to a parallel shift. Large moves need convexity and non-parallel moves need key rate durations.',
          ref: 'Fixed-income valuation, duration, convexity and hedging',
        },
      ],
    },
  ],
};
