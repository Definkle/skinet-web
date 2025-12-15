import { type IUser } from '@features/auth/models/user.model';

export interface IAuthState {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}
