import { ChangeDetectionStrategy, Component, effect, inject, type OnInit } from '@angular/core';
import { MatError } from '@angular/material/input';

import { CheckoutStore } from '@features/checkout/state/checkout';

@Component({
  selector: 'app-checkout-payment',
  imports: [MatError],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent implements OnInit {
  protected readonly CheckoutStore = inject(CheckoutStore);

  protected readonly error = this.CheckoutStore.error;

  constructor() {
    effect(() => {
      if (this.CheckoutStore.hasPaymentElement()) {
        this.CheckoutStore.mountPaymentElement();
      }
    });
  }

  ngOnInit() {
    this.CheckoutStore.initializePaymentElement();
  }
}
