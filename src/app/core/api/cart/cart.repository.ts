import { Injectable } from '@angular/core';
import { RepositoryHelper } from '../repository.helper';
import {
  IDeleteCartResponse,
  IGetCartResponse,
  IUpdateCartParams,
  IUpdateCartResponse,
} from './cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartRepository extends RepositoryHelper {
  getCart$(id: string) {
    return this._http.get<IGetCartResponse>(this._baseUrl + 'cart', {
      params: { id },
    });
  }

  updateCart$(cart: IUpdateCartParams) {
    return this._http.post<IUpdateCartResponse>(this._baseUrl + 'cart', cart);
  }

  deleteCart$(id: string) {
    return this._http.delete<IDeleteCartResponse>(this._baseUrl + 'cart', {
      params: { id },
    });
  }
}
