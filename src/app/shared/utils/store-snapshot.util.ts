import { type TSignalized } from '@shared/types/generics.type';

export function getStoreSnapshot<T>(store: unknown) {
  return store as TSignalized<T>;
}
