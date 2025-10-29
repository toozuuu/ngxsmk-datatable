import { NgxsmkRow } from './row.interface';
import { NgxsmkColumn } from './column.interface';

/**
 * Row grouping configuration
 */
export interface GroupingConfig {
  /** Enable row grouping */
  enabled?: boolean;
  /** Column to group by */
  groupBy?: string | string[];
  /** Group row height */
  groupRowHeight?: number;
  /** Enable group collapsing */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Show group aggregation */
  showAggregation?: boolean;
  /** Aggregation functions */
  aggregationFunctions?: GroupAggregationFunction[];
}

/**
 * Group aggregation function
 */
export interface GroupAggregationFunction {
  /** Column to aggregate */
  column: NgxsmkColumn;
  /** Aggregation type */
  type: AggregationType;
  /** Custom aggregation function */
  customFunction?: (values: any[]) => any;
  /** Label for aggregation */
  label?: string;
}

/**
 * Aggregation type
 */
export type AggregationType =
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'count'
  | 'custom';

/**
 * Group row data
 */
export interface GroupRow extends NgxsmkRow {
  /** Group level */
  $$groupLevel: number;
  /** Group key */
  $$groupKey: string;
  /** Group value */
  $$groupValue: any;
  /** Child rows */
  $$children: NgxsmkRow[];
  /** Group collapsed state */
  $$collapsed?: boolean;
  /** Aggregation results */
  $$aggregation?: { [key: string]: any };
}

/**
 * Column grouping in header
 */
export interface ColumnGroup {
  /** Group name */
  name: string;
  /** Group columns */
  columns: string[];
  /** Group header class */
  headerClass?: string;
}

/**
 * Enhanced group configuration
 */
export interface GroupConfig {
  /** Fields to group by (in order) */
  groupBy?: string[];
  /** Show group footer with aggregates */
  showGroupFooter?: boolean;
  /** Show group header */
  showGroupHeader?: boolean;
  /** Aggregate functions to apply */
  aggregates?: AggregateFunction[];
  /** Default expansion state */
  defaultExpanded?: boolean;
  /** Group row height */
  groupRowHeight?: number;
  /** Enable multi-level grouping */
  multiLevel?: boolean;
}

/**
 * Grouped row type
 */
export interface GroupedRow<T = any> {
  /** Row type */
  type: 'row' | 'group-header' | 'group-footer';
  /** Original data (for data rows) */
  data?: T;
  /** Group key (for group rows) */
  groupKey?: string;
  /** Group value */
  groupValue?: any;
  /** Group field name */
  groupField?: string;
  /** Nesting level */
  level: number;
  /** Is group expanded */
  isExpanded?: boolean;
  /** Row count in group */
  count?: number;
  /** Aggregate values */
  aggregates?: { [key: string]: any };
}

/**
 * Aggregate function definition
 */
export interface AggregateFunction {
  /** Field to aggregate */
  field: string;
  /** Function type */
  function: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'countDistinct' | 'first' | 'last' | 'custom';
  /** Custom aggregation function */
  customFunction?: (values: any[], rows: any[]) => any;
  /** Format function for display */
  format?: (value: any) => string;
  /** Label for aggregate */
  label?: string;
}

/**
 * Group state
 */
export interface GroupState {
  /** Fields currently grouped by */
  groupedBy: string[];
  /** Set of expanded group keys */
  expandedGroups: Set<string>;
  /** Set of collapsed group keys */
  collapsedGroups: Set<string>;
}

/**
 * Group expansion tracking
 */
export interface GroupExpanded {
  [groupKey: string]: boolean;
}
