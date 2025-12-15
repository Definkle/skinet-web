import type { AddressDto } from '@api-models';

import type { IStripeAddress } from '@features/checkout/state/checkout';

export function mapStripeAddressToAddressDto(stripeAddress: IStripeAddress): AddressDto {
  return {
    line1: stripeAddress.line1,
    line2: stripeAddress.line2 ?? '',
    city: stripeAddress.city,
    state: stripeAddress.state,
    country: stripeAddress.country,
    postalCode: stripeAddress.postal_code,
  };
}
