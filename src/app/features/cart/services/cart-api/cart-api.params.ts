import { ICartItem } from '@features/cart/models/cart-item.model';

export interface IUpdateCartParams {
  id: string;
  items: ICartItem[];
}
