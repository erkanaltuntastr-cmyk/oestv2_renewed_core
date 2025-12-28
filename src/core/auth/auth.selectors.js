import { useAuthStore } from './auth.state';

export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectIsLoading = (state) => state.isLoading;

export const useAuthSelector = (selector) => useAuthStore(selector);

export default {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  useAuthSelector,
};
