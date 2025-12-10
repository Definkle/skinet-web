import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, type EmptyFeatureResult, type SignalStoreFeature } from '@ngrx/signals';

import { buildOrderSummary, calculateTotalItemsCount } from './cart.helpers';
import { type ICartState } from './cart.types';

export const cartComputed = (initialState: SignalStoreFeature<EmptyFeatureResult, { state: ICartState; props: {}; methods: {} }>) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ id, deliveryMethod, items, vouchers, deliveryMethodId, clientSecret, paymentIntentId }) => {
      return {
        itemsInCartCount: computed(() => calculateTotalItemsCount(items())),
        isEmpty: computed(() => !items().length),
        orderSummary: computed(() =>
          buildOrderSummary({
            items: items(),
            vouchers: vouchers() ?? [],
            deliveryFee: deliveryMethodId() ? deliveryMethod()?.price : 0,
          })
        ),
        cartAsPayload: computed(() => ({
          id: id(),
          items: items(),
          clientSecret: clientSecret(),
          deliveryMethodId: deliveryMethodId(),
          paymentIntentId: paymentIntentId(),
        })),
      };
    })
  );
};
