import { ICartItem } from '@features/cart/models/cart-item.model';

export interface ICartResponse {
  id: string;
  items: ICartItem[];
}
