/**
 * Undo/Redo configuration
 */
export interface UndoRedoConfig {
  /** Enable undo/redo */
  enabled?: boolean;
  /** Maximum undo stack size */
  maxUndoStackSize?: number;
  /** Enable undo for inline editing */
  undoInlineEdit?: boolean;
  /** Enable undo for row deletion */
  undoRowDeletion?: boolean;
  /** Enable undo for row addition */
  undoRowAddition?: boolean;
}

/**
 * Undo/Redo action
 */
export interface UndoRedoAction {
  /** Action type */
  type: 'edit' | 'delete' | 'add' | 'paste' | 'custom';
  /** Action timestamp */
  timestamp: Date;
  /** Action data */
  data: any;
  /** Undo function */
  undo: () => void;
  /** Redo function */
  redo: () => void;
  /** Action description */
  description?: string;
}

/**
 * Undo/Redo event
 */
export interface UndoRedoEvent {
  /** Event type */
  type: 'undo' | 'redo';
  /** Action being undone/redone */
  action: UndoRedoAction;
}

