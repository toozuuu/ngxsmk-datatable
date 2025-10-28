import { NgxsmkRow } from './row.interface';

/**
 * Available row selection modes
 * - 'single': Single row selection
 * - 'multi': Multiple row selection
 * - 'multiClick': Multiple row selection with click
 * - 'cell': Individual cell selection
 * - 'checkbox': Checkbox-based multi-selection
 * - 'none': No selection allowed
 */
export type SelectionType = 'single' | 'multi' | 'multiClick' | 'cell' | 'checkbox' | 'none';

/**
 * Event emitted when row selection changes
 */
export interface SelectionEvent {
  /** Array of currently selected rows */
  selected: NgxsmkRow[];
  
  /** The DOM event that triggered the selection */
  event: Event;
}

/**
 * Event emitted when a cell is selected
 */
export interface CellSelectionEvent {
  /** The row containing the cell */
  row: NgxsmkRow;
  
  /** The column identifier */
  column: string;
  
  /** The cell value */
  value: any;
  
  /** The DOM event that triggered the selection */
  event: Event;
}

/**
 * Event emitted when a selection checkbox is clicked
 */
export interface SelectionCheckboxEvent {
  /** The row with the checkbox */
  row: NgxsmkRow;
  
  /** Whether the checkbox is checked */
  checked: boolean;
  
  /** The DOM event that triggered the selection */
  event: Event;
}

/**
 * Event emitted when select all is triggered
 */
export interface SelectAllEvent {
  /** Whether all rows are selected */
  selected: boolean;
  
  /** The DOM event that triggered the action */
  event: Event;
}

/**
 * Model for managing row selection state
 */
export interface SelectionModel {
  /** Set of selected row identifiers */
  selected: Set<string>;
  
  /** Set of deselected row identifiers */
  deselected: Set<string>;
  
  /** Checks if a row is selected */
  isSelected: (row: NgxsmkRow) => boolean;
  
  /** Checks if a row is deselected */
  isDeselected: (row: NgxsmkRow) => boolean;
  
  /** Selects a row */
  select: (row: NgxsmkRow) => void;
  
  /** Deselects a row */
  deselect: (row: NgxsmkRow) => void;
  
  /** Clears all selections */
  clear: () => void;
  
  /** Selects all rows */
  selectAll: () => void;
  
  /** Deselects all rows */
  deselectAll: () => void;
  
  /** Toggles the selection state of a row */
  toggle: (row: NgxsmkRow) => void;
}
