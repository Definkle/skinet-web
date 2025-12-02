import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { IGetProductsParams, IProduct } from '../../../core/api/products/product.interface';
import { computed, inject } from '@angular/core';
import { ProductsRepository } from '../../../core/api/products/products.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type ProductsState = {
  products: IProduct[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc'; page: number; pageSize: number };
};
const initialState: ProductsState = {
  products: [],
  isLoading: false,
  filter: { query: '', order: 'asc', page: 1, pageSize: 10 },
};

export const ProductsStore = signalStore(
  withState(initialState),
  withComputed(({ products, filter }) => ({
    productsCount: computed(() => products.length),
    products: computed(() => products()),
  })),
  withMethods((store, productsRepo = inject(ProductsRepository)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    loadByQuery: rxMethod<IGetProductsParams>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) => {
          return productsRepo.getProducts$(params).pipe(
            tapResponse({
              next: ({ data }) => patchState(store, { products: data }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            }),
          );
        }),
      ),
    ),
  })),
);
