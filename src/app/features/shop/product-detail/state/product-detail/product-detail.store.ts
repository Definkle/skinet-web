import { IProduct } from '../../../../../core/api/products/product.interface';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { ProductsRepository } from '../../../../../core/api/products/products.repository';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CartStore } from '../../../../../core/state/cart';

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
      return (
        cartStore.items().find((item) => item.productId === activeProductRef.id)?.quantity ?? 0
      );
    }),
  })),
  withMethods((store, productsRepo = inject(ProductsRepository)) => ({
    initProductDetails: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((productId) =>
          productsRepo.getProduct$(productId).pipe(
            tapResponse({
              next: (activeProduct) => patchState(store, { activeProduct }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
