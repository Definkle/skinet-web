import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { MatError } from '@angular/material/input';

import { CheckoutStore } from '@features/checkout/state/checkout';

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
  protected readonly CheckoutStore = inject(CheckoutStore);

  protected readonly error = this.CheckoutStore.error;

  ngOnInit() {
    this.CheckoutStore.initializeStripe();
  }
}
