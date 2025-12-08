import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { IRegisterParams } from '@features/auth/services/account-api/account-api.params';
import { AccountApiService } from '@features/auth/services/account-api/account-api.service';
import { ILoginParams } from '@features/auth/services/login-api/login-api.params';
import { LoginApiService } from '@features/auth/services/login-api/login-api.service';

export const authMethods = () => {
  return signalStoreFeature(
    withMethods(
      (store, accountRepo = inject(AccountApiService), loginRepo = inject(LoginApiService), errorHandler = inject(ErrorHandlerService)) => {
        const handleAuthError = (error: unknown): void => errorHandler.handleError('AuthStore', error);

        return {
          register: rxMethod<IRegisterParams>(
            pipe(
              distinctUntilChanged(),
              tap(() => patchState(store, { isLoading: true })),
              switchMap((params) =>
                accountRepo.register$(params).pipe(
                  tapResponse({
                    next: () => patchState(store, { isLoading: false }),
                    error: handleAuthError,
                  })
                )
              )
            )
          ),
          login: rxMethod<ILoginParams>(
            pipe(
              distinctUntilChanged(),
              tap(() => patchState(store, { isLoading: true })),
              switchMap((params) =>
                loginRepo.login$(params).pipe(
                  tapResponse({
                    next: (data) => console.log(data),
                    error: handleAuthError,
                    finalize: () => patchState(store, { isLoading: false }),
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
