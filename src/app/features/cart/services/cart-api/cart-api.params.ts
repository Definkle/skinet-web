import type { ShoppingCart as ShoppingCartDto } from '@api-models';

import { type CartItem } from '@models/cart';

export interface IUpdateCartParams extends ShoppingCartDto {
  id: string;
  items: CartItem[];
}
