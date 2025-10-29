/**
 * Multiple Sheet Support
 * Tab-based multi-sheet datatable
 */

/**
 * Sheets configuration
 */
export interface SheetsConfig {
  /** Enable multiple sheets */
  enabled?: boolean;
  
  /** Sheets */
  sheets: Sheet[];
  
  /** Active sheet ID */
  activeSheetId?: string;
  
  /** Show sheet tabs */
  showTabs?: boolean;
  
  /** Tab position */
  tabPosition?: 'top' | 'bottom';
  
  /** Allow sheet add */
  allowAdd?: boolean;
  
  /** Allow sheet delete */
  allowDelete?: boolean;
  
  /** Allow sheet rename */
  allowRename?: boolean;
  
  /** Allow sheet reorder */
  allowReorder?: boolean;
  
  /** Allow sheet duplicate */
  allowDuplicate?: boolean;
  
  /** Maximum sheets */
  maxSheets?: number;
  
  /** Show sheet count */
  showSheetCount?: boolean;
  
  /** Sheet templates */
  templates?: SheetTemplate[];
}

/**
 * Sheet definition
 */
export interface Sheet {
  /** Sheet ID */
  id: string;
  
  /** Sheet name */
  name: string;
  
  /** Sheet data */
  data: any[];
  
  /** Sheet columns */
  columns?: any[];
  
  /** Sheet configuration */
  config?: any;
  
  /** Sheet color */
  color?: string;
  
  /** Sheet icon */
  icon?: string;
  
  /** Sheet protected */
  protected?: boolean;
  
  /** Sheet visible */
  visible?: boolean;
  
  /** Sheet order */
  order?: number;
  
  /** Created timestamp */
  createdAt?: number;
  
  /** Modified timestamp */
  modifiedAt?: number;
  
  /** Sheet metadata */
  metadata?: Record<string, any>;
}

/**
 * Sheet template
 */
export interface SheetTemplate {
  /** Template ID */
  id: string;
  
  /** Template name */
  name: string;
  
  /** Template description */
  description?: string;
  
  /** Template columns */
  columns: any[];
  
  /** Template configuration */
  config?: any;
  
  /** Sample data */
  sampleData?: any[];
  
  /** Template icon */
  icon?: string;
}

/**
 * Sheet tab
 */
export interface SheetTab {
  /** Sheet ID */
  sheetId: string;
  
  /** Tab label */
  label: string;
  
  /** Tab color */
  color?: string;
  
  /** Tab icon */
  icon?: string;
  
  /** Active */
  active?: boolean;
  
  /** Protected */
  protected?: boolean;
  
  /** Closeable */
  closeable?: boolean;
}

/**
 * Sheet operation types
 */
export type SheetOperationType = 
  | 'add'
  | 'delete'
  | 'rename'
  | 'duplicate'
  | 'reorder'
  | 'protect'
  | 'unprotect'
  | 'hide'
  | 'show';

/**
 * Sheet operation
 */
export interface SheetOperation {
  /** Operation type */
  type: SheetOperationType;
  
  /** Sheet ID */
  sheetId: string;
  
  /** Operation data */
  data?: any;
  
  /** Timestamp */
  timestamp: number;
}

/**
 * Sheet context menu
 */
export interface SheetContextMenu {
  /** Menu items */
  items: SheetMenuItem[];
  
  /** Show on right-click */
  showOnRightClick?: boolean;
}

/**
 * Sheet menu item
 */
export interface SheetMenuItem {
  /** Item label */
  label: string;
  
  /** Item icon */
  icon?: string;
  
  /** Item action */
  action: (sheet: Sheet) => void;
  
  /** Disabled condition */
  disabled?: (sheet: Sheet) => boolean;
  
  /** Hidden condition */
  hidden?: (sheet: Sheet) => boolean;
  
  /** Separator */
  separator?: boolean;
}

/**
 * Sheet state
 */
export interface SheetState {
  /** Active sheet */
  activeSheet: Sheet | null;
  
  /** All sheets */
  sheets: Sheet[];
  
  /** Sheet count */
  count: number;
  
  /** Modified sheets */
  modifiedSheets: string[];
}

/**
 * Cross-sheet reference
 */
export interface CrossSheetReference {
  /** Source sheet ID */
  sourceSheetId: string;
  
  /** Target sheet ID */
  targetSheetId: string;
  
  /** Reference type */
  type: 'formula' | 'lookup' | 'link';
  
  /** Reference expression */
  expression: string;
}

