import type { StateCreator } from 'zustand';
import authService from './authService';
import { storageService } from '../storage/storageService';
import type { AuthState } from './auth.state';
import type { User } from '../../types/user';

export interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  checkSession: () => boolean;
}

export type AuthCreator = StateCreator<AuthState & AuthActions, [], [], AuthActions>;

type SessionData = { token: string | null; expiresAt: number | null } | null;

const persistUser = (user: User | null): void => {
  if (user) {
    storageService.user.set(user);
  } else {
    storageService.user.clear();
  }
};

const persistSession = (session: SessionData): void => {
  if (session && session.token) {
    storageService.session.set(session);
  } else {
    storageService.session.clear();
  }
};

export const createAuthActions: AuthCreator = (set, get) => ({
  setUser: (user) => {
    persistUser(user);
    set({
      user,
      isAuthenticated: Boolean(user),
      onboardingCompleted: Boolean(user?.onboardingCompleted),
    });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setOnboardingCompleted: (completed) => {
    const currentUser = get().user;
    const updatedUser = currentUser ? { ...currentUser, onboardingCompleted: completed } : currentUser;
    persistUser(updatedUser as User | null);
    set({
      user: updatedUser as User | null,
      onboardingCompleted: Boolean(completed),
    });
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, token, expiresAt } = await authService.login(email, password);
      persistUser(user);
      persistSession({ token, expiresAt });
      set({
        user,
        token,
        expiresAt,
        onboardingCompleted: Boolean(user?.onboardingCompleted),
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    } catch (error) {
      persistUser(null);
      persistSession(null);
      set({
        user: null,
        token: null,
        expiresAt: null,
        onboardingCompleted: false,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },
  logout: () => {
    persistUser(null);
    persistSession(null);
    set({
      user: null,
      token: null,
      expiresAt: null,
      onboardingCompleted: false,
      isAuthenticated: false,
    });
  },
  checkSession: () => {
    const { token, expiresAt } = get();
    if (!token || !expiresAt) {
      set({ token: null, expiresAt: null, isAuthenticated: false });
      return false;
    }

    const now = Date.now();
    const isValid = expiresAt > now;

    if (!isValid) {
      persistSession(null);
      set({ token: null, expiresAt: null, isAuthenticated: false });
      return false;
    }

    set({ isAuthenticated: true });
    return true;
  },
});

export default createAuthActions;
