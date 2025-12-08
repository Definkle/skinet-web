import { nanoid } from 'nanoid';

import { ICartItem } from './cart-item.model';
import { IVoucher } from './voucher.model';

export interface ICart {
  id: string;
  items: ICartItem[];
  discount: number;
  deliveryFee: number;
  vouchers: IVoucher[];
}

export class Cart implements ICart {
  discount = 0;
  deliveryFee = 0;
  vouchers = [];
  id = nanoid();
  items = [];
}
