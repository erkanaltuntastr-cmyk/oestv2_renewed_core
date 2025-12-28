import { useAuthStore, type AuthStore } from '../../core/auth/auth.state';

export const useAuth = (): AuthStore => useAuthStore();

export default useAuth;
