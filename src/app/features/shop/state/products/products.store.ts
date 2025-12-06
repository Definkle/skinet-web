import { signalStore, withState } from '@ngrx/signals';
import { productMethods } from './products.methods';
import { productComputed } from './products.computed';
import { TProductsState } from './products.types';
import { DEFAULT_FILTER } from './products.constants';

const productsInitialState: TProductsState = {
  products: [],
  productsCount: 0,
  brands: [],
  types: [],
  isLoading: false,
  filter: DEFAULT_FILTER,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  productComputed(withState(productsInitialState)),
  productMethods(),
);
