import { NgxsmkColumn } from './column.interface';

/**
 * Advanced filtering configuration
 */
export interface FilteringConfig {
  /** Enable filtering */
  enabled?: boolean;
  /** Filter mode: 'simple' or 'advanced' */
  mode?: 'simple' | 'advanced';
  /** Show filter row */
  showFilterRow?: boolean;
  /** Enable external filtering (server-side) */
  externalFiltering?: boolean;
  /** Filter debounce time in ms */
  debounceTime?: number;
  /** Case sensitive filtering */
  caseSensitive?: boolean;
}

/**
 * Filter configuration for a column
 */
export interface ColumnFilter {
  /** Column to filter */
  column: NgxsmkColumn;
  /** Filter value */
  value: any;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter type */
  type: FilterType;
}

/**
 * Filter type alias (for headless core architecture)
 */
export type Filter = ColumnFilter;

/**
 * Filter operator
 */
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty';

/**
 * Filter type
 */
export type FilterType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';

/**
 * Filter event
 */
export interface FilterEvent {
  /** Array of active filters */
  filters: ColumnFilter[];
  /** Filtered rows count */
  filteredCount?: number;
}

