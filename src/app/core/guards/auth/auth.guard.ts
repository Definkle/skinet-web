import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';

import { AuthStore } from '@state/auth/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  return authStore.isLoggedIn();
};
