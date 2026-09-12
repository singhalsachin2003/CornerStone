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
  EXAMS,
  QUESTIONS,
  cardCount,
  examTotals,
  formatExamDate,
  questionCount,
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

for (const [key, questions] of Object.entries(QUESTIONS)) {
  if (!known.has(key)) problems.push(`orphan quiz bank: ${key}`);
  questions.forEach((q, i) => {
    if (q.opts.length !== 4) problems.push(`${key}[${i}]: ${q.opts.length} options, expected 4`);
    if (q.a < 0 || q.a >= q.opts.length)
      problems.push(`${key}[${i}]: answer index ${q.a} out of range`);
    if (new Set(q.opts).size !== q.opts.length) problems.push(`${key}[${i}]: duplicate options`);
    if (!q.why) problems.push(`${key}[${i}]: missing explanation`);
    if (!q.ref) problems.push(`${key}[${i}]: missing curriculum reference`);
  });
}

const cards = ALL_TOPICS.reduce((n, t) => n + cardCount(t.key), 0);
const questions = ALL_TOPICS.reduce((n, t) => n + questionCount(t.key), 0);

console.log(`topic areas   ${ALL_TOPICS.length}`);
console.log(`cards         ${cards}`);
console.log(`questions     ${questions}`);
console.log(`CFA           ${JSON.stringify(examTotals('CFA'))}`);
console.log(`FRM           ${JSON.stringify(examTotals('FRM'))}`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('\nall content checks passed');
