import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ProductsStore } from '../state/products';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from '../../../shared/constants/default-pagination-values.constant';
import { FiltersDialogComponent } from '../dialogs/filters-dialog/filters-dialog.component';
import { filter, tap } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IGetProductsParams } from '../../../core/api/products/product.interface';
import { Field, form } from '@angular/forms/signals';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SORT_OPTIONS } from '../../../shared/constants/sort-options.constant';

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
export class ShopFilterComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  protected readonly ProductsStore = inject(ProductsStore);
  private _DestroyRef = inject(DestroyRef);
  private readonly _DialogService = inject(MatDialog);

  protected readonly DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE;
  protected readonly DEFAULT_PAGE_SIZE_OPTIONS = DEFAULT_PAGE_SIZE_OPTIONS;

  protected readonly searchForm = form(
    signal<ISearchModel>({ search: this.ProductsStore.filter().search }),
  );
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
      .open(FiltersDialogComponent, {
        minWidth: '500px',
        data: this.ProductsStore.filterData(),
      })
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((value) => this.ProductsStore.updateFilters(value)),
        takeUntilDestroyed(this._DestroyRef),
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
