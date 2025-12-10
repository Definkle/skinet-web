import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import type { DeliveryMethod } from '@features/checkout/models/delivery-method.models';
import { PaymentsApiService } from '@features/checkout/services/payments/payments-api.service';

import { createStoreErrorHandler } from '@shared/utils/store-error.util';

import { CartStore } from '@state/cart';

export const checkoutMethods = () => {
  return signalStoreFeature(
    withMethods(
      (store, cartStore = inject(CartStore), paymentsApi = inject(PaymentsApiService), errorHandler = inject(ErrorHandlerService)) => {
        const handleError = createStoreErrorHandler('CheckoutStore', errorHandler);

        return {
          initializeDeliveryMethods: rxMethod<void>(
            pipe(
              distinctUntilChanged(),
              tap(() => patchState(store, { isLoading: true })),
              switchMap(() =>
                paymentsApi.getDeliveryMethods$().pipe(
                  tapResponse({
                    next: (deliveryMethods) => {
                      const deliveryMethodIdInCart = cartStore.deliveryMethodId();
                      const selectedDeliveryMethod = deliveryMethodIdInCart
                        ? deliveryMethods.find(({ id }) => deliveryMethodIdInCart === id)
                        : null;
                      patchState(store, {
                        deliveryMethods,
                        selectedDeliveryMethod,
                      });
                      if (selectedDeliveryMethod) cartStore.updateDeliveryMethodState(selectedDeliveryMethod);
                    },
                    error: handleError,
                    finalize: () => patchState(store, { isLoading: false }),
                  })
                )
              )
            )
          ),
          selectDeliveryMethod: rxMethod<DeliveryMethod>(
            pipe(
              tap((selectedDeliveryMethod) => {
                patchState(store, { selectedDeliveryMethod });
                cartStore.updateDeliveryMethodState(selectedDeliveryMethod);
              })
            )
          ),
          resetStore: rxMethod<void>(
            pipe(tap(() => patchState(store, { selectedDeliveryMethodId: null, deliveryMethods: [], isLoading: false })))
          ),
        };
      }
    )
  );
};
