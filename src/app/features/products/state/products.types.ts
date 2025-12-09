import { type Product } from '@features/products/models/product.model';

export interface IBrandTypeFilter {
  brands: string[];
  types: string[];
}

export interface IFilter extends IBrandTypeFilter {
  pageIndex: number;
  pageSize: number;
  search: string;
  sort: string;
}

export interface IProductsState {
  products: Product[];
  productsCount: number;
  brands: string[];
  types: string[];
  isLoading: boolean;
  isLoadingMore: boolean;
  useInfiniteScroll: boolean;
  filter: IFilter;
  activeProduct: Product | null;
}
