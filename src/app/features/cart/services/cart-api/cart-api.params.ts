import { type CartItem } from '@models/cart';

export interface IUpdateCartParams {
  id: string;
  items: CartItem[];
}
