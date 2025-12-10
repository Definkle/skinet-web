import { signalStore, withState } from '@ngrx/signals';

import { cartComputed } from './cart.computed';
import { initializeCartId } from './cart.helpers';
import { cartMethods } from './cart.methods';
import { type ICartState } from './cart.types';

const cartInitialState: ICartState = {
  id: initializeCartId(),
  items: [],
  isLoading: false,
  vouchers: [],
  deliveryMethodId: null,
  clientSecret: null,
  paymentIntentId: null,
  deliveryMethod: null,
};

export const CartStore = signalStore({ providedIn: 'root' }, cartComputed(withState(cartInitialState)), cartMethods());

export type { IProductInCart, ICartState } from './cart.types';
