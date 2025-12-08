import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it } from 'vitest';

import { ProductFilterDialogComponent } from './product-filter-dialog.component';

describe('ProductFilterDialogComponent', () => {
  let component: ProductFilterDialogComponent;
  let fixture: ComponentFixture<ProductFilterDialogComponent>;
  const mockDialogData = {};
  const mockDialogRef = { close: () => ({}) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
