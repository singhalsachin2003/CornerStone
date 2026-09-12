/**
 * Content integrity check. Run with `npm run check:content`.
 *
 * Guards the invariants that matter for a study app: every topic area in the
 * syllabus has real cards and questions, every question has exactly four options
 * with a valid answer index, an explanation and a curriculum reference, and no
 * content bank is keyed to a topic that does not exist.
 */
import {
  ALL_TOPICS,
  CARDS,
  CORE_SLUG,
  EXAMS,
  PREMIUM_SEGMENTS,
  QUESTIONS,
  Question,
  cardCount,
  examTotals,
  isAscending,
  isNumericOptionSet,
  optionValue,
  formatExamDate,
  premiumSegmentsFor,
  premiumTotals,
  questionCount,
  segmentsFor,
} from '../src/content';

const problems: string[] = [];
const known = new Set(ALL_TOPICS.map((t) => t.key));

/**
 * Exam dates must be ISO-8601. Hermes (React Native) only parses ISO, so a
 * human-readable date like "17 May 2027" silently becomes Invalid Date on device
 * and renders as "NaN days to exam day" — while working fine on web under V8.
 */
for (const exam of Object.values(EXAMS)) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(exam.date)) {
    problems.push(
      `${exam.key}: date "${exam.date}" is not ISO-8601 (YYYY-MM-DD) — breaks on Hermes`,
    );
    continue;
  }
  if (!Number.isFinite(Date.parse(exam.date))) {
    problems.push(`${exam.key}: date "${exam.date}" does not parse`);
  }
  if (/NaN|Invalid/.test(formatExamDate(exam.date))) {
    problems.push(`${exam.key}: formatExamDate produced "${formatExamDate(exam.date)}"`);
  }
}

for (const topic of ALL_TOPICS) {
  if (cardCount(topic.key) === 0) problems.push(`${topic.key}: no snapshot cards`);
  if (questionCount(topic.key) === 0) problems.push(`${topic.key}: no questions`);
}

for (const [key, cards] of Object.entries(CARDS)) {
  if (!known.has(key)) problems.push(`orphan card bank: ${key}`);
  cards.forEach((c, i) => {
    if (!c.kicker || !c.title || !c.body || !c.exam) problems.push(`card ${key}[${i}]: incomplete`);
  });
}

/** Every number appearing in a free-text explanation. */
function numbersIn(text: string): number[] {
  const out: number[] = [];
  for (const m of text.replace(/−/g, '-').matchAll(/-?\d[\d,]*(?:\.\d+)?/g)) {
    const n = Number.parseFloat(m[0].replace(/,/g, ''));
    if (Number.isFinite(n)) out.push(n);
  }
  return out;
}

/**
 * For a computational question, does the explanation actually state the answer?
 *
 * This exists because the structural checks cannot see arithmetic, and arithmetic
 * is where these questions go wrong. Three separate answer-index errors shipped
 * past every other check in this file — an option list where `a` pointed at 0.71%
 * while the working said 1.00%, a forward value pointing one option short, a
 * geometric mean off by a whole option — and each would have been caught here,
 * because in every case the explanation computed the right number and the index
 * pointed somewhere else.
 *
 * It also makes the content better on its own terms: an explanation that never
 * states its own answer is a worse explanation.
 */
function explanationStatesAnswer(q: Question): boolean {
  const answer = optionValue(q.opts[q.a]);
  if (!Number.isFinite(answer)) return true;

  // The tolerance is bounded by the distance to the nearest *other* option, not
  // just by the answer's magnitude. A flat 2% sounds reasonable and is useless
  // here: options like 6.14% and 6.18% sit 0.04 apart, so a 2% window around
  // either one swallows the other and a wrong answer index passes. Capping at
  // under half the nearest gap is what makes "a neighbouring option can never
  // satisfy this" true rather than merely intended.
  const others = q.opts.map(optionValue).filter((_, i) => i !== q.a);
  const gaps = others.map((v) => Math.abs(v - answer)).filter((g) => Number.isFinite(g) && g > 0);
  const nearestGap = gaps.length > 0 ? Math.min(...gaps) : Number.POSITIVE_INFINITY;
  const tolerance = Math.min(Math.max(Math.abs(answer) * 0.02, 1e-9), nearestGap * 0.45);

  return numbersIn(q.why).some((n) => Math.abs(n - answer) <= tolerance);
}

