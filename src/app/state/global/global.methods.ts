import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { delay, forkJoin, of, pipe, switchMap, tap } from 'rxjs';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';

import { IGlobalState } from './global.types';

export const globalMethods = () => {
  return signalStoreFeature(
    withMethods((store, authStore = inject(AuthStore), cartStore = inject(CartStore), errorHandler = inject(ErrorHandlerService)) => {
      const handleGlobalError = (error: unknown): void => errorHandler.handleError('GlobalStore', error);

      return {
        initApp: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() =>
              forkJoin([of(authStore.initAuth()), of(cartStore.initCart())]).pipe(
                delay(500),
                tapResponse({
                  next: () => {
                    const splash = document.getElementById('initial-splash');
                    if (splash) {
                      splash.remove();
                    }
                  },
                  error: handleGlobalError,
                  finalize: () => patchState(store, { isLoading: false, isInitialized: true }),
                })
              )
            )
          )
        ),
        incrementOngoingRequestsCount(): void {
          patchState(store, (state: IGlobalState) => ({
            ongoingRequestsCount: state.ongoingRequestsCount + 1,
            isLoading: true,
          }));
        },
        decrementOngoingRequestsCount(): void {
          patchState(store, (state: IGlobalState) => {
            const updatedOngoingRequestsCount = state.ongoingRequestsCount - 1;
            if (updatedOngoingRequestsCount <= 0) {
              return { ongoingRequestsCount: 0, isLoading: false };
            }
            return { ongoingRequestsCount: updatedOngoingRequestsCount };
          });
        },
      };
    })
  );
};
