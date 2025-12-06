import {
  EmptyFeatureResult,
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { ICartState } from './cart.types';
import { calculateSubtotal, calculateTotalItemsCount } from './cart.helpers';

export const cartComputed = (
  initialState: SignalStoreFeature<
    EmptyFeatureResult,
    { state: ICartState; props: {}; methods: {} }
  >,
) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ deliveryFee, discount, items }) => ({
      itemsInCartCount: computed(() => calculateTotalItemsCount(items())),
      isEmpty: computed(() => !items().length),
      orderSummary: computed(() => ({
        subtotal: calculateSubtotal(items()),
        deliveryFee: deliveryFee(),
        discount: discount(),
        totalPrice: calculateSubtotal(items()) - discount() + deliveryFee(),
      })),
    })),
  );
};
