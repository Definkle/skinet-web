export type TSignalized<T> = {
  [K in keyof T]: () => T[K];
};
