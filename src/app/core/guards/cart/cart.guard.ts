import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { CartStore } from '@state/cart';

export const cartGuard: CanActivateFn = () => {
  const snackbar = inject(SnackbarService);
  const { isEmpty } = inject(CartStore);
  if (isEmpty()) snackbar.error('Your cart is empty!');
  return !isEmpty();
};
