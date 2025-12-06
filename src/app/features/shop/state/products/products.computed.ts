import {
  EmptyFeatureResult,
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { TProductsState } from './products.types';

export const productComputed = (
  initialState: SignalStoreFeature<
    EmptyFeatureResult,
    { state: TProductsState; props: {}; methods: {} }
  >,
) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ brands, filter, types }) => ({
      filterData: computed(() => ({
        brands: brands(),
        types: types(),
        selectedBrands: filter.brands(),
        selectedTypes: filter.types(),
      })),
    })),
  );
};
