/**
 * Cross-check src/content/syllabus.ts against the topic areas, weights and learning
 * modules actually printed in CFA-and-FRM-Topicwise-Syllabus.pdf.
 *
 * The expected values below are transcribed from the decoded PDF text
 * (scratchpad/syllabus.txt), not from the app, so this is an independent check.
 */
import { EXAMS, PATHWAYS, topicsFor, cardsFor, questionsFor } from '../src/content';

type Expect = { name: string; weight: string };

const EXPECTED: Record<string, Expect[]> = {
  // Section 3 — CFA Level I, 2027 curriculum (session order as printed)
  'CFA/L1': [
    { name: 'Ethical and Professional Standards', weight: '15–20%' },
    { name: 'Quantitative Methods', weight: '6–9%' },
    { name: 'Economics', weight: '6–9%' },
    { name: 'Financial Statement Analysis', weight: '11–14%' },
    { name: 'Corporate Issuers', weight: '6–9%' },
    { name: 'Equity Investments', weight: '11–14%' },
    { name: 'Fixed Income', weight: '11–14%' },
    { name: 'Derivatives', weight: '5–8%' },
    { name: 'Alternative Investments', weight: '7–10%' },
    { name: 'Portfolio Management', weight: '8–12%' },
  ],
  // Section 4 — CFA Level II, 2026 curriculum
  'CFA/L2': [
    { name: 'Ethical and Professional Standards', weight: '10–15%' },
    { name: 'Quantitative Methods', weight: '5–10%' },
    { name: 'Economics', weight: '5–10%' },
    { name: 'Financial Statement Analysis', weight: '10–15%' },
    { name: 'Corporate Issuers', weight: '5–10%' },
    // The PDF names this area twice and inconsistently: "Equity Investments" in the
    // Level II weight table (line 422 of the decoded text) and "Equity Valuation" in
    // the learning-modules section (line 483). Its modules are all valuation modules
    // (DDM, FCF, multiples, residual income, private company), and Equity Valuation is
    // CFA Institute's current Level II name, so the app uses that.
    { name: 'Equity Valuation', weight: '10–15%' },
    { name: 'Fixed Income', weight: '10–15%' },
    { name: 'Derivatives', weight: '5–10%' },
    { name: 'Alternative Investments', weight: '5–10%' },
    { name: 'Portfolio Management', weight: '10–15%' },
  ],
  // Section 5 — CFA Level III, 2027 core topics (+ pathway checked separately)
  'CFA/L3': [
    { name: 'Asset Allocation', weight: '15–20%' },
    { name: 'Portfolio Construction', weight: '15–20%' },
    { name: 'Performance Measurement', weight: '5–10%' },
    { name: 'Derivatives and Risk Management', weight: '10–15%' },
    { name: 'Ethical and Professional Standards', weight: '10–15%' },
  ],
  // Section 8 — FRM Part I, 2026
  'FRM/P1': [
    { name: 'Foundations of Risk Management', weight: '20%' },
    { name: 'Quantitative Analysis', weight: '20%' },
    { name: 'Financial Markets and Products', weight: '30%' },
    { name: 'Valuation and Risk Models', weight: '30%' },
  ],
  // Section 9 — FRM Part II, 2026
  'FRM/P2': [
    { name: 'Market Risk Measurement and Management', weight: '20%' },
    { name: 'Credit Risk Measurement and Management', weight: '20%' },
    { name: 'Operational Risk and Resilience', weight: '20%' },
    { name: 'Liquidity and Treasury Risk Measurement and Management', weight: '15%' },
    { name: 'Risk Management and Investment Management', weight: '15%' },
    { name: 'Current Issues in Financial Markets', weight: '10%' },
  ],
};

/** Module counts printed under "Learning modules by topic" in the PDF. */
const EXPECTED_MODULE_COUNTS: Record<string, number> = {
  'cfa-l1-quant': 11,
  'cfa-l1-econ': 8,
  'cfa-l1-corp': 7,
  'cfa-l1-fsa': 12,
  'cfa-l1-equity': 12,
  'cfa-l1-fixed': 19,
  'cfa-l1-deriv': 10,
  'cfa-l1-alt': 7,
  'cfa-l1-pm': 6,
  'cfa-l1-ethics': 10,
  'cfa-l2-quant': 7,
  'cfa-l2-econ': 2,
  'cfa-l2-fsa': 6,
  'cfa-l2-corp': 4,
  'cfa-l2-equity': 6,
  'cfa-l2-fixed': 5,
  'cfa-l2-deriv': 2,
  'cfa-l2-alt': 4,
  'cfa-l2-pm': 6,
  'cfa-l2-ethics': 3,
  'cfa-l3-allocation': 5,
  'cfa-l3-construction': 7,
  'cfa-l3-performance': 3,
  'cfa-l3-derivatives': 3,
  'cfa-l3-ethics': 4,
  'cfa-l3-pathway-portfolio': 8,
  'cfa-l3-pathway-private-markets': 7,
  'cfa-l3-pathway-private-wealth': 7,
  'frm-p1-foundations': 8,
  'frm-p1-quant': 7,
  'frm-p1-markets': 10,
  'frm-p1-valuation': 9,
  'frm-p2-market': 8,
  'frm-p2-credit': 8,
  'frm-p2-operational': 9,
  'frm-p2-liquidity': 9,
  'frm-p2-investment': 7,
  'frm-p2-current': 6,
};

