import {
  EmptyFeatureResult,
  signalStoreFeature,
  SignalStoreFeature,
  withComputed,
} from '@ngrx/signals';
import { IGlobalState } from './global.store';
import { ProductsStore } from '../../../features/shop/state/products/products.store';
import { computed, inject } from '@angular/core';

export const globalComputed = (
  initialState: SignalStoreFeature<
    EmptyFeatureResult,
    { state: IGlobalState; props: {}; methods: {} }
  >,
) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ isLoading }, productsStore = inject(ProductsStore)) => ({
      isLoading$: computed(() => {
        return productsStore.isLoading$();
      }),
    })),
  );
};
