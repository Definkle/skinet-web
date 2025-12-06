import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProductDetailStore } from '../../../features/shop/product-detail/state/product-detail/product-detail.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export const productDetailResolver: ResolveFn<boolean> = (route) => {
  const store = inject(ProductDetailStore);
  const productId = +route.paramMap.get('id')!;
  store.initProductDetails(productId);
  return toObservable(store.isLoading).pipe(filter((isLoading) => !isLoading));
};
