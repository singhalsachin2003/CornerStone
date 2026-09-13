/**
 * Glossary integrity. Run with `npm run check:glossary`.
 *
 * A glossary fails quietly in ways the type system cannot see: a topic key with
 * a typo removes a term from its filter and nothing errors, two entries for the
 * same idea both look fine in isolation, and a search alias that collides with
 * another term's name makes one of them unreachable. Each of those is checked
 * here rather than discovered by a candidate who cannot find "convexity".
 */
import { GLOSSARY } from '../src/content/glossary';
import { fold, searchTerms } from '../src/content/glossary/search';
import { ALL_TOPICS } from '../src/content/syllabus';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const problems: string[] = [];
const notes: string[] = [];

const KEY = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const validTopics = new Set(ALL_TOPICS.map((t) => t.key));

// --- keys and terms are unique ------------------------------------------------
const seenKeys = new Map<string, number>();
const seenTerms = new Map<string, string>();

for (const t of GLOSSARY) {
  if (!KEY.test(t.key)) problems.push(`key "${t.key}" is not a lowercase hyphenated slug`);

  const priorKey = seenKeys.get(t.key);
  if (priorKey !== undefined) problems.push(`duplicate key "${t.key}"`);
  seenKeys.set(t.key, 1);

  const folded = fold(t.term);
  const priorTerm = seenTerms.get(folded);
  if (priorTerm) {
    problems.push(`"${t.term}" (${t.key}) duplicates "${priorTerm}" — merge them, or use aka`);
  }
  seenTerms.set(folded, t.term);

  // --- prose is actually written ----------------------------------------------
  if (t.definition.trim().length < 40) {
    problems.push(`${t.key}: definition is too short to be useful`);
  }
  if (!/[.!?]$/.test(t.definition.trim())) {
    problems.push(`${t.key}: definition does not end in a full stop`);
  }
  if (t.note !== undefined && !/[.!?]$/.test(t.note.trim())) {
    problems.push(`${t.key}: note does not end in a full stop`);
  }
  // A definition that opens by restating the term reads as a dictionary joke and
  // wastes the first line, which on a phone is most of what gets read.
  if (fold(t.definition).startsWith(folded + ' is ')) {
    notes.push(`${t.key}: definition opens by restating the term`);
  }

  // --- topics resolve ----------------------------------------------------------
  if (t.topics.length === 0) problems.push(`${t.key}: no topics, so it is unreachable by filter`);
  for (const key of t.topics) {
    if (!validTopics.has(key)) {
      problems.push(`${t.key}: topic "${key}" is not a real topic area`);
    }
  }
}

// --- aliases do not shadow another term's name --------------------------------
const termNames = new Map(GLOSSARY.map((t) => [fold(t.term), t.key]));
for (const t of GLOSSARY) {
  for (const alias of t.aka ?? []) {
    const owner = termNames.get(fold(alias));
    if (owner && owner !== t.key) {
      problems.push(`${t.key}: alias "${alias}" is already the name of "${owner}"`);
    }
  }
}

// --- every term is findable by its own name -----------------------------------
for (const t of GLOSSARY) {
  const hits = searchTerms(GLOSSARY, t.term);
  if (hits[0]?.key !== t.key) {
    problems.push(`${t.key}: searching "${t.term}" does not return it first`);
  }
}

// --- the glossary stays free --------------------------------------------------
// The whole promise is that a reference is never taken away. An import of the
// access rules here would be the first step to a paywalled dictionary, so it is
// a build failure rather than a code review note.
const dir = join(__dirname, '..', 'src', 'content', 'glossary');
for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
  const src = readFileSync(join(dir, file), 'utf8');
  // Match imports only — the doc comments deliberately mention src/access.
  if (/^\s*import[^;]*['"][^'"]*access[^'"]*['"]/m.test(src)) {
    problems.push(`glossary/${file} imports from src/access — the glossary must stay free`);
  }
}

// --- coverage -----------------------------------------------------------------
const tagged = new Set(GLOSSARY.flatMap((t) => t.topics));
const untouched = ALL_TOPICS.filter((t) => !tagged.has(t.key));
if (untouched.length > 0) {
  notes.push(
    `${untouched.length} topic areas have no glossary terms: ${untouched.map((t) => t.key).join(', ')}`,
  );
}

const cfa = GLOSSARY.filter((t) => t.topics.some((k) => k.startsWith('cfa-'))).length;
const frm = GLOSSARY.filter((t) => t.topics.some((k) => k.startsWith('frm-'))).length;

for (const n of notes) console.log(`note: ${n}`);
if (problems.length > 0) {
  for (const p of problems) console.error(`error: ${p}`);
  console.error(`\n${problems.length} glossary problem(s)`);
  process.exit(1);
}
console.log(
  `glossary is well formed — ${GLOSSARY.length} terms (${cfa} CFA, ${frm} FRM), free for everyone`,
);
