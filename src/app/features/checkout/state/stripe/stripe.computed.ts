import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, type EmptyFeatureResult, type SignalStoreFeature } from '@ngrx/signals';

import type { IStripeState } from '@features/checkout/state/stripe/stripe.types';

export const stripeComputed = (initialState: SignalStoreFeature<EmptyFeatureResult, { state: IStripeState; props: {}; methods: {} }>) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ instance, elements, addressElement, addressValue, isAddressComplete, isLoading, isInitialized, error }) => {
      return {
        isReady: computed(() => isInitialized() && instance() !== null && !isLoading()),
        hasElements: computed(() => elements() !== null),
        hasAddressElement: computed(() => addressElement() !== null),
        hasAddressValue: computed(() => addressValue() !== null && isAddressComplete()),
        hasError: computed(() => error() !== null),
        canInitializeElements: computed(() => instance() !== null && !isLoading()),
      };
    })
  );
};
