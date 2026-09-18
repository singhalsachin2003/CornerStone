/**
 * List and delete Supabase auth users. Run with `npm run users` — which only lists.
 *
 * Built to clear the test accounts left over from proving the auth path, and kept
 * because "who actually has an account" is otherwise only answerable in a dashboard.
 *
 * **Deleting an auth user deletes their rows too** — every table in
 * `supabase/schema.sql` is keyed to `auth.uid()` with cascade. There is no undo and
 * no export first, so this lists by default and deletes only accounts named
 * explicitly by email or id:
 *
 * ```bash
 * npm run users                                   # list, change nothing
 * npm run users -- --delete=a@b.com --commit      # delete exactly that account
 * ```
 *
 * `--delete` may be repeated. An address that matches no account aborts before
 * anything is deleted, so a typo cannot silently delete the wrong row or nothing at
 * all while reporting success.
 *
 * **The credential never appears in a command line.** It is read from
 * `SUPABASE_ACCESS_TOKEN`, or from `~/.config/cornerstone/supabase-token` — create
 * one at <https://supabase.com/dashboard/account/tokens>. The token fetches the
 * project's `service_role` key, which is what the auth admin API requires; neither
 * is ever written to disk or logged by this script.
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PROJECT_REF = 'cxigwjqdoxeadkcndili';
const TOKEN_FILE = join(homedir(), '.config', 'cornerstone', 'supabase-token');

function accessToken(): string {
  const fromEnv = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  if (existsSync(TOKEN_FILE)) {
    const fromFile = readFileSync(TOKEN_FILE, 'utf8').trim();
    if (fromFile) return fromFile;
  }
  throw new Error(
    'No Supabase access token.\n\n' +
      'Create one at https://supabase.com/dashboard/account/tokens, then — in your own\n' +
      'terminal, so it does not end up in a transcript:\n\n' +
      `  mkdir -p ~/.config/cornerstone\n` +
      `  printf '%s' 'sbp_your_token' > ${TOKEN_FILE}\n` +
      `  chmod 600 ${TOKEN_FILE}\n`,
  );
}

async function serviceRoleKey(token: string): Promise<string> {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys?reveal=true`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) {
    throw new Error(`Could not read project API keys: ${response.status} ${await response.text()}`);
  }
  const keys = (await response.json()) as { name?: string; api_key?: string }[];
  const key = keys.find((k) => k.name === 'service_role')?.api_key;
  if (!key) {
    throw new Error(
      `No service_role key returned. Keys seen: ${keys.map((k) => k.name).join(', ') || '(none)'}`,
    );
  }
  return key;
}

type User = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
};

async function listUsers(key: string): Promise<User[]> {
  const response = await fetch(
    `https://${PROJECT_REF}.supabase.co/auth/v1/admin/users?per_page=200`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  if (!response.ok) {
    throw new Error(`Could not list users: ${response.status} ${await response.text()}`);
  }
  const body = (await response.json()) as { users?: User[] };
  return body.users ?? [];
}

async function deleteUser(key: string, id: string) {
  const response = await fetch(`https://${PROJECT_REF}.supabase.co/auth/v1/admin/users/${id}`, {
    method: 'DELETE',
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) {
    throw new Error(`Delete failed for ${id}: ${response.status} ${await response.text()}`);
  }
}

const date = (value?: string | null) => (value ? value.slice(0, 19).replace('T', ' ') : '—');

async function main() {
  const commit = process.argv.includes('--commit');
  const targets = process.argv
    .filter((a) => a.startsWith('--delete='))
    .map((a) => a.slice('--delete='.length).trim().toLowerCase());

  const key = await serviceRoleKey(accessToken());
  const users = await listUsers(key);

  console.log(`Supabase project ${PROJECT_REF} — ${users.length} account(s)\n`);
  for (const u of users) {
    console.log(`  ${u.email ?? '(no email)'}`);
    console.log(`      id         ${u.id}`);
    console.log(`      created    ${date(u.created_at)}`);
    console.log(`      last sign-in ${date(u.last_sign_in_at)}`);
    console.log(`      confirmed  ${date(u.email_confirmed_at)}`);
  }

  if (!targets.length) {
    console.log('\nListing only. To remove an account:');
    console.log('  npm run users -- --delete=<email or id> --commit');
    return;
  }

  const matched = targets.map((t) => {
    const found = users.find((u) => u.id === t || u.email?.toLowerCase() === t);
    if (!found) {
      throw new Error(
        `No account matches "${t}". Nothing was deleted.\n` +
          'Check the list above — a typo here would otherwise delete nothing while looking like it worked.',
      );
    }
    return found;
  });

  console.log(`\nWill delete ${matched.length} account(s), and every row keyed to them:`);
  for (const u of matched) console.log(`  ${u.email ?? u.id}  (${u.id})`);

  if (!commit) {
    console.log('\nDRY RUN — nothing was deleted. Add --commit to proceed.');
    return;
  }

  for (const u of matched) {
    await deleteUser(key, u.id);
    console.log(`  deleted ${u.email ?? u.id}`);
  }

  const after = await listUsers(key);
  console.log(`\nRemaining accounts: ${after.length}`);
  for (const u of after) console.log(`  ${u.email ?? u.id}`);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
