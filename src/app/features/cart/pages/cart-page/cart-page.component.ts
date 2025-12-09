import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EmptyStateComponent } from '@components/empty-state/empty-state.component';

import { CartItemComponent } from '@features/cart/components/cart-item/cart-item.component';
import { CartSummaryComponent } from '@features/cart/components/cart-summary/cart-summary.component';

import { CartStore } from '@state/cart';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, CartSummaryComponent, EmptyStateComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent {
  protected readonly CartStore = inject(CartStore);
}
