import { IBasePaginationParams } from '../../interfaces/http-helper.interface';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
}

export interface IGetProductsParams extends IBasePaginationParams {
  types?: string[];
  search?: string;
}
