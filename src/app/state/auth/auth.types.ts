import { IUser } from '@features/auth/models/user.model';

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  tokenExpirationDate?: Date;
}
