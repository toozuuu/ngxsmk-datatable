import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  BatchOperationsConfig,
  BatchOperation,
  BatchOperationResult,
  BatchProgress,
  BatchSelection,
  BulkEditOperation,
  BatchUndoInfo
} from '../interfaces/batch-operations.interface';

/**
 * Batch Operations Service
 * Handles bulk edit, bulk delete, and mass operations
 */
@Injectable({
  providedIn: 'root'
})
export class BatchOperationsService {
  private config: BatchOperationsConfig | null = null;
  private customOperations: Map<string, BatchOperation> = new Map();
  private undoStack: BatchUndoInfo[] = [];

  private progressSubject = new Subject<BatchProgress>();
  readonly progress$ = this.progressSubject.asObservable();

  constructor() {}

  /**
   * Configure batch operations
   */
  configure(config: BatchOperationsConfig): void {
    this.config = config;

    if (config.customOperations) {
      config.customOperations.forEach(op => {
        this.registerOperation(op);
      });
    }
  }

  /**
   * Register custom operation
   */
  registerOperation(operation: BatchOperation): void {
    this.customOperations.set(operation.id, operation);
  }

  /**
   * Bulk edit
   */
  async bulkEdit(
    rows: any[],
    operations: BulkEditOperation[]
  ): Promise<BatchOperationResult> {
    const startTime = performance.now();
    
    if (this.config?.confirmEdit) {
      // Would show confirmation dialog in real implementation
      const confirmed = confirm(`Edit ${rows.length} rows?`);
      if (!confirmed) {
        return this.createCancelledResult(rows.length);
      }
    }

    const updatedData: any[] = [];
    let successCount = 0;
    let failedCount = 0;
    const errors: any[] = [];

    // Save previous state for undo
    const previousState = rows.map(r => ({ ...r }));

    this.emitProgress({
      total: rows.length,
      processed: 0,
      successCount: 0,
      failedCount: 0,
      percentage: 0,
      status: 'processing'
    });

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = { ...rows[i] };

        // Apply all operations
        for (const op of operations) {
          if (op.condition && !op.condition(row)) {
            continue;
          }

          row[op.field] = this.applyEditOperation(row[op.field], op);
        }

        updatedData.push(row);
        successCount++;
      } catch (error: any) {
        errors.push({
          row: i,
          message: error.message
        });
        failedCount++;
      }

      // Emit progress
      this.emitProgress({
        total: rows.length,
        processed: i + 1,
        successCount,
        failedCount,
        percentage: ((i + 1) / rows.length) * 100,
        status: 'processing'
      });

      // Throttle for large datasets
      if (i % 100 === 0) {
        await this.sleep(1);
      }
    }

    const operationTime = performance.now() - startTime;

    // Store undo information
    if (this.config?.allowUndo) {
      this.addToUndoStack({
        operationId: this.generateId(),
        operationType: 'edit',
        previousState,
        affectedIndices: rows.map((_, i) => i),
        timestamp: Date.now(),
        description: `Bulk edit ${rows.length} rows`
      });
    }

    this.emitProgress({
      total: rows.length,
      processed: rows.length,
      successCount,
      failedCount,
      percentage: 100,
      status: 'completed',
      startTime,
      endTime: Date.now()
    });

    return {
      success: failedCount === 0,
      affectedRows: rows.length,
      successCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
      updatedData,
      operationTime
    };
  }

  /**
   * Bulk delete
   */
  async bulkDelete(rows: any[]): Promise<BatchOperationResult> {
    const startTime = performance.now();

    if (this.config?.confirmDelete) {
      const confirmed = confirm(`Delete ${rows.length} rows?`);
      if (!confirmed) {
        return this.createCancelledResult(rows.length);
      }
    }

    // Save for undo
    const previousState = rows.map(r => ({ ...r }));

    this.emitProgress({
      total: rows.length,
      processed: rows.length,
      successCount: rows.length,
      failedCount: 0,
      percentage: 100,
      status: 'completed'
    });

    if (this.config?.allowUndo) {
      this.addToUndoStack({
        operationId: this.generateId(),
        operationType: 'delete',
        previousState,
        affectedIndices: rows.map((_, i) => i),
        timestamp: Date.now(),
        description: `Bulk delete ${rows.length} rows`
      });
    }

    return {
      success: true,
      affectedRows: rows.length,
      successCount: rows.length,
      failedCount: 0,
      operationTime: performance.now() - startTime
    };
  }

  /**
   * Execute custom operation
   */
  async executeOperation(
    operationId: string,
    rows: any[],
    params?: any
  ): Promise<BatchOperationResult> {
    const operation = this.customOperations.get(operationId);
    if (!operation) {
      throw new Error(`Operation "${operationId}" not found`);
    }

    if (operation.requiresConfirmation) {
      const message = operation.confirmationMessage || `Execute ${operation.label}?`;
      const confirmed = confirm(message);
      if (!confirmed) {
        return this.createCancelledResult(rows.length);
      }
    }

    return operation.handler(rows, params);
  }

  /**
   * Undo last operation
   */
  undo(): any[] | null {
    const lastOperation = this.undoStack.pop();
    if (!lastOperation) return null;

    return lastOperation.previousState;
  }

  /**
   * Can undo
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Get undo history
   */
  getUndoHistory(): BatchUndoInfo[] {
    return [...this.undoStack];
  }

  /**
   * Apply edit operation to value
   */
  private applyEditOperation(value: any, operation: BulkEditOperation): any {
    switch (operation.operation) {
      case 'set':
        return operation.value;
      
      case 'increment':
        return Number(value || 0) + Number(operation.value);
      
      case 'decrement':
        return Number(value || 0) - Number(operation.value);
      
      case 'append':
        return String(value || '') + String(operation.value);
      
      case 'prepend':
        return String(operation.value) + String(value || '');
      
      case 'find-replace':
        if (operation.findValue != null) {
          return String(value || '').replace(operation.findValue, operation.value);
        }
        return value;
      
      default:
        return operation.value;
    }
  }

  /**
   * Emit progress
   */
  private emitProgress(progress: Partial<BatchProgress>): void {
    this.progressSubject.next(progress as BatchProgress);
  }

  /**
   * Create cancelled result
   */
  private createCancelledResult(count: number): BatchOperationResult {
    return {
      success: false,
      affectedRows: 0,
      successCount: 0,
      failedCount: count,
      errors: [{ row: -1, message: 'Operation cancelled by user' }],
      operationTime: 0
    };
  }

  /**
   * Add to undo stack
   */
  private addToUndoStack(info: BatchUndoInfo): void {
    this.undoStack.push(info);
    
    // Limit undo stack size
    const maxSize = 50;
    if (this.undoStack.length > maxSize) {
      this.undoStack.shift();
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `batch-op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

