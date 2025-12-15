import { CART_ID_STORAGE_KEY } from '@core/constants/storage-keys.constant';
import { Cart, type ICartItem } from '@features/cart/models/cart.models';
import { type IVoucher } from '@features/cart/models/voucher.model';
import { type IProduct } from '@features/products/models/product.model';

import { type IOrderSummary, type IOrderSummaryParams } from './cart.types';

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

export function buildOrderSummary({ items, vouchers, deliveryFee = 0 }: IOrderSummaryParams): IOrderSummary {
  const subtotal = calculateSubtotal(items);
  const discount = calculateTotalDiscount(vouchers);
  const totalPrice = subtotal + deliveryFee - discount;

  return {
    totalPrice: totalPrice <= 0 ? 0 : totalPrice,
    deliveryFee,
    discount,
    subtotal: subtotal <= 0 ? 0 : subtotal,
    vouchers,
  };
}

export function mapProductToCartItem(product: IProduct): ICartItem {
  return {
    productId: product.id,
    productName: product.name,
    productPrice: product.price,
    brand: product.brand,
    quantity: product?.quantity ?? 0,
    type: product.type,
    pictureUrl: product.pictureUrl,
  };
}
