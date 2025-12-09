import { signalStore, withState } from '@ngrx/signals';

import { authComputed } from '@state/auth/auth.computed';
import { authMethods } from '@state/auth/auth.methods';

import { type IAuthState } from './auth.types';

const authInitialState: IAuthState = {
  user: null,
  isLoading: false,
  isLoggedIn: false,
};

export const AuthStore = signalStore(
  {
    providedIn: 'root',
  },
  authComputed(withState(authInitialState)),
  authMethods()
);
