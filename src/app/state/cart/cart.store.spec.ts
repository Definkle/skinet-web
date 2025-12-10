import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { CART_ID_STORAGE_KEY } from '@core/constants/storage-keys.constant';
import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { CartApiService } from '@features/cart/services/cart-api/cart-api.service';

import type { CartItem, ShoppingCart } from '@models/cart';
import type { Product } from '@models/product';

import { CartStore } from './cart.store';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const flushMicrotasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

interface MockCartApiService {
  getCart$: Mock;
  updateCart$: Mock;
  deleteCart$: Mock;
}

interface MockErrorHandlerService {
  handleError: Mock;
}

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  pictureUrl: 'test.jpg',
  type: 'Test Type',
  brand: 'Test Brand',
  quantityInStock: 10,
};

const mockCartItem: CartItem = {
  productId: 1,
  productName: 'Test Product',
  productPrice: 100,
  quantity: 2,
  pictureUrl: 'test.jpg',
  brand: 'Test Brand',
  type: 'Test Type',
};

const mockCart: ShoppingCart = {
  id: 'test-cart-id',
  items: [mockCartItem],
  deliveryMethodId: null,
  clientSecret: null,
  paymentIntentId: null,
};

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;
  let mockCartApi: MockCartApiService;
  let mockErrorHandler: MockErrorHandlerService;

  const updateCartStateAndWait = async (cart: ShoppingCart) => {
    store.updateCartState(cart);
    await flushMicrotasks();
  };

  const initCartAndWait = async () => {
    store.initCart();
    await flushMicrotasks();
  };

  beforeEach(() => {
    localStorage.clear();

    mockCartApi = {
      getCart$: vi.fn().mockReturnValue(of(mockCart)),
      updateCart$: vi.fn().mockReturnValue(of(mockCart)),
      deleteCart$: vi.fn().mockReturnValue(of(undefined)),
    };

    mockErrorHandler = {
      handleError: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CartStore,
        { provide: CartApiService, useValue: mockCartApi },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
      ],
    });

    store = TestBed.inject(CartStore);
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      expect(store.items()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.vouchers()).toEqual([]);
      expect(store.deliveryMethodId()).toBeNull();
      expect(store.clientSecret()).toBeNull();
      expect(store.paymentIntentId()).toBeNull();
    });

    it('should initialize cart ID from localStorage or generate new one', () => {
      const cartId = store.id();
      expect(cartId).toBeTruthy();
      expect(typeof cartId).toBe('string');
    });
  });

  describe('updateCartState', () => {
    it('should update cart state', async () => {
      const newCart = {
        id: 'new-cart-id',
        items: [mockCartItem],
        vouchers: [],
        deliveryMethodId: null,
        clientSecret: 'secret',
        paymentIntentId: 'intent-id',
      };

      await updateCartStateAndWait(newCart);

      expect(store.id()).toBe('new-cart-id');
      expect(store.items()).toEqual([mockCartItem]);
      expect(store.clientSecret()).toBe('secret');
      expect(store.paymentIntentId()).toBe('intent-id');
    });
  });

  describe('addProduct', () => {
    it('should add product to cart', async () => {
      store.addProduct(mockProduct);

      await wait(400);
      expect(mockCartApi.updateCart$).toHaveBeenCalled();
    });

    it('should consolidate duplicate products', async () => {
      store.addProduct(mockProduct);

      await wait(400);
      store.addProduct(mockProduct);

      await wait(400);
      const calls = mockCartApi.updateCart$.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.items.length).toBe(1);
      expect(lastCall.items[0].quantity).toBe(2);
    });

    it('should initialize cart ID if not present', async () => {
      localStorage.removeItem(CART_ID_STORAGE_KEY);

      const newStore = TestBed.inject(CartStore);

      newStore.addProduct(mockProduct);

      await wait(400);
      expect(newStore.id()).toBeTruthy();
    });
  });

  describe('removeProduct', () => {
    it('should remove product from cart', async () => {
      await updateCartStateAndWait(mockCart);

      store.removeProduct(1);
      await wait(400);

      expect(mockCartApi.deleteCart$).toHaveBeenCalled();
    });

    it('should delete cart when removing last item', async () => {
      mockCartApi.deleteCart$.mockReturnValue(of(undefined));
      await updateCartStateAndWait(mockCart);

      store.removeProduct(1);
      await wait(400);

      expect(mockCartApi.deleteCart$).toHaveBeenCalled();
    });
  });

  describe('updateProductQuantity', () => {
    it('should update product quantity', async () => {
      await updateCartStateAndWait(mockCart);

      store.updateProductQuantity({ productId: 1, quantity: 5 });
      await wait(400);

      expect(mockCartApi.updateCart$).toHaveBeenCalled();
      const calls = mockCartApi.updateCart$.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.items[0].quantity).toBe(5);
    });

    it('should remove product when quantity is 0', async () => {
      await updateCartStateAndWait(mockCart);

      store.updateProductQuantity({ productId: 1, quantity: 0 });
      await wait(400);

      expect(mockCartApi.deleteCart$).toHaveBeenCalled();
    });

    it('should remove product when quantity is negative', async () => {
      await updateCartStateAndWait(mockCart);

      store.updateProductQuantity({ productId: 1, quantity: -1 });
      await wait(400);

      expect(mockCartApi.deleteCart$).toHaveBeenCalled();
    });
  });

  describe('initCart', () => {
    it('should load cart successfully', async () => {
      await initCartAndWait();

      expect(store.items()).toEqual(mockCart.items);
      expect(store.isLoading()).toBe(false);
      expect(mockCartApi.getCart$).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const error = new Error('Cart Error');
      mockCartApi.getCart$.mockReturnValue(throwError(() => error));

      await initCartAndWait();

      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('CartStore', error);
    });
  });

  describe('updateCart (internal)', () => {
    it('should delete cart when items array is empty', async () => {
      mockCartApi.deleteCart$.mockReturnValue(of(undefined));
      await updateCartStateAndWait(mockCart);

      store.removeProduct(1);
      await wait(500);

      expect(mockCartApi.deleteCart$).toHaveBeenCalled();
      expect(store.id()).toBeNull();
      expect(store.items()).toEqual([]);
    });

    it('should remove cart ID from localStorage when cart is deleted', async () => {
      mockCartApi.deleteCart$.mockReturnValue(of(undefined));
      localStorage.setItem(CART_ID_STORAGE_KEY, 'test-id');
      await updateCartStateAndWait(mockCart);

      store.removeProduct(1);
      await wait(500);

      expect(localStorage.getItem(CART_ID_STORAGE_KEY)).toBeNull();
    });

    it('should handle delete cart error', async () => {
      const error = new Error('Delete Error');
      mockCartApi.deleteCart$.mockReturnValue(throwError(() => error));
      await updateCartStateAndWait(mockCart);

      store.removeProduct(1);
      await wait(500);

      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('CartStore', error);
      expect(store.isLoading()).toBe(false);
    });

    it('should handle update cart error', async () => {
      const error = new Error('Update Error');
      mockCartApi.updateCart$.mockReturnValue(throwError(() => error));

      store.addProduct(mockProduct);
      await wait(500);

      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('CartStore', error);
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('Computed Signals', () => {
    describe('itemsInCartCount', () => {
      it('should return 0 for empty cart', () => {
        expect(store.itemsInCartCount()).toBe(0);
      });

      it('should return total quantity of all items', async () => {
        const cartWithMultipleItems = {
          ...mockCart,
          items: [
            { ...mockCartItem, productId: 1, quantity: 2 },
            { ...mockCartItem, productId: 2, quantity: 3 },
          ],
        };

        await updateCartStateAndWait(cartWithMultipleItems);

        expect(store.itemsInCartCount()).toBe(5);
      });
    });

    describe('isEmpty', () => {
      it('should return true for empty cart', () => {
        expect(store.isEmpty()).toBe(true);
      });

      it('should return false when cart has items', async () => {
        await updateCartStateAndWait(mockCart);

        expect(store.isEmpty()).toBe(false);
      });
    });

    describe('orderSummary', () => {
      it('should calculate order summary correctly', async () => {
        const cartWithItems = {
          ...mockCart,
          items: [{ ...mockCartItem, productPrice: 100, quantity: 2 }],
          vouchers: [],
          deliveryMethod: {
            id: 1,
            name: 'Standard Delivery',
            price: 5,
          },
          deliveryMethodId: 1,
        };

        await updateCartStateAndWait(cartWithItems);

        const summary = store.orderSummary();
        expect(summary.subtotal).toBe(200);
        expect(summary.deliveryFee).toBe(5);
        expect(summary.discount).toBe(0);
        expect(summary.totalPrice).toBe(205);
      });

      it('should return zero values for empty cart', () => {
        const summary = store.orderSummary();
        expect(summary.subtotal).toBe(0);
        expect(summary.deliveryFee).toBe(0);
        expect(summary.discount).toBe(0);
        expect(summary.totalPrice).toBe(0);
      });
    });
  });
});
