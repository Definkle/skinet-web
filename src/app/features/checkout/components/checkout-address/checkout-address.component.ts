import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { MatError } from '@angular/material/input';

import { StripeStore } from '@features/checkout/state/stripe';

import { CartStore } from '@state/cart';

@Component({
  selector: 'app-checkout-address',
  imports: [MatError],
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent implements OnInit {
  protected readonly CartStore = inject(CartStore);
  protected readonly StripeStore = inject(StripeStore);

  protected readonly isLoading = this.StripeStore.isLoading;
  protected readonly error = this.StripeStore.error;

  ngOnInit() {
    this.StripeStore.initializeStripe();
  }
}
