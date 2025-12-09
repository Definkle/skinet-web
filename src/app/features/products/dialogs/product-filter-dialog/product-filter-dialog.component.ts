import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field, form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider, MatListOption, MatSelectionList } from '@angular/material/list';

import { type IBrandTypeFilter } from '../../state';

export interface IFiltersDialogData extends IBrandTypeFilter {
  selectedBrands?: string[];
  selectedTypes?: string[];
}

@Component({
  selector: 'app-filters-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatDivider, MatSelectionList, MatListOption, Field, FormsModule],
  templateUrl: './product-filter-dialog.component.html',
  styleUrl: './product-filter-dialog.component.scss',
})
export class ProductFilterDialogComponent {
  protected readonly Data = inject<IFiltersDialogData>(MAT_DIALOG_DATA);
  private readonly _DialogRef = inject(MatDialogRef<ProductFilterDialogComponent>);

  protected readonly filterForm = form(
    signal<IBrandTypeFilter>({
      brands: this.Data.selectedBrands ?? [],
      types: this.Data.selectedTypes ?? [],
    })
  );

  onClickApplyFilters() {
    this._DialogRef.close(this.filterForm().value());
  }

  onClickResetFilters() {
    this.filterForm().value.set({
      brands: [],
      types: [],
    });
  }
}
