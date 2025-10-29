import { NgxsmkColumn } from './column.interface';

/**
 * Event emitted when column sorting changes
 */
export interface SortEvent {
  /** The column being sorted */
  column: NgxsmkColumn;
  
  /** Previous sort direction */
  prevValue: SortDirection;
  
  /** New sort direction */
  newValue: SortDirection;
  
  /** Array of all active sorts */
  sorts: Sort[];
}

/**
 * Sort configuration for a column
 */
export interface Sort {
  /** Property name to sort by */
  prop: string;
  
  /** Sort direction */
  dir: SortDirection;
}

/**
 * Sort state (for headless core architecture)
 */
export interface SortState {
  /** Field name to sort by */
  field: string;
  
  /** Sort direction */
  direction: 'asc' | 'desc';
  
  /** Sort priority (for multi-column sort) */
  priority?: number;
}

/**
 * Sort direction: ascending or descending
 */
export type SortDirection = 'asc' | 'desc' | '';

/**
 * Configuration for sorting behavior
 */
export interface SortConfig {
  /** Single or multiple column sorting */
  mode: 'single' | 'multiple';
  
  /** Default sort direction */
  direction: SortDirection;
  
  /** Whether to disable clearing the sort */
  disableClear: boolean;
  
  /** Whether to disable returning to unsorted state */
  disableUnsort: boolean;
  
  /** Whether custom sorting logic is used */
  customSorting: boolean;
}

/**
 * Configuration for server-side sorting
 */
export interface ServerSideSorting {
  /** Whether server-side sorting is enabled */
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
