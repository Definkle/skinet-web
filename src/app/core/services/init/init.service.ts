import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first } from 'rxjs';

import { CartStore } from '@state/cart';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private readonly _CartStore = inject(CartStore);

  init$() {
    this._CartStore.initCart();
    return toObservable(this._CartStore.id).pipe(
      filter((id) => !!id),
      first()
    );
  }
}
