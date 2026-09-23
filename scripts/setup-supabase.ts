/**
 * Create the Cornerstone Supabase project and apply its schema, end to end.
 *
 *   SUPABASE_ACCESS_TOKEN=sbp_… npm run setup:supabase
 *
 * Everything this does is otherwise a sequence of dashboard clicks that is easy
 * to get subtly wrong — the wrong organisation, a region nobody meant, a schema
 * applied but never verified. It is written to be safe to re-run: an existing
 * project with the same name is reused rather than duplicated, and
 * `supabase/schema.sql` is itself idempotent.
 *
 * **The access token is yours to create and yours to keep.** Generate one at
 * https://supabase.com/dashboard/account/tokens and pass it in the environment.
 * It is never written to disk, never logged, and never committed — this script
 * reads it and nothing else does.
 *
 * The database password is generated here and **printed once**. It is not needed
 * by the app, which authenticates with the publishable key; it is needed only for
 * a direct Postgres connection. Save it in a password manager when you see it,
 * because nothing here stores it.
 *
 * Add `--dry-run` to see exactly what would be created without creating it.
 */
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';

const API = 'https://api.supabase.com';
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * What the app expects; `.env.example` and `src/sync/client.ts` agree with it.
 *
 * **Matched case-insensitively below, and that is not fussiness.** The live
 * project is named `CornerStone`, with a capital S, and this constant is not —
 * so an exact match found nothing, and finding nothing is the branch that
 * *creates a project*. A second, empty database would then be provisioned and
 * its keys printed as the ones to ship, which is a worse outcome than any error.
 */
const PROJECT_NAME = 'Cornerstone';
/**
 * London. OTC Learn went to Tokyo, which its own notes call further away than it
 * needed to be — sync is a background backup rather than something a screen waits
 * on, so it was not worth recreating, but a new project may as well be close.
 */
const REGION = 'eu-west-2';

interface Organization {
  id: string;
  slug: string;
  name: string;
}
interface Project {
  id: string;
  ref?: string;
  name: string;
  region: string;
  status: string;
  organization_id: string;
}
interface ApiKey {
  api_key: string;
  type: string;
  name: string;
}

function requireToken(): string {
  if (!TOKEN) {
    console.error(
      'SUPABASE_ACCESS_TOKEN is not set.\n\n' +
        '  1. Create one at https://supabase.com/dashboard/account/tokens\n' +
        '  2. SUPABASE_ACCESS_TOKEN=sbp_… npm run setup:supabase\n\n' +
        'The token is read from the environment and never written anywhere.',
    );
    process.exit(1);
  }
  return TOKEN;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireToken()}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    // The token itself must never reach the log, so the body is reported and the
    // request headers are not.
    throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status}: ${text.slice(0, 400)}`);
  }
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

/** 32 bytes of base64url — long enough that its strength is not a judgement call. */
function generatePassword(): string {
  return randomBytes(32).toString('base64url');
}

async function findOrCreateProject(): Promise<{ project: Project; password: string | null }> {
  const existing = await api<Project[]>('/v1/projects');
  const wanted = PROJECT_NAME.toLowerCase();
  const match = existing.find((p) => p.name.toLowerCase() === wanted);
  if (match) {
    console.log(`Reusing existing project "${match.name}" (${match.ref ?? match.id}).`);
    return { project: match, password: null };
  }

  // Creating is the expensive branch — it provisions a second database and
  // prints its keys as the ones to ship — so say what was looked for and what
  // was there before taking it. The bug this replaces was silent.
  console.log(
    `No project named "${PROJECT_NAME}" (case-insensitive). This account has: ` +
      `${existing.map((p) => `"${p.name}"`).join(', ') || 'none'}.`,
  );

  const orgs = await api<Organization[]>('/v1/organizations');
  if (orgs.length === 0) throw new Error('This account has no organizations.');
  if (orgs.length > 1) {
    console.log('Organizations on this account:');
    orgs.forEach((o) => console.log(`  ${o.slug}  ${o.name}`));
  }
  // The first organization is the personal one on an account that has never
  // created another, which is the case here. Named explicitly so a surprise is
  // visible in the log rather than silent.
  const org = orgs[0];
  console.log(`Using organization "${org.name}" (${org.slug}).`);

  const password = generatePassword();
  if (DRY_RUN) {
    console.log(`\n[dry run] would create "${PROJECT_NAME}" in ${REGION}, free plan.`);
    process.exit(0);
  }

  console.log(`Creating "${PROJECT_NAME}" in ${REGION} on the free plan…`);
  const project = await api<Project>('/v1/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: PROJECT_NAME,
      organization_slug: org.slug,
      db_pass: password,
      region: REGION,
      plan: 'free',
    }),
  });
  return { project, password };
}

/** A new project takes a couple of minutes to provision. */
async function waitUntilHealthy(ref: string): Promise<void> {
  const deadline = Date.now() + 10 * 60_000;
  let reported = '';
  while (Date.now() < deadline) {
    const [project] = await api<Project[]>('/v1/projects').then((ps) =>
      ps.filter((p) => (p.ref ?? p.id) === ref),
    );
    const status = project?.status ?? 'UNKNOWN';
    if (status !== reported) {
      console.log(`  status: ${status}`);
      reported = status;
    }
    if (status === 'ACTIVE_HEALTHY') return;
    if (status.includes('FAILED')) throw new Error(`Provisioning failed: ${status}`);
    await new Promise((r) => setTimeout(r, 10_000));
  }
  throw new Error('Timed out waiting for the project to become healthy.');
}

async function runSql(ref: string, query: string): Promise<unknown> {
  return api(`/v1/projects/${ref}/database/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

