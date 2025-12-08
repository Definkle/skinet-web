import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { DEFAULT_PAGINATION_VALUES } from '@core/constants/default-pagination-values.constant';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { ProductsStore } from '../../state';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, ProductFilterComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
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
