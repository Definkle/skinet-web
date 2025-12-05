import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface IGlobalState {
  isLoading: boolean;
  ongoingRequestsCount: number;
}

const initialState: IGlobalState = {
  isLoading: false,
  ongoingRequestsCount: 0,
};

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    incrementOngoingRequestsCount(): void {
      patchState(store, (state: IGlobalState) => {
        return {
          ...state,
          ongoingRequestsCount: state.ongoingRequestsCount + 1,
          isLoading: true,
        };
      });
    },
    decrementOngoingRequestsCount(): void {
      patchState(store, (state: IGlobalState) => {
        const updatedOngoingRequestsCount = state.ongoingRequestsCount - 1;
        if (updatedOngoingRequestsCount <= 0) {
          return { ...state, ongoingRequestsCount: 0, isLoading: false };
        }
        return { ...state, ongoingRequestsCount: updatedOngoingRequestsCount };
      });
    },
  })),
);
