/**
 * Price `cornerstone_premium` in every Play region, in two bands. Run with
 * `npm run set:regions` — which changes nothing. Pass `--commit` to write.
 *
 * **The two bands, from `docs/PRICING.md`:**
 *
 * - **Anchor** — USD 3.99 / month and USD 24.99 / year, converted outward by Play
 *   into each region's own currency.
 * - **Override** — twelve markets where the real price is INR 29 / 199 or its local
 *   equivalent, also converted by Play, from the INR amounts rather than the USD ones.
 *
 * Converting from INR outward is the mistake this exists to avoid: INR 199/year is
 * about USD 2.30, which is not a price for a CFA/FRM audience. Converting USD inward
 * is the opposite mistake — USD 3.99 lands at **INR 380/month**, thirteen times the
 * intended Indian price. Hence two bands rather than one.
 *
 * **Prices come from Play's own `pricing:convertRegionPrices`**, never from a
 * hand-built FX table. Play returns the price point it considers idiomatic for each
 * market — JPY 680 rather than JPY 597 — and those are the numbers a buyer expects
 * to see.
 *
 * **Two safety rules, both enforced below rather than trusted:**
 *
 * 1. **India is pinned to its existing INR 29 / 199 and never rewritten.** Conversion
 *    rounds INR 29 to INR 30, and Play restricts changing a price in a region that
 *    already has one — so an innocent-looking re-set is a price rise on a live
 *    product.
 * 2. **Any region already configured must come out identical, or this aborts.** The
 *    job is to *add* regions; changing an existing price is a different operation
 *    with a different blast radius, and it is not going to happen by accident here.
 */
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PACKAGE = 'io.cornerstone.study';
const PRODUCT_ID = 'cornerstone_premium';
const KEY_PATH = join(homedir(), '.config', 'otc-learn', 'play-service-account.json');
const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';

/**
 * **Not a constant, on purpose.** Play versions its region catalogue, and a write
 * carrying regional prices must name the version those prices belong to. Pinning
 * `2022/02` by hand failed with:
 *
 *     Invalid currency for region code BG at the specified regions version 2022/02.
 *     Expected BGN but got EUR.
 *
 * — because Bulgaria has since adopted the euro. The prices came from the current
 * catalogue while the version claimed a 2022 one, and Play correctly refused the
 * mismatch. `convertRegionPrices` returns the version its prices belong to as
 * `regionVersion`, so taking it from there makes the two structurally impossible to
 * disagree. Ask Play what today is rather than remembering what it was.
 */
const versionOverride = process.argv.find((a) => a.startsWith('--regions-version='))?.split('=')[1];

/**
 * Markets priced from the INR amounts rather than the USD anchor, chosen for CFA/FRM
 * candidate populations rather than GDP alone. Mainland China is deliberately absent:
 * the largest CFA candidate population in the world, and Google Play does not operate
 * there, so it costs nothing to leave out.
 */
const OVERRIDE_REGIONS = ['IN', 'PK', 'BD', 'LK', 'NP', 'NG', 'KE', 'GH', 'EG', 'VN', 'PH', 'ID'];

/** India's live price. Pinned, never converted. See safety rule 1. */
const INDIA = {
  monthly: { currencyCode: 'INR', units: '29', nanos: 0 },
  yearly: { currencyCode: 'INR', units: '199', nanos: 0 },
};

const ANCHOR = {
  monthly: { currencyCode: 'USD', units: '3', nanos: 990000000 },
  yearly: { currencyCode: 'USD', units: '24', nanos: 990000000 },
};
const OVERRIDE = {
  monthly: { currencyCode: 'INR', units: '29', nanos: 0 },
  yearly: { currencyCode: 'INR', units: '199', nanos: 0 },
};

type Money = { currencyCode: string; units?: string; nanos?: number };

/** `units` is absent, not "0", when a price is under one unit — NP comes back as USD 0.34. */
const norm = (p: Money) => ({
  currencyCode: p.currencyCode,
  units: p.units ?? '0',
  nanos: p.nanos ?? 0,
});
const same = (a: Money, b: Money) => {
  const x = norm(a);
  const y = norm(b);
  return x.currencyCode === y.currencyCode && x.units === y.units && x.nanos === y.nanos;
};
const show = (p: Money) => {
  const n = norm(p);
  return `${n.currencyCode} ${n.units}.${String(n.nanos).padStart(9, '0').slice(0, 2)}`;
};

const base64url = (value: unknown) =>
  Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');

