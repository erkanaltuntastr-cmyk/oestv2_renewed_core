import { create } from 'zustand';
import { createAuthActions, type AuthActions } from './auth.actions';
import type { User } from '../../types/user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  expiresAt: number | null;
  onboardingCompleted: boolean;
}

export type AuthStore = AuthState & AuthActions;

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
  ...createAuthActions(set, get),
}));

export default useAuthStore;
