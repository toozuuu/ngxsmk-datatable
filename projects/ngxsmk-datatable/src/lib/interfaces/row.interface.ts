import { NgxsmkColumn } from './column.interface';

/**
 * Base interface for datatable rows with internal metadata properties.
 * Use generics to type your row data: NgxsmkRow<YourDataType>
 * 
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * 
 * const rows: NgxsmkRow<User>[] = [
 *   { id: 1, name: 'John', email: 'john@example.com' }
 * ];
 */
export interface NgxsmkRow<T = any> extends Partial<NgxsmkRowMetadata> {
  // Spread the generic type to allow strongly typed row data
  [K: string]: any;
}

/**
 * Internal metadata properties used by the datatable for managing row state.
 * These properties are prefixed with $$ to avoid conflicts with user data.
 */
export interface NgxsmkRowMetadata {
  /** Row index in the current view */
  $$index?: number;
  
  /** Whether the row detail is expanded */
  $$expanded?: boolean;
  
  /** Whether the row is selected */
  $$selected?: boolean;
  
  /** Whether the row is disabled for selection */
  $$disabled?: boolean;
  
  /** Custom height for this row in pixels */
  $$height?: number;
  
  /** Whether the row is frozen in place during scroll */
  $$frozen?: boolean;
  
  /** Tree node status for hierarchical data */
  $$treeStatus?: 'collapsed' | 'expanded' | 'loading' | 'disabled';
  
  /** Tree level depth (0 for root nodes) */
  $$treeLevel?: number;
  
  /** Reference to parent row in tree */
  $$treeParent?: NgxsmkRow;
  
  /** Child rows in tree */
  $$treeChildren?: NgxsmkRow[];
}

/**
 * Configuration for expandable row detail views
 */
export interface RowDetailView {
  /** Template to use for the row detail */
  template: any;
  
  /** Height of the row detail in pixels */
  rowHeight?: number;
  
  /** Whether clicking the row toggles the detail */
  toggleOnClick?: boolean;
  
  /** Whether all rows start expanded */
  expandOnInit?: boolean;
  
  /** Whether row details remain visible during scroll */
  frozen?: boolean;
}

/**
 * Interface for tree-structured rows
 */
export interface TreeRow {
  /** Tree level depth (0 for root nodes) */
  $$treeLevel: number;
  
  /** Current status of the tree node */
  $$treeStatus: 'collapsed' | 'expanded' | 'loading' | 'disabled';
  
  /** Reference to parent node */
  $$treeParent?: TreeRow;
  
  /** Child nodes */
  $$treeChildren?: TreeRow[];
}

/**
 * Event emitted when a row is activated (clicked, double-clicked, etc.)
 * @template T - The type of row data
 */
export interface RowActivateEvent<T = any> {
  /** Type of activation */
  type: 'click' | 'dblclick' | 'keydown';
  
  /** The DOM event */
  event: Event;
  
  /** The activated row */
  row: NgxsmkRow<T>;
  
  /** The column that was activated */
  column: NgxsmkColumn<T>;
  
  /** The cell value */
  value: any;
  
  /** The cell DOM element */
  cellElement: HTMLElement;
}

/**
 * Event emitted for row context menu actions
 * @template T - The type of row data
 */
export interface RowContextEvent<T = any> {
  /** Type of context action */
  type: 'click' | 'dblclick' | 'keydown';
  
  /** The DOM event */
  event: Event;
  
  /** The row */
  row: NgxsmkRow<T>;
  
  /** The column */
  column: NgxsmkColumn<T>;
  
  /** The cell value */
  value: any;
  
  /** The cell DOM element */
  cellElement: HTMLElement;
}
