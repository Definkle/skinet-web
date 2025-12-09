import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { mapCartFromDto } from '@models/cart';

@Injectable({
  providedIn: 'root',
})
export class PaymentsApiService extends RepositoryHelperService {
  private readonly _baseUrl = this.baseUrl + 'payments';

  createOrUpdatePaymentIntent$(cartId: string) {
    return this.http
      .post(
        this._baseUrl,
        {},
        {
          params: { cartId },
        }
      )
      .pipe(map(mapCartFromDto));
  }
}
