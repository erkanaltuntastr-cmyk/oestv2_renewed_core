import firebaseConfig from '../config/firebase';

const ONE_HOUR_MS = 60 * 60 * 1000;
const hasFirebaseConfig = firebaseConfig && !firebaseConfig.mock;
let firebaseClient = null;

const createMockResponse = (email) => {
  const user = { uid: 'mock', email, onboardingCompleted: false };
  const token = 'mock-token';
  const expiresAt = Date.now() + ONE_HOUR_MS;
  return { user, token, expiresAt };
};

const getFirebaseClient = async () => {
  if (!hasFirebaseConfig) return null;
  if (firebaseClient) return firebaseClient;

  try {
    const appModule = await import(/* @vite-ignore */ 'firebase/app');
    const authModule = await import(/* @vite-ignore */ 'firebase/auth');
    const { initializeApp, getApps } = appModule;
    const { getAuth, signInWithEmailAndPassword, signOut } = authModule;

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const auth = getAuth(app);

    firebaseClient = { auth, signInWithEmailAndPassword, signOut };
    return firebaseClient;
  } catch (error) {
    console.warn('Failed to initialize Firebase client, using mock auth instead.', error);
    return null;
  }
};

const loginWithFirebase = async (email, password) => {
  const client = await getFirebaseClient();
  if (!client) return null;

  const { auth, signInWithEmailAndPassword } = client;
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = (await credential.user?.getIdToken?.()) || credential.user?.accessToken || null;
  const user = {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName || credential.user.email?.split('@')[0],
    onboardingCompleted: credential.user?.onboardingCompleted ?? false,
  };

  return { user, token, expiresAt: Date.now() + ONE_HOUR_MS };
};

const mockLogin = async (email, password) => {
  if (password !== 'test') {
    throw new Error('Invalid credentials: use password "test" for mock mode.');
  }
  return createMockResponse(email);
};

const login = async (email, password) => {
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

const logout = async () => {
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
