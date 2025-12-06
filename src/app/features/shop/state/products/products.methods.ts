import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProductsRepository } from '../../../../core/api/products/products.repository';
import { IGetProductsParams } from '../../../../core/api/products/product.interface';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IBasePaginationParams } from '../../../../shared/interfaces/http-helper.interface';
import { IBrandTypeFilter, TProductsState } from './products.types';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ErrorHandler } from '../../../../core/services/error-handler/error-handler.service';

type ProductMethodsReturn = {
  updateSearch(search: string): void;
  updateSort(sort: string): void;
  updateFilters(filters: IBrandTypeFilter): void;
  updatePagination(pagination: IBasePaginationParams): void;
  initProducts: ReturnType<typeof rxMethod<IGetProductsParams>>;
  initBrands: ReturnType<typeof rxMethod<void>>;
  initTypes: ReturnType<typeof rxMethod<void>>;
  resetFilters(): void;
};

export const productMethods = () => {
  return signalStoreFeature(
    withMethods((store, productsRepo = inject(ProductsRepository), errorHandler = inject(ErrorHandler)): ProductMethodsReturn => {
      const handleProductError = (error: unknown): void => errorHandler.handleError('ProductsStore', error);

      return {
      updateSearch(search: string): void {
        patchState(store, (state: TProductsState) => ({
          filter: { ...state.filter, search },
        }));
      },
      updateSort(sort: string): void {
        patchState(store, (state: TProductsState) => ({
          filter: { ...state.filter, sort },
        }));
      },
      updateFilters(filters: IBrandTypeFilter): void {
        patchState(store, (state: TProductsState) => ({
          filter: { ...state.filter, ...filters },
        }));
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
          switchMap((params) =>
            productsRepo.getProducts$(params).pipe(
              tapResponse({
                next: ({ data, totalCount }) =>
                  patchState(store, { products: data, productsCount: totalCount }),
                error: handleProductError,
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
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
                error: handleProductError,
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
                error: handleProductError,
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),
      resetFilters(): void {
        patchState(store, (state: TProductsState) => ({
          filter: { ...state.filter, brands: [], types: [] },
        }));
      },
    };
    }),
  );
};
