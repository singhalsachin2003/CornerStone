import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { GLOSSARY, termByKey, termsForTopic } from '@/content/glossary';
import {
  examsFor,
  filterByExam,
  filterByTopics,
  fold,
  initialOf,
  searchTerms,
  sectionise,
  sortTerms,
} from '@/content/glossary/search';
import { GlossaryTerm } from '@/content/glossary/types';

const mk = (term: string, over: Partial<GlossaryTerm> = {}): GlossaryTerm => ({
  key: fold(term).replace(/ /g, '-'),
  term,
  definition: 'A definition long enough to pass the length check applied by the content script.',
  topics: ['cfa-l1-quant'],
  ...over,
});

describe('fold', () => {
  it('ignores case, accents and punctuation', () => {
    expect(fold('Value-at-Risk')).toBe('value at risk');
    expect(fold('naïve')).toBe('naive');
    expect(fold('  Black–Scholes  ')).toBe('black scholes');
  });

  it('collapses runs of separators rather than leaving empty words', () => {
    expect(fold('two  and---twenty')).toBe('two and twenty');
  });
});

describe('searchTerms', () => {
  const terms = [
    mk('Duration'),
    mk('Modified duration'),
    mk('Effective duration'),
    mk('Value at Risk', { aka: ['VaR'] }),
  ];

  it('returns everything for an empty query, so one function serves the plain list', () => {
    expect(searchTerms(terms, '')).toHaveLength(4);
    expect(searchTerms(terms, '   ')).toHaveLength(4);
  });

  it('ranks an exact match first, then a prefix, then a word start', () => {
    const hits = searchTerms(terms, 'duration').map((t) => t.term);
    expect(hits[0]).toBe('Duration');
    expect(hits).toEqual(expect.arrayContaining(['Modified duration', 'Effective duration']));
  });

  it('finds a term by its abbreviation', () => {
    expect(searchTerms(terms, 'var')[0].term).toBe('Value at Risk');
  });

  it('matches across punctuation the candidate will not type', () => {
    expect(searchTerms(terms, 'value at risk')[0].term).toBe('Value at Risk');
    expect(searchTerms([mk('Black–Scholes')], 'black scholes')).toHaveLength(1);
  });

  /**
   * Searching the definition body sounds helpful and is not: "risk" appears in
   * most definitions in a finance glossary, so it would return nearly everything
   * and answer nothing.
   */
  it('does not match on the definition text', () => {
    const t = [mk('Alpha', { definition: 'Something about convexity and nothing else at all.' })];
    expect(searchTerms(t, 'convexity')).toHaveLength(0);
  });

  it('returns nothing for a query that matches nothing', () => {
    expect(searchTerms(terms, 'zzzz')).toEqual([]);
  });
});

describe('sectionise', () => {
  it('groups by initial, drops empty letters and sorts A first', () => {
    const sections = sectionise(sortTerms([mk('Beta'), mk('Alpha'), mk('Basis risk')]));
    expect(sections.map((s) => s.letter)).toEqual(['A', 'B']);
    expect(sections[1].terms.map((t) => t.term)).toEqual(['Basis risk', 'Beta']);
  });

  it('files digits and symbols under # and puts that section last', () => {
    expect(initialOf(mk('2/20 fee'))).toBe('#');
    const sections = sectionise([mk('2/20 fee'), mk('Alpha')]);
    expect(sections.map((s) => s.letter)).toEqual(['A', '#']);
  });
});

describe('exam and topic filters', () => {
  const cfaOnly = mk('Mosaic theory', { topics: ['cfa-l1-ethics'] });
  const frmOnly = mk('Expected shortfall', { topics: ['frm-p2-market'] });
  const both = mk('Convexity', { topics: ['cfa-l1-fixed', 'frm-p2-market'] });

  it('derives exams from topic key prefixes rather than an authored field', () => {
    expect(examsFor(cfaOnly)).toEqual(['CFA']);
    expect(examsFor(frmOnly)).toEqual(['FRM']);
    expect(examsFor(both).sort()).toEqual(['CFA', 'FRM']);
  });

  it('keeps a shared term under either exam filter', () => {
    const all = [cfaOnly, frmOnly, both];
    expect(filterByExam(all, 'CFA').map((t) => t.term)).toEqual(['Mosaic theory', 'Convexity']);
    expect(filterByExam(all, 'FRM').map((t) => t.term)).toEqual([
      'Expected shortfall',
      'Convexity',
    ]);
    expect(filterByExam(all, null)).toHaveLength(3);
  });

  it('treats an empty topic filter as no filter', () => {
    expect(filterByTopics([cfaOnly, frmOnly], [])).toHaveLength(2);
    expect(filterByTopics([cfaOnly, frmOnly], ['frm-p2-market'])).toEqual([frmOnly]);
  });
});

describe('the shipped glossary', () => {
  it('ships a substantial number of terms for both exams', () => {
    expect(GLOSSARY.length).toBeGreaterThan(200);
    expect(filterByExam(GLOSSARY, 'CFA').length).toBeGreaterThan(100);
    expect(filterByExam(GLOSSARY, 'FRM').length).toBeGreaterThan(50);
  });

  it('has no duplicate keys', () => {
    const keys = GLOSSARY.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('looks a term up by key', () => {
    expect(termByKey('value-at-risk')?.term).toBe('Value at Risk');
    expect(termByKey('not-a-term')).toBeUndefined();
  });

  it('finds every shipped term by its own name', () => {
    for (const t of GLOSSARY) {
      expect(searchTerms(GLOSSARY, t.term)[0]?.key).toBe(t.key);
    }
  });

  it('tags terms to a topic that exists', () => {
    expect(termsForTopic('frm-p2-market').length).toBeGreaterThan(0);
    expect(termsForTopic('nonsense-topic')).toEqual([]);
  });

  /**
   * The promise is that the glossary is free permanently. An import of the access
   * rules would be the first step away from that, so it fails here as well as in
   * `check:glossary` — a content script is easy to skip, a test suite is not.
   */
  it('never imports the access rules', () => {
    const dir = join(__dirname, '..', 'src', 'content', 'glossary');
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
      const src = readFileSync(join(dir, file), 'utf8');
      expect(src).not.toMatch(/^\s*import[^;]*['"][^'"]*access[^'"]*['"]/m);
    }
  });
});
