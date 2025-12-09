import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthStore } from '@state/auth/auth.store';

export const authGuard: CanActivateFn = (_activatedRoute, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authStore.isLoggedIn() || router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
