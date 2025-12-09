import { computed, inject } from '@angular/core';
import { signalStoreFeature, withComputed, type EmptyFeatureResult, type SignalStoreFeature } from '@ngrx/signals';

import { CartStore } from '@state/cart';

import { type IProductsState } from './products.types';

export const productComputed = (
  initialState: SignalStoreFeature<EmptyFeatureResult, { state: IProductsState; props: {}; methods: {} }>
) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ brands, filter, types, activeProduct }, cartStore = inject(CartStore)) => ({
      activeProductQuantityInCart: computed(() => {
        const activeProductRef = activeProduct();
        if (!activeProductRef) return 0;
        return cartStore.items().find((item) => item.productId === activeProductRef.id)?.quantity ?? 0;
      }),
      filterData: computed(() => ({
        brands: brands(),
        types: types(),
        selectedBrands: filter.brands(),
        selectedTypes: filter.types(),
      })),
    }))
  );
};
