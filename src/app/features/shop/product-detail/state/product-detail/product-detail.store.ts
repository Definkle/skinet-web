import { IProduct } from '../../../../../core/api/products/product.interface';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { ProductsRepository } from '../../../../../core/api/products/products.repository';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

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
  withComputed(({ isLoading }) => ({
    isLoading$: computed(() => isLoading()),
  })),
  withMethods((store, productsRepo = inject(ProductsRepository)) => ({
    initProductDetails: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((productId) => {
          return productsRepo.getProduct$(productId).pipe(
            tapResponse({
              next: (activeProduct) => patchState(store, { activeProduct }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            }),
          );
        }),
      ),
    ),
  })),
);
