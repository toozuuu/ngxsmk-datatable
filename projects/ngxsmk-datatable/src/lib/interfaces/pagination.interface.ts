/**
 * Configuration for pagination behavior and display
 */
export interface PaginationConfig {
  /** Number of items per page */
  pageSize: number;
  
  /** Available page size options for the user */
  pageSizeOptions: number[];
  
  /** Whether to show the page size selector */
  showPageSizeOptions: boolean;
  
  /** Whether to show first/last page buttons */
  showFirstLastButtons: boolean;
  
  /** Whether to show range labels (e.g., "1-10 of 100") */
  showRangeLabels: boolean;
  
  /** Whether to show the total items count */
  showTotalItems: boolean;
  
  /** Total number of items across all pages */
  totalItems: number;
  
  /** Current page number (1-based) */
  currentPage: number;
  
  /** Maximum number of page buttons to display */
  maxSize: number;
}

/**
 * Event emitted when pagination changes
 */
export interface PageEvent {
  /** Current page number (1-based) */
  page: number;
  
  /** Number of items per page */
  pageSize: number;
  
  /** Total number of items */
  length: number;
  
  /** Current page index (0-based) */
  pageIndex: number;
  
  /** Previous page index (0-based) */
  previousPageIndex?: number;
}

/**
 * Information about the current pagination state
 */
export interface PaginationInfo {
  /** Current page number (1-based) */
  page: number;
  
  /** Number of items per page */
  pageSize: number;
  
  /** Total number of items */
  totalItems: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Index of first item on current page */
  startIndex: number;
  
  /** Index of last item on current page */
  endIndex: number;
  
  /** Whether there is a next page available */
  hasNextPage: boolean;
  
  /** Whether there is a previous page available */
  hasPreviousPage: boolean;
}

/**
 * Configuration for server-side pagination
 */
export interface ServerSidePagination {
  /** Whether server-side pagination is enabled */
  enabled: boolean;
  
  /** API endpoint URL */
  url?: string;
  
  /** HTTP method to use */
  method?: 'GET' | 'POST';
  
  /** HTTP headers to send with the request */
  headers?: { [key: string]: string };
  
  /** Query parameters to send with the request */
  params?: { [key: string]: any };
  
  /** Request body for POST requests */
  body?: any;
}
