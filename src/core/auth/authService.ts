import firebaseConfig from '../config/firebase';
import type { User } from '../../types/user';

const ONE_HOUR_MS = 60 * 60 * 1000;
const hasFirebaseConfig = firebaseConfig && !(firebaseConfig as { mock?: boolean }).mock;

interface FirebaseClient {
  auth: unknown;
  signInWithEmailAndPassword: (
    auth: unknown,
    email: string,
    password: string
  ) => Promise<{ user: { uid: string; email: string | null; displayName: string | null; getIdToken?: () => Promise<string> } }>;
  signOut: (auth: unknown) => Promise<void>;
}

export interface LoginResponse {
  user: User;
  token: string | null;
  expiresAt: number;
}

let firebaseClient: FirebaseClient | null = null;

const createMockResponse = (email: string): LoginResponse => {
  const user: User = { uid: 'mock', email, onboardingCompleted: false };
  const token = 'mock-token';
  const expiresAt = Date.now() + ONE_HOUR_MS;
  return { user, token, expiresAt };
};

const getFirebaseClient = async (): Promise<FirebaseClient | null> => {
  if (!hasFirebaseConfig) return null;
  if (firebaseClient) return firebaseClient;

  try {
    const appModule = await import(/* @vite-ignore */ 'firebase/app');
    const authModule = await import(/* @vite-ignore */ 'firebase/auth');
    const { initializeApp, getApps } = appModule;
    const { getAuth, signInWithEmailAndPassword, signOut } = authModule;

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig as Record<string, unknown>);
    const auth = getAuth(app);

    firebaseClient = { auth, signInWithEmailAndPassword, signOut } as FirebaseClient;
    return firebaseClient;
  } catch (error) {
    console.warn('Failed to initialize Firebase client, using mock auth instead.', error);
    return null;
  }
};

const loginWithFirebase = async (email: string, password: string): Promise<LoginResponse | null> => {
  const client = await getFirebaseClient();
  if (!client) return null;

  const { auth, signInWithEmailAndPassword: signIn } = client;
  const credential = await signIn(auth, email, password);
  const token = (await credential.user?.getIdToken?.()) || (credential as unknown as { user?: { accessToken?: string } }).user?.accessToken || null;
  const user: User = {
    uid: credential.user.uid,
    email: credential.user.email ?? '',
    displayName: credential.user.displayName || credential.user.email?.split('@')[0],
    onboardingCompleted: (credential.user as User & { onboardingCompleted?: boolean })?.onboardingCompleted ?? false,
  };

  return { user, token, expiresAt: Date.now() + ONE_HOUR_MS };
};

const mockLogin = async (email: string, password: string): Promise<LoginResponse> => {
  if (password !== 'test') {
    throw new Error('Invalid credentials: use password "test" for mock mode.');
  }
  return createMockResponse(email);
};

const login = async (email: string, password: string): Promise<LoginResponse> => {
  if (hasFirebaseConfig) {
    const firebaseResult = await loginWithFirebase(email, password).catch((error) => {
      console.warn('Firebase login failed, attempting mock login.', error);
      return null;
    });
    if (firebaseResult) {
      return firebaseResult;
    }
  }

  return mockLogin(email, password);
};

const logout = async (): Promise<boolean> => {
  if (hasFirebaseConfig) {
    const client = await getFirebaseClient();
    if (client?.signOut) {
      await client.signOut(client.auth).catch((error) => {
        console.warn('Firebase logout failed, clearing local session instead.', error);
      });
    }
  }

  return true;
};

const authService = {
  login,
  logout,
  createMockResponse,
};

export default authService;
