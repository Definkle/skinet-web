import { signalStore, withState } from '@ngrx/signals';

import { checkoutComputed } from './checkout.computed';
import { checkoutMethods } from './checkout.methods';
import type { ICheckoutState } from './checkout.types';

const initialState: ICheckoutState = {
  deliveryMethods: [],
  isLoading: false,
  selectedDeliveryMethod: null,
};

export const CheckoutStore = signalStore(
  {
    providedIn: 'root',
  },
  checkoutComputed(withState(initialState)),
  checkoutMethods()
);
