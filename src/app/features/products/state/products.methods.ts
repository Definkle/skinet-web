import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { DEFAULT_PAGE_INDEX } from '@constants/default-pagination-values.constant';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { type IGetProductsParams } from '@features/products/services/product-api/product-api.params';
import { ProductApiService } from '@features/products/services/product-api/product-api.service';

import { type IBasePaginationParams } from '@models/api-response.models';

import { createStoreErrorHandler } from '@shared/utils/store-error.util';
import { getStoreSnapshot } from '@shared/utils/store-snapshot.util';

import { type IBrandTypeFilter, type IProductsState } from './products.types';

export const productMethods = () => {
  return signalStoreFeature(
    withMethods((store, productsRepo = inject(ProductApiService), errorHandler = inject(ErrorHandlerService)) => {
      const snapshot = getStoreSnapshot<IProductsState>(store);
      const handleProductError = createStoreErrorHandler('ProductsStore', errorHandler);

      return {
        initProductList: rxMethod<IGetProductsParams>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap((params) =>
              productsRepo.getProducts$(params).pipe(
                tapResponse({
                  next: ({ data, totalCount }) => patchState(store, { products: data, productsCount: totalCount }),
                  error: handleProductError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
        initProducts: rxMethod<IGetProductsParams>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap((params) =>
              productsRepo.getProducts$(params).pipe(
                tapResponse({
                  next: ({ data, totalCount }) => patchState(store, { products: data, productsCount: totalCount }),
                  error: handleProductError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
        initBrands: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() =>
              productsRepo.getBrands$().pipe(
                tapResponse({
                  next: (data) => patchState(store, { brands: data }),
                  error: handleProductError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
        initTypes: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() =>
              productsRepo.getTypes$().pipe(
                tapResponse({
                  next: (data) => patchState(store, { types: data }),
                  error: handleProductError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
        initProductDetails: rxMethod<number>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { isLoading: true })),
            switchMap((productId) =>
              productsRepo.getProduct$(productId).pipe(
                tapResponse({
                  next: (activeProduct) => patchState(store, { activeProduct }),
                  error: handleProductError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
        updateSearch(search: string): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, search, pageIndex: DEFAULT_PAGE_INDEX },
          }));
          this.initProducts(snapshot.filter());
        },
        updateSort(sort: string): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, sort, pageIndex: DEFAULT_PAGE_INDEX },
          }));
          this.initProducts(snapshot.filter());
        },
        updateFilters(filters: IBrandTypeFilter): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, ...filters, pageIndex: DEFAULT_PAGE_INDEX },
          }));
          this.initProducts(snapshot.filter());
        },
        updatePagination(pagination: IBasePaginationParams): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, ...pagination },
          }));
          this.initProducts(snapshot.filter());
        },

        resetFilters(): void {
          patchState(store, (state: IProductsState) => ({
            filter: { ...state.filter, brands: [], types: [], search: '', sort: '' },
          }));
        },
      };
    })
  );
};
