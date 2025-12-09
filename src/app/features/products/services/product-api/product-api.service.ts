import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import type { Product as ProductDto } from '@api-models';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { mapProductFromDto, type Product } from '@features/products/models/product.model';

import { type IPaginatedResponseConfig } from '@models/api-response.models';

import { type IGetProductsParams } from './product-api.params';

@Injectable({ providedIn: 'root' })
export class ProductApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'products';

  private _productCache = new Map<string, Observable<IPaginatedResponseConfig<Product>>>();

  getProducts$(httpParams: IGetProductsParams) {
    const cacheKey = JSON.stringify(httpParams);

    if (!this._productCache.has(cacheKey)) {
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

      const request$ = this.http.get<IPaginatedResponseConfig<ProductDto>>(this._baseUrl, { params }).pipe(
        map((response) => ({ ...response, data: response.data.map(mapProductFromDto) })),
        shareReplay({ bufferSize: 1, refCount: true })
      );

      this._productCache.set(cacheKey, request$);
    }

    return this._productCache.get(cacheKey)!;
  }

  getProduct$(id: number) {
    return this.http.get<ProductDto>(this._baseUrl + `/${id}`).pipe(map(mapProductFromDto));
  }

  getBrands$() {
    return this.http.get<string[]>(this._baseUrl + '/brands').pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getTypes$() {
    return this.http.get<string[]>(this._baseUrl + '/types').pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}
