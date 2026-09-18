/**
 * Create the Play subscription `cornerstone_premium`. Run with
 * `npm run create:subscription` — which changes nothing. Pass `--commit` to write.
 *
 * **Why a script rather than the Console form.** The product id and the two base
 * plan ids are permanent from the moment they are created, and RevenueCat reads
 * them as `cornerstone_premium:monthly` / `:yearly`. A typo in a form is a
 * product that has to be abandoned rather than corrected. `docs/PRICING.md`
 * already specifies every field, so this transcribes the spec once, prints it
 * for review, and writes only when told to.
 *
 * **The shape is mirrored from the live `otc_learn_pro`**, read back through this
 * same API rather than assembled from the reference docs — grace period, account
 * hold, proration mode and resubscribe state are all its values, because they are
 * known to be accepted and known to work in production.
 *
 * **Regions: `IN` only, decided deliberately on 2026-09-18.** Play makes a
 * subscription unavailable in every region it has no price for, so this is a
 * launch in India and nowhere else. That was the choice, not an oversight — see
 * the reasoning in `docs/PRICING.md`, including the two-band USD table kept for
 * when regions are added. Adding regions later does not disturb subscribers;
 * raising a price in a region that already has one is the hard part.
 *
 * Base plans are created in DRAFT and are not purchasable until activated, so
 * this activates both and reads the product back to prove the end state.
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
 * Play versions its region catalogue and requires write calls that carry
 * regional prices to name the version they were written against. If Google
 * rejects this, the error names the versions it will accept — pass one with
 * `--regions-version=`.
 */
const REGIONS_VERSION = '2022/02';

/** One regional config, `IN`. See the file header before adding to this list. */
const PRICES = {
  monthly: { period: 'P1M', units: '29' },
  yearly: { period: 'P1Y', units: '199' },
} as const;

/**
 * Play's limits, which it enforces on the create call rather than anywhere you
 * can see while drafting. `BENEFIT_LIMIT` is the one that bites: 40 characters
 * is shorter than it sounds, and the first draft of all three lines here
 * exceeded it. Checked locally in `assertListingFits` so the API is not the
 * thing that discovers it.
 */
const BENEFIT_LIMIT = 40;
const TITLE_LIMIT = 55;
const MAX_BENEFITS = 4;

/**
 * Deliberately omits progress backup and the glossary. Both are free and stay
 * free, so listing either as a subscription benefit would be untrue — and it is
 * the kind of untrue a Play reviewer reads.
 *
 * "more" is doing real work in the second line: the free core stays free
 * permanently and these counts are what a subscription adds on top, so a phrasing
 * that reads as the total would misdescribe what is being sold.
 */
const LISTING = {
  languageCode: 'en-GB',
  title: 'Cornerstone Plus',
  benefits: [
    'Every segment, all 38 topic areas',
    '417 more cards, 834 more questions',
    'New segments each exam cycle',
  ],
};

function assertListingFits() {
  const problems: string[] = [];
  if (LISTING.title.length > TITLE_LIMIT) {
    problems.push(`title is ${LISTING.title.length}, limit ${TITLE_LIMIT}`);
  }
  if (LISTING.benefits.length > MAX_BENEFITS) {
    problems.push(`${LISTING.benefits.length} benefits, limit ${MAX_BENEFITS}`);
  }
  for (const benefit of LISTING.benefits) {
    if (benefit.length > BENEFIT_LIMIT) {
      problems.push(`benefit is ${benefit.length}, limit ${BENEFIT_LIMIT}: "${benefit}"`);
    }
  }
  if (problems.length) {
    throw new Error(`Listing will be rejected by Play:\n  ${problems.join('\n  ')}`);
  }
}

const basePlan = (id: keyof typeof PRICES) => ({
  basePlanId: id,
  regionalConfigs: [
    {
      regionCode: 'IN',
      newSubscriberAvailability: true,
      price: { currencyCode: 'INR', units: PRICES[id].units },
    },
  ],
  autoRenewingBasePlanType: {
    billingPeriodDuration: PRICES[id].period,
    gracePeriodDuration: 'P7D',
    accountHoldDuration: 'P30D',
    resubscribeState: 'RESUBSCRIBE_STATE_ACTIVE',
    prorationMode: 'SUBSCRIPTION_PRORATION_MODE_CHARGE_ON_NEXT_BILLING_DATE',
  },
});

