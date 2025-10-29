import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UndoRedoAction, UndoRedoConfig } from '../interfaces/undo-redo.interface';

/**
 * Undo/Redo service for managing action history
 * 
 * This service provides undo/redo functionality for inline editing
 * and other reversible operations.
 * 
 * @example
 * constructor(private undoRedoService: UndoRedoService) {
 *   this.undoRedoService.setConfig({ maxUndoStackSize: 50 });
 * }
 * 
 * // Add action
 * this.undoRedoService.addAction({
 *   type: 'edit',
 *   data: { row, oldValue, newValue },
 *   undo: () => row.value = oldValue,
 *   redo: () => row.value = newValue
 * });
 * 
 * // Undo
 * this.undoRedoService.undo();
 * 
 * // Redo
 * this.undoRedoService.redo();
 */
@Injectable()
export class UndoRedoService {
  private config: UndoRedoConfig = {
    enabled: true,
    maxUndoStackSize: 50,
    undoInlineEdit: true,
    undoRowDeletion: true,
    undoRowAddition: true
  };

  private undoStack: UndoRedoAction[] = [];
  private redoStack: UndoRedoAction[] = [];

  /**
   * Observable for undo stack
   */
  public undoStack$ = new BehaviorSubject<UndoRedoAction[]>([]);

  /**
   * Observable for redo stack
   */
  public redoStack$ = new BehaviorSubject<UndoRedoAction[]>([]);

  /**
   * Observable for can undo state
   */
  public canUndo$ = new BehaviorSubject<boolean>(false);

  /**
   * Observable for can redo state
   */
  public canRedo$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  /**
   * Set configuration
   */
  public setConfig(config: Partial<UndoRedoConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   */
  public getConfig(): UndoRedoConfig {
    return this.config;
  }

  /**
   * Add an action to the undo stack
   */
  public addAction(action: Omit<UndoRedoAction, 'timestamp'>): void {
    if (!this.config.enabled) return;

    // Check if this type of action should be tracked
    if (action.type === 'edit' && !this.config.undoInlineEdit) return;
    if (action.type === 'delete' && !this.config.undoRowDeletion) return;
    if (action.type === 'add' && !this.config.undoRowAddition) return;

    const fullAction: UndoRedoAction = {
      ...action,
      timestamp: new Date()
    };

    this.undoStack.push(fullAction);

    // Enforce max stack size
    if (this.config.maxUndoStackSize && this.undoStack.length > this.config.maxUndoStackSize) {
      this.undoStack.shift();
    }

    // Clear redo stack when new action is added
    this.redoStack = [];

    this.updateObservables();
  }

  /**
   * Undo the last action
   */
  public undo(): boolean {
    if (!this.canUndo()) return false;

    const action = this.undoStack.pop();
    if (!action) return false;

    try {
      action.undo();
      this.redoStack.push(action);
      this.updateObservables();
      return true;
    } catch (error) {
      console.error('Undo failed:', error);
      this.undoStack.push(action); // Put it back
      return false;
    }
  }

  /**
   * Redo the last undone action
   */
  public redo(): boolean {
    if (!this.canRedo()) return false;

    const action = this.redoStack.pop();
    if (!action) return false;

    try {
      action.redo();
      this.undoStack.push(action);
      this.updateObservables();
      return true;
    } catch (error) {
      console.error('Redo failed:', error);
      this.redoStack.push(action); // Put it back
      return false;
    }
  }

  /**
   * Check if undo is available
   */
  public canUndo(): boolean {
    return (this.config.enabled ?? true) && this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  public canRedo(): boolean {
    return (this.config.enabled ?? true) && this.redoStack.length > 0;
  }

  /**
   * Clear all history
   */
  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.updateObservables();
  }

  /**
   * Get undo stack
   */
  public getUndoStack(): UndoRedoAction[] {
    return [...this.undoStack];
  }

  /**
   * Get redo stack
   */
  public getRedoStack(): UndoRedoAction[] {
    return [...this.redoStack];
  }

  /**
   * Get last action description
   */
  public getLastActionDescription(): string | undefined {
    return this.undoStack[this.undoStack.length - 1]?.description;
  }

  /**
   * Get next redo action description
   */
  public getNextRedoDescription(): string | undefined {
    return this.redoStack[this.redoStack.length - 1]?.description;
  }

  /**
   * Update all observables
   */
  private updateObservables(): void {
    this.undoStack$.next([...this.undoStack]);
    this.redoStack$.next([...this.redoStack]);
    this.canUndo$.next(this.canUndo());
    this.canRedo$.next(this.canRedo());
  }
}

