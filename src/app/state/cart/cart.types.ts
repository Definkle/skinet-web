import { type CartItem, type ShoppingCart } from '@features/cart/models/cart.models';
import { type IVoucher } from '@features/cart/models/voucher.model';
import type { DeliveryMethod } from '@features/checkout/models/delivery-method.models';
import { type Product } from '@features/products/models/product.model';

export interface IProductInCart extends Product {
  quantity: number;
}

export interface ICartState extends ShoppingCart {
  vouchers: IVoucher[];
  deliveryMethod: null | DeliveryMethod;
  isLoading: boolean;
}

export interface IUpdateCartQuantityParams {
  productId: number;
  quantity: number;
}

export interface IOrderSummaryParams {
  items: CartItem[];
  vouchers: IVoucher[];
  deliveryFee?: number;
}

export interface IOrderSummary {
  totalPrice: number;
  deliveryFee: number;
  discount: number;
  subtotal: number;
  vouchers: IVoucher[];
}
