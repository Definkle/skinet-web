import { signalStoreFeature, withComputed, type EmptyFeatureResult, type SignalStoreFeature } from '@ngrx/signals';

import { type IAuthState } from './auth.types';

export const authComputed = (initialState: SignalStoreFeature<EmptyFeatureResult, { state: IAuthState; props: {}; methods: {} }>) => {
  return signalStoreFeature(
    initialState,
    withComputed(() => ({}))
  );
};
