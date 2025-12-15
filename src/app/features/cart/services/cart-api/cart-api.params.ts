import type { ShoppingCart as ShoppingCartDto } from '@api-models';

import { type ICartItem } from '@models/cart';

export interface IUpdateCartParams extends ShoppingCartDto {
  id: string;
  items: ICartItem[];
}
