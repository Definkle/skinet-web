import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { Product } from '@models/product';

import { CartStore } from '@state/cart';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButton, MatCard, MatCardActions, MatCardContent, MatIcon, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  protected readonly CartStore = inject(CartStore);
  product = input<Product>();

  onClickAddToCart(product: Product) {
    this.CartStore.addProduct({
      ...product,
      quantity: 1,
    });
  }
}
