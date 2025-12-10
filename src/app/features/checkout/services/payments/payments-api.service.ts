import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import type { DeliveryMethod } from '@api-models';

import { RepositoryHelperService } from '@core/services/repository.helper';

import { mapDeliveryMethodsFromDto } from '@features/checkout/models/delivery-method.models';

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

  getDeliveryMethods$() {
    return this.http
      .get(this._baseUrl + '/delivery-methods')
      .pipe(map((deliveryMethodDtos) => mapDeliveryMethodsFromDto(deliveryMethodDtos as DeliveryMethod[])));
  }
}
