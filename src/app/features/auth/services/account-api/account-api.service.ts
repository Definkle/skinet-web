import { Injectable } from '@angular/core';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { IRegisterParams } from './account-api.params';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'account';

  register$(httpParams: IRegisterParams) {
    return this.http.post<{}>(this._baseUrl + '/register', httpParams);
  }
}
