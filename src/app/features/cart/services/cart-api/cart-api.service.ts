import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import type { ShoppingCart as ShoppingCartDto } from '@api-models';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { mapCartFromDto, mapCartToDto, type ShoppingCart } from '@features/cart/models/cart.models';

@Injectable({
  providedIn: 'root',
})
export class CartApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'cart';

  getCart$(id: string) {
    return this.http
      .get<ShoppingCartDto>(this._baseUrl, {
        params: { id },
      })
      .pipe(map(mapCartFromDto));
  }

  updateCart$(cart: ShoppingCart) {
    return this.http.post<ShoppingCartDto>(this._baseUrl, mapCartToDto(cart)).pipe(map(mapCartFromDto));
  }

  deleteCart$(id: string) {
    return this.http.delete<object>(this._baseUrl, {
      params: { id },
    });
  }
}
