import { type IBasePaginationParams } from '@models/api-response.models';

export interface IGetProductsParams extends IBasePaginationParams {
  types?: string[];
  brands?: string[];
  search?: string;
  sort?: string;
}
