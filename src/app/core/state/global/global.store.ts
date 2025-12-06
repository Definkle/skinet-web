import { signalStore, withState } from '@ngrx/signals';
import { globalMethods } from './global.methods';
import { INITIAL_GLOBAL_STATE } from './global.constants';

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_GLOBAL_STATE),
  globalMethods(),
);

export type { IGlobalState } from './global.types';
