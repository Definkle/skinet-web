import type { Stripe, StripeElements } from '@stripe/stripe-js';
import type { StripeAddressElement } from '@stripe/stripe-js/dist/stripe-js/elements/address';

export interface IStripeAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface IStripeState {
  instance: Stripe | null;
  elements: StripeElements | null;
  addressElement: StripeAddressElement | null;
  addressValue: IStripeAddress | null;
  isAddressComplete: boolean;
  clientSecret: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}
