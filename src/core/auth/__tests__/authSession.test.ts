import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore, initialAuthState } from '../auth.state';

const storageMap = new Map<string, unknown>();

vi.mock('../../storage/storageService', () => {
  const createNamespace = (key: string) => ({
    get: () => storageMap.get(key) ?? null,
    set: (value: unknown) => storageMap.set(key, value),
    clear: () => storageMap.delete(key),
  });
  return {
    storageService: {
      user: createNamespace('user'),
      session: createNamespace('session'),
      history: createNamespace('history'),
      flags: createNamespace('flags'),
    },
  };
});

describe('auth session expiration', () => {
  beforeEach(() => {
    storageMap.clear();
    useAuthStore.setState(initialAuthState, true);
  });

  afterEach(() => {
    useAuthStore.setState(initialAuthState, true);
  });

  it('marks unauthenticated when no token is present', () => {
    const result = useAuthStore.getState().checkSession();

    expect(result).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('clears expired sessions', () => {
    const past = Date.now() - 1000;
    useAuthStore.setState({ token: 'expired', expiresAt: past, isAuthenticated: true });

    const result = useAuthStore.getState().checkSession();

    expect(result).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().expiresAt).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('keeps active sessions authenticated', () => {
    const future = Date.now() + 60_000;
    useAuthStore.setState({ token: 'valid', expiresAt: future, isAuthenticated: false });

    const result = useAuthStore.getState().checkSession();

    expect(result).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
