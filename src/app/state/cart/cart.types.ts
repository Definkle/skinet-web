import { type CartItem, type ShoppingCart } from '@features/cart/models/cart.models';
import { type IVoucher } from '@features/cart/models/voucher.model';
import { type Product } from '@features/products/models/product.model';

export interface IProductInCart extends Product {
  quantity: number;
}

export interface ICartState extends ShoppingCart {
  isLoading: boolean;
}

export interface IUpdateCartQuantityParams {
  productId: number;
  quantity: number;
}

export interface IOrderSummaryParams {
  items: CartItem[];
  vouchers: IVoucher[];
  deliveryFee: number;
}

export interface IOrderSummary {
  totalPrice: number;
  deliveryFee: number;
  discount: number;
  subtotal: number;
  vouchers: IVoucher[];
}
