import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from '../../core/state/cart';
import { CartItem } from './cart-item/cart-item.component';
import { OrderSummary } from '../../shared/components/order-summary/order-summary.component';

@Component({
  selector: 'app-cart',
  imports: [CartItem, OrderSummary],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  protected readonly CartStore = inject(CartStore);
}
