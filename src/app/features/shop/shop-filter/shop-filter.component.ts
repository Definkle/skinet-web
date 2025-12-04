import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ProductsStore } from '../state/products/products.store';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from '../../../shared/constants/default-pagination-values.constant';
import { FiltersDialog } from '../dialogs/filters-dialog/filters-dialog.component';
import { filter, tap } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IGetProductsParams } from '../../../core/api/products/product.interface';
import { Field, form } from '@angular/forms/signals';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface ISearchModel {
  search: string;
}

@Component({
  selector: 'app-shop-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatIcon,
    MatListOption,
    MatMenu,
    MatSelectionList,
    MatMenuTrigger,
    MatPaginator,
    MatInput,
    Field,
    MatIconButton,
    FormsModule,
    MatSuffix,
    MatFormField,
  ],
  templateUrl: './shop-filter.component.html',
  styleUrl: './shop-filter.component.scss',
})
export class ShopFilter {
  protected readonly ProductsStore = inject(ProductsStore);
  private readonly _DialogService = inject(MatDialog);

  protected readonly DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE;
  protected readonly DEFAULT_PAGE_SIZE_OPTIONS = DEFAULT_PAGE_SIZE_OPTIONS;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  protected readonly searchForm = form(
    signal<ISearchModel>({ search: this.ProductsStore.filter().search }),
  );
  protected readonly sortOptions = [
    {
      value: '',
      viewValue: 'Name: A to Z',
    },
    {
      value: 'priceAsc',
      viewValue: 'Price: Low to High',
    },
    {
      value: 'priceDesc',
      viewValue: 'Price: High to Low',
    },
  ];

  onSelectSortOption(event: MatSelectionListChange) {
    this._resetPagination();
    this.ProductsStore.updateSort(event.source.selectedOptions.selected[0].value);
    this._initializeProducts({
      ...this.ProductsStore.filter(),
      pageIndex: DEFAULT_PAGE_INDEX,
    });
  }

  onSubmitSearchForm() {
    this.ProductsStore.updateSearch(this.searchForm().value().search);
    this._resetPagination();
    this._initializeProducts({
      ...this.ProductsStore.filter(),
      pageIndex: DEFAULT_PAGE_INDEX,
    });
  }

  onClickFiltersButton() {
    this._DialogService
      .open(FiltersDialog, {
        minWidth: '500px',
        data: this.ProductsStore.filterData$(),
      })
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((value) => this.ProductsStore.updateFilters(value)),
      )
      .subscribe({
        next: () => {
          this._resetPagination();
          this._initializeProducts({
            ...this.ProductsStore.filter(),
            pageIndex: DEFAULT_PAGE_INDEX,
          });
        },
      });
  }

  onPageChange($event: PageEvent) {
    this.ProductsStore.updatePagination({
      pageIndex: $event.pageIndex + 1,
      pageSize: $event.pageSize,
    });
    this._initializeProducts(this.ProductsStore.filter());
  }

  private _initializeProducts(params: IGetProductsParams) {
    this.ProductsStore.initProducts(params);
  }

  private _resetPagination() {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
