import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { type ResolveFn } from '@angular/router';
import { filter } from 'rxjs';

import { ProductsStore } from '../../state';

export const productDetailResolver: ResolveFn<boolean> = (route) => {
  const store = inject(ProductsStore);
  const productId = +route.paramMap.get('id')!;
  store.initProductDetails(productId);
  return toObservable(store.isLoading).pipe(filter((isLoading) => !isLoading));
};
