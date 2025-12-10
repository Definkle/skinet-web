import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, type EmptyFeatureResult, type SignalStoreFeature } from '@ngrx/signals';

import type { ICheckoutState } from './checkout.types';

export const checkoutComputed = (
  initialState: SignalStoreFeature<EmptyFeatureResult, { state: ICheckoutState; props: {}; methods: {} }>
) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ deliveryMethods, isLoading }) => ({
      isInitialized: computed(() => !!deliveryMethods()?.length && !isLoading()),
    }))
  );
};
