/**
 * Renders the five paywall states and the locked segment list, so they can be
 * looked at rather than assumed.
 *
 *   node scripts/preview-access-screens.mjs
 *
 * These states are hard to reach any other way. A web build has no store, so
 * `configured` is false, so gating is off and every screen renders its open
 * variant — which is correct behaviour and useless for checking the others. So
 * this script temporarily patches `src/purchases/config.ts` to claim a key,
 * exports, captures, and restores the file. It restores in a `finally`, and the
 * patch asserts on its anchors rather than silently matching nothing: a patch that
 * quietly fails produces screenshots of the wrong states, which is worse than an
 * error.
 *
 * Entitlement is seeded straight into the access store's persisted key, so no
 * purchase, promo code or network call is involved.
 *
 * Output: .expo-web/access-preview/*.png (gitignored).
 */
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONFIG = join(ROOT, 'src/purchases/config.ts');
const WEB_DIR = join(ROOT, '.expo-web/access-preview-build');
const OUT_DIR = join(ROOT, '.expo-web/access-preview');
const PORT = 8766;

const PATCHES = [
  [
    "export const platformSupported = Platform.OS === 'ios' || Platform.OS === 'android';",
    'export const platformSupported = true; // preview build only',
  ],
  [
    "  const key = Platform.OS === 'ios' ? purchases.revenueCatIosKey : purchases.revenueCatAndroidKey;",
    "  const key = 'goog_preview_only'; // preview build only",
  ],
];

const original = readFileSync(CONFIG, 'utf8');
try {
  let patched = original;
  for (const [from, to] of PATCHES) {
    if (!patched.includes(from)) {
      throw new Error(
        `config.ts no longer contains the anchor this script patches:\n  ${from}\n` +
          'Update PATCHES rather than letting it produce screenshots of the wrong states.',
      );
    }
    patched = patched.replace(from, to);
  }
  writeFileSync(CONFIG, patched);
  rmSync(WEB_DIR, { recursive: true, force: true });
  execFileSync('npx', ['expo', 'export', '-p', 'web', '--output-dir', WEB_DIR], {
    cwd: ROOT,
    stdio: 'ignore',
  });
} finally {
  writeFileSync(CONFIG, original);
}

mkdirSync(OUT_DIR, { recursive: true });

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

const study = {
  state: {
    onboarded: true,
    name: 'Guest',
    initials: 'G',
    exam: 'CFA',
    level: 'L1',
    levelByExam: { CFA: 'L1' },
    pathway: 'portfolio',
    variant: 'b',
    mastery: { 'cfa-l1-ethics': 72, 'cfa-l1-quant': 41 },
    cardProgress: {},
    bookmarkedQuestions: {},
    bookmarkedCards: {},
    reviewQueue: [],
    studyDays: [],
    questionsAnswered: 214,
    questionsCorrect: 151,
    settings: { spacedRepetition: true, dailyReminder: false, timedQuizzes: false },
  },
  version: 0,
};

/** Plausible plan rows. Real prices come from Play; these are for layout only. */
const products = [
  {
    id: 'monthly',
    priceLabel: '£3.49',
    periodLabel: 'Monthly',
    title: 'Monthly',
    description: 'Billed each month, cancel any time',
  },
  {
    id: 'annual',
    priceLabel: '£24.99',
    periodLabel: 'Annual',
    title: 'Annual',
    description: 'Two months free against monthly',
  },
];

const access = (over) => ({
  state: {
    grandfathered: false,
    subscriptionActive: false,
    productAvailable: true,
    products,
    promoGrantUntil: null,
    promoCampaign: null,
    ...over,
  },
  version: 0,
});

const SCREENS = [
  ['segments-locked', '/segments?topic=cfa-l1-quant', access({})],
  ['segments-unlocked', '/segments?topic=cfa-l1-quant', access({ subscriptionActive: true })],
  ['paywall-offer', '/paywall', access({})],
  ['paywall-subscribed', '/paywall', access({ subscriptionActive: true })],
  ['paywall-grandfathered', '/paywall', access({ grandfathered: true })],
  [
    'paywall-promo',
    '/paywall',
    access({ promoGrantUntil: Date.now() + 9 * 86_400_000, promoCampaign: 'launch-2026' }),
  ],
  ['paywall-unavailable', '/paywall', access({ productAvailable: false })],
  ['topics-locked', '/topics', access({})],
  ['profile-locked', '/profile', access({})],
];

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let failures = 0;

for (const [name, path, accessState] of SCREENS) {
  const ctx = await browser.newContext({ viewport: { width: 540, height: 1100 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(
    ([s, a]) => {
      window.localStorage.setItem('cornerstone.study.v1', s);
      window.localStorage.setItem('cornerstone.access.v1', a);
    },
    [JSON.stringify(study), JSON.stringify(accessState)],
  );
  await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUT_DIR, `${name}.png`), fullPage: true });
  const headline = await page.evaluate(() =>
    document.body.innerText.split('\n').filter(Boolean).slice(0, 4).join(' · '),
  );
  console.log(`${name.padEnd(24)} ${headline}`);
  if (errors.length) {
    failures += 1;
    console.error(`  page errors: ${errors.slice(0, 2).join(' | ')}`);
  }
  await ctx.close();
}

await browser.close();
server.close();

console.log(`\nwrote ${SCREENS.length} screens to ${OUT_DIR}`);
if (failures) process.exit(1);
