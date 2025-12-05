import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ProductDetailStore } from './state/product-detail/product-detail.store';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, MatButton, MatIcon, MatFormField, MatLabel, MatInput, MatDivider],
  providers: [ProductDetailStore],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetail implements OnInit {
  protected readonly ProductDetailStore = inject(ProductDetailStore);
  private readonly _ActivatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const productId = +this._ActivatedRoute.snapshot.paramMap.get('id')!;
    this.ProductDetailStore.initProductDetails(productId);
  }
}
