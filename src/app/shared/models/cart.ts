import { nanoid } from 'nanoid';
import { ICart } from '../../core/api/cart/cart.interface';

export class Cart implements ICart {
  discount = 0;
  deliveryFee = 0;
  vouchers = [];
  id = nanoid();
  items = [];
}
