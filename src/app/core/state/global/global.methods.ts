import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';

export const globalMethods = () => {
  return signalStoreFeature(
    withMethods((store) => ({
      updateLoading: (isLoading: boolean) => patchState(store, { isLoading }),
    })),
  );
};
