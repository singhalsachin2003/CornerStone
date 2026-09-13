/**
 * Play release pre-flight. Run with `npm run check:play`.
 *
 * **This reads Play through the Android Publisher API, deliberately, rather than
 * the Console.** The Chrome profile on this machine is signed in as a Google
 * account that is not the Play developer account, so the web Console answers
 * every question with a "create a developer account" wall. The API answers the
 * same questions from the service account key and is the only reliable way to
 * establish a Play fact here.
 *
 * It exists to answer one question without guessing: **can a subscription
 * product be created yet?** Play refuses to create one until a binary declaring
 * `com.android.vending.BILLING` has been uploaded to a track. versionCode 5 —
 * what is live — does not declare it; every build from versionCode 7 onward
 * does. So the whole monetisation chain is blocked behind an upload, and this
 * script says so in one line instead of four Console pages.
 *
 * It is read-only in effect. Listing tracks is the one read Play routes through
 * an *edit*, so the script inserts an edit and deletes it again in a `finally`;
 * an edit that is never committed changes nothing, and a stray one expires on
 * its own.
 *
 * The key is `~/.config/otc-learn/play-service-account.json` and must never
 * enter the repo — a path is fine, the bytes are not.
 */
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PACKAGE = 'io.cornerstone.study';
const KEY_PATH = join(homedir(), '.config', 'otc-learn', 'play-service-account.json');
const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';

/**
 * The first versionCode whose manifest declares `com.android.vending.BILLING`.
 * The permission comes from the Play Billing library pulled in by
 * `react-native-purchases`, not from the RevenueCat key, so a keyless build
 * already carries it — which is why the upload can precede the products.
 */
const FIRST_BILLING_VERSION_CODE = 7;

type Track = { track: string; releases?: { versionCodes?: string[]; status?: string }[] };

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

async function main() {
  const token = await accessToken();
  const call = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`${API}/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
  };

  console.log(`Play state for ${PACKAGE}\n`);

  const subscriptions = await call(`${PACKAGE}/subscriptions`);
  // Play answers 204 with an empty body when no product exists at all.
  const products = (subscriptions.body?.subscriptions ?? []) as {
    productId: string;
    basePlans?: {
      basePlanId: string;
      state?: string;
      regionalConfigs?: { regionCode: string }[];
    }[];
  }[];

  let unblocked = false;
  const edit = await call(`${PACKAGE}/edits`, { method: 'POST', body: '{}' });
  if (edit.status !== 200) {
    console.log(`  tracks       could not be read (${edit.status})`);
    console.log(`               ${JSON.stringify(edit.body)}`);
    console.log(
      '\n  A 403 here means the service account has API access but not the separate\n' +
        '  "Release to testing tracks" grant. Google documents up to 36 hours of\n' +
        '  propagation after granting it.',
    );
  } else {
    try {
      const tracks = await call(`${PACKAGE}/edits/${edit.body.id}/tracks`);
      for (const track of (tracks.body?.tracks ?? []) as Track[]) {
        const codes = (track.releases ?? []).flatMap((release) => release.versionCodes ?? []);
        console.log(`  ${track.track.padEnd(12)} versionCode ${codes.join(', ') || '—'}`);
        if (codes.some((code) => Number(code) >= FIRST_BILLING_VERSION_CODE)) unblocked = true;
      }
    } finally {
      await call(`${PACKAGE}/edits/${edit.body.id}`, { method: 'DELETE' });
    }
  }

  console.log('');
  if (products.length === 0) {
    console.log('  subscriptions  none');
  } else {
    for (const product of products) {
      const plans = (product.basePlans ?? [])
        .map(
          (plan) =>
            `${plan.basePlanId} (${plan.state}, ${(plan.regionalConfigs ?? []).length} regions)`,
        )
        .join(', ');
      console.log(`  subscriptions  ${product.productId}: ${plans || 'no base plans'}`);
    }
  }

  console.log('\nNext action:');
  if (!unblocked) {
    console.log(
      `  Upload an AAB of versionCode ${FIRST_BILLING_VERSION_CODE} or later to a track.\n` +
        '  Play will not let a subscription be created until a binary declaring\n' +
        '  com.android.vending.BILLING is on one, and no track has such a binary yet.\n' +
        '  `eas submit --platform android --profile production` is configured for it.',
    );
  } else if (products.length === 0) {
    console.log(
      '  Create the subscription. See docs/PRICING.md for the product id, the base\n' +
        '  plans and the regional prices, then add it to a RevenueCat offering on the\n' +
        '  `premium` entitlement. The paywall turns itself on with no code change.',
    );
  } else {
    console.log('  Products exist. Check they are in a RevenueCat offering on `premium`.');
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
