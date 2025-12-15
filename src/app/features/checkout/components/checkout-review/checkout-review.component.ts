import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { CheckoutStore } from '@features/checkout/state/checkout';

import { AddressPipe } from '@shared/pipes/address/address.pipe';
import { PaymentCardPipe } from '@shared/pipes/payment-card/payment-card.pipe';

import { CartStore } from '@state/cart';

@Component({
  selector: 'app-checkout-review',
  imports: [CurrencyPipe, AddressPipe, PaymentCardPipe],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReview implements OnInit {
  protected readonly CartStore = inject(CartStore);
  protected readonly CheckoutStore = inject(CheckoutStore);

  ngOnInit() {
    this.CheckoutStore.createConfirmationToken();
  }
}
