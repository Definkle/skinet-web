import { ICartItem, IVoucher } from '../../api/cart/cart.interface';
import { IProductInCart } from './cart.types';
import { Cart } from '../../../shared/models/cart';
import { CART_ID_STORAGE_KEY } from '../../../shared/constants/storage-keys.constant';

export type CartStoreSnapshot = {
  id: () => string;
  items: () => ICartItem[];
};

export function getStoreSnapshot(store: unknown): CartStoreSnapshot {
  return store as CartStoreSnapshot;
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
