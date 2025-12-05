import { signalStore, withState } from '@ngrx/signals';
import { IProduct } from '../../../../core/api/products/product.interface';
import { productMethods } from './products.methods';
import { productComputed } from './products.computed';

export interface IBrandTypeFilter {
  brands: string[];
  types: string[];
}

interface IFilter extends IBrandTypeFilter {
  pageIndex: number;
  pageSize: number;
  search: string;
  sort: string;
}

export type TProductsState = {
  products: IProduct[];
  productsCount: number;
  brands: string[];
  types: string[];
  isLoading: boolean;
  filter: IFilter;
};

const productsInitialState: TProductsState = {
  products: [],
  productsCount: 0,
  brands: [],
  types: [],
  isLoading: false,
  filter: { pageIndex: 1, pageSize: 10, brands: [], types: [], search: '', sort: '' },
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  productComputed(withState(productsInitialState)),
  productMethods(),
);
