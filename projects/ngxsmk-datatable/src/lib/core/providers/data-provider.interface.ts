import { Observable } from 'rxjs';
import { NgxsmkColumn } from '../../interfaces/column.interface';
import { SortState } from '../../interfaces/sorting.interface';
import { Filter } from '../../interfaces/filtering.interface';

/**
 * Data request configuration
 */
export interface DataRequest {
  /** Pagination */
  pagination: {
    page: number;
    pageSize: number;
    cursor?: string;  // For cursor-based pagination
  };
  
  /** Sorting (can be multiple for multi-column sort) */
  sorting?: SortState[];
  
  /** Filtering */
  filtering?: Filter[];
  
  /** Search term (global search) */
  search?: string;
  
  /** Additional parameters */
  params?: Record<string, any>;
}

/**
 * Data response
 */
export interface DataResponse<T> {
  /** Row data */
  data: T[];
  
  /** Total count (for pagination) */
  total: number;
  
  /** Next page cursor (for cursor-based pagination) */
  nextCursor?: string;
  
  /** Previous page cursor */
  prevCursor?: string;
  
  /** Has next page */
  hasNextPage?: boolean;
  
  /** Has previous page */
  hasPrevPage?: boolean;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Base data provider interface
 * Implement this to create custom data sources
 */
export interface DataProvider<T> {
  /**
   * Fetch data from the source
   */
  fetch(request: DataRequest): Observable<DataResponse<T>>;
  
  /**
   * Create a new item (optional)
   */
  create?(item: T): Observable<T>;
  
  /**
   * Update an existing item (optional)
   */
  update?(id: string | number, item: Partial<T>): Observable<T>;
  
  /**
   * Delete an item (optional)
   */
  delete?(id: string | number): Observable<void>;
  
  /**
   * Batch update (optional)
   */
  batchUpdate?(updates: Array<{ id: string | number; data: Partial<T> }>): Observable<T[]>;
  
  /**
   * Batch delete (optional)
   */
  batchDelete?(ids: (string | number)[]): Observable<void>;
}

/**
 * Data provider configuration
 */
export interface DataProviderConfig {
  /** Mode: client-side or server-side */
  mode: 'client' | 'server';
  
  /** Debounce time for search/filter (ms) */
  debounceTime?: number;
  
  /** Enable retry on error */
  retry?: boolean;
  
  /** Max retry attempts */
  maxRetries?: number;
  
  /** Enable caching */
  cache?: boolean;
  
  /** Cache duration (ms) */
  cacheDuration?: number;
}

/**
 * Client-side data provider configuration
 */
export interface ClientDataProviderConfig extends DataProviderConfig {
  mode: 'client';
  
  /** Initial data */
  data: any[];
}

/**
 * Server-side data provider configuration
 */
export interface ServerDataProviderConfig extends DataProviderConfig {
  mode: 'server';
  
  /** API endpoint URL */
  url: string;
  
  /** HTTP headers */
  headers?: Record<string, string>;
  
  /** Request transform function */
  transformRequest?: (request: DataRequest) => any;
  
  /** Response transform function */
  transformResponse?: (response: any) => DataResponse<any>;
}

