import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ICartItem } from '../../../core/api/cart/cart.interface';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { IUpdateCartQuantityParams } from '../../../core/state/cart/cart.types';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink, MatIcon, MatIconButton, CurrencyPipe, MatButton],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItem {
  item = input.required<ICartItem>();
  isLoading = input.required<boolean>();
  onUpdateQuantity = output<IUpdateCartQuantityParams>();
  onDeleteItem = output<number>();

  updateQuantity(quantity: number) {
    this.onUpdateQuantity.emit({ productId: this.item().productId, quantity });
  }
}
