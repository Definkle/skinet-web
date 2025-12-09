import { type AddressDto } from '@api-models';

export interface User {
  firstName: string;
  LastName: string;
  email: string;
  address?: AddressDto;
}
