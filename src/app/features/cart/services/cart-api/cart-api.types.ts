import { type ICartItem } from '@models/cart';

export interface ICartResponse {
  id: string;
  items: ICartItem[];
}
