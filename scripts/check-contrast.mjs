/**
 * Walks every screen in both themes and reports any text whose contrast against
 * its own background falls below WCAG AA.
 *
 * Dark mode is the reason this exists. A palette can be derived carefully and
 * still put light-palette brass on a dark ground at one call site that forgot to
 * thread the theme through — which is exactly what happened to the exam switcher
 * on the first pass, and what no amount of reading the diff was going to catch.
 * The browser computes the colour that actually rendered, including the opacity
 * and the stack of translucent backgrounds behind it.
 *
 *   npx expo export --platform web --output-dir .expo-web
 *   npm run check:contrast
 *
 * Deliberately not in `npm run verify`: it needs a web export, which takes about
 * a minute, and the gate is meant to stay at ten seconds. Run it after touching
 * the palette, the type scale, or any screen's colours.
 *
 * Drives the Chrome already on the machine through `playwright-core`, the same
 * way `capture-home-screenshot.mjs` does.
 *
 * `EXPECTED` below holds what is known to be under the bar and is not a
 * regression — see the comments on each entry. Everything else fails the run.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB_DIR = process.env.WEB_DIR ? resolve(process.env.WEB_DIR) : join(ROOT, '.expo-web');
const SHOT_DIR = process.env.SHOT_DIR ? resolve(process.env.SHOT_DIR) : null;
const PORT = 8791;
const TODAY = '2026-07-31';
const CLOCK = `${TODAY}T14:30:00`;

if (!existsSync(WEB_DIR)) {
  console.error(
    `No web export at ${WEB_DIR}\n` +
      `Run:  npx expo export --platform web --output-dir ${WEB_DIR}`,
  );
  process.exit(1);
}

/**
 * Known and accepted, by the colour that produces them.
 *
 *  - The light palette's small-copy colours — `muted`, `meta`, `brass`,
 *    `brassBody` and `tabInactive` — used to sit here at 2.36–4.23:1. They were
 *    darkened in `src/theme/tokens.ts` instead, so nothing of theirs is accepted
 *    any more; what remains below is only what is decorative by intent.
 *  - The snapshot card's watermark number is decorative: a numeral at 16–22%
 *    behind the card title, in both themes by design.
 *  - The Index variant's card is a dark card in *both* themes — a card style, not
 *    a theme — so its own muted copy reads the same 4.41 in light mode as in dark.
 */
const EXPECTED = [
  { color: 'rgba(22, 35, 59, 0.16)', theme: 'light' },
  // the Index card, identical in both themes
  { color: 'rgba(244, 241, 234, 0.22)' },
  { color: 'rgba(244, 241, 234, 0.5)' },
  { color: 'rgba(244, 241, 234, 0.18)', theme: 'dark' },
];

const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const mastery = {
  'cfa-l1-ethics': 72,
  'cfa-l1-quant': 66,
  'cfa-l1-econ': 41,
  'cfa-l1-fsa': 38,
  'cfa-l1-corp': 30,
  'cfa-l1-equity': 45,
  'cfa-l1-fixed': 40,
  'cfa-l1-deriv': 25,
  'cfa-l1-alt': 20,
  'cfa-l1-pm': 35,
};

/** Part-finished, so rings, streaks and the review queue all have something to draw. */
const baseState = {
  onboarded: true,
  name: 'Guest',
  initials: 'G',
  exam: 'CFA',
  level: 'L1',
  levelByExam: { CFA: 'L1' },
  pathway: 'portfolio',
  variant: 'b',
  mastery,
  cardProgress: { 'cfa-l1-ethics': 3, 'cfa-l1-quant': 3 },
  bookmarkedQuestions: { 'cfa-l1-fsa#1': true },
  bookmarkedCards: { 'cfa-l1-econ#1': true },
  reviewQueue: [
    { id: 'cfa-l1-fsa#2', topicKey: 'cfa-l1-fsa', qIdx: 2, step: 0, dueOn: TODAY, lapses: 1 },
    {
      id: 'cfa-l1-alt#3',
      topicKey: 'cfa-l1-alt',
      qIdx: 3,
      step: 1,
      dueOn: addDays(TODAY, -1),
      lapses: 2,
    },
    {
      id: 'cfa-l1-corp#1',
      topicKey: 'cfa-l1-corp',
      qIdx: 1,
      step: 2,
      dueOn: addDays(TODAY, 4),
      lapses: 1,
    },
  ],
  studyDays: Array.from({ length: 9 }, (_, i) => addDays(TODAY, -(8 - i))),
  questionsAnswered: 214,
  questionsCorrect: 151,
  settings: { spacedRepetition: true, dailyReminder: false, timedQuizzes: false },
};

