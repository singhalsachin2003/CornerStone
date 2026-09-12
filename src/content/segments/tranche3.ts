import { PremiumSegmentBank } from '../types';

/**
 * Tranche III — a fourth segment, allocated by exam weight rather than evenly.
 *
 * Tranches I and II gave every one of the 38 areas three segments. Spreading a
 * fourth evenly would put as much new material into Level II Economics, which is
 * 5–10% of one exam and two readings long, as into the Level III pathways, which
 * are 30–35% of a paper a candidate actually sits. So this tranche goes only to
 * areas whose published weight midpoint is 11% or above, heaviest first.
 *
 * That is a product decision and it is the honest one: candidates' time follows
 * the weights, and so should the content they are paying for.
 */
export const TRANCHE_III_SEGMENTS: PremiumSegmentBank = {
  'cfa-l3-pathway-portfolio': [
    {
      slug: 'index-strategies-and-ldi',
      name: 'Index Strategies & LDI',
      blurb: 'Replicating an index cheaply, and building a portfolio against a liability.',
      modules: ['Index-Based Equity Strategies', 'Liability-Driven and Index-Based Strategies'],
      cards: [
        {
          kicker: 'REPLICATE',
          title: 'Full replication, sampling, or a derivative — cost decides',
          body: 'Full replication tracks tightest in liquid large-cap indices. Stratified sampling and optimisation cut cost in broad or illiquid ones at the price of tracking error. A total return swap or futures gives exposure with no holdings at all, and introduces counterparty and roll considerations instead.',
          formula: null,
          exam: 'A synthetic index position has no securities to lend, which removes an income source the physical fund has.',
        },
        {
          kicker: 'LDI',
          title: 'Hedge the liability’s sensitivities, then decide how much risk to keep',
          body: 'Match the basis point value, and where the liability is inflation-linked match that exposure too. The hedge ratio is a deliberate decision: below 100% leaves surplus risk the sponsor is choosing to run, and it should be stated as a choice rather than emerge from a shortage of long bonds.',
          formula: 'BPV_assets × hedge ratio = BPV_liabilities',
          exam: 'Leverage through repo or swaps is how a plan hedges long duration without holding the whole balance sheet in bonds.',
        },
        {
          kicker: 'RESIDUALS',
          title: 'A perfect duration match still leaves three things',
          body: 'Basis risk between the liability discount curve and the asset curve; convexity mismatch on a large move; and longevity, which no financial instrument in the portfolio addresses at all.',
          formula: null,
          exam: 'Longevity risk is transferred through a buy-in, a buy-out or a longevity swap, not through the bond portfolio.',
        },
      ],
      questions: [
        {
          text: 'A pension plan hedges liability duration using interest rate swaps funded through repo rather than by holding long government bonds outright. The principal motivation is:',
          given: null,
          opts: [
            'Lower counterparty risk',
            'Capital efficiency — achieving the duration exposure without committing the whole portfolio to bonds',
            'Higher expected return on the hedge itself',
            'Avoiding the need for collateral',
          ],
          a: 1,
          why: 'Derivative-based hedging frees capital for return-seeking assets while still matching the liability sensitivity. The cost is collateral management and roll risk.',
          ref: 'Liability-Driven and Index-Based Strategies',
        },
        {
          text: 'Liabilities have a BPV of 62,000 and the asset portfolio a BPV of 24,000. To reach a 75% hedge ratio using swaps with a BPV of 110 per million notional, the required notional is closest to:',
          given:
            'liability BPV 62,000; asset BPV 24,000; target hedge ratio 75%; swap BPV 110 per million',
          opts: ['155 million', '205 million', '345 million', '564 million'],
          a: 1,
          why: 'Target asset BPV = 0.75 × 62,000 = 46,500. The gap to close is 46,500 − 24,000 = 22,500, so the notional is 22,500/110 = 205 million. Hedging to 100% rather than 75% would need 345 million, which is the next distractor.',
          ref: 'Liability-Driven and Index-Based Strategies',
        },
        {
          text: 'A plan achieves an exact duration match but discounts liabilities on a corporate curve while holding government bonds. It retains:',
          given: null,
          opts: [
            'No residual risk',
            'Basis risk between the two curves, which can be large precisely in a crisis',
            'Only longevity risk',
            'Only convexity risk',
          ],
          a: 1,
          why: 'A duration match across different curves leaves the spread between them unhedged. In a stress the spread widens and the match fails when it is most needed.',
          ref: 'Liability-Driven and Index-Based Strategies',
        },
        {
          text: 'Which risk in a defined benefit plan cannot be hedged by any instrument in the bond portfolio?',
          given: null,
          opts: ['Interest rate risk', 'Inflation risk', 'Longevity risk', 'Credit spread risk'],
          a: 2,
          why: 'Longevity is transferred through a buy-in, buy-out or longevity swap. No bond position addresses members living longer than assumed.',
          ref: 'Liability-Driven and Index-Based Strategies',
        },
        {
          text: 'Relative to a physically replicated index fund, a synthetic index position using a total return swap:',
          given: null,
          opts: [
            'Earns securities lending revenue',
            'Forgoes lending revenue and introduces counterparty exposure to the swap provider',
            'Has zero tracking error by construction',
            'Requires no collateral',
          ],
          a: 1,
          why: 'There are no securities to lend, and performance depends on a counterparty honouring the swap. The trade-off is often a tighter and more predictable tracking difference.',
          ref: 'Index-Based Equity Strategies',
        },
        {
          text: 'A manager tracking a broad small-cap index with 2,400 constituents would most appropriately use:',
          given: null,
          opts: [
            'Full replication, for the tightest tracking',
            'Stratified sampling or optimisation, because full replication would be prohibitively costly in illiquid names',
            'A single futures contract on a large-cap index',
            'An equal-weighted portfolio of the largest 50 names',
          ],
          a: 1,
          why: 'Transaction costs in the long tail of an illiquid index exceed the tracking error saved. Sampling is the standard answer for breadth plus illiquidity.',
          ref: 'Index-Based Equity Strategies',
        },
      ],
    },
  ],

  'cfa-l3-pathway-private-markets': [
    {
      slug: 'private-debt-and-special-situations',
      name: 'Private Debt & Special Situations',
      blurb: 'Lending privately, and what happens when the borrower stops paying.',
      modules: ['Private Debt', 'Private Special Situations', 'Private Investments and Structures'],
      cards: [
        {
          kicker: 'SPECTRUM',
          title: 'Senior, unitranche, mezzanine, and the return comes from different places',
          body: 'Senior direct lending earns spread and fees with covenants and security. Unitranche blends senior and junior into one instrument at a blended rate. Mezzanine sits below the senior debt and earns part of its return in equity-linked form.',
          formula: null,
          exam: 'Loans are usually floating-rate, so private credit returns are spread plus base rate, with little interest rate duration.',
        },
        {
          kicker: 'FULCRUM',
          title: 'In a restructuring the fulcrum security becomes the equity',
          body: 'The fulcrum is the most senior claim not paid in full — the one that converts to ownership in a reorganisation. Identifying it correctly is the whole distressed-for-control trade, and it depends on the enterprise value the process ultimately accepts.',
          formula: null,
          exam: 'Above the fulcrum you are repaid; below it you are wiped out. Which class that is depends on the valuation the court or the parties adopt.',
        },
        {
          kicker: 'RECOVERY',
          title: 'Documentation determines recovery more than the label does',
          body: 'Security over what assets, in which jurisdiction, with what guarantees from which entities, and whether value can be moved out from under the lenders. Structural subordination — lending to a holding company whose operating subsidiaries owe others first — is the trap.',
          formula: null,
          exam: 'A "senior" loan to a holding company can rank behind unsecured trade creditors of the operating company.',
        },
      ],
      questions: [
        {
          text: 'A lender holds a "senior" loan to a holding company whose operating subsidiaries have their own unsecured trade creditors and no upstream guarantees. The lender is:',
          given: null,
          opts: [
            'Senior to all creditors of the group',
            'Structurally subordinated to the operating companies’ creditors, despite the label',
            'Protected by the seniority of the instrument',
            'Equal in ranking to the trade creditors',
          ],
          a: 1,
          why: 'Claims are satisfied at the entity that owes them. Without guarantees or security from the operating entities, the holding company lender is paid only from residual value after their creditors.',
          ref: 'Private Debt',
        },
        {
          text: 'A company has 300 of senior secured debt, 150 of senior unsecured notes and 100 of subordinated notes. The restructuring values the enterprise at 380. The fulcrum security is:',
          given: 'enterprise value 380; senior secured 300; senior unsecured 150; subordinated 100',
          opts: [
            'The senior secured debt',
            'The senior unsecured notes',
            'The subordinated notes',
            'The existing equity',
          ],
          a: 1,
          why: 'Secured debt of 300 is covered in full, leaving 80 for the 150 of senior unsecured. That class is the most senior not paid in full, so it converts to the new equity.',
          ref: 'Private Special Situations',
        },
        {
          text: 'A unitranche loan differs from a senior-plus-mezzanine structure principally in that it:',
          given: null,
          opts: [
            'Pays a lower blended rate',
            'Combines both layers in a single instrument at a blended rate, simplifying the borrower’s documentation',
            'Ranks behind trade creditors',
            'Carries no covenants',
          ],
          a: 1,
          why: 'One instrument, one lender group, one rate. Any internal ranking between lenders is handled in an agreement among them rather than in the borrower’s capital structure.',
          ref: 'Private Debt',
        },
        {
          text: 'A direct lending fund holds floating-rate senior loans. Base rates rise 200 basis points and stay there. The most likely combined effect is:',
          given: null,
          opts: [
            'Portfolio value falls sharply through duration',
            'Coupon income rises while borrower interest coverage deteriorates, raising default risk',
            'No effect on either income or credit quality',
            'Coupon income falls',
          ],
          a: 1,
          why: 'Floating coupons reset upward, so income rises and duration is minimal. The same rise squeezes the borrowers, which is the offsetting concern.',
          ref: 'Private Debt',
        },
        {
          text: 'A rescue financing provided to a company in distress, ranking ahead of existing debt with the consent of the court, is best described as:',
          given: null,
          opts: [
            'Mezzanine finance',
            'Priming or debtor-in-possession financing',
            'A dividend recapitalisation',
            'A unitranche loan',
          ],
          a: 1,
          why: 'Financing that ranks ahead of existing claims, with court sanction, is what allows a company to keep operating through a reorganisation.',
          ref: 'Private Special Situations',
        },
        {
          text: 'The principal risk of relying on an enterprise value estimate when buying the fulcrum security is that:',
          given: null,
          opts: [
            'The coupon may be suspended',
            'A lower accepted valuation moves the fulcrum up the structure, wiping out the class purchased',
            'Recovery rates are fixed by statute',
            'The process cannot be completed',
          ],
          a: 1,
          why: 'The fulcrum is defined by the valuation the process adopts. A lower value means a more senior class absorbs the equity and everything below it is impaired.',
          ref: 'Private Special Situations',
        },
      ],
    },
  ],

  'cfa-l3-pathway-private-wealth': [
    {
      slug: 'tax-aware-investing',
      name: 'Tax-Aware Investing',
      blurb: 'Harvesting, location, turnover and the arithmetic of deferral.',
      modules: ['Investment Planning', 'Preserving the Wealth'],
      cards: [
        {
          kicker: 'DEFERRAL',
          title: 'Deferral is worth the return on the tax not yet paid',
          body: 'An unrealised gain is an interest-free loan from the tax authority, and its value compounds with the horizon and the return. That is why low-turnover strategies and in-kind transfers matter more for a taxable investor than a few basis points of fee.',
          formula: 'after-tax FV = FV_pretax − t(FV_pretax − basis)',
          exam: 'The benefit rises with horizon and with return. Over a short horizon it is small and not worth distorting the portfolio for.',
        },
        {
          kicker: 'HARVESTING',
          title: 'Realising a loss converts it into a deferred asset',
          body: 'Selling a loss position and reinvesting in a similar, not identical, exposure banks the loss against gains while keeping the market position. Wash sale rules define how similar is too similar, and the benefit is deferral rather than elimination, since basis falls.',
          formula: null,
          exam: 'Harvesting lowers basis, so it defers tax rather than avoiding it — unless a step-up occurs at death.',
        },
        {
          kicker: 'TURNOVER',
          title: 'A manager’s pre-tax alpha has to clear the tax its turnover creates',
          body: 'A strategy turning over 120% a year realising short-term gains needs materially more pre-tax alpha than a low-turnover one to deliver the same after-tax result. Comparing managers on pre-tax returns, for a taxable client, compares the wrong number.',
          formula: null,
          exam: 'Tax-managed and tax-aware mandates are worth a fee premium exactly to the extent they reduce realised short-term gains.',
        },
      ],
      questions: [
        {
          text: 'An investor holds a position worth 500,000 with a basis of 200,000, facing a 25% rate on realised gains. The tax deferred by not selling is:',
          given: 'value 500,000; basis 200,000; tax rate 25%',
          opts: ['50,000', '75,000', '125,000', '300,000'],
          a: 1,
          why: 'The unrealised gain is 300,000 and the tax on it would be 75,000 — an interest-free loan for as long as the position is held.',
          ref: 'Investment Planning',
        },
        {
          text: 'Tax loss harvesting produces a benefit that is best described as:',
          given: null,
          opts: [
            'A permanent elimination of tax',
            'A deferral, because realising the loss also reduces the basis of the replacement holding',
            'An increase in pre-tax return',
            'A reduction in portfolio risk',
          ],
          a: 1,
          why: 'The loss offsets a gain now and lowers basis, so more gain is realised later. It is a timing benefit, worth the return on the tax deferred.',
          ref: 'Investment Planning',
        },
        {
          text: 'Two managers deliver identical 8% pre-tax returns. One turns the portfolio over 15% a year, the other 130% with mostly short-term gains. For a taxable investor:',
          given: null,
          opts: [
            'The two are equivalent',
            'The low-turnover manager will usually deliver a materially higher after-tax return',
            'The high-turnover manager is preferable, because gains are realised and compounded',
            'The comparison depends only on the fee',
          ],
          a: 1,
          why: 'Realising gains annually, at the higher short-term rate, removes money that would otherwise compound. Pre-tax equivalence is not after-tax equivalence.',
          ref: 'Investment Planning',
        },
        {
          text: 'An investor holds both a high-yield bond fund and a broad equity index fund, and has a tax-sheltered account and a taxable account of equal size. The most tax-efficient location is:',
          given: null,
          opts: [
            'Bonds in the taxable account, equities in the sheltered account',
            'Bonds in the sheltered account, equities in the taxable account',
            'Half of each in both accounts',
            'It makes no difference',
          ],
          a: 1,
          why: 'The bond fund throws off income taxed annually at the higher rate; the index fund defers most of its return as unrealised gain. Shelter the heavily taxed asset.',
          ref: 'Investment Planning',
        },
        {
          text: 'A jurisdiction grants a step-up in basis at death. The planning implication for a low-basis holding is that:',
          given: null,
          opts: [
            'It should be sold and repurchased annually',
            'Holding it until death eliminates the deferred gain entirely, which favours gifting other assets instead',
            'It should be gifted during life in preference to all other assets',
            'The step-up applies only to real estate',
          ],
          a: 1,
          why: 'A step-up removes the accrued gain. The low-basis asset is therefore the one to hold, and high-basis assets are the better candidates for lifetime gifting.',
          ref: 'Preserving the Wealth',
        },
        {
          text: 'An investor sells a fund at a loss and immediately buys an economically near-identical fund tracking the same index. In most jurisdictions this is:',
          given: null,
          opts: [
            'Fully effective for harvesting the loss',
            'At risk of being disallowed under wash sale or substantially-identical rules',
            'Effective only if the two funds have different managers',
            'Effective only for losses above a threshold',
          ],
          a: 1,
          why: 'Rules on substantially identical securities exist exactly to prevent a loss being realised while the economic position is unchanged. A related but genuinely different exposure is the usual route.',
          ref: 'Investment Planning',
        },
      ],
    },
  ],

  'frm-p1-markets': [
    {
      slug: 'rates-products-and-mbs',
      name: 'Rates Products & Mortgages',
      blurb: 'Rate conventions, the products built on them, and the prepayment option.',
      modules: [
        'Interest rates and interest-rate products',
        'Corporate bonds; mortgages and mortgage-backed securities',
        'Exchange-traded and OTC market structure, central counterparties',
      ],
      cards: [
        {
          kicker: 'CONVENTIONS',
          title: 'Day counts and compounding are not details when you are comparing',
          body: 'Money market instruments quote on actual/360 or a discount basis; bonds on 30/360 or actual/actual. Two instruments quoted differently cannot be compared until both are converted to the same basis, and the difference is large enough to change a decision.',
          formula: 'bond equivalent yield = discount yield × 365/360 adjusted for price',
          exam: 'A discount-basis quote understates the true yield because the discount is taken on face rather than on the price paid.',
        },
        {
          kicker: 'MORTGAGES',
          title: 'A mortgage is an amortising loan with a free option attached',
          body: 'The borrower may prepay at any time without penalty in most markets, which is a call on the loan struck at par. The lender is short that option and is not separately paid for it beyond the spread in the rate.',
          formula: null,
          exam: 'Prepayment speed is quoted as CPR annually or SMM monthly, and the PSA benchmark expresses it as a percentage of a standard ramp.',
        },
        {
          kicker: 'CLEARING',
          title: 'A central counterparty concentrates risk in exchange for netting it',
          body: 'Novation replaces bilateral exposures with exposure to the CCP, multilateral netting cuts gross exposure sharply, and a default waterfall — margin, default fund, then mutualised loss — absorbs a failure. The CCP itself becomes systemically critical.',
          formula: null,
          exam: 'Initial margin covers potential future exposure over the close-out period; variation margin settles today’s move.',
        },
      ],
      questions: [
        {
          text: 'A Treasury bill is quoted at a discount yield of 4.80% with 90 days to maturity on a 360-day basis. Relative to its bond equivalent yield, the discount yield is:',
          given: 'discount yield 4.80%; 90 days; actual/360',
          opts: [
            'Higher, because it uses a 360-day year',
            'Lower, because the discount is computed on face value rather than on the price paid',
            'Identical',
            'Indeterminate without the coupon',
          ],
          a: 1,
          why: 'The discount basis divides by face rather than by the smaller purchase price, and uses 360 days rather than 365. Both adjustments raise the bond equivalent yield above the quoted figure.',
          ref: 'Interest rates and interest-rate products',
        },
        {
          text: 'A pool has a single monthly mortality rate of 0.5%. The corresponding constant prepayment rate is closest to:',
          given: 'SMM 0.5%',
          opts: ['5.8%', '6.0%', '0.5%', '12.0%'],
          a: 0,
          why: 'CPR = 1 − (1 − SMM)^12 = 1 − 0.995^12 = 1 − 0.9416 = 5.84%. Multiplying by twelve gives 6.0%, the distractor.',
          ref: 'Corporate bonds; mortgages and mortgage-backed securities',
        },
        {
          text: 'The prepayment option in a standard residential mortgage is best described as:',
          given: null,
          opts: [
            'A put held by the lender',
            'A call on the loan held by the borrower, struck at par',
            'An obligation on the borrower to refinance',
            'A feature with no option value',
          ],
          a: 1,
          why: 'The borrower may repay at par whenever it suits, which is exactly a call struck at par. The lender is short it, which is the source of the negative convexity.',
          ref: 'Corporate bonds; mortgages and mortgage-backed securities',
        },
        {
          text: 'In a central counterparty’s default waterfall, losses beyond the defaulter’s own margin are absorbed next by:',
          given: null,
          opts: [
            'Surviving members’ variation margin',
            'The defaulter’s contribution to the default fund, then the CCP’s own capital, then the mutualised default fund',
            'The central bank',
            'The exchange’s shareholders only',
          ],
          a: 1,
          why: 'The standard sequence is the defaulter’s margin, the defaulter’s default fund contribution, a tranche of CCP capital, and then the surviving members’ mutualised contributions.',
          ref: 'Exchange-traded and OTC market structure, central counterparties',
        },
        {
          text: 'Multilateral netting through a central counterparty most directly reduces:',
          given: null,
          opts: [
            'Market risk on the underlying positions',
            'Gross counterparty exposure, by offsetting positions across all members',
            'The need for initial margin',
            'The volatility of the cleared instruments',
          ],
          a: 1,
          why: 'Netting collapses a web of offsetting bilateral claims into a single net position per member. The market risk on the underlying is untouched.',
          ref: 'Exchange-traded and OTC market structure, central counterparties',
        },
        {
          text: 'A 30-year mortgage pool experiences a sharp fall in mortgage rates. The investor most directly faces:',
          given: null,
          opts: [
            'Extension risk and a longer average life',
            'Contraction risk, with principal returned early to be reinvested at lower rates',
            'An increase in credit risk',
            'A rise in the pool’s duration',
          ],
          a: 1,
          why: 'Refinancing accelerates, shortening average life and returning capital precisely when reinvestment yields are worst. That asymmetry is the negative convexity.',
          ref: 'Corporate bonds; mortgages and mortgage-backed securities',
        },
      ],
    },
  ],

  'frm-p1-valuation': [
    {
      slug: 'country-risk-and-capital',
      name: 'Country Risk, Ratings & Capital',
      blurb: 'Sovereign analysis, what a rating does and does not say, and sizing capital.',
      modules: [
        'Country and sovereign risk; external ratings and rating transition matrices',
        'Economic and regulatory capital',
      ],
      cards: [
        {
          kicker: 'SOVEREIGN',
          title: 'Ability and willingness are separate questions',
          body: 'Ability is measured through debt to GDP, the maturity profile, reserves against short-term external debt and the currency of issuance. Willingness is political, and a government able to pay may still choose not to — which is why local-currency and foreign-currency ratings differ.',
          formula: null,
          exam: 'A government can print the local currency it owes. Foreign currency obligations require reserves it may not have.',
        },
        {
          kicker: 'RATINGS',
          title: 'A rating is an ordinal opinion about default, not a probability and not a price',
          body: 'Ratings are through-the-cycle and change slowly, which makes them stable and lagging. They say nothing about expected loss magnitude in most scales, nothing about liquidity, and nothing about whether the spread on offer is adequate.',
          formula: null,
          exam: 'Rating agencies are paid by issuers, which is the conflict the exam expects you to name.',
        },
        {
          kicker: 'CAPITAL',
          title: 'Economic capital is chosen; regulatory capital is imposed',
          body: 'Economic capital follows from a confidence level and a horizon the firm selects, usually aligned to a target rating. Regulatory capital is a prescribed floor. Whichever is higher binds, and a firm running well above both is either conservative or under-earning.',
          formula: 'economic capital = loss at chosen confidence − expected loss',
          exam: 'Targeting a AA rating implies a confidence level around 99.97%, because that is roughly the historical one-year default rate for AA.',
        },
      ],
      questions: [
        {
          text: 'A sovereign’s local-currency rating is two notches above its foreign-currency rating. The most likely reason is that:',
          given: null,
          opts: [
            'Local currency debt is issued under foreign law',
            'The government can create the currency it owes domestically, but foreign currency obligations require reserves',
            'Local currency debt has shorter maturities',
            'Foreign currency debt is always secured',
          ],
          a: 1,
          why: 'Default on local currency debt is a policy choice with inflationary consequences; default on foreign currency debt can be an inability to pay. Ratings reflect that difference.',
          ref: 'Country and sovereign risk; external ratings and rating transition matrices',
        },
        {
          text: 'A firm targets a confidence level of 99.97% over one year for its economic capital. This is most consistent with:',
          given: null,
          opts: [
            'A regulatory minimum',
            'A desire to maintain a AA-equivalent credit rating',
            'A one-in-ten-year event',
            'A stress testing requirement',
          ],
          a: 1,
          why: 'The confidence level is chosen to match the historical one-year default rate of the target rating. Around three basis points corresponds to AA.',
          ref: 'Economic and regulatory capital',
        },
        {
          text: 'A one-year transition matrix shows a BBB issuer with a 4% probability of moving to BB and a 0.3% probability of default. For a diversified BBB portfolio, the larger source of loss over the year is most likely:',
          given: 'P(BBB→BB) 4%; P(BBB→default) 0.3%',
          opts: [
            'Default losses',
            'Migration and the associated spread widening',
            'Neither — the two are equal',
            'Interest rate movements',
          ],
          a: 1,
          why: 'Downgrades are an order of magnitude more frequent than defaults, and each one repricing a position produces mark-to-market loss well before any default occurs.',
          ref: 'Country and sovereign risk; external ratings and rating transition matrices',
        },
        {
          text: 'The principal structural criticism of the credit rating agency model is that:',
          given: null,
          opts: [
            'Ratings change too frequently',
            'Issuers pay for their own ratings, which creates a conflict of interest',
            'Ratings are expressed on an ordinal scale',
            'Agencies publish transition matrices',
          ],
          a: 1,
          why: 'The issuer-pays model gives the agency a commercial interest in the rating being acceptable to the party being rated. It is the conflict that structured credit exposed.',
          ref: 'Country and sovereign risk; external ratings and rating transition matrices',
        },
        {
          text: 'A portfolio has expected loss of 18 million and a loss at the 99.9% confidence level of 145 million. Economic capital is:',
          given: 'expected loss 18m; 99.9% loss 145m',
          opts: ['127 million', '145 million', '163 million', '18 million'],
          a: 0,
          why: '145 − 18 = 127 million. Expected loss is provisioned and priced; capital covers the unexpected part.',
          ref: 'Economic and regulatory capital',
        },
        {
          text: 'A country with reserves of 40 billion and short-term external debt of 72 billion is most exposed to:',
          given: 'reserves 40bn; short-term external debt 72bn',
          opts: [
            'Domestic inflation only',
            'A sudden stop, since reserves cannot cover maturing external obligations if they are not rolled',
            'A currency appreciation',
            'A fall in the local-currency rating only',
          ],
          a: 1,
          why: 'A reserves-to-short-term-external-debt ratio below one means a refusal to roll over cannot be met from reserves. It is the standard sudden-stop indicator.',
          ref: 'Country and sovereign risk; external ratings and rating transition matrices',
        },
      ],
    },
  ],
};
