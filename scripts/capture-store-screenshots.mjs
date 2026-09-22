/**
 * Recaptures every phone screenshot in `store/screenshots/`.
 *
 * All seven used to be hand-staged except the dashboard, and hand-staging is why
 * four of them spent a release advertising the placeholder square-and-circle tab
 * glyphs that `02c4bcc` replaced with Lucide icons: nothing connected a UI change
 * to the pictures in the listing. This does, so a screenshot is never older than
 * the last time somebody ran it.
 *
 *   npx expo export --platform web --output-dir .expo-web
 *   npm run store:screenshot
 *
 * Renders at a 540×960 CSS viewport at 2× to land on the 1080×1920 the listing
 * uses. Drives the Chrome already installed on the machine through
 * `playwright-core`, which arrives as an Expo transitive dependency rather than
 * something this project declares — if an SDK upgrade drops it, install it
 * directly.
 *
 * The two screens that need a tap — the revealed exam angle and quiz feedback —
 * are reached by clicking coordinates rather than selectors. React Native Web
 * renders a `Pressable` as a plain div with no role, and Playwright's element
 * clicks do not reliably fire its press handler; a real mouse click at the
 * element's centre does.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB_DIR = process.env.WEB_DIR ? resolve(process.env.WEB_DIR) : join(ROOT, '.expo-web');
const OUT_DIR = join(ROOT, 'store/screenshots');
const PORT = 8765;

/**
 * The day every shot is staged around. Pinned rather than "today" so the
 * countdown, the streak and the week strip stay consistent with each other, and
 * so rerunning this next month produces the same images instead of silently
 * different ones.
 */
const TODAY = '2026-07-31';
const CLOCK = `${TODAY}T14:30:00`;

if (!existsSync(WEB_DIR)) {
  console.error(
    `No web export at ${WEB_DIR}\n` +
      `Run:  npx expo export --platform web --output-dir ${WEB_DIR}`,
  );
  process.exit(1);
}

const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

/**
 * Ethics and Quant sit above the 60% mark that the resume card treats as "done", so
 * Economics becomes the pick-up-where-you-left-off topic. Weighted against the
 * published Level I bands these land on 44% overall.
 */
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

const persisted = {
  state: {
    onboarded: true,
    // The shipped default. A screenshot showing a made-up person's name is what
    // sent this file stale the first time.
    name: 'Guest',
    initials: 'G',
    exam: 'CFA',
    level: 'L1',
    levelByExam: { CFA: 'L1' },
    pathway: 'portfolio',
    variant: 'b',
    themePreference: 'system',
    mastery,
    // Economics is deliberately absent. The resume card reads "{weight} of the exam"
    // only while a topic's cards are unstarted, and that surfaces the weighted-
    // syllabus idea; any entry here flips it to the duller "quiz unlocked".
    cardProgress: { 'cfa-l1-ethics': 3, 'cfa-l1-quant': 3 },
    bookmarkedQuestions: { 'cfa-l1-fsa#1': true, 'cfa-l1-equity#0': true },
    bookmarkedCards: { 'cfa-l1-econ#1': true },
    reviewQueue: [
      { id: 'cfa-l1-fsa#2', topicKey: 'cfa-l1-fsa', qIdx: 2, step: 0, dueOn: TODAY, lapses: 1 },
      { id: 'cfa-l1-deriv#0', topicKey: 'cfa-l1-deriv', qIdx: 0, step: 0, dueOn: TODAY, lapses: 1 },
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
      {
        id: 'cfa-l1-equity#4',
        topicKey: 'cfa-l1-equity',
        qIdx: 4,
        step: 2,
        dueOn: addDays(TODAY, 7),
        lapses: 1,
      },
    ],
    studyDays: Array.from({ length: 9 }, (_, i) => addDays(TODAY, -(8 - i))),
    questionsAnswered: 214,
    questionsCorrect: 151,
    settings: { spacedRepetition: true, dailyReminder: false, timedQuizzes: false },
  },
  version: 0,
};

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

