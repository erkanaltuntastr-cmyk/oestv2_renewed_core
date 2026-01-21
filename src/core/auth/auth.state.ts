
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
  // MUST exist on store public API
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
  // placeholder (runtime’da bağlanacak)
  checkSession: () => false,
};

export const useAuthStore = create<AuthStore>((set, get, api) => {
  // Kalıcı kontrol: her zaman store API’de olmalı
  const boundCheckSession = (): boolean => {
    const { token, expiresAt } = get();
    if (!token || !expiresAt || Date.now() >= expiresAt) {
      try {
        // varsa persisted oturumu temizle
        storageService?.session?.clear?.();
      } catch {
        /* no-op */
      }
      set({
        token: null,
        expiresAt: null,
        isAuthenticated: false,
        user: null,
        onboardingCompleted: false,
      });
      return false;
    }
    set({ isAuthenticated: true });
    return true;
  };

  // Zustand setState’i sarmala: replace=true gelirse checkSession yeniden ekle
  const originalSetState = api.setState.bind(api);
  api.setState = (nextState: Partial<AuthStore> | AuthStore, replace?: boolean) => {
    originalSetState(nextState as any, replace as any);
    if (replace) {
      const current = api.getState();
      if (!current.checkSession) {
        originalSetState({ ...current, checkSession: boundCheckSession } as any, true);
      }
    }
  };

  return {
    ...initialAuthState,
    // runtime kaynağı: her zaman bağlı işlev
    checkSession: boundCheckSession,
    ...createAuthActions(set, get),
  };
});

export default useAuthStore;
