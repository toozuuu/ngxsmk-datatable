import { NgxsmkRow } from './row.interface';
import { NgxsmkColumn } from './column.interface';

/**
 * Context menu configuration
 */
export interface ContextMenuConfig {
  /** Enable context menu */
  enabled?: boolean;
  /** Custom menu items */
  items?: ContextMenuItem[];
  /** Show default menu items */
  showDefaultItems?: boolean;
}

/**
 * Context menu item
 */
export interface ContextMenuItem {
  /** Menu item label */
  label: string;
  /** Menu item icon class */
  icon?: string;
  /** Menu item action */
  action?: (context: ContextMenuContext) => void;
  /** Whether item is disabled */
  disabled?: boolean | ((context: ContextMenuContext) => boolean);
  /** Whether item is visible */
  visible?: boolean | ((context: ContextMenuContext) => boolean);
  /** Submenu items */
  children?: ContextMenuItem[];
  /** Menu item separator */
  separator?: boolean;
  /** Keyboard shortcut */
  shortcut?: string;
}

/**
 * Context menu context
 */
export interface ContextMenuContext {
  /** Row data */
  row: NgxsmkRow;
  /** Column definition */
  column: NgxsmkColumn;
  /** Cell value */
  value: any;
  /** Row index */
  rowIndex: number;
  /** Column index */
  columnIndex: number;
  /** Mouse event */
  event: MouseEvent;
}

