import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, type EmptyFeatureResult, type SignalStoreFeature } from '@ngrx/signals';

import type { ICheckoutState } from './checkout.types';

export const checkoutComputed = (
  initialState: SignalStoreFeature<EmptyFeatureResult, { state: ICheckoutState; props: {}; methods: {} }>
) => {
  return signalStoreFeature(
    initialState,
    withComputed(
      ({
        deliveryMethods,
        deliveryLoading,
        instance,
        elements,
        addressElement,
        addressValue,
        paymentElement,
        isAddressComplete,
        stripeLoading,
        stripeInitialized,
        confirmationToken,
        error,
      }) => ({
        isDeliveryMethodsInitialized: computed(() => !!deliveryMethods()?.length && !deliveryLoading()),
        isInitialized: computed(() => !!deliveryMethods()?.length && !deliveryLoading() && stripeInitialized()),

        isReady: computed(() => stripeInitialized() && instance() !== null && !stripeLoading()),
        hasElements: computed(() => elements() !== null),
        hasAddressElement: computed(() => addressElement() !== null),
        hasPaymentElement: computed(() => paymentElement() !== null),
        hasAddressValue: computed(() => addressValue() !== null && isAddressComplete()),
        hasError: computed(() => error() !== null),
        canInitializeElements: computed(() => instance() !== null && !stripeLoading()),
        shippingFromToken: computed(() => confirmationToken()?.shipping),
        cardDetailsFromToken: computed(() => confirmationToken()?.payment_method_preview),
      })
    )
  );
};
