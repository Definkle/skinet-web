import { ICartItem } from '@features/cart/models/cart-item.model';
import { ICart } from '@features/cart/models/cart.model';
import { IVoucher } from '@features/cart/models/voucher.model';
import { IProduct } from '@features/products/models';

export interface IProductInCart extends IProduct {
  quantity: number;
}

export interface ICartState extends ICart {
  isLoading: boolean;
}

export interface IUpdateCartQuantityParams {
  productId: number;
  quantity: number;
}

export interface IOrderSummaryParams {
  items: ICartItem[];
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
