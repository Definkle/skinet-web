import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
  type OnDestroy,
  type OnInit,
} from '@angular/core';

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
export class ProductListComponent implements OnInit, OnDestroy {
  protected readonly ProductsStore = inject(ProductsStore);

  private readonly _loadMoreTrigger = viewChild<ElementRef>('loadMoreTrigger');
  private _intersectionObserver?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      this._setupInfiniteScrollIfNeeded();
    });

    effect(() => {
      if (this.ProductsStore.useInfiniteScroll()) {
        this._setupInfiniteScrollIfNeeded();
      } else {
        this._cleanupInfiniteScroll();
      }
    });
  }

  ngOnInit(): void {
    this._initializeProducts();
  }

  private _initializeProducts() {
    this.ProductsStore.initProducts(DEFAULT_PAGINATION_VALUES);
    this.ProductsStore.initBrands();
    this.ProductsStore.initTypes();
  }

  private _setupInfiniteScrollIfNeeded() {
    if (!this.ProductsStore.useInfiniteScroll()) return;

    const trigger = this._loadMoreTrigger()?.nativeElement;
    if (!trigger) return;

    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && this.ProductsStore.hasMoreProducts() && !this.ProductsStore.isLoadingMore()) {
          this.ProductsStore.loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    this._intersectionObserver.observe(trigger);
  }

  private _cleanupInfiniteScroll() {
    this._intersectionObserver?.disconnect();
    this._intersectionObserver = undefined;
  }

  ngOnDestroy() {
    this._cleanupInfiniteScroll();
  }
}
