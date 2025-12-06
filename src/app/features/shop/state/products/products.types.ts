import { IProduct } from '../../../../core/api/products/product.interface';

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

export type TProductsState = {
  products: IProduct[];
  productsCount: number;
  brands: string[];
  types: string[];
  isLoading: boolean;
  filter: IFilter;
};