function checkQuestions(label: string, questions: Question[]) {
  questions.forEach((q, i) => {
    // Numeric option sets are not shuffled at session time, so their authored
    // order is what every candidate sees. Ascending order is what exam boards
    // print and what keeps the answer's slot uncorrelated with its correctness.
    if (isNumericOptionSet(q) && !isAscending(q)) {
      problems.push(`${label}[${i}]: numeric options are not in ascending order`);
    }
    if (q.opts.length !== 4) problems.push(`${label}[${i}]: ${q.opts.length} options, expected 4`);
    if (q.a < 0 || q.a >= q.opts.length)
      problems.push(`${label}[${i}]: answer index ${q.a} out of range`);
    if (new Set(q.opts).size !== q.opts.length) problems.push(`${label}[${i}]: duplicate options`);
    if (!q.text) problems.push(`${label}[${i}]: missing question text`);
    if (!q.why) problems.push(`${label}[${i}]: missing explanation`);
    if (isNumericOptionSet(q) && q.why && !explanationStatesAnswer(q)) {
      problems.push(
        `${label}[${i}]: the explanation never states the answer (${q.opts[q.a]}) — ` +
          'either the answer index is wrong or the working is',
      );
    }
    if (!q.ref) problems.push(`${label}[${i}]: missing curriculum reference`);
  });
}

for (const [key, questions] of Object.entries(QUESTIONS)) {
  if (!known.has(key)) problems.push(`orphan quiz bank: ${key}`);
  checkQuestions(key, questions);
}

// ---------------------------------------------------------------------------
// Segments
// ---------------------------------------------------------------------------

const topicModules = new Map(ALL_TOPICS.map((t) => [t.key, new Set(t.modules)]));

for (const [topicKey, specs] of Object.entries(PREMIUM_SEGMENTS)) {
  if (!known.has(topicKey)) {
    problems.push(`orphan premium segment bank: ${topicKey}`);
    continue;
  }
  const slugs = new Set<string>();
  for (const spec of specs) {
    const label = `${topicKey}/${spec.slug}`;
    // `core` is how the free segment is addressed. A premium segment claiming that
    // slug would shadow the free content in every lookup that goes through a key.
    if (spec.slug === CORE_SLUG)
      problems.push(`${label}: premium segment may not use the reserved core slug`);
    if (!/^[a-z0-9-]+$/.test(spec.slug)) problems.push(`${label}: slug must be kebab-case`);
    if (slugs.has(spec.slug)) problems.push(`${label}: duplicate slug within the topic`);
    slugs.add(spec.slug);
    if (!spec.name || !spec.blurb) problems.push(`${label}: missing name or blurb`);
    if (spec.cards.length === 0) problems.push(`${label}: no snapshot cards`);
    if (spec.questions.length === 0) problems.push(`${label}: no questions`);
    if (spec.modules.length === 0) problems.push(`${label}: cites no learning modules`);
    // A segment claims to cover named modules from the published outline. A module
    // that is not in this topic's own list means the segment is filed under the
    // wrong area or the name was mistyped — both mislead a candidate lining the app
    // up against the curriculum they were given, which is the point of citing them.
    const moduleNames = topicModules.get(topicKey)!;
    for (const m of spec.modules) {
      if (!moduleNames.has(m))
        problems.push(`${label}: module not in the syllabus for this area — "${m}"`);
    }
    spec.cards.forEach((c, i) => {
      if (!c.kicker || !c.title || !c.body || !c.exam)
        problems.push(`card ${label}[${i}]: incomplete`);
    });
    // Validate what ships, not what was typed. Numeric option sets are put into
    // ascending order at the content boundary (see src/content/optionOrder.ts), so
    // checking the authored spec would fail on a file the app never serves.
    const shipped = premiumSegmentsFor(topicKey).find((seg) => seg.slug === spec.slug);
    checkQuestions(label, shipped?.questions ?? spec.questions);
  }
}

// Segment keys are route params, so they must be unique across the whole app.
const segmentKeys = new Set<string>();
for (const topic of ALL_TOPICS) {
  for (const seg of segmentsFor(topic.key)) {
    if (segmentKeys.has(seg.key)) problems.push(`duplicate segment key: ${seg.key}`);
    segmentKeys.add(seg.key);
  }
}

const cards = ALL_TOPICS.reduce((n, t) => n + cardCount(t.key), 0);
const questions = ALL_TOPICS.reduce((n, t) => n + questionCount(t.key), 0);

console.log(`topic areas   ${ALL_TOPICS.length}`);
console.log(`cards         ${cards}`);
console.log(`questions     ${questions}`);
console.log(`CFA           ${JSON.stringify(examTotals('CFA'))}`);
console.log(`FRM           ${JSON.stringify(examTotals('FRM'))}`);
console.log(`premium       ${JSON.stringify(premiumTotals())}`);

// How much work the boundary is doing. Not a failure — the normaliser exists so
// banks can be written in whatever order reads best — but a number worth seeing,
// because it is the count of questions whose slots the author did not choose.
const reordered = ALL_TOPICS.flatMap((t) => segmentsFor(t.key))
  .flatMap((seg) => seg.questions)
  .filter((q) => isNumericOptionSet(q)).length;
console.log(`numeric items ${reordered} with fixed option order, all ascending`);
console.log(
  `paid areas    ${ALL_TOPICS.filter((t) => premiumSegmentsFor(t.key).length > 0).length} of ${ALL_TOPICS.length}`,
);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('\nall content checks passed');
