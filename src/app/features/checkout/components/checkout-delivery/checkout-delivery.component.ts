import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { CheckoutStore } from '@features/checkout/state/checkout';

import { CartStore } from '@state/cart';

@Component({
  selector: 'app-checkout-delivery',
  imports: [MatRadioButton, CurrencyPipe, MatRadioGroup],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutDeliveryComponent {
  protected readonly CartStore = inject(CartStore);
  protected readonly CheckoutStore = inject(CheckoutStore);
}
