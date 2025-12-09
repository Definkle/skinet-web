import { signalStore, withState } from '@ngrx/signals';

import { stripeComputed } from './stripe.computed';
import { stripeMethods } from './stripe.methods';
import type { IStripeState } from './stripe.types';

const stripeInitialState: IStripeState = {
  instance: null,
  elements: null,
  addressElement: null,
  addressValue: null,
  isAddressComplete: false,
  clientSecret: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const StripeStore = signalStore({ providedIn: 'root' }, stripeComputed(withState(stripeInitialState)), stripeMethods());

export type { IStripeState } from './stripe.types';
