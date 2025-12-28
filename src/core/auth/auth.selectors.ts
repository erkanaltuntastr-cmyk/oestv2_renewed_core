import { useAuthStore, type AuthStore } from './auth.state';

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;

export const useAuthSelector = <T>(selector: (state: AuthStore) => T) => useAuthStore(selector);

export default {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  useAuthSelector,
};
