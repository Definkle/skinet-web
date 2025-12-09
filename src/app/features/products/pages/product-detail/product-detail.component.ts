import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field, form, min, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDivider } from '@angular/material/list';

import { type Product } from '@features/products/models/product.model';

import { CartStore } from '@state/cart';

import { ProductsStore } from '../../state';

interface IFormModel {
  quantity: number;
}

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, MatButton, MatIcon, MatFormField, MatLabel, MatInput, MatDivider, FormsModule, Field],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  protected readonly CartStore = inject(CartStore);
  protected readonly ProductStore = inject(ProductsStore);

  private readonly _formModel = signal<IFormModel>({
    quantity: this.ProductStore.activeProductQuantityInCart(),
  });
  protected form = form(this._formModel, (form) => {
    required(form.quantity);
    min(form.quantity, 1);
  });
  protected isFormDisabled = computed(
    () =>
      this.CartStore.isLoading() || this.form().invalid() || this.form.quantity().value() <= this.ProductStore.activeProductQuantityInCart()
  );

  onClickAddToCart(product: Product) {
    const formValue = this.form().value;
    this.CartStore.addProduct({
      ...product,
      quantity: formValue().quantity - this.ProductStore.activeProductQuantityInCart(),
    });
  }
}
