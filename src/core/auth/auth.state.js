import { create } from 'zustand';
import { createAuthActions } from './auth.actions';

export const initialAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  expiresAt: null,
  onboardingCompleted: false,
};

export const useAuthStore = create((set, get) => ({
  ...initialAuthState,
  ...createAuthActions(set, get),
}));

export default useAuthStore;
