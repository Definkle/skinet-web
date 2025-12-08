import { CART_ID_STORAGE_KEY } from '@core/constants/storage-keys.constant';

import { ICartItem } from '@features/cart/models/cart-item.model';
import { Cart } from '@features/cart/models/cart.model';
import { IVoucher } from '@features/cart/models/voucher.model';

import { IOrderSummary, IOrderSummaryParams, IProductInCart } from './cart.types';

export interface ICartStoreSnapshot {
  id: () => string;
  items: () => ICartItem[];
}

export function getStoreSnapshot(store: unknown): ICartStoreSnapshot {
  return store as ICartStoreSnapshot;
}

export function initializeCartId(): string {
  const existingCartId = localStorage.getItem(CART_ID_STORAGE_KEY);

  if (existingCartId?.length) {
    return existingCartId;
  }

  const newCart = new Cart();
  const cartId: string = newCart.id;
  localStorage.setItem(CART_ID_STORAGE_KEY, cartId);
  return cartId;
}

export function consolidateCartItems(cartItems: ICartItem[]): ICartItem[] {
  const consolidatedMap = new Map<number, ICartItem>();

  cartItems.forEach((item) => {
    const existingItem = consolidatedMap.get(item.productId);

    if (existingItem) {
      consolidatedMap.set(item.productId, {
        ...existingItem,
        quantity: existingItem.quantity + item.quantity,
      });
    } else {
      consolidatedMap.set(item.productId, { ...item });
    }
  });

  return Array.from(consolidatedMap.values());
}

export function calculateTotalDiscount(vouchers: IVoucher[]) {
  return vouchers.reduce((sum, voucher) => sum + voucher.discount, 0);
}

export function calculateTotalItemsCount(cartItems: ICartItem[]): number {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

export function calculateSubtotal(cartItems: ICartItem[]): number {
  return cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
}

export function buildOrderSummary({ items, vouchers, deliveryFee }: IOrderSummaryParams): IOrderSummary {
  const subtotal = calculateSubtotal(items);
  const discount = calculateTotalDiscount(vouchers);
  const totalPrice = subtotal + deliveryFee - discount;

  return {
    totalPrice: totalPrice <= 0 ? 0 : totalPrice,
    deliveryFee,
    discount,
    subtotal,
    vouchers,
  };
}

export function mapProductToCartItem(product: IProductInCart): ICartItem {
  return {
    productId: product.id,
    productName: product.name,
    productPrice: product.price,
    brand: product.brand,
    quantity: product.quantity,
    type: product.type,
    pictureUrl: product.pictureUrl,
  };
}
