import { signalStoreFeature, withComputed, type EmptyFeatureResult, type SignalStoreFeature } from '@ngrx/signals';

import { type IGlobalState } from './global.types';

export const globalComputed = (initialState: SignalStoreFeature<EmptyFeatureResult, { state: IGlobalState; props: {}; methods: {} }>) => {
  return signalStoreFeature(
    initialState,
    withComputed(() => ({}))
  );
};
