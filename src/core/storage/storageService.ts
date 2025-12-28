const hasLocalStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const memoryStore = new Map<string, string>();
const STORAGE_PREFIX = 'oestv2';

type NamespaceValue = unknown;

type StorageNamespace<T = NamespaceValue> = {
  get: () => T | null;
  set: (value: T) => void;
  clear: () => void;
};

const getStorageKey = (namespace: string) => `${STORAGE_PREFIX}:${namespace}`;

const read = (key: string): unknown => {
  try {
    const value = hasLocalStorage ? window.localStorage.getItem(key) : memoryStore.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Failed to read from storage', error);
    return null;
  }
};

const write = (key: string, value: unknown) => {
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

const remove = (key: string) => {
  try {
    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    }
    memoryStore.delete(key);
  } catch (error) {
    console.warn('Failed to clear storage', error);
  }
};

const createNamespace = <T = NamespaceValue>(namespace: string): StorageNamespace<T> => {
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
