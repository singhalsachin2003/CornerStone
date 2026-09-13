/**
 * Ethical and Professional Standards, plus GIPS.
 *
 * Wording here paraphrases the Standards rather than reproducing them: the Code
 * and Standards are CFA Institute's copyrighted text, and the app is not
 * affiliated with or endorsed by CFA Institute. A candidate sitting the exam
 * should read the Standards themselves; this is a lookup, not a substitute.
 */
import { GlossaryTerm } from './types';

export const ETHICS_TERMS: GlossaryTerm[] = [
  {
    key: 'code-of-ethics',
    term: 'Code of Ethics',
    definition:
      'The aspirational statement of how members and candidates should conduct themselves. It sets the principles; the Standards of Professional Conduct are what is actually enforced.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics', 'cfa-l3-ethics'],
  },
  {
    key: 'standards-of-professional-conduct',
    term: 'Standards of Professional Conduct',
    definition:
      'The seven enforceable standards covering professionalism, integrity of capital markets, duties to clients, duties to employers, investment analysis and recommendations, conflicts of interest, and responsibilities as a member or candidate.',
    note: 'Questions usually turn on which standard applies rather than on whether something felt wrong. Learn the seven headings in order.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics', 'cfa-l3-ethics'],
  },
  {
    key: 'fiduciary-duty',
    term: 'Fiduciary duty',
    definition:
      'The obligation to act in another party’s interest ahead of your own, with the care and loyalty that relationship demands.',
    note: 'Identify who the client actually is before applying it. For a pension, the duty runs to the beneficiaries, not to the company that hired you.',
    topics: ['cfa-l1-ethics', 'cfa-l3-ethics'],
  },
  {
    key: 'material-nonpublic-information',
    term: 'Material non-public information',
    aka: ['MNPI', 'inside information'],
    definition:
      'Information that has not been released to the market and that a reasonable investor would want before trading. Acting or causing others to act on it is prohibited.',
    note: 'Materiality and non-publicity are separate tests and both must hold. Selective disclosure to analysts does not make information public.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'mosaic-theory',
    term: 'Mosaic theory',
    definition:
      'Combining public information with non-material non-public information to reach a material conclusion. Doing so is permitted.',
    note: 'The defence of a good analyst. Keep the notes: the file showing how the conclusion was assembled is what distinguishes a mosaic from an inside tip.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'front-running',
    term: 'Front-running',
    definition:
      'Trading ahead of a client order to benefit from the price move that order will cause.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'market-manipulation',
    term: 'Market manipulation',
    definition:
      'Transactions or information intended to distort prices or artificially inflate trading volume, in order to mislead other participants.',
    note: 'Split into information-based and transaction-based. Intent is what is examined, and it is usually established by what the person expected to happen.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'fair-dealing',
    term: 'Fair dealing',
    definition:
      'Treating all clients fairly when disseminating recommendations or taking investment action. Fair does not mean identical.',
    note: 'Different service levels are allowed if disclosed and available to all. What is not allowed is giving some clients a head start on a change of recommendation.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'suitability',
    term: 'Suitability',
    definition:
      'The requirement to judge an investment against the client’s objectives, constraints and circumstances before recommending or making it.',
    note: 'For a portfolio the test is the effect on the total portfolio, not the merits of the security in isolation.',
    topics: ['cfa-l1-ethics', 'cfa-l3-ethics', 'cfa-l3-construction'],
  },
  {
    key: 'independence-and-objectivity',
    term: 'Independence and objectivity',
    definition:
      'The requirement to use reasonable care and judgement to keep independence, and to refuse any gift or pressure that could compromise it.',
    note: 'Modest, customary token gifts from clients may be accepted with disclosure to the employer; anything from a company you cover is the problem case.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'loyalty-to-employer',
    term: 'Loyalty to employer',
    definition:
      'The duty to act for the employer’s benefit, not to deprive it of your skills, and not to divulge confidential information.',
    note: 'Preparing to leave is allowed; taking client lists, models or records built on the employer’s time is not. Nothing changes once notice is served.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'diligence-and-reasonable-basis',
    term: 'Diligence and reasonable basis',
    definition:
      'The requirement that any recommendation or action rest on adequate research and analysis that could be defended if challenged.',
    note: 'Relying on a third-party model is acceptable only after making reasonable enquiries into its soundness. Delegation does not transfer the duty.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'record-retention',
    term: 'Record retention',
    definition:
      'The requirement to keep the records supporting analysis, recommendations and actions. Seven years is the recommended minimum where no regulation says otherwise.',
    note: 'Records belong to the employer. They do not travel with you to the next firm.',
    topics: ['cfa-l1-ethics', 'cfa-l2-ethics'],
  },
  {
    key: 'gips',
    term: 'GIPS',
    aka: ['Global Investment Performance Standards'],
    definition:
      'Voluntary standards for calculating and presenting investment performance, designed so that a prospective client can compare firms on a like-for-like basis.',
    note: 'Compliance is claimed by the firm as a whole — never by a single composite, product or individual.',
    topics: ['cfa-l1-ethics', 'cfa-l3-performance'],
  },
  {
    key: 'composite',
    term: 'Composite',
    definition:
      'All portfolios managed to the same strategy or objective, grouped together for GIPS reporting.',
    note: 'Every fee-paying discretionary portfolio must be in at least one composite. That requirement is what stops a firm from showing only its winners.',
    topics: ['cfa-l1-ethics', 'cfa-l3-performance'],
  },
];
