import { computed, inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first } from 'rxjs';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private readonly _AuthStore = inject(AuthStore);
  private readonly _CartStore = inject(CartStore);

  init$() {
    this._AuthStore.initAuth();
    this._CartStore.initCart();

    const values = computed(() => {
      return [this._CartStore.id(), this._AuthStore.isLoading()];
    });

    return toObservable(values).pipe(
      filter(([id, isLoading]) => !!id && !isLoading),
      first()
    );
  }
}
