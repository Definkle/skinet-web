import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
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

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE_OPTIONS } from '@core/constants/default-pagination-values.constant';
import { SORT_OPTIONS } from '@core/constants/sort-options.constant';

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
export class ProductFilterComponent {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  protected readonly ProductsStore = inject(ProductsStore);
  private readonly _DialogService = inject(MatDialog);

  protected readonly DEFAULT_PAGE_SIZE_OPTIONS = DEFAULT_PAGE_SIZE_OPTIONS;

  protected readonly searchForm = form(signal<ISearchModel>({ search: this.ProductsStore.filter().search }));
  protected readonly sortOptions = SORT_OPTIONS;

  constructor() {
    effect(() => {
      if (this.ProductsStore.filter().pageIndex === DEFAULT_PAGE_INDEX) {
        if (this.paginator) {
          this.paginator.firstPage();
        }
      }
    });
  }

  onSelectSortOption(event: MatSelectionListChange) {
    this.ProductsStore.updateSort(event.source.selectedOptions.selected[0].value);
  }

  onSubmitSearchForm() {
    this.ProductsStore.updateSearch(this.searchForm().value().search);
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
        tap((value) => this.ProductsStore.handleFilterDialogResult(value))
      )
      .subscribe();
  }

  onPageChange($event: PageEvent) {
    this.ProductsStore.updatePagination({
      pageIndex: this._toBackendPageIndex($event.pageIndex),
      pageSize: $event.pageSize,
    });
  }

  private _toBackendPageIndex(materialPageIndex: number): number {
    return materialPageIndex + 1;
  }
}
