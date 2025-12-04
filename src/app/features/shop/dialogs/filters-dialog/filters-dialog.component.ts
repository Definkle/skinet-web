import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDivider, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { Field, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBrandTypeFilter } from '../../state/products/products.store';

export interface IFiltersDialogData extends IBrandTypeFilter {
  selectedBrands?: string[];
  selectedTypes?: string[];
}

@Component({
  selector: 'app-filters-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatDivider, MatSelectionList, MatListOption, Field, FormsModule],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss',
})
export class FiltersDialog {
  protected readonly Data = inject<IFiltersDialogData>(MAT_DIALOG_DATA);
  private readonly _DialogRef = inject(MatDialogRef<FiltersDialog>);

  protected readonly filterForm = form(
    signal<IBrandTypeFilter>({
      brands: this.Data.selectedBrands ?? [],
      types: this.Data.selectedTypes ?? [],
    }),
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
