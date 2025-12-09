import { Injectable } from '@angular/core';

import { type AddressDto } from '@api-models';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { type User } from '@features/auth/models/user.model';

import { type IRegisterParams } from './account-api.params';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'account';

  register$(httpParams: IRegisterParams) {
    return this.http.post<{}>(this._baseUrl + '/register', httpParams);
  }

  getUserInfo$() {
    return this.http.get<User>(this._baseUrl + '/user-info');
  }

  logout$() {
    return this.http.post<{}>(this._baseUrl + '/logout', {});
  }

  updateAddress$(address: AddressDto) {
    return this.http.post<{}>(this._baseUrl + '/address', address);
  }
}
