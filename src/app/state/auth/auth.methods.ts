import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';
import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { IRegisterParams } from '@features/auth/services/account-api/account-api.params';
import { AccountApiService } from '@features/auth/services/account-api/account-api.service';
import { ILoginParams } from '@features/auth/services/login-api/login-api.params';
import { LoginApiService } from '@features/auth/services/login-api/login-api.service';

export const authMethods = () => {
  return signalStoreFeature(
    withMethods(
      (
        store,
        accountRepo = inject(AccountApiService),
        loginRepo = inject(LoginApiService),
        errorHandler = inject(ErrorHandlerService),
        router = inject(Router),
        snackbar = inject(SnackbarService)
      ) => {
        const handleAuthError = (error: unknown): void => errorHandler.handleError('AuthStore', error);

        return {
          initAuth: rxMethod<void>(
            pipe(
              distinctUntilChanged(),
              tap(() => patchState(store, { isLoading: true })),
              switchMap(() =>
                accountRepo.getUserInfo$().pipe(
                  tapResponse({
                    next: (user) => patchState(store, { user }),
                    error: handleAuthError,
                    finalize: () => patchState(store, { isLoading: false }),
                  })
                )
              )
            )
          ),
          register: rxMethod<IRegisterParams>(
            pipe(
              distinctUntilChanged(),
              tap(() => patchState(store, { isLoading: true })),
              switchMap((params) =>
                accountRepo.register$(params).pipe(
                  tapResponse({
                    next: () => patchState(store, { isLoading: false }),
                    error: handleAuthError,
                    finalize: () => {
                      snackbar.success('Registration successful - you can now login!');
                      void router.navigateByUrl('/login');
                    },
                  })
                )
              )
            )
          ),
          login: rxMethod<ILoginParams>(
            pipe(
              tap(() => patchState(store, { isLoading: true })),
              switchMap((params) =>
                loginRepo.login$(params).pipe(
                  tapResponse({
                    next: () => undefined,
                    error: (error) => {
                      handleAuthError(error);
                      patchState(store, { isLoading: false });
                    },
                  })
                )
              ),
              switchMap(() =>
                accountRepo.getUserInfo$().pipe(
                  tapResponse({
                    next: (user) => {
                      patchState(store, { user });
                      void router.navigateByUrl('/shop');
                    },
                    error: handleAuthError,
                    finalize: () => {
                      patchState(store, { isLoading: false });
                    },
                  })
                )
              )
            )
          ),
          logout: rxMethod<void>(
            pipe(
              tap(() => patchState(store, { isLoading: true })),
              switchMap(() =>
                accountRepo.logout$().pipe(
                  tapResponse({
                    next: () => patchState(store, { user: null }),
                    error: handleAuthError,
                    finalize: () => {
                      patchState(store, { isLoading: false });
                      void router.navigateByUrl('/login');
                    },
                  })
                )
              )
            )
          ),
        };
      }
    )
  );
};
