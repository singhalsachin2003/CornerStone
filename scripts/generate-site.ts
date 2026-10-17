/**
 * Generates the public study pages under docs/frm and docs/glossary from the
 * app's own free content, so the website cannot drift from what ships:
 *   - docs/frm/index.md and one page per FRM topic area: published weight band,
 *     official learning modules, and the free sample questions with answers
 *   - docs/glossary/frm.md: the FRM terms from the glossary, which is free
 *     permanently in the app
 *   - docs/cfa/index.md and one page per CFA topic area and Level III pathway,
 *     built the same way from the free CFA question banks
 *   - docs/glossary/cfa.md: the CFA terms from the same glossary
 *   - docs/glossary/index.md: a hub for both glossaries
 *
 * Only the free question banks are published. Premium segments never appear here.
 * Run: npx tsx scripts/generate-site.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { EXAMS, PATHWAYS, formatExamDate, pathwayTopic } from '../src/content/syllabus';
import { FRM_QUESTIONS } from '../src/content/questions/frm';
import { CFA_L1_QUESTIONS } from '../src/content/questions/cfaL1';
import { CFA_L2_QUESTIONS } from '../src/content/questions/cfaL2';
import { CFA_L3_QUESTIONS } from '../src/content/questions/cfaL3';
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
  return '[Get Cornerstone on Google Play (Android)](/CornerStone/get/?c=web)\n\n[Follow the daily questions on WhatsApp](https://whatsapp.com/channel/0029Vb9LcPUFXUudEZ6Hm61m)';
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
// ---- CFA -------------------------------------------------------------------
// Mirrors the FRM pages above. Only the original free banks (src/content/questions)
// are read; the premium segments under src/content/segments never reach the site.
const CFA_NOTE =
  'Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed by or sponsored by CFA Institute.';
const CFA_QUESTIONS = { ...CFA_L1_QUESTIONS, ...CFA_L2_QUESTIONS, ...CFA_L3_QUESTIONS };
const cfa = EXAMS.CFA;
const cfaSlug = (key: string) => key.replace(/^cfa-/, '');
const l3 = cfa.levels.find((l) => l.hasPathway);
const cfaTopics = [
  ...cfa.levels.flatMap((l) => l.topics.map((t) => ({ t, levelName: l.name, pathway: false }))),
  ...PATHWAYS.map((p) => ({
    t: pathwayTopic(p),
    levelName: l3 ? l3.name : 'Level III',
    pathway: true,
  })),
];

for (const { t, levelName, pathway } of cfaTopics) {
  const qs = CFA_QUESTIONS[t.key] ?? [];
  const out: string[] = [];
  out.push('---');
  out.push(`title: "${esc(t.name)} — CFA ${esc(levelName)} sample questions"`);
  out.push(
    `description: "${esc(t.name)}: weight band, learning modules and ${qs.length} worked sample questions for CFA ${esc(levelName)} candidates."`,
  );
  out.push(`permalink: /cfa/${cfaSlug(t.key)}/`);
  out.push('---', '');
  out.push(`# ${t.name}`, '');
  out.push(
    `*CFA® ${levelName}${pathway ? ' pathway' : ''}, published weight ${t.weight}.* ${t.blurb}`,
    '',
    '## What the outline covers',
    '',
  );
  for (const m of t.modules) out.push(`- ${m}`);
  if (qs.length) {
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
  }
  out.push('', '## Practise more', '');
  out.push(
    'The app adds snapshot cards, timed question sessions and a spaced-repetition review queue for this topic area, and works offline.',
    '',
    install(),
    '',
    `[All CFA topic areas](/CornerStone/cfa/) · [CFA glossary](/CornerStone/glossary/cfa/)`,
    '',
    `*${CFA_NOTE}*`,
  );
  write(`cfa/${cfaSlug(t.key)}.md`, out.join('\n'));
}

{
  const out: string[] = [];
  out.push('---');
  out.push('title: "CFA topic map: Level I, Level II and Level III"');
  out.push(
    `description: "The CFA topic areas for all three levels and the Level III pathways, with published weight bands, official modules and free worked sample questions."`,
  );
  out.push('permalink: /cfa/');
  out.push('---', '');
  out.push('# CFA® topic map', '');
  out.push(
    'Each topic area below lists its published weight band and the learning modules from the outline, with free sample questions and answers.',
    '',
  );
  for (const level of cfa.levels) {
    out.push(`## ${level.name}`, '', level.note, '');
    for (const t of level.topics) {
      out.push(`- [${t.name}](/CornerStone/cfa/${cfaSlug(t.key)}/) — ${t.weight}. ${t.blurb}`);
    }
    out.push('');
    if (level.hasPathway) {
      out.push(
        '### Level III pathways',
        '',
        'Candidates choose one pathway, which sits on top of the core topics.',
        '',
      );
      for (const p of PATHWAYS) {
        const t = pathwayTopic(p);
        out.push(`- [${t.name}](/CornerStone/cfa/${cfaSlug(t.key)}/) — ${t.weight}. ${t.blurb}`);
      }
      out.push('');
    }
  }
  out.push(
    '## Study on your phone',
    '',
    install(),
    '',
    '[CFA glossary](/CornerStone/glossary/cfa/) · [FRM topic map](/CornerStone/frm/)',
    '',
    `*${CFA_NOTE}*`,
  );
  write('cfa/index.md', out.join('\n'));
}

{
  const terms = GLOSSARY.filter((g) => g.topics.some((k) => k.startsWith('cfa-'))).sort((a, b) =>
    a.term.localeCompare(b.term),
  );
  const out: string[] = [];
  out.push('---');
  out.push('title: "CFA glossary: investment terms defined"');
  out.push(
    `description: "${terms.length} CFA terms defined in plain English, with formulas and the exam angle."`,
  );
  out.push('permalink: /glossary/cfa/');
  out.push('---', '');
  out.push('# CFA® glossary', '');
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
  out.push(install(), '', '[CFA topic map](/CornerStone/cfa/)', '', `*${CFA_NOTE}*`);
  write('glossary/cfa.md', out.join('\n'));
  console.log(`cfa glossary terms: ${terms.length}`);
}

{
  const nCfa = GLOSSARY.filter((g) => g.topics.some((k) => k.startsWith('cfa-'))).length;
  const nFrm = GLOSSARY.filter((g) => g.topics.some((k) => k.startsWith('frm-'))).length;
  write(
    'glossary/index.md',
    [
      '---',
      'title: "Glossary: CFA and FRM terms defined"',
      `description: "${GLOSSARY.length} finance terms from the Cornerstone glossary, in plain English with formulas and the exam angle."`,
      'permalink: /glossary/',
      '---',
      '',
      '# Glossary',
      '',
      `The Cornerstone glossary has ${GLOSSARY.length} terms, free permanently in the app. Some terms belong to both programmes.`,
      '',
      `- [CFA® glossary](/CornerStone/glossary/cfa/) — ${nCfa} terms`,
      `- [FRM® glossary](/CornerStone/glossary/frm/) — ${nFrm} terms`,
      '',
      install(),
      '',
      `*${CFA_NOTE.replace('CFA Institute.', 'CFA Institute or GARP.')}*`,
    ].join('\n'),
  );
}
console.log(`cfa topic pages: ${cfaTopics.length}`);
