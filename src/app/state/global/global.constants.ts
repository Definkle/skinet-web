import { type IGlobalState } from './global.types';

export const INITIAL_GLOBAL_STATE: IGlobalState = {
  isLoading: false,
  ongoingRequestsCount: 0,
  isInitialized: false,
};
