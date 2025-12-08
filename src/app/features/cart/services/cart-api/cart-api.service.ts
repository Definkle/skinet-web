import { Injectable } from '@angular/core';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { IUpdateCartParams } from './cart-api.params';
import { ICartResponse } from './cart-api.types';

@Injectable({
  providedIn: 'root',
})
export class CartApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'cart';

  getCart$(id: string) {
    return this.http.get<ICartResponse>(this._baseUrl, {
      params: { id },
    });
  }

  updateCart$(cart: IUpdateCartParams) {
    return this.http.post<ICartResponse>(this._baseUrl, cart);
  }

  deleteCart$(id: string) {
    return this.http.delete<object>(this._baseUrl, {
      params: { id },
    });
  }
}
