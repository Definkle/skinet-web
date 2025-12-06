import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { CartRepository } from '../../api/cart/cart.repository';
import { IUpdateCartParams } from '../../api/cart/cart.interface';
import { IProductInCart, IUpdateCartQuantityParams } from './cart.types';
import {
  CartStoreSnapshot,
  consolidateCartItems,
  getStoreSnapshot,
  initializeCartId,
  mapProductToCartItem,
} from './cart.helpers';
import { CART_ID_STORAGE_KEY } from '../../../shared/constants/storage-keys.constant';
import { ErrorHandler } from '../../services/error-handler/error-handler.service';

type CartMethods = {
  addProduct(product: IProductInCart): void;
  removeProduct(productId: number): void;
  updateProductQuantity(params: IUpdateCartQuantityParams): void;
  initCart: ReturnType<typeof rxMethod<void>>;
  updateCart: ReturnType<typeof rxMethod<IUpdateCartParams>>;
};

export const cartMethods = () => {
  return signalStoreFeature(
    withMethods((store: CartStoreSnapshot, cartRepo = inject(CartRepository), errorHandler = inject(ErrorHandler)): CartMethods => {
      const snapshot = getStoreSnapshot(store);
      const handleCartError = (error: unknown): void => errorHandler.handleError('CartStore', error);

      const updateCart = rxMethod<IUpdateCartParams>(
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
                    }));
                    localStorage.removeItem(CART_ID_STORAGE_KEY);
                  },
                  error: handleCartError,
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
            }

            return cartRepo.updateCart$({ ...params, id: snapshot.id() }).pipe(
              tapResponse({
                next: (cart) => patchState(store, cart),
                error: handleCartError,
                finalize: () => patchState(store, { isLoading: false }),
              }),
            );
          }),
        ),
      );

      return {
        addProduct(product: IProductInCart): void {
          if (!snapshot.id()) {
            const newCartId = initializeCartId();
            patchState(store, { id: newCartId });
          }

          const cartItem = mapProductToCartItem(product);
          const items = snapshot.items();
          const consolidatedItems = consolidateCartItems([...items, cartItem]);

          updateCart({
            id: snapshot.id(),
            items: consolidatedItems,
          });
        },
        removeProduct(productId: number): void {
          const items = snapshot.items();
          const filteredItems = items.filter((item) => item.productId !== productId);

          updateCart({
            id: snapshot.id(),
            items: filteredItems,
          });
        },
        updateProductQuantity({ productId, quantity }: IUpdateCartQuantityParams): void {
          if (quantity <= 0) {
            this.removeProduct(productId);
            return;
          }

          const items = snapshot.items();
          const updatedItems = items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          );
          updateCart({
            id: snapshot.id(),
            items: updatedItems,
          });
        },
        initCart: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(() =>
              cartRepo.getCart$(snapshot.id()).pipe(
                tapResponse({
                  next: (cart) => patchState(store, cart),
                  error: handleCartError,
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              ),
            ),
          ),
        ),
        updateCart,
      };
    }),
  );
};
