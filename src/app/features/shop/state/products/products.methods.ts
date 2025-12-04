import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProductsRepository } from '../../../../core/api/products/products.repository';
import { IGetProductsParams } from '../../../../core/api/products/product.interface';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IBrandTypeFilter, TProductsState } from './products.store';
import { IBasePaginationParams } from '../../../../shared/interfaces/http-helper.interface';

export const productMethods = () => {
  return signalStoreFeature(
    withMethods((store, productsRepo = inject(ProductsRepository)) => ({
      updateSearch(search: string): void {
        patchState(store, (state: TProductsState) => ({ filter: { ...state.filter, search } }));
      },
      updateSort(sort: string): void {
        patchState(store, (state: TProductsState) => ({ filter: { ...state.filter, sort } }));
      },
      updateFilters(filters: IBrandTypeFilter): void {
        patchState(store, (state: TProductsState) => ({ filter: { ...state.filter, ...filters } }));
      },
      updatePagination(pagination: IBasePaginationParams): void {
        patchState(store, (state: TProductsState) => ({
          filter: { ...state.filter, ...pagination },
        }));
      },
      initProducts: rxMethod<IGetProductsParams>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) => {
            return productsRepo.getProducts$(params).pipe(
              tapResponse({
                next: ({ data, totalCount }) =>
                  patchState(store, { products: data, productsCount: totalCount }),
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              }),
            );
          }),
        ),
      ),
      initBrands: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            productsRepo.getBrands$().pipe(
              tapResponse({
                next: (data) => patchState(store, { brands: data }),
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),
      initTypes: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            productsRepo.getTypes$().pipe(
              tapResponse({
                next: (data) => patchState(store, { types: data }),
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),
      resetFilters: () =>
        patchState(store, (state: TProductsState) => ({
          filter: { ...state.filter, brands: [], types: [] },
        })),
    })),
  );
};
