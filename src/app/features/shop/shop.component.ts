import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ProductsStore } from './state/products/products.store';
import { ProductComponent } from './product/product.component';
import { ShopFilterComponent } from './shop-filter/shop-filter.component';
import { DEFAULT_PAGINATION_VALUES } from '../../shared/constants/default-pagination-values.constant';

@Component({
  selector: 'app-shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductComponent, ShopFilterComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  protected readonly ProductsStore = inject(ProductsStore);

  ngOnInit(): void {
    this._initializeProducts();
  }

  private _initializeProducts() {
    this.ProductsStore.initProducts(DEFAULT_PAGINATION_VALUES);
    this.ProductsStore.initBrands();
    this.ProductsStore.initTypes();
  }
}