const ROUTES = [
  ['home', '/home'],
  ['topics', '/topics'],
  ['topics-index', '/topics', { variant: 'c' }],
  ['review', '/review'],
  ['profile', '/profile'],
  ['snapshot', '/snapshot?topic=cfa-l1-econ'],
  ['snapshot-index', '/snapshot?topic=cfa-l1-econ', { variant: 'c' }],
  ['glossary', '/glossary'],
  ['about', '/about'],
  ['account', '/account'],
  ['paywall', '/paywall'],
  ['switch', '/switch'],
  ['segments', '/segments?topic=cfa-l1-econ'],
  ['setup-exam', '/setup/exam'],
  ['setup-level', '/setup/level'],
  ['onboarding', '/onboarding', { onboarded: false }],
];

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = join(WEB_DIR, path);
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(WEB_DIR, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));

/**
 * Runs in the page. For every element that owns a text node: resolve its colour
 * and the background actually behind it — compositing every translucent layer up
 * the tree onto white — and compare. AA is 4.5:1, or 3:1 for large text.
 */
const MEASURE = `(() => {
  const lum = (r, g, b) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const WHITE = { r: 255, g: 255, b: 255, a: 1 };
  const bgOf = (el) => {
    let acc = null;
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (!c || c.a === 0) continue;
      acc = acc ? over(acc, c) : c;
      if (c.a >= 1) return acc;
    }
    return acc ? over(acc, WHITE) : WHITE;
  };
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none' || parseFloat(st.opacity) < 0.15) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    const declared = parse(st.color);
    if (!declared) continue;
    const bg = bgOf(el);
    const fg = over({ ...declared, a: declared.a * parseFloat(st.opacity || '1') }, bg);
    const ratio = (Math.max(lum(fg.r, fg.g, fg.b), lum(bg.r, bg.g, bg.b)) + 0.05)
                / (Math.min(lum(fg.r, fg.g, fg.b), lum(bg.r, bg.g, bg.b)) + 0.05);
    const size = parseFloat(st.fontSize);
    const large = size >= 24 || (size >= 18.66 && parseInt(st.fontWeight, 10) >= 600);
    if (ratio < (large ? 3 : 4.5)) {
      out.push({
        text: el.textContent.trim().slice(0, 40),
        ratio: +ratio.toFixed(2),
        size,
        color: st.color,
        bg: 'rgb(' + [bg.r, bg.g, bg.b].map(Math.round).join(', ') + ')',
      });
    }
  }
  return out;
})()`;

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
if (SHOT_DIR) mkdirSync(SHOT_DIR, { recursive: true });
let unexpected = 0;
let accepted = 0;

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 400, height: 860 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await ctx.newPage();

  // Frozen so the greeting, the countdown and the streak agree with the seeded state.
  await page.addInitScript((iso) => {
    const Real = Date;
    const fixed = new Real(iso).getTime();
    class Frozen extends Real {
      constructor(...args) {
        if (args.length === 0) super(fixed);
        else super(...args);
      }
      static now() {
        return fixed;
      }
    }
    window.Date = Frozen;
  }, CLOCK);

  for (const [name, route, overrides] of ROUTES) {
    await page.addInitScript(
      ([key, value]) => window.localStorage.setItem(key, value),
      [
        'cornerstone.study.v1',
        JSON.stringify({ state: { ...baseState, ...overrides }, version: 0 }),
      ],
    );
    await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);
    if (SHOT_DIR) await page.screenshot({ path: join(SHOT_DIR, `${theme}-${name}.png`) });

    const found = await page.evaluate(MEASURE);
    const bad = found.filter(
      (f) => !EXPECTED.some((e) => e.color === f.color && (e.theme ?? theme) === theme),
    );
    accepted += found.length - bad.length;
    if (!bad.length) {
      console.log(`${theme}/${name}: ok`);
      continue;
    }
    unexpected += bad.length;
    console.log(`${theme}/${name}: ${bad.length} below AA`);
    for (const b of bad.slice(0, 10)) {
      console.log(`   ${b.ratio}:1  ${b.size}px  ${b.color} on ${b.bg}   "${b.text}"`);
    }
  }
  await ctx.close();
}

await browser.close();
server.close();

console.log(`\n${accepted} known-and-accepted, ${unexpected} unexpected`);
if (unexpected) {
  console.error('Text below WCAG AA that is not on the accepted list.');
  process.exit(1);
}
