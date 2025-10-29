/**
 * Batch Operations
 * Bulk edit, bulk delete, and mass operations
 */

/**
 * Batch operations configuration
 */
export interface BatchOperationsConfig {
  /** Enable batch operations */
  enabled?: boolean;
  
  /** Show batch toolbar */
  showToolbar?: boolean;
  
  /** Toolbar position */
  toolbarPosition?: 'top' | 'bottom' | 'both';
  
  /** Confirm before delete */
  confirmDelete?: boolean;
  
  /** Confirm before edit */
  confirmEdit?: boolean;
  
  /** Maximum batch size */
  maxBatchSize?: number;
  
  /** Show progress indicator */
  showProgress?: boolean;
  
  /** Allow undo */
  allowUndo?: boolean;
  
  /** Custom operations */
  customOperations?: BatchOperation[];
}

/**
 * Batch operation types
 */
export type BatchOperationType = 
  | 'edit'
  | 'delete'
  | 'duplicate'
  | 'export'
  | 'tag'
  | 'assign'
  | 'custom';

/**
 * Batch operation definition
 */
export interface BatchOperation {
  /** Operation ID */
  id: string;
  
  /** Operation type */
  type: BatchOperationType;
  
  /** Operation label */
  label: string;
  
  /** Operation icon */
  icon?: string;
  
  /** Operation description */
  description?: string;
  
  /** Handler function */
  handler: (rows: any[], params?: any) => Promise<BatchOperationResult>;
  
  /** Show in toolbar */
  showInToolbar?: boolean;
  
  /** Requires confirmation */
  requiresConfirmation?: boolean;
  
  /** Confirmation message */
  confirmationMessage?: string;
  
  /** Parameters form */
  parametersForm?: BatchOperationParameter[];
  
  /** Disabled condition */
  disabled?: (rows: any[]) => boolean;
  
  /** Hidden condition */
  hidden?: (rows: any[]) => boolean;
}

/**
 * Batch operation parameter
 */
export interface BatchOperationParameter {
  /** Parameter name */
  name: string;
  
  /** Parameter label */
  label: string;
  
  /** Parameter type */
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'textarea';
  
  /** Required */
  required?: boolean;
  
  /** Default value */
  defaultValue?: any;
  
  /** Options (for select) */
  options?: Array<{ value: any; label: string }>;
  
  /** Validation */
  validate?: (value: any) => boolean | string;
  
  /** Placeholder */
  placeholder?: string;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  /** Success status */
  success: boolean;
  
  /** Number of affected rows */
  affectedRows: number;
  
  /** Success count */
  successCount: number;
  
  /** Failed count */
  failedCount: number;
  
  /** Errors */
  errors?: BatchOperationError[];
  
  /** Warnings */
  warnings?: string[];
  
  /** Updated data */
  updatedData?: any[];
  
  /** Operation time (ms) */
  operationTime?: number;
  
  /** Undo data */
  undoData?: any;
}

/**
 * Batch operation error
 */
export interface BatchOperationError {
  /** Row index or ID */
  row: number | string;
  
  /** Error message */
  message: string;
  
  /** Error code */
  code?: string;
  
  /** Field (if applicable) */
  field?: string;
}

/**
 * Bulk edit configuration
 */
export interface BulkEditConfig {
  /** Fields to edit */
  fields?: string[];
  
  /** Edit mode */
  mode?: 'replace' | 'append' | 'find-replace';
  
  /** Show field selector */
  showFieldSelector?: boolean;
  
  /** Allow multi-field edit */
  allowMultiField?: boolean;
  
  /** Validation rules */
  validationRules?: Record<string, any>;
}

/**
 * Bulk edit operation
 */
export interface BulkEditOperation {
  /** Field to edit */
  field: string;
  
  /** New value */
  value: any;
  
  /** Operation type */
  operation?: 'set' | 'increment' | 'decrement' | 'append' | 'prepend' | 'find-replace';
  
  /** Find value (for find-replace) */
  findValue?: any;
  
  /** Condition */
  condition?: (row: any) => boolean;
}

/**
 * Bulk delete configuration
 */
export interface BulkDeleteConfig {
  /** Soft delete */
  softDelete?: boolean;
  
  /** Soft delete field */
  softDeleteField?: string;
  
  /** Confirmation required */
  confirmationRequired?: boolean;
  
  /** Custom confirmation message */
  confirmationMessage?: string;
  
  /** Allow permanent delete */
  allowPermanentDelete?: boolean;
  
  /** Cascade delete */
  cascadeDelete?: boolean;
  
  /** Related tables */
  relatedTables?: string[];
}

/**
 * Batch selection
 */
export interface BatchSelection {
  /** Selected rows */
  rows: any[];
  
  /** Row indices */
  indices: number[];
  
  /** Row IDs */
  ids: (string | number)[];
  
  /** Selection count */
  count: number;
  
  /** All selected */
  allSelected: boolean;
}

/**
 * Batch progress
 */
export interface BatchProgress {
  /** Total items */
  total: number;
  
  /** Processed items */
  processed: number;
  
  /** Success count */
  successCount: number;
  
  /** Failed count */
  failedCount: number;
  
  /** Progress percentage (0-100) */
  percentage: number;
  
  /** Current operation */
  currentOperation?: string;
  
  /** Status */
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  
  /** Start time */
  startTime?: number;
  
  /** End time */
  endTime?: number;
  
  /** Estimated time remaining (ms) */
  estimatedTimeRemaining?: number;
}

/**
 * Batch undo information
 */
export interface BatchUndoInfo {
  /** Operation ID */
  operationId: string;
  
  /** Operation type */
  operationType: BatchOperationType;
  
  /** Previous state */
  previousState: any[];
  
  /** Affected indices */
  affectedIndices: number[];
  
  /** Timestamp */
  timestamp: number;
  
  /** Description */
  description: string;
}

