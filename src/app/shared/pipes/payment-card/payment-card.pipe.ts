import { Pipe, type PipeTransform } from '@angular/core';
import type { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'paymentCard',
})
export class PaymentCardPipe implements PipeTransform {
  transform(value?: ConfirmationToken['payment_method_preview']): unknown {
    if (value?.card) {
      const { brand, last4, exp_month, exp_year } = value.card;
      return `${brand.toUpperCase()} ending in ${last4}, expires ${exp_month}/${exp_year.toString().slice(-2)}`;
    }

    return 'Unknown card';
  }
}
