import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, expect, vi, type Mocked } from 'vitest';

import { CART_ID_STORAGE_KEY } from '@constants/storage-keys.constant';
import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';
import { CartApiService } from '@features/cart/services/cart-api/cart-api.service';
import { type IShoppingCart } from '@models/cart';
import type { IProduct } from '@models/product';
import type { TRequired } from '@shared/types/generics.type';
import { mapProductToCartItem } from '@state/cart/cart.helpers';
import { CartStore } from '@state/cart/cart.store';

const mockProduct: TRequired<IProduct> = {
  id: 1,
  name: 'Product 1',
  price: 100,
  quantity: 1,
  pictureUrl: 'http://example.com/product1.jpg',
  brand: 'Brand A',
  type: 'Type X',
  description: '',
  quantityInStock: 10,
};

const mockProduct2: TRequired<IProduct> = {
  id: 2,
  name: 'Product 2',
  price: 200,
  quantity: 1,
  pictureUrl: 'http://example.com/product2.jpg',
  brand: 'Brand B',
  type: 'Type Z',
  description: '',
  quantityInStock: 20,
};

const mockCart: IShoppingCart = {
  id: 'cart1',
  items: [],
  deliveryMethodId: null,
  paymentIntentId: null,
  clientSecret: null,
};

const mockCartItem = mapProductToCartItem(mockProduct);

const mockCartItem2 = mapProductToCartItem(mockProduct2);

