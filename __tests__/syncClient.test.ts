/**
 * The client is inert without credentials, the same shape as the purchases
 * facade. Null is a first-class state: Cornerstone shipped with no account and
 * no server, so a build with no credentials is a working app.
 */
/**
 * AsyncStorage's web implementation reaches for `window`, which a node test
 * environment does not have — and building a real client starts a session load
 * that touches it. An in-memory stand-in is enough: nothing here exercises
 * persistence, only whether a client is built at all.
 */
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: async (k: string) => store.get(k) ?? null,
      setItem: async (k: string, v: string) => void store.set(k, v),
      removeItem: async (k: string) => void store.delete(k),
    },
  };
});

import { createSyncClient, isSyncConfigured, resetSyncClient } from '@/sync/client';
import { describePasswordProblem, looksLikeEmail } from '@/sync/auth';

const URL = 'https://example.supabase.co';
const KEY = 'sb_publishable_abc123';

describe('configuring the client', () => {
  beforeEach(() => resetSyncClient());

  it('is null with no URL', () => {
    expect(createSyncClient({ publishableKey: KEY })).toBeNull();
  });

  it('is null with no key', () => {
    expect(createSyncClient({ url: URL })).toBeNull();
  });

  it('is null with empty strings, which is what an unset EXPO_PUBLIC var becomes', () => {
    expect(createSyncClient({ url: '', publishableKey: '' })).toBeNull();
  });

  /**
   * The publishable key is meant to ship in the bundle; the secret key is a
   * server credential. Failing closed on an unexpected prefix is the only safe
   * reading — shipping one would hand every installer full database access.
   */
  it('refuses a secret key outright rather than shipping it', () => {
    expect(createSyncClient({ url: URL, publishableKey: 'sb_secret_abc123' })).toBeNull();
  });

  it('builds a client when both are present', () => {
    expect(createSyncClient({ url: URL, publishableKey: KEY })).not.toBeNull();
  });

  it('reports whether this build can sync at all', () => {
    expect(isSyncConfigured({ url: URL, publishableKey: KEY })).toBe(true);
    resetSyncClient();
    expect(isSyncConfigured({ url: '', publishableKey: '' })).toBe(false);
  });

  // `createClient` starts a token-refresh timer, so two clients would race each
  // other refreshing the same session.
  it('caches the client rather than building one per call', () => {
    const a = isSyncConfigured({ url: URL, publishableKey: KEY });
    const b = isSyncConfigured({ url: '', publishableKey: '' });
    expect(a).toBe(true);
    expect(b).toBe(true);
  });
});

describe('what the form checks before calling Supabase', () => {
  it('accepts an ordinary address and rejects the obvious mistakes', () => {
    expect(looksLikeEmail('a@b.co')).toBe(true);
    expect(looksLikeEmail('  spaced@example.com  ')).toBe(true);
    expect(looksLikeEmail('no-at-sign')).toBe(false);
    expect(looksLikeEmail('two@@example.com')).toBe(false);
    expect(looksLikeEmail('no@domain')).toBe(false);
  });

  it('asks for a longer password than Supabase itself requires', () => {
    expect(describePasswordProblem('short')).toMatch(/8/);
    expect(describePasswordProblem('longenough')).toBeNull();
  });
});
