import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { type ICartItem } from '@models/cart';
import { type IUpdateCartQuantityParams } from '@state/cart/cart.types';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink, MatIcon, MatIconButton, CurrencyPipe, MatButton],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  item = input.required<ICartItem>();
  isLoading = input.required<boolean>();
  updateQuantity = output<IUpdateCartQuantityParams>();
  deleteItem = output<number>();

  onUpdateQuantity(quantity: number) {
    this.updateQuantity.emit({ productId: this.item().productId, quantity });
  }
}