const problems: string[] = [];

/** App names are shortened for the phone; compare on a normalised form. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Does the app's (shorter) name capture the syllabus name's distinctive words? */
function nameMatches(appName: string, pdfName: string): boolean {
  const a = norm(appName);
  const p = norm(pdfName);
  if (a === p) return true;
  const stop = new Set(['and', 'of', 'the', 'in', 'measurement', 'management']);
  const key = p.split(' ').filter((w) => !stop.has(w) && w.length > 3);
  return key.every((w) => a.includes(w));
}

for (const [id, expected] of Object.entries(EXPECTED)) {
  const [examKey, levelKey] = id.split('/') as ['CFA' | 'FRM', any];
  const all = topicsFor(examKey, levelKey, 'portfolio');
  // Level III's 6th area is the pathway; core comparison excludes it.
  const actual = levelKey === 'L3' ? all.slice(0, 5) : all;

  if (actual.length !== expected.length) {
    problems.push(`${id}: ${actual.length} areas, syllabus has ${expected.length}`);
  }
  expected.forEach((exp, i) => {
    const got = actual[i];
    if (!got) {
      problems.push(`${id}[${i}]: missing "${exp.name}"`);
      return;
    }
    if (!nameMatches(got.name, exp.name)) {
      problems.push(`${id}[${i}]: name "${got.name}" does not match syllabus "${exp.name}"`);
    }
    if (got.weight !== exp.weight) {
      problems.push(
        `${id}[${i}] ${exp.name}: weight "${got.weight}" but syllabus says "${exp.weight}"`,
      );
    }
  });
}

// Level III pathways: all three present at 30–35%
const pathNames = ['Portfolio Management', 'Private Markets', 'Private Wealth'];
pathNames.forEach((n) => {
  const p = PATHWAYS.find((x) => x.name === n);
  if (!p) problems.push(`missing pathway: ${n}`);
  else if (p.weight !== '30–35%')
    problems.push(`pathway ${n}: weight "${p.weight}" but syllabus says "30–35%"`);
});
// and each is selectable as the 6th L3 area
PATHWAYS.forEach((p) => {
  const t = topicsFor('CFA', 'L3', p.key);
  if (t.length !== 6) problems.push(`L3 with pathway ${p.key}: ${t.length} areas, expected 6`);
});

// Learning modules present and complete
for (const [key, count] of Object.entries(EXPECTED_MODULE_COUNTS)) {
  const topic = [
    ...topicsFor('CFA', 'L1'),
    ...topicsFor('CFA', 'L2'),
    ...topicsFor('CFA', 'L3'),
    ...PATHWAYS.map((p) => topicsFor('CFA', 'L3', p.key)[5]),
    ...topicsFor('FRM', 'P1'),
    ...topicsFor('FRM', 'P2'),
  ].find((t) => t?.key === key);
  if (!topic) {
    problems.push(`module check: topic ${key} not found`);
    continue;
  }
  if (topic.modules.length !== count) {
    problems.push(`${key}: ${topic.modules.length} learning modules, syllabus lists ${count}`);
  }
}

// Content present for every area reachable in the app
const reachable = new Set<string>();
for (const ex of ['CFA', 'FRM'] as const) {
  for (const lvl of EXAMS[ex].levels) {
    if (lvl.hasPathway)
      PATHWAYS.forEach((p) => topicsFor(ex, lvl.key, p.key).forEach((t) => reachable.add(t.key)));
    else topicsFor(ex, lvl.key).forEach((t) => reachable.add(t.key));
  }
}
reachable.forEach((k) => {
  if (cardsFor(k).length < 4) problems.push(`${k}: only ${cardsFor(k).length} cards`);
  if (questionsFor(k).length < 5) problems.push(`${k}: only ${questionsFor(k).length} questions`);
});

console.log(`reachable topic areas : ${reachable.size}`);
console.log(`levels checked        : ${Object.keys(EXPECTED).length} + 3 L3 pathways`);
console.log(`weights checked       : ${Object.values(EXPECTED).flat().length + 3}`);
console.log(`module counts checked : ${Object.keys(EXPECTED_MODULE_COUNTS).length}`);

if (problems.length) {
  console.error(`\n✖ ${problems.length} mismatch(es) vs the syllabus PDF:`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('\n✓ every topic area, weight, module count and content bank matches the syllabus PDF');
