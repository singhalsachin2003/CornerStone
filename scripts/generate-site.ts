/**
 * Generates the public study pages under docs/frm and docs/glossary from the
 * app's own free content, so the website cannot drift from what ships:
 *   - docs/frm/index.md and one page per FRM topic area: published weight band,
 *     official learning modules, and the free sample questions with answers
 *   - docs/glossary/frm.md: the FRM terms from the glossary, which is free
 *     permanently in the app
 *
 * Only the free question banks are published. Premium segments never appear here.
 * Run: npx tsx scripts/generate-site.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { EXAMS, formatExamDate } from '../src/content/syllabus';
import { FRM_QUESTIONS } from '../src/content/questions/frm';
import { GLOSSARY } from '../src/content/glossary';

const DOCS = join(__dirname, '..', 'docs');
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const NOTE =
  'Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed by or sponsored by GARP.';

const frm = EXAMS.FRM;
const frmTopics = frm.levels.flatMap((l) => l.topics.map((t) => ({ t, level: l })));
const slug = (key: string) => key.replace(/^frm-/, '');

function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}
function install(): string {
  // Through /get/ rather than straight to Play, so the redirector can attribute
  // the click to a custom store listing. `web` must also be in the allowlist in
  // docs/get/index.html, and a custom store listing of that name has to exist in
  // the Console — the Play API cannot create one. Until it does, Play ignores an
  // unknown `listing` and serves the default, so this is inert rather than broken.
  return '[Get Cornerstone on Google Play (Android)](/CornerStone/get/?c=web)';
}
function write(rel: string, body: string) {
  const path = join(DOCS, rel);
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, body.trimEnd() + '\n');
}

// ---- topic pages -----------------------------------------------------------
for (const { t, level } of frmTopics) {
  const qs = FRM_QUESTIONS[t.key] ?? [];
  const out: string[] = [];
  out.push('---');
  out.push(`title: "${esc(t.name)} — ${esc(level.name)} sample questions"`);
  out.push(
    `description: "${esc(t.name)}: weight band, learning modules and ${qs.length} worked sample questions for ${esc(level.name)} candidates."`,
  );
  out.push(`permalink: /frm/${slug(t.key)}/`);
  out.push('---', '');
  out.push(`# ${t.name}`, '');
  out.push(
    `*FRM® ${level.name}, published weight ${t.weight}.* ${t.blurb}`,
    '',
    '## What the outline covers',
    '',
  );
  for (const m of t.modules) out.push(`- ${m}`);
  out.push('', '## Sample questions', '');
  out.push(
    `These ${qs.length} questions are free in the app too. Try each one before opening the answer.`,
    '',
  );
  qs.forEach((q, i) => {
    out.push(`### Question ${i + 1}`, '', q.text, '');
    if (q.given) out.push(`> ${q.given}`, '');
    q.opts.forEach((o, j) => out.push(`${LETTERS[j]}. ${o}  `));
    out.push('', '<details markdown="1">', '<summary>Show the answer</summary>', '');
    out.push(`**${LETTERS[q.a]}.** ${q.why}`, '', `*Reading: ${q.ref}*`, '', '</details>', '');
  });
  out.push('## Practise more', '');
  out.push(
    'The app adds snapshot cards, timed question sessions and a spaced-repetition review queue for this topic area, and works offline.',
    '',
    install(),
    '',
    `[All FRM topic areas](/CornerStone/frm/) · [FRM glossary](/CornerStone/glossary/frm/)`,
    '',
    `*${NOTE}*`,
  );
  write(`frm/${slug(t.key)}.md`, out.join('\n'));
}

// ---- hub -------------------------------------------------------------------
{
  const out: string[] = [];
  out.push('---');
  out.push('title: "FRM topic map: Part I and Part II"');
  out.push(
    'description: "The ten FRM topic areas with published weight bands, official modules and free worked sample questions."',
  );
  out.push('permalink: /frm/');
  out.push('---', '');
  out.push('# FRM® topic map', '');
  out.push(
    `The next published sitting in this app is Part I on ${formatExamDate(frm.date)}. Each topic area below lists its published weight band and the learning modules from the outline, with free sample questions and answers.`,
    '',
  );
  for (const level of frm.levels) {
    out.push(`## ${level.name}`, '', level.note, '');
    for (const t of level.topics) {
      out.push(`- [${t.name}](/CornerStone/frm/${slug(t.key)}/) — ${t.weight}. ${t.blurb}`);
    }
    out.push('');
  }
  out.push(
    '## Study on your phone',
    '',
    install(),
    '',
    '[FRM glossary](/CornerStone/glossary/frm/)',
    '',
    `*${NOTE}*`,
  );
  write('frm/index.md', out.join('\n'));
}

// ---- glossary --------------------------------------------------------------
{
  const terms = GLOSSARY.filter((g) => g.topics.some((k) => k.startsWith('frm-'))).sort((a, b) =>
    a.term.localeCompare(b.term),
  );
  const out: string[] = [];
  out.push('---');
  out.push('title: "FRM glossary: risk management terms defined"');
  out.push(
    `description: "${terms.length} FRM terms defined in plain English, with formulas and the exam angle."`,
  );
  out.push('permalink: /glossary/frm/');
  out.push('---', '');
  out.push('# FRM® glossary', '');
  out.push(
    `${terms.length} terms, each written to be read cold. The same glossary is free in the app, with search.`,
    '',
  );
  for (const g of terms) {
    out.push(`### ${g.term} {#${g.key}}`, '');
    if (g.aka?.length) out.push(`*Also: ${g.aka.join(', ')}*`, '');
    out.push(g.definition, '');
    if (g.formula) out.push('```', g.formula, '```', '');
    if (g.note) out.push(`**Exam angle:** ${g.note}`, '');
  }
  out.push(install(), '', '[FRM topic map](/CornerStone/frm/)', '', `*${NOTE}*`);
  write('glossary/frm.md', out.join('\n'));
  console.log(`glossary terms: ${terms.length}`);
}
console.log(`topic pages: ${frmTopics.length}`);
