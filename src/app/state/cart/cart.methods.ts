import { computed, inject, type Signal } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { CART_ID_STORAGE_KEY } from '@core/constants/storage-keys.constant';
import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';
import { CartApiService } from '@features/cart/services/cart-api/cart-api.service';
import type { IDeliveryMethod } from '@features/checkout/models/delivery-method.models';
import { type IProduct } from '@features/products/models/product.model';
import type { IShoppingCart } from '@models/cart';
import { createStoreErrorHandler } from '@shared/utils/store-error.util';
import { getStoreSnapshot } from '@shared/utils/store-snapshot.util';

import { consolidateCartItems, initializeCartId, mapProductToCartItem } from './cart.helpers';
import { type ICartState, type IUpdateCartQuantityParams } from './cart.types';

export const cartMethods = () => {
  return signalStoreFeature(
    withMethods((store, cartRepo = inject(CartApiService), errorHandler = inject(ErrorHandlerService)) => {
      const snapshot = getStoreSnapshot<ICartState>(store);
      const handleCartError = createStoreErrorHandler('CartStore', errorHandler);

      const getStoreAsPayload: Signal<IShoppingCart> = computed(() => ({
        id: snapshot.id(),
        items: snapshot.items(),
        clientSecret: snapshot.clientSecret(),
        deliveryMethodId: snapshot.deliveryMethodId(),
        paymentIntentId: snapshot.paymentIntentId(),
      }));

      const updateCart = rxMethod<IShoppingCart>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((params) => {
            if (!params.items.length) {
              return cartRepo.deleteCart$(snapshot.id()).pipe(
                tapResponse({
                  next: () => {
                    patchState(store, () => ({
                      id: null,
                      items: [],
                      vouchers: [],
                      deliveryMethod: null,
                    }));
                    localStorage.removeItem(CART_ID_STORAGE_KEY);
                  },
                  error: handleCartError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              );
            }
            return cartRepo.updateCart$(params).pipe(
              tapResponse({
                next: (cart) => patchState(store, cart),
                error: handleCartError,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      );

      const deleteCart = rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((cartId) =>
            cartRepo.deleteCart$(cartId).pipe(
              tapResponse({
                next: () => {
                  patchState(store, () => ({
                    id: null,
                    items: [],
                    deliveryMethod: null,
                    vouchers: [],
                  }));
                  localStorage.removeItem(CART_ID_STORAGE_KEY);
                },
                error: handleCartError,
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      );

      return {
        deleteCart,
        updateCart,
        updateDeliveryMethodState: rxMethod<IDeliveryMethod>(
          pipe(
            tap((deliveryMethod) => {
              patchState(store, { deliveryMethod, deliveryMethodId: deliveryMethod.id });
              updateCart(getStoreAsPayload());
            })
          )
        ),
        addProduct: rxMethod<IProduct>(
          pipe(
            tap((product) => {
              if (!snapshot.id()) {
                const newCartId = initializeCartId();
                patchState(store, { id: newCartId });
              }

              const cartItem = mapProductToCartItem(product);
              const items = snapshot.items();
              const consolidatedItems = consolidateCartItems([...items, cartItem]);
              patchState(store, { items: consolidatedItems });
              updateCart(getStoreAsPayload());
            })
          )
        ),
        removeProduct: rxMethod<number>(
          pipe(
            tap((productId) => {
              const items = snapshot.items();
              const filteredItems = items.filter((item) => item.productId !== productId);
              patchState(store, { items: filteredItems });
              updateCart(getStoreAsPayload());
            })
          )
        ),
        updateProductQuantity: rxMethod<IUpdateCartQuantityParams>(
          pipe(
            tap(({ productId, quantity }) => {
              const items = snapshot.items();

              if (quantity <= 0) {
                const filteredItems = items.filter((item) => item.productId !== productId);
                patchState(store, { items: filteredItems });

                return;
              }

              const updatedItems = items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
              patchState(store, { items: updatedItems });
              updateCart(getStoreAsPayload());
            })
          )
        ),
        initCart: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() =>
              cartRepo.getCart$(snapshot.id()).pipe(
                tapResponse({
                  next: (cart) => patchState(store, cart),
                  error: handleCartError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
            )
          )
        ),
      };
    })
  );
};
