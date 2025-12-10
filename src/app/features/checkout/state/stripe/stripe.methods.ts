import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { loadStripe, type StripeAddressElementOptions } from '@stripe/stripe-js';
import { EMPTY, from, pipe, switchMap, tap } from 'rxjs';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { environment } from '@env/environment';

import type { User } from '@features/auth/models/user.model';
import { PaymentsApiService } from '@features/checkout/services/payments/payments-api.service';

import { createStoreErrorHandler } from '@shared/utils/store-error.util';
import { getStoreSnapshot } from '@shared/utils/store-snapshot.util';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';

import type { IStripeState } from './stripe.types';

export const stripeMethods = () => {
  return signalStoreFeature(
    withMethods(
      (
        store,
        paymentsApi = inject(PaymentsApiService),
        cartStore = inject(CartStore),
        authStore = inject(AuthStore),
        errorHandler = inject(ErrorHandlerService)
      ) => {
        const snapshot = getStoreSnapshot<IStripeState>(store);
        const handleStripeError = createStoreErrorHandler('StripeStore', errorHandler);

        const initializeStripe = rxMethod<void>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() =>
              from(loadStripe(environment.stripePublicKey)).pipe(
                tapResponse({
                  next: (instance) => {
                    patchState(store, {
                      instance,
                      isInitialized: true,
                      isLoading: false,
                      error: null,
                    });
                    initializeElements(cartStore.id());
                  },
                  error: (error: Error) => {
                    handleStripeError(error);
                    patchState(store, {
                      isLoading: false,
                      error: error.message ?? 'Failed to load Stripe',
                    });
                  },
                })
              )
            )
          )
        );

        const initializeElements = rxMethod<string>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap((cartId) => {
              const stripeInstance = snapshot.instance();
              if (!stripeInstance) {
                const error = new Error('Stripe instance not initialized');
                handleStripeError(error);
                patchState(store, {
                  isLoading: false,
                  error: error.message ?? 'Failed to initialize elements',
                });
                return EMPTY;
              }

              return paymentsApi.createOrUpdatePaymentIntent$(cartId).pipe(
                tapResponse({
                  next: (cart) => {
                    cartStore.updateCartState(cart);

                    const elements = stripeInstance.elements({
                      clientSecret: cart.clientSecret!,
                      appearance: { labels: 'floating' },
                    });

                    patchState(store, {
                      elements,
                      clientSecret: cart.clientSecret,
                      isLoading: false,
                      error: null,
                    });

                    createAddressElement();
                  },
                  error: (error: Error) => {
                    handleStripeError(error);
                    patchState(store, {
                      isLoading: false,
                      error: error.message ?? 'Failed to initialize elements',
                    });
                  },
                })
              );
            })
          )
        );

        const createAddressElement = rxMethod<void>(
          pipe(
            tap(() => {
              const elements = snapshot.elements();
              if (!elements) {
                const error = new Error('Stripe elements not initialized');
                handleStripeError(error);
                patchState(store, { error: error.message ?? 'Stripe elements not initialized' });
                return;
              }

              const addressElement = elements.create('address', buildAddressElementOptions(authStore.user()));

              patchState(store, {
                addressElement,
                error: null,
              });
              mountAddressElement();
            })
          )
        );

        const mountAddressElement = rxMethod<void>(
          pipe(
            tap(() => {
              const addressElement = snapshot.addressElement();
              if (!addressElement) {
                const error = new Error('Stripe address element not initialized');
                handleStripeError(error);
                patchState(store, { error: error.message ?? 'Stripe address element not initialized' });
                return;
              }

              addressElement.on('change', (event) => {
                if (event.complete) {
                  patchState(store, {
                    addressValue: {
                      name: event.value.name,
                      line1: event.value.address.line1,
                      line2: event.value.address.line2,
                      city: event.value.address.city,
                      state: event.value.address.state,
                      postal_code: event.value.address.postal_code,
                      country: event.value.address.country,
                    },
                    isAddressComplete: true,
                  });
                } else {
                  patchState(store, {
                    isAddressComplete: false,
                  });
                }
              });

              addressElement.mount('#addressElement');
            })
          )
        );

        const updatePaymentIntent = rxMethod<string>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap((cartId) =>
              paymentsApi.createOrUpdatePaymentIntent$(cartId).pipe(
                tapResponse({
                  next: (cart) => cartStore.updateCartState(cart),
                  error: handleStripeError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        );

        return {
          initializeStripe,
          initializeElements,
          createAddressElement,
          mountAddressElement,
          updatePaymentIntent,
          resetElements: rxMethod<void>(
            pipe(
              tap(() =>
                patchState(store, {
                  elements: null,
                  addressElement: null,
                  addressValue: null,
                  isAddressComplete: false,
                  clientSecret: null,
                  error: null,
                })
              )
            )
          ),
          resetStore: rxMethod<void>(
            pipe(
              tap(() =>
                patchState(store, {
                  instance: null,
                  elements: null,
                  addressElement: null,
                  addressValue: null,
                  isAddressComplete: false,
                  clientSecret: null,
                  isLoading: false,
                  isInitialized: false,
                  error: null,
                })
              )
            )
          ),

          clearError: rxMethod<void>(pipe(tap(() => patchState(store, { error: null })))),
        };
      }
    )
  );
};

function buildAddressElementOptions(user: User | null) {
  const options: StripeAddressElementOptions = {
    mode: 'shipping',
  };

  let defaultValues: StripeAddressElementOptions['defaultValues'] = {};

  if (user) {
    defaultValues = {
      name: `${user.firstName} ${user.lastName}`,
      address: {
        line1: user.address?.line1,
        line2: user.address?.line2,
        city: user.address?.city,
        state: user.address?.state,
        postal_code: user.address?.postalCode,
        country: user.address?.country ?? '',
      },
    };
    options.defaultValues = defaultValues;
  }

  return options;
}
