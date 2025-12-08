import { computed } from '@angular/core';
import { EmptyFeatureResult, signalStoreFeature, SignalStoreFeature, withComputed } from '@ngrx/signals';

import { IAuthState } from './auth.types';

export const authComputed = (initialState: SignalStoreFeature<EmptyFeatureResult, { state: IAuthState; props: {}; methods: {} }>) => {
  return signalStoreFeature(
    initialState,
    withComputed(({ user }) => ({
      isLoggedIn: computed(() => !!user()),
    }))
  );
};
