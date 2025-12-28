declare global {
  type ID = string;
  type Timestamp = number;

  type Nullable<T> = T | null | undefined;
  type Dictionary<T> = Record<string, T>;
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
  };

  const __APP_VERSION__: string;
}

export {};
