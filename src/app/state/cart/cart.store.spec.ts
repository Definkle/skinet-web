import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, vi } from 'vitest';

import { CartApiService } from '@features/cart/services/cart-api/cart-api.service';

import { type CartItem, type ShoppingCart } from '@models/cart';
import type { Product } from '@models/product';

import { CartStore } from '@state/cart/cart.store';

const mockProduct: Product = {
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

const mockProduct2: Product = {
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

const mockCart: ShoppingCart = {
  id: 'cart1',
  items: [],
  deliveryMethodId: null,
  paymentIntentId: null,
  clientSecret: null,
};

const mockCartItem: CartItem = {
  productId: mockProduct.id,
  productName: mockProduct.name,
  productPrice: mockProduct.price,
  quantity: +mockProduct.quantity!,
  pictureUrl: mockProduct.pictureUrl,
  brand: mockProduct.brand,
  type: mockProduct.type,
};

const mockCartItem2: CartItem = {
  productId: mockProduct2.id,
  productName: mockProduct2.name,
  productPrice: mockProduct2.price,
  quantity: +mockProduct2.quantity!,
  pictureUrl: mockProduct2.pictureUrl,
  brand: mockProduct2.brand,
  type: mockProduct2.type,
};

describe('CartStore', () => {
  const mockCartApiService = {
    getCart$: vi.fn().mockReturnValue(of(mockCart)),
    deleteCart$: vi.fn().mockReturnValue(of({})),
    updateCart$: vi
      .fn()
      .mockReturnValue(
        of({ id: 'cart1', items: [mockCartItem], deliveryMethodId: null, paymentIntentId: null, clientSecret: null } as ShoppingCart)
      ),
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CartApiService,
          useValue: mockCartApiService,
        },
      ],
    });

    return TestBed.inject(CartStore);
  };

  it('should have the correct initial state', () => {
    const store = setup();

    expect(store.items().length).toEqual(0);
  });

  it('should init cart', async () => {
    const store = setup();
    store.initCart();
    expect(store.id()).toEqual('cart1');
  });

  it('should update cart', async () => {
    const store = setup();
    store.initCart();
    store.updateCart({ ...mockCart, items: [mockCartItem] });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(store.items()).toEqual([mockCartItem]);
  });

  it('should delete cart', async () => {
    const store = setup();
    store.initCart();
    store.updateCart({ ...mockCart, id: 'cart2', items: [] });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(store.id()).toEqual(null);
  });

  it('should update delivery method state', async () => {
    const store = setup();
    store.initCart();

    store.updateDeliveryMethodState({
      shortName: 'UPS1',
      deliveryTime: '1-2 Days',
      description: 'Fastest delivery time',
      price: 10,
      id: 1,
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(store.deliveryMethodId()).toEqual(1);
  });

  it('should add item to cart', async () => {
    const store = setup();
    store.addProduct(mockProduct);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(store.items()).toEqual([mockCartItem]);
  });

  it('should remove item from cart', async () => {
    const store = setup();

    vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [mockCartItem] }));
    store.addProduct(mockProduct);
    await new Promise((resolve) => setTimeout(resolve, 300));

    vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [mockCartItem, mockCartItem2] }));
    store.addProduct(mockProduct2);
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(store.items()).toEqual([mockCartItem, mockCartItem2]);
    store.removeProduct(mockProduct.id);
    expect(store.items()).toEqual([mockCartItem2]);
  });

  describe('updateProductQuantity', () => {
    it('should remove products of quantity with less than or equal to 0', async () => {
      vi.spyOn(mockCartApiService, 'getCart$').mockReturnValue(of({ ...mockCart, items: [{ ...mockCartItem, quantity: 64 }] }));
      const store = setup();

      store.updateProductQuantity({ productId: mockProduct.id, quantity: 0 });
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(store.items()).toEqual([]);
    });

    it('should update quantity of item in cart', async () => {
      const store = setup();
      const updatedCartItem = { ...mockCartItem, quantity: 64 };

      store.addProduct(mockProduct);
      await new Promise((resolve) => setTimeout(resolve, 300));

      vi.spyOn(mockCartApiService, 'updateCart$').mockReturnValue(of({ ...mockCart, items: [{ ...mockCartItem, quantity: 64 }] }));
      store.updateProductQuantity({ productId: mockProduct.id, quantity: 64 });
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(store.items()).toEqual([updatedCartItem]);
    });
  });
});
