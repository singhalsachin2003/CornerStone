/**
 * Recaptures `store/screenshots/04-home-dashboard.png`.
 *
 * That shot is the only one in the set that needs a populated store — a streak, a
 * part-finished syllabus and a review queue — so it was originally hand-staged, and
 * it went stale the moment the default profile name changed. This script stages the
 * same state from code instead, so it can be regenerated whenever the home screen
 * moves.
 *
 * The other six screenshots show first-run or mid-session screens and are still
 * captured by hand; nothing here is stopping you from extending it to those.
 *
 *   npx expo export --platform web --output-dir .expo-web
 *   npm run store:screenshot
 *
 * Renders at a 540×960 CSS viewport at 2× to land on the 1080×1920 the rest of the
 * set uses. Drives the Chrome already installed on the machine through
 * `playwright-core`, which arrives as an Expo transitive dependency rather than
 * something this project declares — if an SDK upgrade drops it, install it directly.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB_DIR = process.env.WEB_DIR ? resolve(process.env.WEB_DIR) : join(ROOT, '.expo-web');
const OUT = join(ROOT, 'store/screenshots/04-home-dashboard.png');
const PORT = 8765;

/**
 * The day the shot is staged around. Pinned rather than "today" so the countdown,
 * the streak and the week strip stay consistent with each other, and so rerunning
 * this next month produces the same image instead of a silently different one.
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
const ctx = await browser.newContext({
  viewport: { width: 540, height: 960 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

// Freeze the clock so the greeting reads "Good afternoon" every run rather than
// whatever time the script happened to be invoked. Same calendar day as the seeded
// state, so the countdown and the streak are untouched.
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

// Seeded before the app boots, so zustand rehydrates straight into this state and
// no navigation or tapping is needed to reach the dashboard.
await page.addInitScript(
  ([key, value]) => window.localStorage.setItem(key, value),
  ['cornerstone.study.v1', JSON.stringify(persisted)],
);

await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const heading = await page.evaluate(() =>
  document.body.innerText.split('\n').slice(0, 2).join(' · '),
);
await page.screenshot({ path: OUT });

await browser.close();
server.close();

console.log(`captured ${heading}`);
console.log(`wrote ${OUT} — 1080×1920`);
