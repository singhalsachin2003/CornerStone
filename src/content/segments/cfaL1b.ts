import { PremiumSegmentBank } from '../types';

/**
 * CFA Level I — premium segments, tranche II.
 *
 * A third segment per topic area, drawn from the learning modules the first two
 * did not reach. Level I Fixed Income alone is nineteen modules; two segments
 * could not cover it and pretending otherwise would have left the most-weighted
 * areas the thinnest.
 *
 * Appended after tranche I in `segments/index.ts`, never inserted — see the note
 * there on why the order is load-bearing.
 */
export const CFA_L1_SEGMENTS_II: PremiumSegmentBank = {
  'cfa-l1-ethics': [
    {
      slug: 'professionalism-and-diligence',
      name: 'Professionalism & Diligence',
      blurb: 'Standard I and Standard V — competence, misrepresentation, and the basis for a call.',
      modules: [
        'Code of Ethics and Standards of Professional Conduct',
        'Guidance for Standard I: Professionalism',
        'Guidance for Standard V: Investment Analysis, Recommendations, and Actions',
        'Guidance for Standard VII: Responsibilities as a CFA Institute Member or Candidate',
      ],
      cards: [
        {
          kicker: 'BASIS',
          title: 'Standard V(A) is about what you did, not what happened',
          body: 'A recommendation needs a reasonable and adequate basis supported by appropriate research and investigation. Relying on a third party is permitted only after making reasonable efforts to establish that the third party is itself sound.',
          formula: null,
          exam: 'Judge the process. A recommendation that made money on no basis is still a violation; one that lost money on a defensible basis is not.',
        },
        {
          kicker: 'MISREPRESENTATION',
          title: 'Plagiarism is the form of I(C) the exam tests most',
          body: 'Using another’s work without attribution breaches Standard I(C), including reusing charts, phrasing or model output. Recognised statistical bodies and factual data need no attribution; analysis and opinion always do.',
          formula: null,
          exam: 'Citing a source you have not read is also misrepresentation — you are claiming a diligence you did not perform.',
        },
        {
          kicker: 'COMPETENCE',
          title: 'Standard I(A) also covers not knowingly helping somebody else break it',
          body: 'Members must understand and comply with applicable law, must not knowingly participate in a violation, and must dissociate when one comes to light. Dissociation means stepping away from the activity, not merely disagreeing with it.',
          formula: null,
          exam: 'Resignation is rarely the required first step. Escalation, then documented dissociation, is.',
        },
      ],
      questions: [
        {
          text: 'An analyst forwards a third-party research note to clients as the firm’s own recommendation, having read the summary but not the underlying work. This most likely violates:',
          given: null,
          opts: [
            'Standard III(B) Fair Dealing',
            'Standard V(A) Diligence and Reasonable Basis, and Standard I(C) Misrepresentation',
            'Standard VI(A) Disclosure of Conflicts only',
            'No standard, because the third party is reputable',
          ],
          a: 1,
          why: 'Relying on third-party work requires reasonable efforts to verify its soundness. Presenting it as the firm’s own compounds the failure with misrepresentation.',
          ref: 'Standard V(A) — Diligence and Reasonable Basis',
        },
        {
          text: 'Which use of another party’s material requires attribution under Standard I(C)?',
          given: null,
          opts: [
            'Unemployment figures published by a national statistical agency',
            'A competitor analyst’s written interpretation of those figures',
            'A widely used option pricing formula',
            'The closing price of a listed security',
          ],
          a: 1,
          why: 'Factual data from recognised sources and standard formulae need no citation. Another party’s analysis and opinion always do.',
          ref: 'Standard I(C) — Misrepresentation',
        },
        {
          text: 'A member discovers that a colleague is preparing marketing material containing a claim the member knows to be false. The member’s minimum obligation is to:',
          given: null,
          opts: [
            'Say nothing, since the material is not the member’s responsibility',
            'Decline to participate and report the matter through appropriate channels',
            'Correct the material without telling anyone',
            'Resign from the firm',
          ],
          a: 1,
          why: 'Standard I(A) prohibits knowingly participating in a violation and requires dissociation. Escalation comes before resignation, which is a last resort.',
          ref: 'Standard I(A) — Knowledge of the Law',
        },
        {
          text: 'A quantitative analyst builds a model whose output drives client recommendations. Under Standard V(A) she must most appropriately:',
          given: null,
          opts: [
            'Rely on the model output alone, since it is objective',
            'Understand the model’s assumptions and limitations, and test it before relying on it',
            'Disclose the model’s source code to clients',
            'Have the model audited by a regulator',
          ],
          a: 1,
          why: 'Diligence extends to the tools used. A member who cannot state a model’s assumptions has no reasonable basis for what it produces.',
          ref: 'Standard V(A) — Diligence and Reasonable Basis',
        },
        {
          text: 'A charterholder describes herself as "a CFA" on her firm biography. This is:',
          given: null,
          opts: [
            'Acceptable, because she holds the charter',
            'Improper — the marks are adjectives, so the correct form is "CFA charterholder"',
            'Acceptable only in written materials',
            'Improper only if she is not a member in good standing',
          ],
          a: 1,
          why: 'Standard VII(B) requires the marks be used as adjectives, never as nouns or in the plural. "A CFA" treats the mark as a noun.',
          ref: 'Standard VII(B) — Reference to CFA Institute and the CFA Designation',
        },
        {
          text: 'A member is asked by a prospective employer to describe the strategies used at her current firm, including a proprietary screening method. She should most appropriately:',
          given: null,
          opts: [
            'Describe the method fully, since she developed part of it',
            'Describe her general expertise without disclosing proprietary methods belonging to her employer',
            'Refuse to discuss her experience at all',
            'Describe the method only if the prospective employer signs an agreement',
          ],
          a: 1,
          why: 'General skill and knowledge travel with a member; employer property, including proprietary methods, does not. Standards I(C) and IV(A) both bear on it.',
          ref: 'Standard IV(A) — Loyalty',
        },
      ],
    },
  ],

  'cfa-l1-quant': [
    {
      slug: 'rates-and-time-value',
      name: 'Rates & Time Value',
      blurb: 'Moving between rate conventions, and valuing a stream of cash flows correctly.',
      modules: ['Rates and Returns', 'Time Value of Money in Finance'],
      cards: [
        {
          kicker: 'CONVERT',
          title: 'Never compare two rates on different compounding conventions',
          body: 'The effective annual rate is the common currency. Convert a stated annual rate at m compoundings per year before comparing it with anything, and remember that continuous compounding is the limiting case.',
          formula: 'EAR = (1 + r/m)^m − 1;  continuous: EAR = e^r − 1',
          exam: 'A higher stated rate with less frequent compounding can be the worse deal. That is the entire point of most of these items.',
        },
        {
          kicker: 'AVERAGES',
          title: 'Arithmetic for the next period, geometric for the realised past',
          body: 'The arithmetic mean is the unbiased estimate of a single future period’s return. The geometric mean is what the investor actually earned over the whole period, and it is always lower whenever returns vary at all.',
          formula: 'geometric = [Π(1 + Ri)]^(1/n) − 1',
          exam: 'The gap between the two widens with volatility. A large gap in a stem is a hint about the dispersion, not an error.',
        },
        {
          kicker: 'ANNUITIES',
          title: 'An annuity due is an ordinary annuity times (1 + r)',
          body: 'Ordinary annuities pay at period end, annuities due at the start. Converting between them is one multiplication. Perpetuities are the limit as n grows, and a growing perpetuity divides by (r − g).',
          formula: 'PV_due = PV_ordinary × (1 + r);  PV_perpetuity = C/r',
          exam: 'Draw the timeline. Almost every time-value error is an off-by-one in when the first payment lands.',
        },
      ],
      questions: [
        {
          text: 'A bank quotes 6.0% compounded quarterly. The effective annual rate is closest to:',
          given: 'stated rate 6.0%, m = 4',
          opts: ['6.00%', '6.14%', '6.18%', '6.09%'],
          a: 1,
          why: '(1 + 0.06/4)^4 − 1 = 1.015^4 − 1 = 6.136%.',
          ref: 'Rates and Returns',
        },
        {
          text: 'Which of these offers the highest effective annual rate?',
          given: null,
          opts: [
            '6.10% compounded annually',
            '6.05% compounded semi-annually',
            '6.00% compounded continuously',
            '5.98% compounded monthly',
          ],
          a: 2,
          why: 'Converted to effective annual rates: 6.100%, 6.142%, 6.184% and 6.147%. The lowest stated rate wins, because continuous compounding is the limiting case — which is why each has to be converted rather than ranked by the quoted number.',
          ref: 'Rates and Returns',
        },
        {
          text: 'Annual returns are +30%, −20% and +15%. The geometric mean return is closest to:',
          given: 'returns +30%, −20%, +15%',
          opts: ['4.10%', '5.31%', '6.15%', '8.33%'],
          a: 2,
          why: '(1.30 × 0.80 × 1.15)^(1/3) − 1 = 1.196^(1/3) − 1 = 6.15%. The arithmetic mean is 8.33%, and it overstates what was actually earned whenever returns vary.',
          ref: 'Rates and Returns',
        },
        {
          text: 'An investor will receive 5,000 at the start of each year for 10 years, with the first payment today. At 7% the present value is closest to:',
          given: 'payment 5,000; n = 10; r = 7%; annuity due',
          opts: ['35,118', '37,576', '32,822', '50,000'],
          a: 1,
          why: 'Ordinary annuity PV = 5,000 × 7.0236 = 35,118. An annuity due multiplies by 1.07: 35,118 × 1.07 = 37,576.',
          ref: 'Time Value of Money in Finance',
        },
        {
          text: 'A perpetuity pays 400 a year starting one year from now and grows at 2%. At a required return of 7% its value is:',
          given: 'C₁ 400; g 2%; r 7%',
          opts: ['5,714', '8,000', '5,600', '20,000'],
          a: 1,
          why: 'V = C₁/(r − g) = 400/0.05 = 8,000.',
          ref: 'Time Value of Money in Finance',
        },
        {
          text: 'A holding period return of 21% is earned over 18 months. The equivalent effective annual return is closest to:',
          given: 'HPR 21% over 18 months',
          opts: ['14.0%', '13.6%', '21.0%', '31.5%'],
          a: 1,
          why: '(1.21)^(12/18) − 1 = (1.21)^(2/3) − 1 = 13.7%. Dividing 21% by 1.5 gives 14%, which is the distractor.',
          ref: 'Rates and Returns',
        },
      ],
    },
  ],

  'cfa-l1-econ': [
    {
      slug: 'market-structures',
      name: 'Firms & Market Structures',
      blurb: 'Where pricing power comes from, and how concentration is actually measured.',
      modules: ['The Firm and Market Structures'],
      cards: [
        {
          kicker: 'FOUR',
          title: 'The structures differ in one thing: the demand curve the firm faces',
          body: 'Perfect competition faces a horizontal demand curve and is a price taker. Monopolistic competition and oligopoly face downward-sloping curves through differentiation or few rivals. Monopoly faces the whole market curve.',
          formula: 'profit maximised where MR = MC',
          exam: 'Long-run economic profit is zero under perfect competition *and* monopolistic competition, because entry is free in both.',
        },
        {
          kicker: 'ELASTICITY',
          title: 'Marginal revenue and elasticity are the same fact twice',
          body: 'A firm with pricing power maximises profit only where demand is elastic: in the inelastic region raising price raises revenue and cuts cost at once, so it cannot be optimal. Marginal revenue is negative there.',
          formula: 'MR = P[1 + 1/E_d]',
          exam: 'If a stem puts the profit-maximising point in the inelastic region, something is wrong with the stem or with your reading of it.',
        },
        {
          kicker: 'CONCENTRATION',
          title: 'HHI is the measure that notices the shape, not just the count',
          body: 'The N-firm concentration ratio adds the top N shares and is blind to how they are distributed. The Herfindahl–Hirschman Index squares each share, so a market with one dominant firm scores far higher than an evenly split one with the same ratio.',
          formula: 'HHI = Σ (market share in %)²',
          exam: 'Neither measure captures entry barriers or the threat of imports, which is the standard criticism of both.',
        },
      ],
      questions: [
        {
          text: 'A market has four firms with shares of 40%, 25%, 20% and 15%. The Herfindahl–Hirschman Index is:',
          given: 'shares 40%, 25%, 20%, 15%',
          opts: ['2,850', '3,050', '1,000', '2,250'],
          a: 0,
          why: '40² + 25² + 20² + 15² = 1,600 + 625 + 400 + 225 = 2,850.',
          ref: 'The Firm and Market Structures',
        },
        {
          text: 'In long-run equilibrium, a firm in monopolistic competition earns:',
          given: null,
          opts: [
            'Positive economic profit, because its product is differentiated',
            'Zero economic profit, because entry continues until profit is competed away',
            'Negative economic profit',
            'Profit equal to that of a monopolist',
          ],
          a: 1,
          why: 'Differentiation gives short-run pricing power, but free entry erodes it. The firm ends at zero economic profit producing below minimum average cost.',
          ref: 'The Firm and Market Structures',
        },
        {
          text: 'A profit-maximising firm with pricing power will always operate where demand is:',
          given: null,
          opts: ['Inelastic', 'Elastic', 'Unit elastic', 'Perfectly inelastic'],
          a: 1,
          why: 'Marginal revenue is negative in the inelastic region, so marginal cost — which is positive — cannot equal it. The optimum is always in the elastic region.',
          ref: 'The Firm and Market Structures',
        },
        {
          text: 'Two markets both have a four-firm concentration ratio of 80%. Market A is split 65/5/5/5 and market B 20/20/20/20. Relative to the concentration ratio, the HHI will:',
          given: null,
          opts: [
            'Be identical for both, since the ratio is the same',
            'Be far higher for A, because squaring shares penalises dominance',
            'Be higher for B',
            'Be undefined without the remaining firms',
          ],
          a: 1,
          why: 'A scores 4,300 from the top four against B’s 1,600. Squaring is precisely what makes the index notice a dominant firm the ratio hides.',
          ref: 'The Firm and Market Structures',
        },
        {
          text: 'Under the Cournot model of oligopoly, firms compete by choosing:',
          given: null,
          opts: [
            'Price',
            'Quantity, taking rivals’ quantities as given',
            'Advertising spend',
            'Product quality',
          ],
          a: 1,
          why: 'Cournot is quantity competition; Bertrand is price competition, which drives price to marginal cost with homogeneous goods.',
          ref: 'The Firm and Market Structures',
        },
        {
          text: 'A perfectly competitive firm faces a market price of 24 and has marginal cost of 24 at an output of 900 units, with average total cost of 26 at that output. In the short run it should:',
          given: 'P 24; MC 24 at Q 900; ATC 26; AVC below 24',
          opts: [
            'Shut down immediately',
            'Continue producing 900 units, since price covers variable cost and part of fixed cost',
            'Raise price to 26',
            'Increase output until ATC equals price',
          ],
          a: 1,
          why: 'A price above average variable cost but below average total cost means losses, but shutting down would forgo the contribution to fixed costs. Production continues in the short run.',
          ref: 'The Firm and Market Structures',
        },
      ],
    },
  ],
};
