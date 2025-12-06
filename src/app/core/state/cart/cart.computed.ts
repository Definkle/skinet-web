import {
  EmptyFeatureResult,
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { ICartState } from './cart.types';
import { buildOrderSummary, calculateTotalItemsCount } from './cart.helpers';

export const cartComputed = (
  initialState: SignalStoreFeature<
    EmptyFeatureResult,
    { state: ICartState; props: {}; methods: {} }
  >,
) => {
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
          }),
        ),
      };
    }),
  );
};
