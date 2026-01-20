
import { create } from 'zustand';
import { createAuthActions, type AuthActions } from './auth.actions';

export interface AuthState {
  user: unknown | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  expiresAt: number | null;
  onboardingCompleted: boolean;
}

type SessionActions = {
  /**
   * Public API expected by tests:
   *   useAuthStore.getState().checkSession()
   * Returns true if the session is active; otherwise clears it and returns false.
   */
  checkSession: () => boolean;
};

export type AuthStore = AuthState & AuthActions & SessionActions;

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  expiresAt: null,
  onboardingCompleted: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialAuthState,
  // wire actions from ./auth.actions
  ...createAuthActions(set, get),

  // ---- Public session guard (MUST exist on store API) ----
  checkSession: (): boolean => {
    const { token, expiresAt } = get();
    const expired = typeof expiresAt === 'number' ? Date.now() >= expiresAt : true;

    if (!token || expiresAt == null || expired) {
      set({ token: null, expiresAt: null, isAuthenticated: false });
      return false;
    }

    set({ isAuthenticated: true });
    return true;
  },
}));

export default useAuthStore;
