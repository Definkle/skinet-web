import { type AddressDto } from '@api-models';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  address?: AddressDto;
}
