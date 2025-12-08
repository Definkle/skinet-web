import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { filter } from 'rxjs';

import { ProductDetailStore } from '../../state';

export const productDetailResolver: ResolveFn<boolean> = (route) => {
  const store = inject(ProductDetailStore);
  const productId = +route.paramMap.get('id')!;
  store.initProductDetails(productId);
  return toObservable(store.isLoading).pipe(filter((isLoading) => !isLoading));
};
