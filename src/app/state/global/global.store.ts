import { signalStore, withState } from '@ngrx/signals';

import { INITIAL_GLOBAL_STATE } from './global.constants';
import { globalMethods } from './global.methods';

export const GlobalStore = signalStore({ providedIn: 'root' }, withState(INITIAL_GLOBAL_STATE), globalMethods());
