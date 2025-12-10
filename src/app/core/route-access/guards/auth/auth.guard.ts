import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, type CanActivateFn } from '@angular/router';
import { filter, first, map } from 'rxjs';

import { AuthStore } from '@state/auth';
import { GlobalStore } from '@state/global';

interface AuthGuardConfig {
  requireAuth: boolean;
  redirectTo: string;
  preserveReturnUrl?: boolean;
}

function createAuthGuard(config: AuthGuardConfig): CanActivateFn {
  return (_route, state) => {
    const { isLoggedIn } = inject(AuthStore);
    const { isInitialized } = inject(GlobalStore);
    const router = inject(Router);

    const checkAuth = () => {
      const isAllowed = config.requireAuth ? isLoggedIn() : !isLoggedIn();

      if (isAllowed) return true;

      const queryParams = config.preserveReturnUrl ? { returnUrl: state.url } : undefined;
      return router.createUrlTree([config.redirectTo], { queryParams });
    };

    if (isInitialized()) {
      return checkAuth();
    }

    return toObservable(isInitialized).pipe(filter(Boolean), first(), map(checkAuth));
  };
}

export const authGuard = createAuthGuard({
  requireAuth: true,
  redirectTo: '/login',
  preserveReturnUrl: true,
});

export const preventLoginAccess = createAuthGuard({
  requireAuth: false,
  redirectTo: '/shop',
});
