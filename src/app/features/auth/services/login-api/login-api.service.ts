import { Injectable } from '@angular/core';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { ILoginParams } from './login-api.params';
import { ILoginResponse } from './login-api.types';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'login';

  login$(httpParams: ILoginParams) {
    return this.http.post<ILoginResponse>(this._baseUrl, httpParams);
  }
}
