import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { ResolveFn } from '@angular/router';
import { filter } from 'rxjs';

import { CheckoutStore } from '@features/checkout/state/checkout';

export const deliveryMethodsResolver: ResolveFn<boolean> = () => {
  const store = inject(CheckoutStore);

  if (!store.isInitialized()) {
    store.initializeDeliveryMethods();
    return toObservable(store.isInitialized).pipe(filter((isLoading) => !isLoading));
  }

  return toObservable(store.isInitialized);
};
