import { signalStore, withState } from '@ngrx/signals';

import { globalMethods } from '@state/global/global.methods';

import { INITIAL_GLOBAL_STATE } from './global.constants';

export const GlobalStore = signalStore({ providedIn: 'root' }, withState(INITIAL_GLOBAL_STATE), globalMethods());
