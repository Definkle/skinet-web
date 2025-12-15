import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { loadStripe, type ConfirmationToken, type StripeAddressElementOptions } from '@stripe/stripe-js';
import { distinctUntilChanged, EMPTY, filter, from, pipe, switchMap, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { environment } from '@env/environment';

import type { IUser } from '@features/auth/models/user.model';
import type { IDeliveryMethod } from '@features/checkout/models/delivery-method.models';
import { PaymentsApiService } from '@features/checkout/services/payments/payments-api.service';

import { createStoreErrorHandler } from '@shared/utils/store-error.util';
import { getStoreSnapshot } from '@shared/utils/store-snapshot.util';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';

import type { ICheckoutState } from './checkout.types';

export const checkoutMethods = () => {
  return signalStoreFeature(
    withMethods(
      (
        store,
        cartStore = inject(CartStore),
        authStore = inject(AuthStore),
        paymentsApi = inject(PaymentsApiService),
        errorHandler = inject(ErrorHandlerService),
        router = inject(Router)
      ) => {
        const snapshot = getStoreSnapshot<ICheckoutState>(store);
        const handleError = createStoreErrorHandler('CheckoutStore', errorHandler);

        const initializeDeliveryMethods = rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => patchState(store, { deliveryLoading: true })),
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
                  finalize: () => patchState(store, { deliveryLoading: false }),
                })
              )
            )
          )
        );

        const selectDeliveryMethod = rxMethod<IDeliveryMethod>(
          pipe(
            tap((selectedDeliveryMethod) => {
              patchState(store, { selectedDeliveryMethod });
              cartStore.updateDeliveryMethodState(selectedDeliveryMethod);
            })
          )
        );

        const initializeStripe = rxMethod<void>(
          pipe(
            filter(() => !snapshot.stripeInitialized()),
            tap(() => patchState(store, { stripeLoading: true })),
            switchMap(() =>
              from(loadStripe(environment.stripePublicKey)).pipe(
                tapResponse({
                  next: (instance) => {
                    patchState(store, {
                      instance,
                      stripeInitialized: true,
                      stripeLoading: false,
                      error: null,
                    });
                    initializeElements(cartStore.id());
                  },
                  error: (error: Error) => {
                    handleError(error);
                    patchState(store, {
                      stripeLoading: false,
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
            tap(() => patchState(store, { stripeLoading: true })),
            switchMap((cartId) => {
              const stripeInstance = snapshot.instance();
              if (!stripeInstance) {
                const error = new Error('Stripe instance not initialized');
                handleError(error);
                patchState(store, {
                  stripeLoading: false,
                  error: error.message ?? 'Failed to initialize elements',
                });
                return EMPTY;
              }

              return paymentsApi.createOrUpdatePaymentIntent$(cartId).pipe(
                tapResponse({
                  next: (cart) => {
                    cartStore.updateCart(cart);

                    const elements = stripeInstance.elements({
                      clientSecret: cart.clientSecret!,
                      appearance: { labels: 'floating' },
                    });

                    patchState(store, {
                      elements,
                      clientSecret: cart.clientSecret,
                      stripeLoading: false,
                      error: null,
                    });

                    initializeAddressElement();
                  },
                  error: (error: Error) => {
                    handleError(error);
                    patchState(store, {
                      stripeLoading: false,
                      error: error.message ?? 'Failed to initialize elements',
                    });
                  },
                })
              );
            })
          )
        );

        const initializeAddressElement = rxMethod<void>(
          pipe(
            tap(() => {
              const elements = snapshot.elements();
              if (!elements) {
                const error = new Error('Stripe elements not initialized');
                handleError(error);
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
                handleError(error);
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
                    isAddressComplete: event.complete,
                  });
                } else {
                  patchState(store, {
                    isAddressComplete: event.complete,
                  });
                }
              });

              addressElement.mount('#addressElement');
            })
          )
        );

        const initializePaymentElement = rxMethod<void>(
          pipe(
            tap(() => {
              if (snapshot.paymentElement()) {
                return;
              }

              const elements = snapshot.elements();
              if (!elements) {
                const error = new Error('Stripe elements not initialized');
                handleError(error);
                patchState(store, { error: error.message ?? 'Stripe elements not initialized' });
                return;
              }

              const paymentElement = elements.create('payment');

              patchState(store, {
                paymentElement,
                error: null,
              });
            })
          )
        );

        const mountPaymentElement = rxMethod<void>(
          pipe(
            tap(() => {
              const paymentElement = snapshot.paymentElement();
              if (!paymentElement) {
                const error = new Error('Stripe payment element not initialized');
                handleError(error);
                patchState(store, { error: error.message ?? 'Stripe payment element not initialized' });
                return;
              }

              paymentElement.on('change', (event) => {
                if (event.complete) {
                  patchState(store, {
                    isPaymentComplete: event.complete,
                  });
                } else {
                  patchState(store, {
                    isPaymentComplete: event.complete,
                  });
                }
              });

              paymentElement.mount('#paymentElement');
            })
          )
        );

        const createConfirmationToken = rxMethod<void>(
          pipe(
            tap(() => patchState(store, { stripeLoading: true })),
            switchMap(() => {
              const { elements, stripeInstance } = getInstances();

              if (!stripeInstance || !elements) {
                return EMPTY;
              }

              const result = fromPromise(elements.submit());
              return result.pipe(
                switchMap(() =>
                  fromPromise(stripeInstance?.createConfirmationToken({ elements: snapshot.elements()! })).pipe(
                    tapResponse({
                      next: ({ confirmationToken }) => patchState(store, { confirmationToken }),
                      error: handleError,
                      finalize: () => patchState(store, { stripeLoading: false }),
                    })
                  )
                )
              );
            })
          )
        );

        const confirmPayment = rxMethod<ConfirmationToken>(
          pipe(
            tap(() => patchState(store, { stripeLoading: true })),
            switchMap((confirmationToken) => {
              const { elements, stripeInstance } = getInstances();
              const clientSecret = snapshot.clientSecret();

              if (!stripeInstance || !elements) {
                return EMPTY;
              }

              if (!clientSecret) {
                const error = new Error('Client secret not found');
                handleError(error);
                patchState(store, {
                  stripeLoading: false,
                  error: error.message ?? 'Failed to create confirmation token',
                });
              }

              return fromPromise(
                stripeInstance.confirmPayment({
                  clientSecret: clientSecret!,
                  confirmParams: {
                    confirmation_token: confirmationToken.id,
                  },
                  redirect: 'if_required',
                })
              ).pipe(
                tapResponse({
                  next: (value) => {
                    if (value.error) {
                      handleError(value.error);
                      patchState(store, {
                        stripeLoading: false,
                        error: value.error.message ?? 'Failed to confirm payment',
                      });
                      createConfirmationToken();
                      return;
                    }
                    patchState(store, { stripeLoading: true, selectDeliveryMethod: null });
                    cartStore.deleteCart(cartStore.id());
                    void router.navigate(['/checkout/success']);
                  },
                  error: handleError,
                  finalize: () => patchState(store, { stripeLoading: false, selectDeliveryMethod: null }),
                })
              );
            })
          )
        );

        const updatePaymentIntent = rxMethod<string>(
          pipe(
            tap(() => patchState(store, { stripeLoading: true })),
            switchMap((cartId) =>
              paymentsApi.createOrUpdatePaymentIntent$(cartId).pipe(
                tapResponse({
                  next: (cart) => cartStore.updateCart(cart),
                  error: handleError,
                  finalize: () => patchState(store, { stripeLoading: false }),
                })
              )
            )
          )
        );

        const resetElements = rxMethod<void>(
          pipe(
            tap(() =>
              patchState(store, {
                elements: null,
                addressElement: null,
                addressValue: null,
                paymentElement: null,
                isAddressComplete: false,
                clientSecret: null,
                error: null,
              })
            )
          )
        );

        const resetStore = rxMethod<void>(
          pipe(
            tap(() =>
              patchState(store, {
                instance: null,
                elements: null,
                addressElement: null,
                addressValue: null,
                paymentElement: null,
                isAddressComplete: false,
                isPaymentComplete: false,
                clientSecret: null,
                stripeLoading: false,
                stripeInitialized: false,

                error: null,
              })
            )
          )
        );

        const clearError = rxMethod<void>(pipe(tap(() => patchState(store, { error: null }))));

        const getInstances = () => {
          const stripeInstance = snapshot.instance();
          const elements = snapshot.elements();

          if (!stripeInstance || !elements) {
            const error = new Error('Stripe elements not initialized');
            handleError(error);
            patchState(store, {
              stripeLoading: false,
              error: error.message ?? 'Failed to create confirmation token',
            });
          }

          return { stripeInstance, elements };
        };

        return {
          initializeDeliveryMethods,
          selectDeliveryMethod,

          initializeStripe,
          initializeElements,
          createConfirmationToken,

          initializeAddressElement,
          mountAddressElement,

          initializePaymentElement,
          mountPaymentElement,

          updatePaymentIntent,
          confirmPayment,

          resetElements,
          resetStore,
          clearError,
        };
      }
    )
  );
};

function buildAddressElementOptions(user: IUser | null) {
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