async function accessToken(): Promise<string> {
  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8')) as {
    client_email: string;
    private_key: string;
  };
  const issued = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url({ alg: 'RS256', typ: 'JWT' })}.${base64url({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: 'https://oauth2.googleapis.com/token',
    exp: issued + 3600,
    iat: issued,
  })}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(body)}`);
  return body.access_token;
}

async function call(url: string, token: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      message = JSON.stringify(JSON.parse(text).error, null, 2);
    } catch {
      /* raw body is the best available message */
    }
    throw new Error(`${init.method ?? 'GET'} ${url}\n${response.status}\n${message}`);
  }
  return text ? JSON.parse(text) : {};
}

async function main() {
  const commit = process.argv.includes('--commit');
  const token = await accessToken();

  let regionsVersion = versionOverride ?? '';
  const convert = async (price: Money) => {
    const result = await call(`${API}/${PACKAGE}/pricing:convertRegionPrices`, token, {
      method: 'POST',
      body: JSON.stringify({ price }),
    });
    // The version these prices belong to. See the note on `versionOverride`.
    if (!versionOverride && result.regionVersion?.version) {
      regionsVersion = result.regionVersion.version;
    }
    return result.convertedRegionPrices as Record<string, { price: Money }>;
  };

  const converted = {
    monthly: { anchor: await convert(ANCHOR.monthly), override: await convert(OVERRIDE.monthly) },
    yearly: { anchor: await convert(ANCHOR.yearly), override: await convert(OVERRIDE.yearly) },
  };

  const current = await call(`${API}/${PACKAGE}/subscriptions/${PRODUCT_ID}`, token);
  const existing: Record<string, Record<string, Money>> = {};
  for (const bp of current.basePlans ?? []) {
    existing[bp.basePlanId] = Object.fromEntries(
      (bp.regionalConfigs ?? []).map((rc: any) => [rc.regionCode, rc.price]),
    );
  }

  const plans = ['monthly', 'yearly'] as const;
  const conflicts: string[] = [];
  const built: Record<string, any[]> = {};

  for (const plan of plans) {
    const rows: any[] = [];
    for (const [region, entry] of Object.entries(converted[plan].anchor)) {
      let price: Money;
      if (region === 'IN') {
        price = INDIA[plan]; // safety rule 1
      } else if (OVERRIDE_REGIONS.includes(region)) {
        price = converted[plan].override[region]?.price ?? entry.price;
      } else {
        price = entry.price;
      }
      // safety rule 2 — an already-priced region must come out identical
      const was = existing[plan]?.[region];
      if (was && !same(was, price)) {
        conflicts.push(`${plan} ${region}: ${show(was)} -> ${show(price)}`);
      }
      rows.push({ regionCode: region, newSubscriberAvailability: true, price: norm(price) });
    }
    built[plan] = rows;
  }

  const total = built.monthly.length;
  const added = total - Object.keys(existing.monthly ?? {}).length;
  console.log(`Regional pricing for ${PRODUCT_ID}\n`);
  console.log(`  regions priced now   ${Object.keys(existing.monthly ?? {}).length}`);
  console.log(`  regions after this   ${total}   (+${added})`);
  console.log(`  override band        ${OVERRIDE_REGIONS.join(' ')}`);
  console.log(`  anchor               ${show(ANCHOR.monthly)} / ${show(ANCHOR.yearly)}`);
  console.log(`  regions version      ${regionsVersion}  (from convertRegionPrices)\n`);

  const sample = ['IN', 'PK', 'NG', 'VN', 'US', 'GB', 'CA', 'AE', 'SG', 'ZA', 'JP'];
  console.log('  region   monthly              yearly                band');
  for (const r of sample) {
    const m = built.monthly.find((x) => x.regionCode === r);
    const y = built.yearly.find((x) => x.regionCode === r);
    if (!m || !y) continue;
    const band = r === 'IN' ? 'pinned' : OVERRIDE_REGIONS.includes(r) ? 'override' : 'anchor';
    console.log(
      `  ${r.padEnd(7)}  ${show(m.price).padEnd(20)} ${show(y.price).padEnd(21)} ${band}`,
    );
  }

  if (conflicts.length) {
    console.error(
      `\nABORT — these regions already have a price and this would change it:\n  ${conflicts.join('\n  ')}\n` +
        'Adding regions is safe; changing a live price is not. Nothing was sent.',
    );
    process.exit(1);
  }
  console.log('\n  no already-priced region changes value  (safety rule 2 holds)');

  if (!commit) {
    console.log('\nDRY RUN — nothing was sent. Re-run with --commit to apply.');
    console.log('Play restricts RAISING a price in a region that already has one, so');
    console.log('every number above is easier to set now than to correct later.');
    return;
  }

  const body = {
    packageName: PACKAGE,
    productId: PRODUCT_ID,
    listings: current.listings,
    taxAndComplianceSettings: current.taxAndComplianceSettings,
    basePlans: (current.basePlans ?? []).map((bp: any) => ({
      ...bp,
      regionalConfigs: built[bp.basePlanId] ?? bp.regionalConfigs,
    })),
  };

  console.log('\nApplying…');
  const updated = await call(
    `${API}/${PACKAGE}/subscriptions/${PRODUCT_ID}` +
      `?updateMask=basePlans&regionsVersion.version=${encodeURIComponent(regionsVersion)}`,
    token,
    { method: 'PATCH', body: JSON.stringify(body) },
  );

  for (const bp of updated.basePlans ?? []) {
    console.log(
      `  ${bp.basePlanId}: ${bp.regionalConfigs?.length ?? 0} regions, state ${bp.state}`,
    );
  }
  const inMonthly = (updated.basePlans ?? [])
    .find((b: any) => b.basePlanId === 'monthly')
    ?.regionalConfigs?.find((r: any) => r.regionCode === 'IN')?.price;
  console.log(`  India still ${inMonthly ? show(inMonthly) : '(missing!)'} — expected INR 29.00`);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
