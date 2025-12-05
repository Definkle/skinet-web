import { signalStore, withState } from '@ngrx/signals';
import { globalComputed } from './global.computed';
import { globalMethods } from './global.methods';

export interface IGlobalState {
  isLoading: boolean;
}

const initialState: IGlobalState = {
  isLoading: false,
};

export const GlobalStore = signalStore(globalComputed(withState(initialState)), globalMethods());
