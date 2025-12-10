import type { DeliveryMethod } from '@features/checkout/models/delivery-method.models';

export interface ICheckoutState {
  deliveryMethods: DeliveryMethod[];
  selectedDeliveryMethod: DeliveryMethod | null;
  isLoading: boolean;
}
