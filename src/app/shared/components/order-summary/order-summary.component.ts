import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

interface IOrderSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalPrice: number;
}

@Component({
  selector: 'app-order-summary',
  imports: [CurrencyPipe, RouterLink, MatButton, MatFormField, MatLabel, MatInput],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummary {
  orderSummary = input.required<IOrderSummary>();
}
