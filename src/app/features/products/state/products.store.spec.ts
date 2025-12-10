import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@core/constants/default-pagination-values.constant';
import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { ProductApiService } from '@features/products/services/product-api/product-api.service';

import { CartStore } from '@state/cart';

import { ProductsStore } from './products.store';

interface MockProductApiService {
  getProducts$: Mock;
  getBrands$: Mock;
  getTypes$: Mock;
  getProduct$: Mock;
}

interface MockErrorHandlerService {
  handleError: Mock;
}

interface MockCartStore {
  items: Mock;
}

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  pictureUrl: 'test.jpg',
  productType: 'Test Type',
  productBrand: 'Test Brand',
  quantityInStock: 10,
};

const mockProducts = [mockProduct, { ...mockProduct, id: 2, name: 'Test Product 2' }];
const flushMicrotasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('ProductsStore', () => {
  let store: InstanceType<typeof ProductsStore>;
  let mockProductApi: MockProductApiService;
  let mockErrorHandler: MockErrorHandlerService;
  let mockCartStore: MockCartStore;

  const defaultFilter = {
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    search: '',
    brands: [],
    types: [],
    sort: '',
  };

  const initProductsAndWait = async (filter = defaultFilter) => {
    store.initProducts(filter);
    await flushMicrotasks();
  };

  const initBrandsAndWait = async () => {
    store.initBrands();
    await flushMicrotasks();
  };

  const initTypesAndWait = async () => {
    store.initTypes();
    await flushMicrotasks();
  };

  const initProductDetailsAndWait = async (id: number) => {
    store.initProductDetails(id);
    await flushMicrotasks();
  };

  beforeEach(() => {
    mockProductApi = {
      getProducts$: vi.fn().mockReturnValue(of({ data: mockProducts, totalCount: 100 })),
      getBrands$: vi.fn().mockReturnValue(of(['Brand1', 'Brand2'])),
      getTypes$: vi.fn().mockReturnValue(of(['Type1', 'Type2'])),
      getProduct$: vi.fn().mockReturnValue(of(mockProduct)),
    };

    mockErrorHandler = {
      handleError: vi.fn(),
    };

    mockCartStore = {
      items: vi.fn().mockReturnValue([]),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        { provide: ProductApiService, useValue: mockProductApi },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: CartStore, useValue: mockCartStore },
      ],
    });

    store = TestBed.inject(ProductsStore);
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      expect(store.products()).toEqual([]);
      expect(store.productsCount()).toBe(0);
      expect(store.brands()).toEqual([]);
      expect(store.types()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.isLoadingMore()).toBe(false);
      expect(store.useInfiniteScroll()).toBe(false);
      expect(store.activeProduct()).toBeNull();
      expect(store.filter()).toEqual({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        search: '',
        brands: [],
        types: [],
        sort: '',
      });
    });
  });

  describe('initProducts', () => {
    it('should load products successfully', async () => {
      await initProductsAndWait({ pageIndex: 1, pageSize: 10, search: '', brands: [], types: [], sort: '' });

      expect(store.products()).toEqual(mockProducts);
      expect(store.productsCount()).toBe(100);
      expect(store.isLoading()).toBe(false);
      expect(mockProductApi.getProducts$).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const error = new Error('API Error');
      mockProductApi.getProducts$.mockReturnValue(throwError(() => error));

      await initProductsAndWait();

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('ProductsStore', error);
    });
  });

  describe('loadMoreProducts', () => {
    it('should append products and increment page index', async () => {
      await initProductsAndWait();

      const newProducts = [{ ...mockProduct, id: 3, name: 'Test Product 3' }];
      mockProductApi.getProducts$.mockReturnValue(of({ data: newProducts, totalCount: 100 }));

      store.loadMoreProducts();
      await flushMicrotasks();

      expect(store.products().length).toBe(3);
      expect(store.filter().pageIndex).toBe(2);
      expect(store.isLoadingMore()).toBe(false);
    });

    it('should handle error when loading more', async () => {
      const error = new Error('Load More Error');

      await initProductsAndWait();

      mockProductApi.getProducts$.mockReturnValue(throwError(() => error));
      store.loadMoreProducts();
      await flushMicrotasks();

      expect(store.isLoadingMore()).toBe(false);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('ProductsStore', error);
    });
  });

  describe('initBrands', () => {
    it('should load brands successfully', async () => {
      await initBrandsAndWait();

      expect(store.brands()).toEqual(['Brand1', 'Brand2']);
      expect(store.isLoading()).toBe(false);
      expect(mockProductApi.getBrands$).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const error = new Error('Brands Error');
      mockProductApi.getBrands$.mockReturnValue(throwError(() => error));

      await initBrandsAndWait();

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('ProductsStore', error);
    });
  });

  describe('initTypes', () => {
    it('should load types successfully', async () => {
      await initTypesAndWait();

      expect(store.types()).toEqual(['Type1', 'Type2']);
      expect(store.isLoading()).toBe(false);
      expect(mockProductApi.getTypes$).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const error = new Error('Types Error');
      mockProductApi.getTypes$.mockReturnValue(throwError(() => error));

      await initTypesAndWait();

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('ProductsStore', error);
    });
  });

  describe('initProductDetails', () => {
    it('should load product details successfully', async () => {
      await initProductDetailsAndWait(1);

      expect(store.activeProduct()).toEqual(mockProduct);
      expect(store.isLoading()).toBe(false);
      expect(mockProductApi.getProduct$).toHaveBeenCalledWith(1);
    });

    it('should handle error', async () => {
      const error = new Error('Product Details Error');
      mockProductApi.getProduct$.mockReturnValue(throwError(() => error));

      await initProductDetailsAndWait(1);

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('ProductsStore', error);
    });
  });

  describe('handleFilterDialogResult', () => {
    it('should update filters and reset page index', async () => {
      store.handleFilterDialogResult({
        brands: ['Brand1'],
        types: ['Type1'],
      });

      await flushMicrotasks();

      expect(store.filter().brands).toEqual(['Brand1']);
      expect(store.filter().types).toEqual(['Type1']);
      expect(store.filter().pageIndex).toBe(DEFAULT_PAGE_INDEX);
      expect(mockProductApi.getProducts$).toHaveBeenCalled();
    });
  });

  describe('updateSearch', () => {
    it('should update search and reset page index', async () => {
      store.updateSearch('test query');

      await flushMicrotasks();

      expect(store.filter().search).toBe('test query');
      expect(store.filter().pageIndex).toBe(DEFAULT_PAGE_INDEX);
      expect(mockProductApi.getProducts$).toHaveBeenCalled();
    });
  });

  describe('updateSort', () => {
    it('should update sort and reset page index', async () => {
      store.updateSort('priceAsc');

      await flushMicrotasks();

      expect(store.filter().sort).toBe('priceAsc');
      expect(store.filter().pageIndex).toBe(DEFAULT_PAGE_INDEX);
      expect(mockProductApi.getProducts$).toHaveBeenCalled();
    });
  });

  describe('updateFilters', () => {
    it('should update filters and reset page index', async () => {
      store.updateFilters({
        brands: ['Brand1', 'Brand2'],
        types: ['Type1'],
      });

      await flushMicrotasks();

      expect(store.filter().brands).toEqual(['Brand1', 'Brand2']);
      expect(store.filter().types).toEqual(['Type1']);
      expect(store.filter().pageIndex).toBe(DEFAULT_PAGE_INDEX);
      expect(mockProductApi.getProducts$).toHaveBeenCalled();
    });
  });

  describe('updatePagination', () => {
    it('should update pagination', async () => {
      store.updatePagination({
        pageIndex: 3,
        pageSize: 20,
      });

      await flushMicrotasks();

      expect(store.filter().pageIndex).toBe(3);
      expect(store.filter().pageSize).toBe(20);
      expect(mockProductApi.getProducts$).toHaveBeenCalled();
    });
  });

  describe('resetFilters', () => {
    it('should reset filters to default values', async () => {
      store.updateFilters({
        brands: ['Brand1'],
        types: ['Type1'],
      });
      await flushMicrotasks();

      store.updateSearch('test');
      await flushMicrotasks();

      store.updateSort('priceAsc');
      await flushMicrotasks();

      store.resetFilters();
      await flushMicrotasks();

      expect(store.filter().brands).toEqual([]);
      expect(store.filter().types).toEqual([]);
      expect(store.filter().search).toBe('');
      expect(store.filter().sort).toBe('');
    });
  });

  describe('toggleInfiniteScroll', () => {
    it('should toggle infinite scroll and reset page index', async () => {
      const initialValue = store.useInfiniteScroll();

      store.toggleInfiniteScroll();
      await flushMicrotasks();

      expect(store.useInfiniteScroll()).toBe(!initialValue);
      expect(store.filter().pageIndex).toBe(DEFAULT_PAGE_INDEX);
      expect(mockProductApi.getProducts$).toHaveBeenCalled();
    });
  });

  describe('Computed Signals', () => {
    describe('hasMoreProducts', () => {
      it('should return true when more products are available', async () => {
        await initProductsAndWait();

        expect(store.hasMoreProducts()).toBe(true);
      });

      it('should return false when all products are loaded', async () => {
        mockProductApi.getProducts$.mockReturnValue(of({ data: mockProducts, totalCount: 2 }));

        await initProductsAndWait();

        expect(store.hasMoreProducts()).toBe(false);
      });
    });

    describe('filterData', () => {
      it('should combine brands, types, and selected filters', async () => {
        await initBrandsAndWait();
        await initTypesAndWait();

        store.updateFilters({ brands: ['Brand1'], types: ['Type1'] });
        await flushMicrotasks();

        const filterData = store.filterData();
        expect(filterData.brands).toEqual(['Brand1', 'Brand2']);
        expect(filterData.types).toEqual(['Type1', 'Type2']);
        expect(filterData.selectedBrands).toEqual(['Brand1']);
        expect(filterData.selectedTypes).toEqual(['Type1']);
      });
    });

    describe('activeProductQuantityInCart', () => {
      it('should return 0 when no active product', () => {
        expect(store.activeProductQuantityInCart()).toBe(0);
      });

      it('should return 0 when active product not in cart', async () => {
        mockCartStore.items.mockReturnValue([]);

        await initProductDetailsAndWait(1);

        expect(store.activeProductQuantityInCart()).toBe(0);
      });

      it('should return quantity when active product is in cart', async () => {
        mockCartStore.items.mockReturnValue([
          { productId: 1, quantity: 3, productName: 'Test Product', price: 100, pictureUrl: 'test.jpg', brand: 'Test', type: 'Test' },
        ]);

        await initProductDetailsAndWait(1);

        expect(store.activeProductQuantityInCart()).toBe(3);
      });
    });
  });
});
