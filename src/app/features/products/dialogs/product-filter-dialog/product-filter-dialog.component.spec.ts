import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersDialog } from './product-filter-dialog.component';

describe('FiltersDialog', () => {
  let component: FiltersDialog;
  let fixture: ComponentFixture<FiltersDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
