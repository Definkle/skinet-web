import type { Signal } from '@angular/core';
import type { RxMethod } from '@ngrx/signals/rxjs-interop';

export type TSignalized<T> = {
  [K in keyof T]: Signal<T[K]>;
};

export type TRequired<T> = {
  [K in keyof T]-?: T[K];
};

export type TRxMethod<T> = {
  [K in keyof T]: RxMethod<T[K]>;
};
