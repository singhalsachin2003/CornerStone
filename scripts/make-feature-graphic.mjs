/**
 * Generates the Play Store feature graphic (1024×500, no alpha) from the brand.
 *
 *   node scripts/make-feature-graphic.mjs
 *
 * The brand fonts are read out of node_modules and embedded as data URIs, so the
 * output uses real Source Serif 4 and Archivo rather than a system substitute.
 *
 * Rendering needs a Chromium binary. It uses playwright-core if installed, otherwise
 * falls back to a local Google Chrome. Without either it still writes the .svg, which
 * you can open and export by hand. A browser is used deliberately: macOS `qlmanage`
 * applies its own fit-and-centre scaling and will not honour an exact pixel size.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'store');
mkdirSync(out, { recursive: true });

const FONTS = {
  serif: '@expo-google-fonts/source-serif-4/400Regular/SourceSerif4_400Regular.ttf',
  serifSemi: '@expo-google-fonts/source-serif-4/600SemiBold/SourceSerif4_600SemiBold.ttf',
  sans: '@expo-google-fonts/archivo/500Medium/Archivo_500Medium.ttf',
  sansSemi: '@expo-google-fonts/archivo/600SemiBold/Archivo_600SemiBold.ttf',
};

function embed(rel) {
  const p = join(root, 'node_modules', rel);
  if (!existsSync(p)) throw new Error(`font not found: ${rel} — run npm install first`);
  return readFileSync(p).toString('base64');
}

const face = (family, b64, weight) =>
  `@font-face{font-family:'${family}';src:url(data:font/ttf;base64,${b64}) format('truetype');font-weight:${weight};}`;

const css = [
  face('CSSerif', embed(FONTS.serif), 400),
  face('CSSerif', embed(FONTS.serifSemi), 600),
  face('CSSans', embed(FONTS.sans), 500),
  face('CSSans', embed(FONTS.sansSemi), 600),
].join('');

// Colours are the design tokens from src/theme/tokens.ts.
const ink = '#16233b';
const paper = '#f7f4ee';
const brass = '#9a6b2f';
const muted = '#6f7a90';
const meta = '#8c8578';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
<defs><style>${css}</style></defs>
<rect width="1024" height="500" fill="${paper}"/>

<rect x="64" y="398" width="896" height="1" fill="${ink}" fill-opacity="0.14"/>

<rect x="64" y="52" width="54" height="54" fill="none" stroke="${ink}" stroke-width="2.2"/>
<text x="91" y="80" font-family="CSSerif" font-size="28" font-weight="600" fill="${ink}"
      text-anchor="middle" dominant-baseline="central">C</text>
<text x="136" y="80" font-family="CSSans" font-size="13" font-weight="600" fill="${brass}"
      letter-spacing="2.1" dominant-baseline="central">CORNERSTONE</text>

<text x="64" y="196" font-family="CSSerif" font-size="44" fill="${ink}">Fifteen honest minutes</text>
<text x="64" y="248" font-family="CSSerif" font-size="44" fill="${ink}">beats three distracted hours.</text>

<text x="64" y="306" font-family="CSSans" font-size="17" font-weight="500" fill="${muted}">Snapshot cards and quizzes for CFA® and FRM® candidates.</text>

<text x="64" y="444" font-family="CSSans" font-size="15" font-weight="600" fill="${ink}">38 topic areas</text>
<text x="196" y="444" font-family="CSSans" font-size="15" font-weight="500" fill="${meta}">·</text>
<text x="214" y="444" font-family="CSSans" font-size="15" font-weight="600" fill="${ink}">Works offline</text>
<text x="336" y="444" font-family="CSSans" font-size="15" font-weight="500" fill="${meta}">·</text>
<text x="354" y="444" font-family="CSSans" font-size="15" font-weight="600" fill="${ink}">No account, no ads</text>

<circle cx="856" cy="212" r="74" fill="none" stroke="${ink}" stroke-opacity="0.10" stroke-width="16"/>
<circle cx="856" cy="212" r="74" fill="none" stroke="${brass}" stroke-width="16"
        stroke-dasharray="293 172" transform="rotate(-90 856 212)"/>
<text x="856" y="205" font-family="CSSerif" font-size="33" font-weight="600" fill="${ink}"
      text-anchor="middle" dominant-baseline="central">63%</text>
<text x="856" y="233" font-family="CSSans" font-size="10" font-weight="600" fill="${meta}"
      text-anchor="middle" letter-spacing="1.3" dominant-baseline="central">SYLLABUS</text>
</svg>`;

const svgPath = join(out, 'feature-graphic.svg');
writeFileSync(svgPath, svg);
console.log(`wrote ${svgPath}`);

async function findChromium() {
  try {
    const { chromium } = await import('playwright-core');
    const local =
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    const testing = join(
      process.env.HOME ?? '',
      'Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    );
    for (const executablePath of [testing, local]) {
      if (existsSync(executablePath)) return { chromium, executablePath };
    }
  } catch {
    // playwright-core not installed
  }
  return null;
}

const found = await findChromium();
if (!found) {
  console.log('No Chromium found — SVG written, render it manually to 1024×500 PNG (no alpha).');
  process.exit(0);
}

const browser = await found.chromium.launch({ executablePath: found.executablePath });
const page = await browser.newPage({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 2 });
await page.setContent(`<!doctype html><body style="margin:0;overflow:hidden">${svg}</body>`, {
  waitUntil: 'load',
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
// Screenshot at 2x then let the caller downsample; Play wants exactly 1024×500.
const pngPath = join(out, 'feature-graphic@2x.png');
await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1024, height: 500 } });
await browser.close();
console.log(`wrote ${pngPath} — downsample to 1024×500 (e.g. sips -z 500 1024) before upload`);
