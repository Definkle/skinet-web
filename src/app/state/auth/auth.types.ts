import { User } from '@features/auth/models/user.model';

export interface IAuthState {
  user: User | null;
  isLoading: boolean;
  tokenExpirationDate?: Date;
}
