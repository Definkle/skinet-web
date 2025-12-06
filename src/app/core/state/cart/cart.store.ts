import { signalStore, withState } from '@ngrx/signals';
import { cartMethods } from './cart.methods';
import { cartComputed } from './cart.computed';
import { ICartState } from './cart.types';
import { initializeCartId } from './cart.helpers';

const cartInitialState: ICartState = {
  id: initializeCartId(),
  items: [],
  isLoading: false,
  deliveryFee: 0,
  discount: 0,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  cartComputed(withState(cartInitialState)),
  cartMethods(),
);

export type { IProductInCart, ICartState } from './cart.types';
