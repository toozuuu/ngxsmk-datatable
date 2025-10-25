import { NgxsmkColumn } from './column.interface';

export interface SortEvent {
  column: NgxsmkColumn;
  prevValue: SortDirection;
  newValue: SortDirection;
  sorts: Sort[];
}

export interface Sort {
  prop: string;
  dir: SortDirection;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  mode: 'single' | 'multiple';
  direction: SortDirection;
  disableClear: boolean;
  disableUnsort: boolean;
  customSorting: boolean;
}

export interface ServerSideSorting {
  enabled: boolean;
  url?: string;
  method?: 'GET' | 'POST';
  headers?: { [key: string]: string };
  params?: { [key: string]: any };
  body?: any;
}
