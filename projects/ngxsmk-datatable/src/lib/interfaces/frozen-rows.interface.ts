/**
 * Frozen Rows Configuration
 * Pin header and footer rows
 */

/**
 * Frozen rows configuration
 */
export interface FrozenRowsConfig {
  /** Enable frozen rows */
  enabled?: boolean;
  
  /** Freeze header rows */
  freezeHeader?: boolean;
  
  /** Number of header rows to freeze */
  headerRowCount?: number;
  
  /** Freeze footer rows */
  freezeFooter?: boolean;
  
  /** Number of footer rows to freeze */
  footerRowCount?: number;
  
  /** Freeze specific rows */
  freezeRows?: number[];
  
  /** Custom frozen rows */
  customFrozenRows?: FrozenRow[];
  
  /** Z-index for frozen elements */
  zIndex?: number;
  
  /** Shadow on frozen elements */
  showShadow?: boolean;
  
  /** Allow unfreezing */
  allowUnfreeze?: boolean;
}

/**
 * Frozen row definition
 */
export interface FrozenRow {
  /** Row index or ID */
  row: number | string;
  
  /** Position */
  position: 'top' | 'bottom';
  
  /** Sticky */
  sticky?: boolean;
  
  /** Custom style */
  style?: Record<string, string>;
  
  /** CSS classes */
  cssClasses?: string[];
}

/**
 * Frozen columns configuration
 */
export interface FrozenColumnsConfig {
  /** Enable frozen columns */
  enabled?: boolean;
  
  /** Freeze left columns */
  freezeLeft?: number;
  
  /** Freeze right columns */
  freezeRight?: number;
  
  /** Specific columns to freeze */
  freezeColumns?: string[];
  
  /** Allow column reorder with frozen */
  allowReorder?: boolean;
  
  /** Show separator */
  showSeparator?: boolean;
  
  /** Separator color */
  separatorColor?: string;
}

/**
 * Frozen state
 */
export interface FrozenState {
  /** Header frozen */
  headerFrozen: boolean;
  
  /** Footer frozen */
  footerFrozen: boolean;
  
  /** Frozen header rows */
  frozenHeaderRows: number[];
  
  /** Frozen footer rows */
  frozenFooterRows: number[];
  
  /** Frozen left columns */
  frozenLeftColumns: string[];
  
  /** Frozen right columns */
  frozenRightColumns: string[];
}

