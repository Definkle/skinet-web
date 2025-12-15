import { type ICartItem, type IShoppingCart } from '@features/cart/models/cart.models';
import { type IVoucher } from '@features/cart/models/voucher.model';
import type { IDeliveryMethod } from '@features/checkout/models/delivery-method.models';
import { type IProduct } from '@features/products/models/product.model';

export interface IProductInCart extends IProduct {
  quantity: number;
}

export interface ICartState extends IShoppingCart {
  vouchers: IVoucher[];
  deliveryMethod: null | IDeliveryMethod;
  isLoading: boolean;
}

export interface IUpdateCartQuantityParams {
  productId: number;
  quantity: number;
}

export interface IOrderSummaryParams {
  items: ICartItem[];
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
