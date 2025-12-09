import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@core/constants/default-pagination-values.constant';

import { type IFilter } from './products.types';

export const DEFAULT_FILTER: IFilter = {
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
  brands: [],
  types: [],
  search: '',
  sort: '',
};
