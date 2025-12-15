import type { ConfirmationToken, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import type { StripeAddressElement } from '@stripe/stripe-js/dist/stripe-js/elements/address';

import type { DeliveryMethod } from '@features/checkout/models/delivery-method.models';

export interface IStripeAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface ICheckoutState {
  deliveryMethods: DeliveryMethod[];
  selectedDeliveryMethod: DeliveryMethod | null;
  deliveryLoading: boolean;

  instance: Stripe | null;
  elements: StripeElements | null;
  addressElement: StripeAddressElement | null;
  addressValue: IStripeAddress | null;
  paymentElement: StripePaymentElement | null;
  confirmationToken: ConfirmationToken | null;
  isAddressComplete: boolean;
  isPaymentComplete: boolean;
  clientSecret: string | null;
  stripeLoading: boolean;
  stripeInitialized: boolean;

  error: string | null;
}
