export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions: number[];
  showPageSizeOptions: boolean;
  showFirstLastButtons: boolean;
  showRangeLabels: boolean;
  showTotalItems: boolean;
  totalItems: number;
  currentPage: number;
  maxSize: number;
}

export interface PageEvent {
  page: number;
  pageSize: number;
  length: number;
  pageIndex: number;
  previousPageIndex?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ServerSidePagination {
  enabled: boolean;
  url?: string;
  method?: 'GET' | 'POST';
  headers?: { [key: string]: string };
  params?: { [key: string]: any };
  body?: any;
}
