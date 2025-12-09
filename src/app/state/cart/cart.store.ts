import { signalStore, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';

import { type CartItem } from '@models/cart';

import { cartComputed } from './cart.computed';
import { initializeCartId } from './cart.helpers';
import { cartMethods } from './cart.methods';
import { type ICartState } from './cart.types';

const cartInitialState: ICartState = {
  id: initializeCartId(),
  items: [],
  isLoading: false,
  deliveryFee: 0,
  vouchers: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withEntities<CartItem>(),
  cartComputed(withState(cartInitialState)),
  cartMethods()
);

export type { IProductInCart, ICartState } from './cart.types';
