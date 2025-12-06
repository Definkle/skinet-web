import { IFilter } from './products.types';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '../../../../shared/constants/default-pagination-values.constant';

export const DEFAULT_FILTER: IFilter = {
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
  brands: [],
  types: [],
  search: '',
  sort: '',
};
