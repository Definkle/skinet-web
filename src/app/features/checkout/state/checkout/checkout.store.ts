import { signalStore, withState } from '@ngrx/signals';

import { checkoutComputed } from './checkout.computed';
import { checkoutMethods } from './checkout.methods';
import type { ICheckoutState } from './checkout.types';

const initialState: ICheckoutState = {
  deliveryMethods: [],
  selectedDeliveryMethod: null,
  deliveryLoading: false,

  instance: null,
  elements: null,
  addressElement: null,
  addressValue: null,
  paymentElement: null,
  confirmationToken: null,
  isAddressComplete: false,
  isPaymentComplete: false,
  clientSecret: null,
  stripeLoading: false,
  stripeInitialized: false,

  error: null,
};

export const CheckoutStore = signalStore(
  {
    providedIn: 'root',
  },
  checkoutComputed(withState(initialState)),
  checkoutMethods()
);
