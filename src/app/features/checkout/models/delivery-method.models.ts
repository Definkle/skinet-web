import type { DeliveryMethod as DeliveryMethodDto } from '@api-models';

import type { TRequired } from '@shared/types/generics.type';

export interface IDeliveryMethod extends TRequired<DeliveryMethodDto> {}

export function mapDeliveryMethodsFromDto(deliveryMethodsDtos: DeliveryMethodDto[]): IDeliveryMethod[] {
  return deliveryMethodsDtos
    .map((dto) => {
      if (!dto.id || !dto.shortName || dto.price === undefined || !dto.description || !dto.deliveryTime) {
        throw new Error(`Invalid cart item: missing required fields. Received: ${JSON.stringify(dto)}`);
      }
      return {
        id: dto.id,
        shortName: dto.shortName,
        deliveryTime: dto.deliveryTime,
        description: dto.description,
        price: dto.price,
      };
    })
    .sort((a, b) => a.price - b.price);
}
