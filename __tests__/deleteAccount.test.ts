/**
 * Account deletion is a Play requirement, not a feature — the store can reject
 * an update for its absence. So it gets tests that fail loudly if it ever
 * decays into a button that clears the session and leaves the rows behind,
 * which would look identical to the candidate and satisfy nothing.
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

const getSyncClient = jest.fn();
jest.mock('@/sync/client', () => ({
  getSyncClient: () => getSyncClient(),
  isSyncConfigured: () => getSyncClient() !== null,
}));

import { deleteAccount } from '@/sync/auth';

function clientWith(rpc: jest.Mock, signOut = jest.fn().mockResolvedValue({})) {
  getSyncClient.mockReturnValue({ rpc, auth: { signOut } });
  return signOut;
}

beforeEach(() => {
  getSyncClient.mockReset();
});

describe('deleteAccount', () => {
  it('calls the deletion function and revokes the session', async () => {
    const rpc = jest.fn().mockResolvedValue({ error: null });
    const signOut = clientWith(rpc);

    await expect(deleteAccount()).resolves.toEqual({ kind: 'ok' });
    expect(rpc).toHaveBeenCalledWith('delete_account');
    expect(signOut).toHaveBeenCalled();
  });

  /** The rows are gone; a failed revoke cannot make them come back. */
  it('still succeeds when the revoke fails', async () => {
    const rpc = jest.fn().mockResolvedValue({ error: null });
    clientWith(rpc, jest.fn().mockRejectedValue(new Error('offline')));

    await expect(deleteAccount()).resolves.toEqual({ kind: 'ok' });
  });

  it('reports a refusal rather than pretending to have deleted', async () => {
    clientWith(jest.fn().mockResolvedValue({ error: { message: 'permission denied' } }));

    const outcome = await deleteAccount();

    expect(outcome.kind).toBe('failed');
  });

  /** Offline is the common case, and it must not read like a stack trace. */
  it('says something a candidate can act on when offline', async () => {
    clientWith(jest.fn().mockRejectedValue(new Error('Network request failed')));

    const outcome = await deleteAccount();

    expect(outcome.kind).toBe('failed');
    expect(outcome.kind === 'failed' && outcome.message).toContain('No connection');
  });

  /** A build with no credentials has no account to delete, and says so. */
  it('is inert without a configured client', async () => {
    getSyncClient.mockReturnValue(null);

    await expect(deleteAccount()).resolves.toEqual({ kind: 'not-configured' });
  });
});