// expo exports the web build as a single-page app, so anything that is not a real
// file has to fall back to index.html rather than 404.
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = join(WEB_DIR, path);
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(WEB_DIR, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function openPage(theme) {
  const ctx = await browser.newContext({
    viewport: { width: 540, height: 960 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await ctx.newPage();

  // Freeze the clock so the greeting reads "Good afternoon" every run rather than
  // whatever time the script happened to be invoked. Same calendar day as the
  // seeded state, so the countdown and the streak are untouched.
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

  // Seeded before the app boots, so zustand rehydrates straight into this state
  // and no navigation is needed to reach a populated screen.
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    ['cornerstone.study.v1', JSON.stringify(persisted)],
  );
  return { ctx, page };
}

const text = (page) => page.evaluate(() => document.body.innerText);

/**
 * Centre-click the visible element whose text matches, by coordinates.
 *
 * `maxHeight` is what separates a row from the container that holds it: both
 * match the row's text, and clicking the container lands in the wrong place.
 */
async function tap(page, pattern, { dy = 0, pick = 'last', maxHeight = 1e4 } = {}) {
  const box = await page.evaluate(
    ([src, pickWhich, maxH]) => {
      const re = new RegExp(src);
      const hits = [...document.querySelectorAll('div,span')].filter((el) => {
        if (!re.test(el.innerText || '')) return false;
        const r = el.getBoundingClientRect();
        return (
          r.width > 20 && r.height > 12 && r.height <= maxH && r.bottom > 0 && r.top < innerHeight
        );
      });
      const hit = pickWhich === 'first' ? hits[0] : hits[hits.length - 1];
      if (!hit) return null;
      const r = hit.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    },
    [pattern, pick, maxHeight],
  );
  if (!box) throw new Error(`nothing matching /${pattern}/ to tap`);
  await page.mouse.click(box.x, box.y + dy);
  await page.waitForTimeout(900);
}

async function shoot(page, file) {
  await page.screenshot({ path: join(OUT_DIR, file) });
  const heading = (await text(page)).split('\n').slice(0, 2).join(' · ');
  console.log(`${file}  ${heading}`);
}

const { ctx, page } = await openPage('light');
const go = async (route) => {
  await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
};

// 01 / 02 — a snapshot card carrying a formula block, then its exam angle.
await go('/snapshot?topic=cfa-l1-econ');
for (let i = 0; i < 6 && !/FORMULA/.test(await text(page)); i++) await tap(page, '^Next card$');
if (!/FORMULA/.test(await text(page))) throw new Error('no card with a formula in the first six');
await shoot(page, '01-snapshot-card.png');
await tap(page, 'Tap the card for the exam angle', { dy: -260 });
if (!/IN THE EXAM/.test(await text(page))) throw new Error('the card did not reveal');
await shoot(page, '02-snapshot-revealed.png');

/**
 * 03 — quiz feedback on a *right* answer, which is the version of this screen
 * worth showing: the explanation, the worked formula and the LOS reference.
 * Nothing in the DOM says which option is correct until one is chosen, so this
 * answers question 1 and, if it guessed wrong, restarts the session and tries the
 * next option — rather than moving on, which would leave a red segment in the
 * progress bar at the top of the shot. Option order is seeded per question, so
 * every run lands on the same screenshot.
 */
const QUIZ_SEGMENT = '/snapshot?topic=cfa-l1-fixed&segment=core';
const startQuiz = async () => {
  await go(QUIZ_SEGMENT);
  for (let i = 0; i < 8 && !/Start the quiz/.test(await text(page)); i++)
    await tap(page, '^Next card$');
  await tap(page, '^Start the quiz');
  if (!/QUESTION 1 OF/.test(await text(page))) throw new Error('the quiz did not start');
};

let answered = '';
for (const letter of 'ABCD') {
  await startQuiz();
  await tap(page, `^${letter}\\n`, { pick: 'first', maxHeight: 90 });
  answered = await text(page);
  if (!/(CORRECT|NOT QUITE)/.test(answered)) throw new Error('the answer did not register');
  if (/CORRECT/.test(answered)) break;
}
if (!/CORRECT/.test(answered)) throw new Error('no option on question 1 was the right one');
await shoot(page, '03-quiz-feedback.png');

// 04–07 — the screens that need no interaction.
await go('/home');
await shoot(page, '04-home-dashboard.png');
await go('/topics');
await shoot(page, '05-topics-weights.png');
await go('/review');
await shoot(page, '06-review-queue.png');
await go('/switch');
await shoot(page, '07-exam-switcher.png');
await ctx.close();

// 08 — the same dashboard in dark mode. Play allows eight phone shots and dark
// mode is the kind of thing a candidate studying at 11pm scrolls the set for.
const dark = await openPage('dark');
await dark.page.goto(`http://127.0.0.1:${PORT}/home`, { waitUntil: 'networkidle' });
await dark.page.waitForTimeout(2000);
await shoot(dark.page, '08-home-dark.png');
await dark.ctx.close();

await browser.close();
server.close();
console.log(`\nwrote ${OUT_DIR} — 1080×1920`);
