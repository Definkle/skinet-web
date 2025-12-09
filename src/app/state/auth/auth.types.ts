import { type User } from '@features/auth/models/user.model';

export interface IAuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}
