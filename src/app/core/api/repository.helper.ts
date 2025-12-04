import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class RepositoryHelper {
  protected readonly _http = inject(HttpClient);
  protected readonly _baseUrl = 'https://localhost:5000/api/';

  buildParams<T>(httpParams: T): {} {
    if (!httpParams) return {};

    return Object.keys(httpParams)?.reduce((params, key) => {
      const param = httpParams[key as keyof T];
      const isParamValid = param !== undefined && param !== null;
      if (isParamValid) {
        return {
          ...params,
          [key]: Array.isArray(param) ? param?.join(',') : param,
        };
      }
      return params;
    }, {});
  }
}
