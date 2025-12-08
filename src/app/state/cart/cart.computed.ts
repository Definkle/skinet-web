import { computed } from '@angular/core';
import { EmptyFeatureResult, SignalStoreFeature, signalStoreFeature, withComputed } from '@ngrx/signals';

import { buildOrderSummary, calculateTotalItemsCount } from './cart.helpers';
import { ICartState } from './cart.types';

export const cartComputed = (initialState: SignalStoreFeature<EmptyFeatureResult, { state: ICartState; props: {}; methods: {} }>) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ deliveryFee, items, vouchers }) => {
      return {
        itemsInCartCount: computed(() => calculateTotalItemsCount(items())),
        isEmpty: computed(() => !items().length),
        orderSummary: computed(() =>
          buildOrderSummary({
            deliveryFee: deliveryFee(),
            items: items(),
            vouchers: vouchers(),
          })
        ),
      };
    })
  );
};
