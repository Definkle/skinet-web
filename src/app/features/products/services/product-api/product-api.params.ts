import { IBasePaginationParams } from '@shared/models/api-response.model';

export interface IGetProductsParams extends IBasePaginationParams {
  types?: string[];
  brands?: string[];
  search?: string;
  sort?: string;
}
