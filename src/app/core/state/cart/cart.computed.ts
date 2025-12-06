import {
  EmptyFeatureResult,
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { ICartState } from './cart.types';
import {
  calculateSubtotal,
  calculateTotalDiscount,
  calculateTotalItemsCount,
} from './cart.helpers';

export const cartComputed = (
  initialState: SignalStoreFeature<
    EmptyFeatureResult,
    { state: ICartState; props: {}; methods: {} }
  >,
) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ deliveryFee, items, vouchers }) => {
      const subtotal = calculateSubtotal(items());
      const discount = calculateTotalDiscount(vouchers());
      const totalPrice = subtotal + deliveryFee() - discount;

      return {
        itemsInCartCount: computed(() => calculateTotalItemsCount(items())),
        isEmpty: computed(() => !items().length),
        orderSummary: computed(() => ({
          subtotal,
          deliveryFee: deliveryFee(),
          discount,
          totalPrice: totalPrice <= 0 ? 0 : totalPrice,
          vouchers: vouchers(),
        })),
      };
    }),
  );
};