/**
 * The check that actually matters.
 *
 * A `select` returning `[]` proves nothing on an empty database. What proves the
 * policies are live is that every table exists, has RLS enabled, and carries the
 * four policies the schema generates — because the publishable key ships inside
 * the app bundle, so anyone who installs the app has it.
 */
async function verify(ref: string): Promise<boolean> {
  const tables = [
    'profiles',
    'settings',
    'topic_progress',
    'stats',
    'review_queue',
    'bookmarks',
    'study_days',
  ];

  const rls = (await runSql(
    ref,
    `select relname, relrowsecurity from pg_class
     where relnamespace = 'public'::regnamespace and relkind = 'r'
     order by relname;`,
  )) as { relname: string; relrowsecurity: boolean }[];

  const policies = (await runSql(
    ref,
    `select tablename, count(*)::int as n from pg_policies
     where schemaname = 'public' group by tablename order by tablename;`,
  )) as { tablename: string; n: number }[];

  let ok = true;
  for (const table of tables) {
    const row = rls.find((r) => r.relname === table);
    const policyCount = policies.find((p) => p.tablename === table)?.n ?? 0;
    if (!row) {
      console.error(`  ✗ ${table}: missing`);
      ok = false;
    } else if (!row.relrowsecurity) {
      console.error(`  ✗ ${table}: RLS NOT enabled`);
      ok = false;
    } else if (policyCount < 4) {
      console.error(`  ✗ ${table}: RLS on but only ${policyCount} policies (expected 4)`);
      ok = false;
    } else {
      console.log(`  ✓ ${table}: RLS on, ${policyCount} policies`);
    }
  }
  return ok;
}

async function main(): Promise<void> {
  requireToken();

  const { project, password } = await findOrCreateProject();
  const ref = project.ref ?? project.id;

  if (project.status !== 'ACTIVE_HEALTHY') {
    console.log('Waiting for the project to finish provisioning…');
    await waitUntilHealthy(ref);
  }

  console.log('\nApplying supabase/schema.sql…');
  const schema = readFileSync(join(__dirname, '../supabase/schema.sql'), 'utf8');
  await runSql(ref, schema);
  console.log('Applied.');

  console.log('\nVerifying row level security from outside the dashboard:');
  const ok = await verify(ref);

  const keys = await api<ApiKey[]>(`/v1/projects/${ref}/api-keys?reveal=true`);
  const publishable =
    keys.find((k) => k.api_key?.startsWith('sb_publishable_')) ??
    keys.find((k) => k.type === 'publishable') ??
    keys.find((k) => k.name === 'anon');

  console.log('\n' + '='.repeat(72));
  console.log('Set these in the EAS production environment:\n');
  console.log(`  EXPO_PUBLIC_SUPABASE_URL=https://${ref}.supabase.co`);
  console.log(
    `  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishable?.api_key ?? '(not found — check the dashboard)'}`,
  );
  console.log(
    '\n  eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value …',
  );
  console.log(
    '  eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value …',
  );

  if (password) {
    console.log('\n' + '-'.repeat(72));
    console.log('DATABASE PASSWORD — shown once, save it now:\n');
    console.log(`  ${password}`);
    console.log('\nThe app does not need it. It is for direct Postgres access only.');
  }

  console.log('\n' + '-'.repeat(72));
  console.log('Still to do by hand, and it is the real blocker:\n');
  console.log('  Email delivery. Confirm-email is on by default and the built-in sender is');
  console.log('  rate limited to 2 emails per hour for the whole project, so the third person');
  console.log('  to sign up in an hour never receives a link and nothing reports why.');
  console.log('  Either configure custom SMTP, or turn confirmation off — see supabase/sync.md.');
  console.log('='.repeat(72));

  if (!ok) {
    console.error('\nRow level security did not verify. Do not ship the key until it does.');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`\n${(e as Error).message}`);
  process.exit(1);
});
