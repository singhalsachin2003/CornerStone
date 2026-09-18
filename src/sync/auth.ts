/**
 * Sign in, sign up, sign out.
 *
 * Every function resolves to a typed outcome rather than throwing, and every one
 * is a no-op when the build has no Supabase credentials. The account screen is
 * hidden in that case, so these are defensive rather than load-bearing — but a
 * screen that renders before `isSyncConfigured` is read must not crash.
 *
 * Email and password only, deliberately. Google sign-in on Android needs the
 * release keystore's SHA-1 registered against an OAuth client, and EAS owns the
 * keystore rather than this repo — extra setup that cannot be done from here, for
 * a convenience rather than a capability. The schema keys off `auth.users.id`
 * however the user got there, so it can be added later without touching any of it.
 */
import { getSyncClient } from './client';

export type AuthOutcome =
  | { kind: 'ok' }
  /** Signed up, but the address has to be confirmed before signing in. */
  | { kind: 'confirm-email' }
  | { kind: 'not-configured' }
  | { kind: 'failed'; message: string };

/**
 * Supabase returns its own messages, several of which are unhelpful to a
 * candidate ("Invalid login credentials" for a wrong password *and* an
 * unconfirmed address). These are the ones worth rewriting; everything else is
 * passed through rather than guessed at.
 */
function readable(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) {
    // Deliberately does not mention a confirmation email. Confirmation is off on
    // the project, so suggesting one would send a candidate hunting for a message
    // that was never sent — and if it is ever turned back on, the distinct
    // "email not confirmed" case below says so precisely.
    return 'That email and password did not match.';
  }
  if (m.includes('email not confirmed')) {
    return 'Check your email for a confirmation link before signing in.';
  }
  if (m.includes('user already registered')) {
    return 'There is already an account with that email. Try signing in instead.';
  }
  if (m.includes('rate limit') || m.includes('too many requests')) {
    return 'Too many attempts just now. Wait a few minutes and try again.';
  }
  return message;
}

export async function signIn(email: string, password: string): Promise<AuthOutcome> {
  const client = getSyncClient();
  if (!client) return { kind: 'not-configured' };
  const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  return error ? { kind: 'failed', message: readable(error.message) } : { kind: 'ok' };
}

export async function signUp(email: string, password: string): Promise<AuthOutcome> {
  const client = getSyncClient();
  if (!client) return { kind: 'not-configured' };
  const { data, error } = await client.auth.signUp({ email: email.trim(), password });
  if (error) return { kind: 'failed', message: readable(error.message) };
  // A session means confirmation is switched off and the user is already in.
  // Without one they have to click a link — and on a project using Supabase's
  // built-in sender that email is rate limited to two an hour for the whole
  // project, so this state can last a while through no fault of theirs.
  return data.session ? { kind: 'ok' } : { kind: 'confirm-email' };
}

export async function signOut(): Promise<void> {
  await getSyncClient()?.auth.signOut();
}

export async function currentEmail(): Promise<string | null> {
  const client = getSyncClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session?.user?.email ?? null;
}

/** Minimum the UI enforces before calling Supabase, which requires six. */
export const MIN_PASSWORD_LENGTH = 8;

export function describePasswordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export function looksLikeEmail(value: string): boolean {
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
