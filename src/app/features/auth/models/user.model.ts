import { type AddressDto } from '@api-models';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  address?: AddressDto;
}
