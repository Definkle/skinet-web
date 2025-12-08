import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';

import { IGlobalState } from './global.types';

export const globalMethods = () => {
  return signalStoreFeature(
    withMethods((store) => ({
      incrementOngoingRequestsCount(): void {
        patchState(store, (state: IGlobalState) => ({
          ongoingRequestsCount: state.ongoingRequestsCount + 1,
          isLoading: true,
        }));
      },

      decrementOngoingRequestsCount(): void {
        patchState(store, (state: IGlobalState) => {
          const updatedOngoingRequestsCount = state.ongoingRequestsCount - 1;
          if (updatedOngoingRequestsCount <= 0) {
            return { ongoingRequestsCount: 0, isLoading: false };
          }
          return { ongoingRequestsCount: updatedOngoingRequestsCount };
        });
      },
    }))
  );
};
