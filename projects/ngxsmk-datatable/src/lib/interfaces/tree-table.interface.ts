import { NgxsmkRow } from './row.interface';

/**
 * Tree table configuration
 */
export interface TreeTableConfig {
  /** Enable tree table */
  enabled?: boolean;
  /** Property name for children */
  childrenProperty?: string;
  /** Property name for parent ID */
  parentProperty?: string;
  /** Tree level indent in pixels */
  levelIndent?: number;
  /** Show expand/collapse icons */
  showExpandIcon?: boolean;
  /** Default expanded state */
  defaultExpanded?: boolean;
  /** Enable lazy loading of children */
  lazyLoading?: boolean;
}

/**
 * Tree node row data
 */
export interface TreeNodeRow extends NgxsmkRow {
  /** Tree level */
  $$treeLevel: number;
  /** Has children */
  $$hasChildren: boolean;
  /** Expanded state */
  $$expanded?: boolean;
  /** Parent row */
  $$parent?: TreeNodeRow;
  /** Child rows */
  $$children?: TreeNodeRow[];
  /** Loading children */
  $$loadingChildren?: boolean;
}

/**
 * Tree node expand event
 */
export interface TreeNodeExpandEvent {
  /** Node row */
  node: TreeNodeRow;
  /** Expanded state */
  expanded: boolean;
  /** Row index */
  rowIndex: number;
}

/**
 * Tree node structure
 */
export interface TreeNode<T = any> {
  /** Unique node ID */
  id?: string;
  /** Node data */
  data: T;
  /** Child nodes */
  children?: TreeNode<T>[];
  /** Has children (for lazy loading) */
  hasChildren?: boolean;
  /** Parent node ID */
  parentId?: string;
  /** Is node expanded */
  expanded?: boolean;
  /** Is loading children */
  loading?: boolean;
}

/**
 * Flattened tree node for rendering
 */
export interface FlattenedTreeNode<T = any> {
  /** Node data */
  data: T;
  /** Node ID */
  id: string;
  /** Nesting level */
  level: number;
  /** Has children */
  hasChildren: boolean;
  /** Is expanded */
  isExpanded: boolean;
  /** Is loading */
  isLoading: boolean;
  /** Parent node ID */
  parent: string | null;
  /** Is leaf node */
  isLeaf: boolean;
  /** Number of children */
  childCount: number;
}

/**
 * Tree state
 */
export interface TreeState {
  /** Set of expanded node IDs */
  expandedNodes: Set<string>;
  /** Set of collapsed node IDs */
  collapsedNodes: Set<string>;
  /** Set of loading node IDs */
  loadingNodes: Set<string>;
}
