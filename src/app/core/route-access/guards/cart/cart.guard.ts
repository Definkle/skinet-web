import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { CartStore } from '@state/cart';
import { GlobalStore } from '@state/global';

export const cartGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);
  const { isInitialized } = inject(GlobalStore);
  const { isEmpty } = inject(CartStore);
  if (!isInitialized()) return router.createUrlTree([state.url]);
  if (isEmpty()) snackbar.error('Your cart is empty!');

  return !isEmpty();
};
