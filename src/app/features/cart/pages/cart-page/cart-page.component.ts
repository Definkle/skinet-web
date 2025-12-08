import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartStore } from '@state/cart';

import { CartItemComponent } from '@features/cart/components/cart-item/cart-item.component';
import { CartSummaryComponent } from '@features/cart/components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, CartSummaryComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent {
  protected readonly CartStore = inject(CartStore);
}
