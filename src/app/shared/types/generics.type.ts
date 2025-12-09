export type TSignalized<T> = {
  [K in keyof T]: () => T[K];
};

export type TRequired<T> = {
  [K in keyof T]-?: T[K];
};