describe('CartStore', () => {
  let mockCartApiService: Mocked<CartApiService>;
  let mockErrorHandlerService: Mocked<ErrorHandlerService>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockCartApiService = {
      getCart$: vi.fn().mockReturnValue(of(mockCart)),
      deleteCart$: vi.fn().mockReturnValue(of({})),
      updateCart$: vi
        .fn()
        .mockReturnValue(
          of({ id: 'cart1', items: [mockCartItem], deliveryMethodId: null, paymentIntentId: null, clientSecret: null } as IShoppingCart)
        ),
    } as unknown as Mocked<CartApiService>;

    mockErrorHandlerService = {
      handleError: vi.fn(),
    } as unknown as Mocked<ErrorHandlerService>;

    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CartApiService,
          useValue: mockCartApiService,
        },
        {
          provide: ErrorHandlerService,
          useValue: mockErrorHandlerService,
        },
      ],
    });

    return TestBed.inject(CartStore);
  };

  it('should have the correct initial state', () => {
    const store = setup();

    expect(store.items()).toHaveLength(0);
    expect(store.isEmpty()).toBe(true);
    expect(store.itemsInCartCount()).toBe(0);
  });

  it('should initialize cart and load cart data from API', () => {
    const store = setup();
    store.initCart();
    expect(store.id()).toEqual('cart1');
  });

  it('should update cart items after debounce period', () => {
    const store = setup();
    store.initCart();
    store.updateCart({ ...mockCart, items: [mockCartItem] });
    vi.advanceTimersByTime(300);
    expect(store.items()).toEqual([mockCartItem]);
  });

  it('should delete cart when updating with empty items', () => {
    const store = setup();
    store.initCart();
    store.updateCart({ ...mockCart, id: 'cart2', items: [] });
    vi.advanceTimersByTime(300);
    expect(store.id()).toEqual(null);
  });

  it('should update delivery method state and persist to cart', () => {
    const store = setup();
    store.initCart();

    store.updateDeliveryMethodState({
      shortName: 'UPS1',
      deliveryTime: '1-2 Days',
      description: 'Fastest delivery time',
      price: 10,
      id: 1,
    });
    vi.advanceTimersByTime(300);
    expect(store.deliveryMethodId()).toEqual(1);
  });

  it('should add items to cart, consolidate duplicates, and update computed signals', () => {
    const store = setup();

    store.addProduct(mockProduct);
    vi.advanceTimersByTime(300);
    expect(store.items()).toEqual([mockCartItem]);

    vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [mockCartItem, mockCartItem2] }));
    store.addProduct(mockProduct2);
    vi.advanceTimersByTime(300);
    vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(
      of({ ...mockCart, items: [mockCartItem, { ...mockCartItem2, quantity: 2 }] })
    );
    store.addProduct(mockProduct2);
    expect(store.isLoading()).toBe(true);
    vi.advanceTimersByTime(300);

    expect(store.items()).toEqual([mockCartItem, { ...mockCartItem2, quantity: 2 }]);
    expect(store.itemsInCartCount()).toEqual(3);
    expect(store.isEmpty()).toEqual(false);
    expect(store.orderSummary()).toEqual({
      totalPrice: 500,
      deliveryFee: 0,
      discount: 0,
      subtotal: 500,
      vouchers: [],
    });
    expect(store.cartAsPayload()).toEqual({
      id: 'cart1',
      items: [mockCartItem, { ...mockCartItem2, quantity: 2 }],
      deliveryMethodId: null,
      paymentIntentId: null,
      clientSecret: null,
    });
  });

  it('should remove item from cart', () => {
    const store = setup();

    vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [mockCartItem] }));
    store.addProduct(mockProduct);
    vi.advanceTimersByTime(300);

    vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [mockCartItem, mockCartItem2] }));
    store.addProduct(mockProduct2);
    vi.advanceTimersByTime(300);

    expect(store.items()).toEqual([mockCartItem, mockCartItem2]);
    vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [mockCartItem2] }));

    store.removeProduct(mockCartItem.productId);
    vi.advanceTimersByTime(300);
    expect(store.items()).toEqual([mockCartItem2]);
  });

  it('should return existing cart ID from localStorage', () => {
    const existingCartId = 'existing-cart-123';
    vi.spyOn(localStorage, 'getItem').mockReturnValue(existingCartId);

    const store = setup();

    store.initCart();

    expect(localStorage.getItem(CART_ID_STORAGE_KEY)).toBe(existingCartId);
  });

  describe('updateProductQuantity', () => {
    it('should remove products of quantity with less than or equal to 0', () => {
      vi.spyOn(mockCartApiService, 'getCart$').mockReturnValue(of({ ...mockCart, items: [{ ...mockCartItem, quantity: 64 }] }));
      const store = setup();

      store.updateProductQuantity({ productId: mockProduct.id, quantity: 0 });
      vi.advanceTimersByTime(300);
      expect(store.items()).toEqual([]);
    });

    it('should update quantity of item in cart', () => {
      const store = setup();
      const updatedCartItem = { ...mockCartItem, quantity: 64 };

      store.addProduct(mockProduct);
      vi.advanceTimersByTime(300);

      vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [{ ...mockCartItem, quantity: 64 }] }));
      store.updateProductQuantity({ productId: mockProduct.id, quantity: 64 });
      vi.advanceTimersByTime(300);

      expect(store.items()).toEqual([updatedCartItem]);
    });
  });

  describe('isLoading state', () => {
    it('should set isLoading to false after cart is initialized', () => {
      const store = setup();

      store.initCart();
      vi.advanceTimersByTime(0);
      expect(store.isLoading()).toBe(false);
    });

    it('should set isLoading to true when updating cart', () => {
      const store = setup();
      store.initCart();
      vi.advanceTimersByTime(0);

      expect(store.isLoading()).toBe(false);
      store.updateCart({ ...mockCart, items: [mockCartItem] });
      expect(store.isLoading()).toBe(true);
    });

    it('should set isLoading to false after cart update completes', () => {
      const store = setup();

      store.updateCart({ ...mockCart, items: [mockCartItem] });
      vi.advanceTimersByTime(300);
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle errors when initializing cart fails', () => {
      const error = new Error('Failed to fetch cart');
      vi.spyOn(mockCartApiService, 'getCart$').mockReturnValue(throwError(() => error));

      const store = setup();
      store.initCart();
      vi.advanceTimersByTime(0);

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
    });

    it('should handle errors when updating cart fails', () => {
      const error = new Error('Failed to update cart');
      vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(throwError(() => error));

      const store = setup();
      store.updateCart({ ...mockCart, items: [mockCartItem] });
      vi.advanceTimersByTime(300);

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
    });

    it('should handle errors when deleting cart fails', () => {
      const error = new Error('Failed to delete cart');
      vi.spyOn(mockCartApiService, 'deleteCart$').mockReturnValue(throwError(() => error));

      const store = setup();
      store.initCart();
      vi.advanceTimersByTime(0);

      store.updateCart({ ...mockCart, items: [] });
      vi.advanceTimersByTime(300);

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
    });
  });

  describe('edge cases and optional fields', () => {
    it('should handle product quantity when it does not exists', () => {
      const store = setup();
      store.initCart();
      vi.advanceTimersByTime(0);
      store.addProduct({ ...mockProduct, quantity: undefined });
      vi.advanceTimersByTime(300);
      expect(store.items()).toEqual([mockCartItem]);
    });

    it('should handle negative total price', () => {
      vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [{ ...mockCartItem, productPrice: -100 }] }));

      const store = setup();
      store.initCart();
      vi.advanceTimersByTime(0);
      store.addProduct(mockProduct);
      vi.advanceTimersByTime(300);
      expect(store.orderSummary()).toEqual({
        totalPrice: 0,
        deliveryFee: 0,
        discount: 0,
        subtotal: 0,
        vouchers: [],
      });
    });
  });

  describe('orderSummary computed signal', () => {
    it('should calculate order summary with delivery fee included', () => {
      vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(
        of({
          ...mockCart,
          items: [mockCartItem],
          deliveryMethodId: 1,
        })
      );

      const store = setup();
      store.initCart();
      vi.advanceTimersByTime(0);

      vi.advanceTimersByTime(300);

      store.addProduct(mockProduct);
      vi.advanceTimersByTime(300);
      store.updateDeliveryMethodState({
        shortName: 'UPS1',
        deliveryTime: '1-2 Days',
        description: 'Fastest delivery time',
        price: 10,
        id: 1,
      });
      expect(store.orderSummary()).toEqual({
        totalPrice: 110,
        deliveryFee: 10,
        discount: 0,
        subtotal: 100,
        vouchers: [],
      });
    });

    it('should have zero delivery fee when no delivery method is set', () => {
      const store = setup();

      vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [mockCartItem] }));
      store.addProduct(mockProduct);
      vi.advanceTimersByTime(300);

      expect(store.orderSummary().deliveryFee).toBe(0);
      expect(store.orderSummary().totalPrice).toBe(100);
    });
  });
});
