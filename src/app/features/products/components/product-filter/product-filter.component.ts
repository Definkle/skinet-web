import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Field, form } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { filter, tap } from 'rxjs';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from '@core/constants/default-pagination-values.constant';
import { SORT_OPTIONS } from '@core/constants/sort-options.constant';

import { IGetProductsParams } from '@features/products/services/product-api/product-api.params';

import { ProductFilterDialogComponent } from '../../dialogs/product-filter-dialog/product-filter-dialog.component';
import { ProductsStore } from '../../state';

interface ISearchModel {
  search: string;
}

@Component({
  selector: 'app-product-filter',
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
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  protected readonly ProductsStore = inject(ProductsStore);
  private readonly _DestroyRef = inject(DestroyRef);
  private readonly _DialogService = inject(MatDialog);

  protected readonly DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE;
  protected readonly DEFAULT_PAGE_SIZE_OPTIONS = DEFAULT_PAGE_SIZE_OPTIONS;

  protected readonly searchForm = form(signal<ISearchModel>({ search: this.ProductsStore.filter().search }));
  protected readonly sortOptions = SORT_OPTIONS;

  ngOnDestroy(): void {
    this.ProductsStore.resetFilters();
  }

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
      .open(ProductFilterDialogComponent, {
        minWidth: '500px',
        data: this.ProductsStore.filterData(),
      })
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((value) => this.ProductsStore.updateFilters(value)),
        takeUntilDestroyed(this._DestroyRef)
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
      pageIndex: this._toBackendPageIndex($event.pageIndex),
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

  private _toBackendPageIndex(materialPageIndex: number): number {
    return materialPageIndex + 1;
  }
}
