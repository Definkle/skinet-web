import { signalStore, withState } from '@ngrx/signals';

import { productComputed } from './products.computed';
import { DEFAULT_FILTER } from './products.constants';
import { productMethods } from './products.methods';
import { type IProductsState } from './products.types';

const productsInitialState: IProductsState = {
  products: [],
  productsCount: 0,
  brands: [],
  types: [],
  isLoading: false,
  filter: DEFAULT_FILTER,
  activeProduct: null,
};

export const ProductsStore = signalStore({ providedIn: 'root' }, productComputed(withState(productsInitialState)), productMethods());
