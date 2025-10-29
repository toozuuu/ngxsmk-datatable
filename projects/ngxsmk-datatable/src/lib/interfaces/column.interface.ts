import { TemplateRef } from '@angular/core';
import type { NgxsmkRow } from './row.interface';

/**
 * Template context for cell templates
 * @template T - The type of the row data
 * @template V - The type of the cell value (defaults to any)
 * 
 * Note: The row is typed as NgxsmkRow<T> which includes both your data properties
 * and internal metadata ($$expanded, $$selected, etc.)
 */
export interface NgxsmkCellTemplateContext<T = any, V = any> {
  /** The row data (implicit context, can be used with let-row) */
  $implicit: NgxsmkRow<T>;
  /** The row data */
  row: NgxsmkRow<T>;
  /** The column definition */
  column: NgxsmkColumn<T>;
  /** The cell value */
  value: V;
  /** The row index */
  rowIndex: number;
}

/**
 * Template context for header templates
 * @template T - The type of the row data
 */
export interface NgxsmkHeaderTemplateContext<T = any> {
  /** The column definition */
  $implicit: NgxsmkColumn<T>;
  /** The column definition */
  column: NgxsmkColumn<T>;
}

/**
 * Template context for row detail templates
 * @template T - The type of the row data
 * 
 * Note: The row is typed as NgxsmkRow<T> which includes both your data properties
 * and internal metadata ($$expanded, $$selected, etc.)
 */
export interface NgxsmkRowDetailTemplateContext<T = any> {
  /** The row data (implicit context) */
  $implicit: NgxsmkRow<T>;
  /** The row data */
  row: NgxsmkRow<T>;
  /** The row index */
  rowIndex: number;
}

/**
 * Column configuration with strongly-typed templates
 * @template T - The type of the row data (for type-safe templates)
 */
export interface NgxsmkColumn<T = any> {
  id: string;
  name: string;
  prop?: string;
  sortable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  frozen?: 'left' | 'right' | false;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  flexGrow?: number;
  cellClass?: string | ((row: NgxsmkRow<T>, column: NgxsmkColumn<T>, value: any, rowIndex: number) => string);
  headerClass?: string;
  sortProp?: string;
  comparator?: (propA: any, propB: any) => number;
  pipe?: any;
  pipeArgs?: any[];
  checkboxable?: boolean;
  headerCheckboxable?: boolean;
  canAutoResize?: boolean;
  resizeable?: boolean;
  frozenLeft?: boolean;
  frozenRight?: boolean;
  isTreeColumn?: boolean;
  treeLevelIndent?: number;
  summaryFunc?: (cells: any[]) => any;
  summaryTemplate?: TemplateRef<NgxsmkCellTemplateContext<T>>;
  /** Strongly-typed cell template */
  cellTemplate?: TemplateRef<NgxsmkCellTemplateContext<T>>;
  /** Strongly-typed header template */
  headerTemplate?: TemplateRef<NgxsmkHeaderTemplateContext<T>>;
  /** Strongly-typed footer template */
  footerTemplate?: TemplateRef<NgxsmkCellTemplateContext<T>>;
  /** Enable multi-line text wrapping for this column */
  multiLine?: boolean;
  /** Enable filtering for this column */
  filterable?: boolean;
  /** Filter type for advanced filtering */
  filterType?: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  /** Filter options for select/multiselect filters */
  filterOptions?: any[];
  /** Enable column grouping in header */
  group?: string;
  /** Enable cell merging for this column */
  mergeable?: boolean;
  /** Custom merge function for cell merging */
  mergeFunction?: (currentRow: NgxsmkRow<T>, previousRow: NgxsmkRow<T>) => boolean;
  /** Card view role (title, subtitle, description, image, badge, meta) */
  cardRole?: 'title' | 'subtitle' | 'description' | 'image' | 'badge' | 'meta' | 'hidden';
  /** Card view priority (1-10, higher = more prominent) */
  cardPriority?: number;
  /** Hide this column in card view */
  hideInCardView?: boolean;
  /** Text alignment for cell content: 'left' | 'center' | 'right' (default: 'center') */
  align?: 'left' | 'center' | 'right';
}

export interface ColumnWidth {
  column: NgxsmkColumn;
  width: number;
  minWidth: number;
  maxWidth: number;
}

export interface ColumnResizeEvent {
  column: NgxsmkColumn;
  newWidth: number;
  oldWidth: number;
}

export interface ColumnReorderEvent {
  column: NgxsmkColumn;
  newIndex: number;
  oldIndex: number;
}

export type ColumnMode = 'standard' | 'flex' | 'force';
