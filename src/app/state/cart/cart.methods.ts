import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { CART_ID_STORAGE_KEY } from '@core/constants/storage-keys.constant';
import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { CartApiService } from '@features/cart/services/cart-api/cart-api.service';
import type { DeliveryMethod } from '@features/checkout/models/delivery-method.models';
import { type Product } from '@features/products/models/product.model';

import type { CartItem, ShoppingCart } from '@models/cart';

import { createStoreErrorHandler } from '@shared/utils/store-error.util';
import { getStoreSnapshot } from '@shared/utils/store-snapshot.util';

import { consolidateCartItems, initializeCartId, mapProductToCartItem } from './cart.helpers';
import { type ICartState, type IUpdateCartQuantityParams } from './cart.types';

export const cartMethods = () => {
  return signalStoreFeature(
    withMethods((store, cartRepo = inject(CartApiService), errorHandler = inject(ErrorHandlerService)) => {
      const snapshot = getStoreSnapshot<ICartState>(store);

      const handleCartError = createStoreErrorHandler('CartStore', errorHandler);

      const updateCartItems = rxMethod<CartItem[]>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((items) => {
            if (!items.length) {
              return cartRepo.deleteCart$(snapshot.id()).pipe(
                tapResponse({
                  next: () => {
                    patchState(store, () => ({
                      id: null,
                      items: [],
                    }));
                    localStorage.removeItem(CART_ID_STORAGE_KEY);
                  },
                  error: handleCartError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              );
            }
            return cartRepo
              .updateCart$({
                id: snapshot.id(),
                clientSecret: snapshot.clientSecret(),
                deliveryMethodId: snapshot.deliveryMethodId(),
                paymentIntentId: snapshot.paymentIntentId(),
                items,
              })
              .pipe(
                tapResponse({
                  next: (cart) => patchState(store, cart),
                  error: handleCartError,
                  finalize: () => patchState(store, { isLoading: false }),
                })
              );
          })
        )
      );

      const updateCart = rxMethod<ShoppingCart>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) => cartRepo.updateCart$(params))
        )
      );

      return {
        updateCartState: rxMethod<ShoppingCart>(pipe(tap((shoppingCart) => patchState(store, { ...shoppingCart })))),
        updateDeliveryMethodState: rxMethod<DeliveryMethod>(pipe(tap((deliveryMethod) => patchState(store, { deliveryMethod })))),
        addProduct: rxMethod<Product>(
          pipe(
            tap((product) => {
              if (!snapshot.id()) {
                const newCartId = initializeCartId();
                patchState(store, { id: newCartId });
              }

              const cartItem = mapProductToCartItem(product);
              const items = snapshot.items();
              const consolidatedItems = consolidateCartItems([...items, cartItem]);

              updateCartItems(consolidatedItems);
            })
          )
        ),
        removeProduct: rxMethod<number>(
          pipe(
            tap((productId) => {
              const items = snapshot.items();
              const filteredItems = items.filter((item) => item.productId !== productId);

              updateCartItems(filteredItems);
            })
          )
        ),
        updateProductQuantity: rxMethod<IUpdateCartQuantityParams>(
          pipe(
            tap(({ productId, quantity }) => {
              if (quantity <= 0) {
                const items = snapshot.items();
                const filteredItems = items.filter((item) => item.productId !== productId);

                updateCartItems(filteredItems);
                return;
              }

              const items = snapshot.items();
              const updatedItems = items.map((item) => (item.productId === productId ? { ...item, quantity } : item));

              updateCartItems(updatedItems);
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
        updateCart,
        updateCartItems,
      };
    })
  );
};
