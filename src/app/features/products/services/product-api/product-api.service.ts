import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { IPaginatedResponseConfig } from '@shared/models/api-response.model';

import { IGetProductsParams } from './product-api.params';
import { IProduct } from '../../models';

@Injectable({ providedIn: 'root' })
export class ProductApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'products';

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

    return this.http.get<IPaginatedResponseConfig<IProduct>>(this._baseUrl, {
      params,
    });
  }

  getProduct$(id: number) {
    return this.http.get<IProduct>(this._baseUrl + `/${id}`);
  }

  getBrands$() {
    return this.http.get<string[]>(this._baseUrl + '/brands').pipe(shareReplay(1));
  }

  getTypes$() {
    return this.http.get<string[]>(this._baseUrl + '/types').pipe(shareReplay(1));
  }
}
