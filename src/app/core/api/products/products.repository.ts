import { Injectable } from '@angular/core';
import { RepositoryHelper } from '../repository.helper';
import { IPaginatedResponseConfig } from '../../interfaces/http-helper.interface';
import { IGetProductsParams, IProduct } from './product.interface';

@Injectable({ providedIn: 'root' })
export class ProductsRepository extends RepositoryHelper {
  getProducts$(httpParams: IGetProductsParams) {
    return this._http.get<IPaginatedResponseConfig<IProduct>>(this._baseUrl + 'products', {
      params: this.buildParams(httpParams),
    });
  }
}
