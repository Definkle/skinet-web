import { Pipe, type PipeTransform } from '@angular/core';
import type { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'address',
})
export class AddressPipe implements PipeTransform {
  transform(value?: ConfirmationToken['shipping']) {
    if (value?.address && value?.name) {
      const { city, country, line1, line2, postal_code, state } = value.address;
      return `${value.name}, ${line1}, ${line2 ? ', ' + line2 : ''}, ${city}, ${state}, ${postal_code}, ${country}`;
    }
    return 'Unknown address';
  }
}
