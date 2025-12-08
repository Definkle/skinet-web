import { CartItem } from '@models/cart';

export interface ICartResponse {
  id: string;
  items: CartItem[];
}
