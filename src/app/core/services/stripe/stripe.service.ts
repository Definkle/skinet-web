import { inject, Injectable } from '@angular/core';
import { loadStripe, type StripeAddressElementOptions, type StripeElements } from '@stripe/stripe-js';
import type { StripeAddressElement } from '@stripe/stripe-js/dist/stripe-js/elements/address';
import { firstValueFrom, tap } from 'rxjs';

import { environment } from '@env/environment';

import { PaymentsApiService } from '@features/checkout/services/payments/payments-api.service';

import { CartStore } from '@state/cart';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private readonly _CartStore = inject(CartStore);
  private readonly _PaymentsApiService = inject(PaymentsApiService);

  private _stripePromise = loadStripe(environment.stripePublicKey);

  private _stripeElements?: StripeElements;
  private _stripeAddressElement?: StripeAddressElement;

  getStripeInstance() {
    return this._stripePromise;
  }

  async initializeElements() {
    if (!this._stripeElements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent$());
        this._stripeElements = stripe?.elements({
          clientSecret: cart?.clientSecret ?? '',
          appearance: { labels: 'floating' },
        });
      } else {
        throw new Error('Stripe instance is not initialized');
      }
    }
    return this._stripeElements;
  }

  async createAddressElement() {
    if (!this._stripeAddressElement) {
      const elements = await this.initializeElements();
      if (elements) {
        const options: StripeAddressElementOptions = {
          mode: 'shipping',
        };
        this._stripeAddressElement = elements.create('address', options);
      } else {
        throw new Error('Stripe elements are not initialized');
      }
    }

    return this._stripeAddressElement;
  }

  createOrUpdatePaymentIntent$() {
    if (!this._CartStore.id()) throw new Error('Problem with Cart');
    return this._PaymentsApiService
      .createOrUpdatePaymentIntent$(this._CartStore.id())
      .pipe(tap((cart) => this._CartStore.updateCartState(cart)));
  }
}
