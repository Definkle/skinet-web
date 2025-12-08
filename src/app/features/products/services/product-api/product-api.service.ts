import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';

import type { Product as ProductDto } from '@api-models';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { mapProductFromDto } from '@features/products/models/product.model';

import { IPaginatedResponseConfig } from '@models/api-response.models';

import { IGetProductsParams } from './product-api.params';

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

    return this.http
      .get<IPaginatedResponseConfig<ProductDto>>(this._baseUrl, {
        params,
      })
      .pipe(map((response) => ({ ...response, data: response.data.map(mapProductFromDto) })));
  }

  getProduct$(id: number) {
    return this.http.get<ProductDto>(this._baseUrl + `/${id}`).pipe(map(mapProductFromDto));
  }

  getBrands$() {
    return this.http.get<string[]>(this._baseUrl + '/brands').pipe(shareReplay(1));
  }

  getTypes$() {
    return this.http.get<string[]>(this._baseUrl + '/types').pipe(shareReplay(1));
  }
}
