/**
 * Keyboard navigation configuration for Excel-like functionality
 */
export interface KeyboardNavigationConfig {
  /** Enable keyboard navigation */
  enabled?: boolean;
  /** Enable arrow key navigation */
  arrowKeys?: boolean;
  /** Enable Tab/Shift+Tab navigation */
  tabNavigation?: boolean;
  /** Enable Enter to edit cell */
  enterToEdit?: boolean;
  /** Enable Escape to cancel edit */
  escapeToCancel?: boolean;
  /** Enable Home/End keys */
  homeEndKeys?: boolean;
  /** Enable Page Up/Page Down */
  pageKeys?: boolean;
  /** Enable Ctrl+C for copy */
  copyEnabled?: boolean;
  /** Enable Ctrl+V for paste */
  pasteEnabled?: boolean;
  /** Enable Ctrl+Z for undo */
  undoEnabled?: boolean;
  /** Enable Ctrl+Y for redo */
  redoEnabled?: boolean;
  /** Enable Ctrl+A to select all */
  selectAllEnabled?: boolean;
  /** Enable F2 to edit cell */
  f2ToEdit?: boolean;
}

/**
 * Keyboard navigation event
 */
export interface KeyboardNavigationEvent {
  /** Key code */
  key: string;
  /** Original keyboard event */
  event: KeyboardEvent;
  /** Current cell row index */
  rowIndex: number;
  /** Current cell column index */
  columnIndex: number;
  /** Current cell value */
  value: any;
  /** Whether to prevent default behavior */
  preventDefault?: boolean;
}

/**
 * Cell position for navigation
 */
export interface CellPosition {
  /** Row index */
  rowIndex: number;
  /** Column index */
  columnIndex: number;
}

/**
 * Cell selection range
 */
export interface CellSelectionRange {
  /** Start cell position */
  start: CellPosition;
  /** End cell position */
  end: CellPosition;
}

