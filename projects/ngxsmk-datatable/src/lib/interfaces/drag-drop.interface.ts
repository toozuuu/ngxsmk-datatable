/**
 * Interfaces for drag-and-drop functionality in the datatable
 */

/**
 * Drag and drop configuration
 */
export interface DragDropConfig {
  /** Enable column reordering */
  enableColumnReorder?: boolean;
  
  /** Enable row reordering */
  enableRowReorder?: boolean;
  
  /** CSS class for drag handle */
  dragHandleClass?: string;
  
  /** Show drag preview */
  showDragPreview?: boolean;
  
  /** Custom drag preview template */
  dragPreviewTemplate?: any;
  
  /** Drag threshold in pixels */
  dragThreshold?: number;
  
  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * Drag start event data
 */
export interface DragStartEvent<T = any> {
  /** Type of item being dragged (column or row) */
  type: 'column' | 'row';
  
  /** Item being dragged */
  item: T;
  
  /** Index of item */
  index: number;
  
  /** Original DOM event */
  event: DragEvent;
  
  /** Starting coordinates */
  startX: number;
  startY: number;
}

/**
 * Drag over event data
 */
export interface DragOverEvent<T = any> {
  /** Type of item */
  type: 'column' | 'row';
  
  /** Source item */
  sourceItem: T;
  
  /** Source index */
  sourceIndex: number;
  
  /** Target item */
  targetItem: T;
  
  /** Target index */
  targetIndex: number;
  
  /** Original DOM event */
  event: DragEvent;
  
  /** Current coordinates */
  currentX: number;
  currentY: number;
}

/**
 * Drop event data
 */
export interface DropEvent<T = any> {
  /** Type of item */
  type: 'column' | 'row';
  
  /** Source item */
  sourceItem: T;
  
  /** Source index */
  sourceIndex: number;
  
  /** Target index */
  targetIndex: number;
  
  /** Original DOM event */
  event: DragEvent;
  
  /** Whether the item moved */
  moved: boolean;
}

/**
 * Drag state for tracking current drag operation
 */
export interface DragState<T = any> {
  /** Whether drag is active */
  isDragging: boolean;
  
  /** Type of drag */
  type: 'column' | 'row' | null;
  
  /** Item being dragged */
  item: T | null;
  
  /** Source index */
  sourceIndex: number;
  
  /** Current target index */
  targetIndex: number;
  
  /** Starting coordinates */
  startX: number;
  startY: number;
  
  /** Current coordinates */
  currentX: number;
  currentY: number;
  
  /** Drag element reference */
  dragElement: HTMLElement | null;
}

/**
 * Row reorder event
 */
export interface RowReorderEvent<T = any> {
  /** Row that was moved */
  row: T;
  
  /** Previous index */
  previousIndex: number;
  
  /** New index */
  newIndex: number;
  
  /** Updated rows array */
  rows: T[];
}

