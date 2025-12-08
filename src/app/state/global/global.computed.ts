import { EmptyFeatureResult, signalStoreFeature, SignalStoreFeature, withComputed } from '@ngrx/signals';

import { IGlobalState } from './global.types';

export const globalComputed = (initialState: SignalStoreFeature<EmptyFeatureResult, { state: IGlobalState; props: {}; methods: {} }>) => {
  return signalStoreFeature(
    initialState,
    withComputed(() => ({}))
  );
};
