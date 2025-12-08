export interface IPaginatedResponseConfig<T> {
  data: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export interface IBasePaginationParams {
  pageIndex: number;
  pageSize: number;
}
