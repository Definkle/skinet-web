import { ICart } from '../../api/cart/cart.interface';
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