const SUBSCRIPTION = {
  packageName: PACKAGE,
  productId: PRODUCT_ID,
  listings: [LISTING],
  basePlans: [basePlan('monthly'), basePlan('yearly')],
  taxAndComplianceSettings: { eeaWithdrawalRightType: 'WITHDRAWAL_RIGHT_SERVICE' },
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

/** Fails loudly with Google's own message — a summarised API error is useless here. */
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
      /* not JSON; the raw body is the best available message */
    }
    throw new Error(`${init.method ?? 'GET'} ${url}\n${response.status}\n${message}`);
  }
  return text ? JSON.parse(text) : {};
}

async function main() {
  const commit = process.argv.includes('--commit');
  const versionArg = process.argv.find((a) => a.startsWith('--regions-version='));
  const regionsVersion = versionArg ? versionArg.split('=')[1] : REGIONS_VERSION;

  console.log(`Play subscription for ${PACKAGE}\n`);
  console.log(`  product      ${PRODUCT_ID}`);
  console.log(`  monthly      INR ${PRICES.monthly.units}  ${PRICES.monthly.period}   IN only`);
  console.log(`  yearly       INR ${PRICES.yearly.units}  ${PRICES.yearly.period}   IN only`);
  console.log(`  title        ${LISTING.title}`);
  for (const benefit of LISTING.benefits) {
    console.log(
      `               • ${benefit.padEnd(BENEFIT_LIMIT)}  ${benefit.length}/${BENEFIT_LIMIT}`,
    );
  }
  console.log(`  regions ver  ${regionsVersion}\n`);

  assertListingFits();

  const token = await accessToken();

  const existing = await fetch(`${API}/${PACKAGE}/subscriptions/${PRODUCT_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (existing.ok) {
    const current = await existing.json();
    console.log('Already exists. Nothing to create. Current state:\n');
    console.log(JSON.stringify(current, null, 2));
    console.log(
      '\nA subscription cannot be recreated. To change prices or listings, patch it\n' +
        'in the Console — and remember Play restricts raising a price in a region\n' +
        'that already has one.',
    );
    return;
  }
  if (existing.status !== 404) {
    throw new Error(`Unexpected ${existing.status} reading the product: ${await existing.text()}`);
  }

  if (!commit) {
    console.log('DRY RUN — nothing was sent. The body that would be posted:\n');
    console.log(JSON.stringify(SUBSCRIPTION, null, 2));
    console.log(
      '\nRe-run with --commit to create it. The product id and both base plan ids\n' +
        'are permanent from that moment; read them once more before committing.',
    );
    return;
  }

  console.log('Creating…');
  const created = await call(
    `${API}/${PACKAGE}/subscriptions?productId=${PRODUCT_ID}&regionsVersion.version=${encodeURIComponent(regionsVersion)}`,
    token,
    { method: 'POST', body: JSON.stringify(SUBSCRIPTION) },
  );
  console.log(`  created ${created.productId} with ${created.basePlans?.length ?? 0} base plan(s)`);

  // Created base plans are DRAFT, which is not purchasable and not visible to
  // RevenueCat as an available product.
  for (const id of Object.keys(PRICES)) {
    await call(`${API}/${PACKAGE}/subscriptions/${PRODUCT_ID}/basePlans/${id}:activate`, token, {
      method: 'POST',
      body: JSON.stringify({ packageName: PACKAGE, productId: PRODUCT_ID, basePlanId: id }),
    });
    console.log(`  activated ${id}`);
  }

  const final = await call(`${API}/${PACKAGE}/subscriptions/${PRODUCT_ID}`, token);
  console.log('\nFinal state, read back from Play:\n');
  console.log(JSON.stringify(final, null, 2));
  console.log(
    '\nNext: add both base plans to an offering in RevenueCat on the `premium`\n' +
      'entitlement, then rebuild. The paywall turns itself on with no code change.\n' +
      'RevenueCat sees these as cornerstone_premium:monthly and :yearly.',
  );
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
