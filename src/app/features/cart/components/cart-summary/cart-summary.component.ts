import { CurrencyPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { CardComponent } from '@components/card/card.component';

export interface ICartSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalPrice: number;
}

@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe, RouterLink, MatButton, MatFormField, MatLabel, MatInput, CardComponent],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  cartSummary = input.required<ICartSummary>();
  location = inject(Location);
}
