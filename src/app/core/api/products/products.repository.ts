import { Injectable } from '@angular/core';
import { RepositoryHelper } from '../repository.helper';
import { IPaginatedResponseConfig } from '../../../shared/interfaces/http-helper.interface';
import { IGetProductsParams, IProduct } from './product.interface';
import { HttpParams } from '@angular/common/http';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsRepository extends RepositoryHelper {
  getProducts$(httpParams: IGetProductsParams) {
    let params = new HttpParams().appendAll({
      pageIndex: httpParams.pageIndex,
      pageSize: httpParams.pageSize,
      sort: httpParams?.sort ?? '',
      search: httpParams?.search ?? '',
    });

    if (httpParams.types?.length) {
      params = params.append('types', httpParams.types.join(','));
    }
    if (httpParams.brands?.length) {
      params = params.append('brands', httpParams.brands.join(','));
    }

    return this._http.get<IPaginatedResponseConfig<IProduct>>(this._baseUrl + 'products', {
      params,
    });
  }

  getProduct$(id: number) {
    return this._http.get<IProduct>(this._baseUrl + `products/${id}`);
  }

  getBrands$() {
    return this._http.get<string[]>(this._baseUrl + 'products/brands').pipe(shareReplay(1));
  }

  getTypes$() {
    return this._http.get<string[]>(this._baseUrl + 'products/types').pipe(shareReplay(1));
  }
}
