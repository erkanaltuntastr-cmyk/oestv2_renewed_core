
import { create } from 'zustand';
import { createAuthActions, type AuthActions } from './auth.actions';
import { storageService } from '../storage/storageService';
import type { User } from '../../types/user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  expiresAt: number | null;
  onboardingCompleted: boolean;
  /** MUST exist on store public API; returns boolean */
  checkSession: () => boolean;
}

export type AuthStore = AuthState & AuthActions;

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  expiresAt: null,
  onboardingCompleted: false,
  // placeholder; will be rebound below so it survives state replacement
  checkSession: () => false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialAuthState,
  ...createAuthActions(set, get),
}));

/**
 * Bound checker that survives `setState(initialAuthState, true)`
 * by being copied onto initialAuthState.
 */
const boundCheckSession = (): boolean => {
  const { token, expiresAt } = useAuthStore.getState();

  const expired =
    typeof expiresAt === 'number' ? Date.now() >= expiresAt : true;

  if (!token || expiresAt == null || expired) {
    // clear any persisted session (if used)
    try {
      storageService?.session?.clear?.();
    } catch {
      // no-op if storageService is not wired
    }

    useAuthStore.setState({
      token: null,
      expiresAt: null,
      isAuthenticated: false,
      user: null,
      onboardingCompleted: false,
    });
    return false;
  }

  useAuthStore.setState({ isAuthenticated: true });
  return true;
};

// Ensure that replacing state with `initialAuthState` still provides a callable checkSession
initialAuthState.checkSession = boundCheckSession;

export default useAuthStore;
