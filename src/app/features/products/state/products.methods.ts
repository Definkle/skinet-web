import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { IGetProductsParams } from '@features/products/services/product-api/product-api.params';
import { ProductApiService } from '@features/products/services/product-api/product-api.service';

import { IBasePaginationParams } from '@models/api-response.models';

import { IBrandTypeFilter, IProductsState } from './products.types';

export const productMethods = () => {
  return signalStoreFeature(
    withMethods((store, productsRepo = inject(ProductApiService), errorHandler = inject(ErrorHandlerService)) => {
      const handleProductError = (error: unknown): void => errorHandler.handleError('ProductsStore', error);

      return {
        updateSearch(search: string): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, search },
          }));
        },
        updateSort(sort: string): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, sort },
          }));
        },
        updateFilters(filters: IBrandTypeFilter): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, ...filters },
          }));
        },
        updatePagination(pagination: IBasePaginationParams): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, ...pagination },
          }));
        },
        initProducts: rxMethod<IGetProductsParams>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap((params) => productsRepo.getProducts$(params)),
            tapResponse({
              next: ({ data, totalCount }) => patchState(store, { products: data, productsCount: totalCount }),
              error: handleProductError,
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        ),
        initBrands: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() => productsRepo.getBrands$()),
            tapResponse({
              next: (data) => patchState(store, { brands: data }),
              error: handleProductError,
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        ),
        initTypes: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() => productsRepo.getTypes$()),
            tapResponse({
              next: (data) => patchState(store, { types: data }),
              error: handleProductError,
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        ),
        resetFilters(): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, brands: [], types: [], search: '', sort: '' },
          }));
        },
      };
    })
  );
};
