import { inject } from '@angular/core';
import { signalStore, withProps, withState } from '@ngrx/signals';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { CartApiService } from '@features/cart/services/cart-api/cart-api.service';

import { cartComputed } from './cart.computed';
import { initializeCartId } from './cart.helpers';
import { cartMethods } from './cart.methods';
import { ICartState } from './cart.types';

const cartInitialState: ICartState = {
  id: initializeCartId(),
  items: [],
  isLoading: false,
  deliveryFee: 0,
  vouchers: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  cartComputed(withState(cartInitialState)),
  withProps(() => ({
    cartRepo: inject(CartApiService),
    errorHandler: inject(ErrorHandlerService),
  })),
  cartMethods()
);

export type { IProductInCart, ICartState } from './cart.types';
