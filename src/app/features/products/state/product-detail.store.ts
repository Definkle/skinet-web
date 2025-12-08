import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { CartStore } from '@state/cart';

import { IProduct } from '@features/products/models';
import { ProductApiService } from '@features/products/services/product-api/product-api.service';

export interface IProductDetailState {
  activeProduct: IProduct | null;
  isLoading: boolean;
}

export const productDetailInitialState: IProductDetailState = {
  activeProduct: null,
  isLoading: false,
};

export const ProductDetailStore = signalStore(
  { providedIn: 'root' },
  withState(productDetailInitialState),
  withComputed(({ activeProduct }, cartStore = inject(CartStore)) => ({
    quantityInCart: computed(() => {
      const activeProductRef = activeProduct();
      if (!activeProductRef) return 0;
      return cartStore.items().find((item) => item.productId === activeProductRef.id)?.quantity ?? 0;
    }),
  })),
  withMethods((store, productsRepo = inject(ProductApiService)) => ({
    initProductDetails: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((productId) =>
          productsRepo.getProduct$(productId).pipe(
            tapResponse({
              next: (activeProduct) => patchState(store, { activeProduct }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),
  }))
);
