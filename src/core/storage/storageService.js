const hasLocalStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const memoryStore = new Map();
const STORAGE_PREFIX = 'oestv2';

const getStorageKey = (namespace) => `${STORAGE_PREFIX}:${namespace}`;

const read = (key) => {
  try {
    const value = hasLocalStorage ? window.localStorage.getItem(key) : memoryStore.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Failed to read from storage', error);
    return null;
  }
};

const write = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    if (hasLocalStorage) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryStore.set(key, serialized);
    }
  } catch (error) {
    console.warn('Failed to write to storage', error);
  }
};

const remove = (key) => {
  try {
    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    }
    memoryStore.delete(key);
  } catch (error) {
    console.warn('Failed to clear storage', error);
  }
};

const createNamespace = (namespace) => {
  const key = getStorageKey(namespace);
  return {
    get: () => read(key),
    set: (value) => write(key, value),
    clear: () => remove(key),
  };
};

export const storageService = {
  user: createNamespace('user'),
  session: createNamespace('session'),
  history: createNamespace('history'),
  flags: createNamespace('flags'),
};

export default storageService;
