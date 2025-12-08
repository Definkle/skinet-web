import { computed } from '@angular/core';
import { EmptyFeatureResult, SignalStoreFeature, signalStoreFeature, withComputed } from '@ngrx/signals';

import { IProductsState } from './products.types';

export const productComputed = (
  initialState: SignalStoreFeature<EmptyFeatureResult, { state: IProductsState; props: {}; methods: {} }>
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
    }))
  );
};
