import { ICart, ICartItem, IVoucher } from '../../api/cart/cart.interface';
import { IProduct } from '../../api/products/product.interface';

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

export type TOrderSummary = {
  totalPrice: number;
  deliveryFee: number;
  discount: number;
  subtotal: number;
  vouchers: IVoucher[];
};
