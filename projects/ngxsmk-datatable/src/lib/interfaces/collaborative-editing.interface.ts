/**
 * Real-time Collaborative Editing Configuration
 * Enables multiple users to edit the datatable simultaneously
 */

/**
 * Collaboration configuration
 */
export interface CollaborativeEditingConfig {
  /** Enable collaborative editing */
  enabled?: boolean;
  
  /** WebSocket connection URL */
  websocketUrl?: string;
  
  /** User identification */
  userId: string;
  
  /** User display name */
  userName?: string;
  
  /** User avatar URL */
  userAvatar?: string;
  
  /** User color for cursor and highlights */
  userColor?: string;
  
  /** Room/session ID */
  roomId?: string;
  
  /** Show other users' cursors */
  showCursors?: boolean;
  
  /** Show other users' selections */
  showSelections?: boolean;
  
  /** Show active editors badge */
  showActiveUsers?: boolean;
  
  /** Auto-reconnect on disconnect */
  autoReconnect?: boolean;
  
  /** Reconnect interval (ms) */
  reconnectInterval?: number;
  
  /** Conflict resolution strategy */
  conflictResolution?: ConflictResolutionStrategy;
  
  /** Operation transformation enabled */
  operationalTransform?: boolean;
  
  /** Broadcast user presence */
  broadcastPresence?: boolean;
  
  /** Presence update interval (ms) */
  presenceInterval?: number;
  
  /** Custom authentication handler */
  authenticate?: () => Promise<string | null>;
}

/**
 * Conflict resolution strategies
 */
export type ConflictResolutionStrategy = 
  | 'last-write-wins'
  | 'first-write-wins'
  | 'manual'
  | 'operational-transform';

/**
 * Collaborative operation types
 */
export type CollaborativeOperationType = 
  | 'cell-edit'
  | 'row-add'
  | 'row-delete'
  | 'row-move'
  | 'column-add'
  | 'column-delete'
  | 'column-move'
  | 'sort'
  | 'filter'
  | 'selection';

/**
 * Collaborative operation
 */
export interface CollaborativeOperation {
  /** Operation ID */
  id: string;
  
  /** Operation type */
  type: CollaborativeOperationType;
  
  /** User who performed the operation */
  userId: string;
  
  /** Timestamp */
  timestamp: number;
  
  /** Operation data */
  data: any;
  
  /** Previous state (for undo) */
  previousState?: any;
  
  /** Row index (if applicable) */
  rowIndex?: number;
  
  /** Column field (if applicable) */
  columnField?: string;
  
  /** Version number for OT */
  version?: number;
}

/**
 * Active user in collaboration session
 */
export interface CollaborativeUser {
  /** User ID */
  id: string;
  
  /** User display name */
  name: string;
  
  /** User avatar URL */
  avatar?: string;
  
  /** User color */
  color: string;
  
  /** Current cursor position */
  cursor?: CollaborativeCursor;
  
  /** Current selection */
  selection?: CollaborativeSelection;
  
  /** Last activity timestamp */
  lastActivity: number;
  
  /** Online status */
  online: boolean;
  
  /** User permissions */
  permissions?: CollaborativePermissions;
}

/**
 * Collaborative cursor position
 */
export interface CollaborativeCursor {
  /** Row index */
  rowIndex: number;
  
  /** Column field */
  columnField: string;
  
  /** Cell editing state */
  editing?: boolean;
}

/**
 * Collaborative selection
 */
export interface CollaborativeSelection {
  /** Start row index */
  startRow: number;
  
  /** End row index */
  endRow: number;
  
  /** Start column field */
  startColumn: string;
  
  /** End column field */
  endColumn: string;
}

/**
 * User permissions for collaboration
 */
export interface CollaborativePermissions {
  /** Can edit cells */
  canEdit?: boolean;
  
  /** Can add rows */
  canAddRows?: boolean;
  
  /** Can delete rows */
  canDeleteRows?: boolean;
  
  /** Can modify columns */
  canModifyColumns?: boolean;
  
  /** Can change settings */
  canChangeSettings?: boolean;
  
  /** Read-only mode */
  readOnly?: boolean;
}

/**
 * Collaborative session state
 */
export interface CollaborativeSession {
  /** Session ID */
  id: string;
  
  /** Active users */
  users: CollaborativeUser[];
  
  /** Session created timestamp */
  createdAt: number;
  
  /** Last activity timestamp */
  lastActivity: number;
  
  /** Connection status */
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  
  /** Operation history */
  operations: CollaborativeOperation[];
  
  /** Current version */
  version: number;
}

/**
 * WebSocket message types
 */
export interface CollaborativeMessage {
  /** Message type */
  type: 'operation' | 'presence' | 'cursor' | 'selection' | 'join' | 'leave' | 'sync';
  
  /** Message payload */
  payload: any;
  
  /** User ID */
  userId: string;
  
  /** Timestamp */
  timestamp: number;
  
  /** Message ID */
  messageId?: string;
}

/**
 * Conflict detected event
 */
export interface CollaborativeConflict {
  /** Local operation */
  localOperation: CollaborativeOperation;
  
  /** Remote operation */
  remoteOperation: CollaborativeOperation;
  
  /** Conflict type */
  type: 'edit-edit' | 'edit-delete' | 'delete-delete';
  
  /** Resolution */
  resolution?: 'accepted' | 'rejected' | 'merged';
}

