import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { ProductFilterComponent } from './product-filter.component';
import { ProductsStore } from '../../state';


interface MockProductsStore {
  filter: Mock;
  filterData: Mock;
  productsCount: Mock;
  updateSort: Mock;
  updateSearch: Mock;
  updateFilters: Mock;
  updatePagination: Mock;
  initProducts: Mock;
  resetFilters: Mock;
  useInfiniteScroll: Mock;
  toggleInfiniteScroll: Mock;
  hasMoreProducts: Mock;
  isLoadingMore: Mock;
}

interface MockMatDialog {
  open: Mock;
}

describe('ProductFilterComponent', () => {
  let component: ProductFilterComponent;
  let fixture: ComponentFixture<ProductFilterComponent>;
  let mockProductsStore: MockProductsStore;
  let mockDialog: MockMatDialog;

  beforeEach(async () => {
    mockProductsStore = {
      filter: vi.fn().mockReturnValue({
        search: '',
        pageIndex: 1,
        pageSize: 10,
        brands: [],
        types: [],
        sort: 'name',
      }),
      filterData: vi.fn().mockReturnValue({
        brands: [],
        types: [],
      }),
      productsCount: vi.fn().mockReturnValue(100),
      updateSort: vi.fn(),
      updateSearch: vi.fn(),
      updateFilters: vi.fn(),
      updatePagination: vi.fn(),
      initProducts: vi.fn(),
      resetFilters: vi.fn(),
      useInfiniteScroll: vi.fn().mockReturnValue(false),
      toggleInfiniteScroll: vi.fn(),
      hasMoreProducts: vi.fn().mockReturnValue(true),
      isLoadingMore: vi.fn().mockReturnValue(false),
    };

    mockDialog = {
      open: vi.fn().mockReturnValue({
        afterClosed: vi.fn().mockReturnValue(of(null)),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ProductFilterComponent],
      providers: [
        { provide: ProductsStore, useValue: mockProductsStore },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSelectSortOption', () => {
    it('should update sort and initialize products', () => {
      const mockEvent = {
        source: {
          selectedOptions: {
            selected: [{ value: 'priceAsc' }],
          },
        },
      } as MatSelectionListChange;

      component.paginator = { firstPage: vi.fn() } as unknown as MatPaginator;
      component.onSelectSortOption(mockEvent);

      expect(mockProductsStore.updateSort).toHaveBeenCalledWith('priceAsc');
      expect(component.paginator?.firstPage).toHaveBeenCalled();
    });
  });

  describe('onSubmitSearchForm', () => {
    it('should update search and initialize products', () => {
      component['searchForm'].search().value.set('test search');
      component.paginator = { firstPage: vi.fn() } as unknown as MatPaginator;

      component.onSubmitSearchForm();

      expect(mockProductsStore.updateSearch).toHaveBeenCalledWith('test search');
      expect(component.paginator?.firstPage).toHaveBeenCalled();
    });
  });

  describe('onClickFiltersButton', () => {
    it('should open filter dialog and not update if cancelled', () => {
      mockDialog.open.mockReturnValue({
        afterClosed: vi.fn().mockReturnValue(of(null)),
      });

      component.onClickFiltersButton();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockProductsStore.updateFilters).not.toHaveBeenCalled();
    });

    it('should open filter dialog and update filters if confirmed', () => {
      const filterData = { brands: [1, 2], types: [3] };
      mockDialog.open.mockReturnValue({
        afterClosed: vi.fn().mockReturnValue(of(filterData)),
      });
      component.paginator = { firstPage: vi.fn() } as unknown as MatPaginator;

      component.onClickFiltersButton();

      expect(mockDialog.open).toHaveBeenCalledWith(expect.anything(), {
        minWidth: '500px',
        data: mockProductsStore.filterData(),
      });
      expect(mockProductsStore.updateFilters).toHaveBeenCalledWith(filterData);
      expect(component.paginator?.firstPage).toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should update pagination and initialize products', () => {
      const pageEvent: PageEvent = {
        pageIndex: 2,
        pageSize: 20,
        length: 100,
      };

      component.onPageChange(pageEvent);

      expect(mockProductsStore.updatePagination).toHaveBeenCalledWith({
        pageIndex: 3,
        pageSize: 20,
      });
    });
  });

  describe('private methods', () => {
    it('should not reset pagination if paginator is undefined', () => {
      component.paginator = undefined;
      component.onSubmitSearchForm();
      expect(mockProductsStore.updateSearch).toHaveBeenCalled();
    });

    it('should reset pagination if paginator exists', () => {
      const mockPaginator = { firstPage: vi.fn() } as unknown as MatPaginator;
      component.paginator = mockPaginator;

      component.onSubmitSearchForm();

      expect(mockPaginator.firstPage).toHaveBeenCalled();
    });
  });
});
