import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field, form, min, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDivider } from '@angular/material/list';

import { CartStore } from '@state/cart';

import { IProduct } from '../../models';
import { ProductDetailStore } from '../../state';

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
  protected readonly ProductDetailStore = inject(ProductDetailStore);

  private readonly _formModel = signal<IFormModel>({
    quantity: this.ProductDetailStore.quantityInCart(),
  });
  protected form = form(this._formModel, (form) => {
    required(form.quantity);
    min(form.quantity, 1);
  });
  protected isFormDisabled = computed(
    () => this.CartStore.isLoading() || this.form().invalid() || this.form.quantity().value() <= this.ProductDetailStore.quantityInCart()
  );

  onClickAddToCart(product: IProduct) {
    const formValue = this.form().value;
    this.CartStore.addProduct({
      ...product,
      quantity: formValue().quantity - this.ProductDetailStore.quantityInCart(),
    });
  }
}
