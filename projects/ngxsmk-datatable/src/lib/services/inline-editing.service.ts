import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { NgxsmkRow } from '../interfaces/row.interface';
import { NgxsmkColumn } from '../interfaces/column.interface';

/**
 * Cell edit state
 */
export interface CellEditState {
  rowIndex: number;
  columnIndex: number;
  row: NgxsmkRow;
  column: NgxsmkColumn;
  value: any;
  isEditing: boolean;
  validationErrors?: string[];
}

/**
 * Edit event
 */
export interface CellEditEvent {
  row: NgxsmkRow;
  column: NgxsmkColumn;
  oldValue: any;
  newValue: any;
  rowIndex: number;
  columnIndex: number;
}

/**
 * Validation rule
 */
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean;
}

/**
 * Cell validator configuration
 */
export interface CellValidatorConfig {
  columnId: string;
  rules: ValidationRule[];
}

/**
 * Inline editing service
 * 
 * This service manages inline editing state efficiently by tracking
 * only ONE active editing cell at a time, rather than creating
 * thousands of form controls.
 * 
 * @example
 * // In component
 * constructor(private editingService: InlineEditingService) {}
 * 
 * startEdit(row, column, rowIndex, colIndex) {
 *   this.editingService.startEdit(row, column, rowIndex, colIndex);
 * }
 * 
 * isEditing(rowIndex, colIndex) {
 *   return this.editingService.isEditing(rowIndex, colIndex);
 * }
 */
@Injectable()
export class InlineEditingService {
  /**
   * Currently editing cell (only ONE at a time!)
   */
  private currentEdit$ = new BehaviorSubject<CellEditState | null>(null);
  
  /**
   * Cell edit commit event
   */
  public cellEdit$ = new Subject<CellEditEvent>();
  
  /**
   * Cell edit cancel event
   */
  public cellEditCancel$ = new Subject<CellEditState>();
  
  /**
   * Validation error event
   */
  public validationError$ = new Subject<{ errors: string[], state: CellEditState }>();

  /**
   * Validation rules by column ID
   */
  private validationRules = new Map<string, ValidationRule[]>();

  /**
   * Observable for current editing state
   */
  public get editing$() {
    return this.currentEdit$.asObservable();
  }

  /**
   * Get current editing state
   */
  public getCurrentEdit(): CellEditState | null {
    return this.currentEdit$.value;
  }

  /**
   * Check if a specific cell is being edited
   */
  public isEditing(rowIndex: number, columnIndex: number): boolean {
    const current = this.currentEdit$.value;
    return current !== null && 
           current.rowIndex === rowIndex && 
           current.columnIndex === columnIndex;
  }

  /**
   * Check if any cell is currently being edited
   */
  public isAnyEditing(): boolean {
    return this.currentEdit$.value !== null;
  }

  /**
   * Start editing a cell
   * 
   * This automatically cancels any existing edit first
   */
  public startEdit(
    row: NgxsmkRow,
    column: NgxsmkColumn,
    rowIndex: number,
    columnIndex: number
  ): void {
    // Cancel any existing edit first
    if (this.isAnyEditing()) {
      this.cancelEdit();
    }

    const prop = column.prop || column.id;
    const value = this.getNestedValue(row, prop);

    this.currentEdit$.next({
      rowIndex,
      columnIndex,
      row,
      column,
      value,
      isEditing: true
    });
  }

  /**
   * Set validation rules for a column
   */
  public setValidationRules(columnId: string, rules: ValidationRule[]): void {
    this.validationRules.set(columnId, rules);
  }

  /**
   * Get validation rules for a column
   */
  public getValidationRules(columnId: string): ValidationRule[] {
    return this.validationRules.get(columnId) || [];
  }

  /**
   * Validate a value against rules
   */
  public validate(columnId: string, value: any): string[] {
    const rules = this.validationRules.get(columnId);
    if (!rules || rules.length === 0) return [];

    const errors: string[] = [];

    for (const rule of rules) {
      let isValid = true;
      let errorMessage = rule.message;

      switch (rule.type) {
        case 'required':
          isValid = value !== null && value !== undefined && value !== '';
          errorMessage = errorMessage || 'This field is required';
          break;

        case 'min':
          isValid = Number(value) >= rule.value;
          errorMessage = errorMessage || `Value must be at least ${rule.value}`;
          break;

        case 'max':
          isValid = Number(value) <= rule.value;
          errorMessage = errorMessage || `Value must be at most ${rule.value}`;
          break;

        case 'minLength':
          isValid = String(value).length >= rule.value;
          errorMessage = errorMessage || `Minimum length is ${rule.value}`;
          break;

        case 'maxLength':
          isValid = String(value).length <= rule.value;
          errorMessage = errorMessage || `Maximum length is ${rule.value}`;
          break;

        case 'pattern':
          isValid = new RegExp(rule.value).test(String(value));
          errorMessage = errorMessage || 'Invalid format';
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = emailRegex.test(String(value));
          errorMessage = errorMessage || 'Invalid email address';
          break;

        case 'custom':
          if (rule.validator) {
            isValid = rule.validator(value);
            errorMessage = errorMessage || 'Validation failed';
          }
          break;
      }

      if (!isValid && errorMessage) {
        errors.push(errorMessage);
      }
    }

    return errors;
  }

  /**
   * Commit the edit (save changes) with validation
   */
  public commitEdit(newValue: any, skipValidation = false): boolean {
    const current = this.currentEdit$.value;
    if (!current) return false;

    // Validate if not skipped
    if (!skipValidation) {
      const errors = this.validate(current.column.id, newValue);
      if (errors.length > 0) {
        current.validationErrors = errors;
        this.currentEdit$.next({ ...current });
        this.validationError$.next({ errors, state: current });
        return false;
      }
    }

    const prop = current.column.prop || current.column.id;
    const oldValue = this.getNestedValue(current.row, prop);

    // Only update if value changed
    if (oldValue === newValue) {
      this.currentEdit$.next(null);
      return true;
    }

    // Update the value in the row
    this.setNestedValue(current.row, prop, newValue);

    // Emit edit event
    this.cellEdit$.next({
      row: current.row,
      column: current.column,
      oldValue,
      newValue,
      rowIndex: current.rowIndex,
      columnIndex: current.columnIndex
    });

    // Clear editing state
    this.currentEdit$.next(null);
    return true;
  }

  /**
   * Get validation errors for current edit
   */
  public getValidationErrors(): string[] {
    return this.currentEdit$.value?.validationErrors || [];
  }

  /**
   * Check if current edit has validation errors
   */
  public hasValidationErrors(): boolean {
    return (this.currentEdit$.value?.validationErrors?.length || 0) > 0;
  }

  /**
   * Cancel the edit (discard changes)
   */
  public cancelEdit(): void {
    const current = this.currentEdit$.value;
    if (!current) return;

    this.cellEditCancel$.next(current);
    this.currentEdit$.next(null);
  }

  /**
   * Get the editing value for the current cell
   */
  public getEditingValue(): any {
    return this.currentEdit$.value?.value;
  }

  /**
   * Update the editing value (for two-way binding)
   */
  public updateEditingValue(value: any): void {
    const current = this.currentEdit$.value;
    if (current) {
      current.value = value;
    }
  }

  /**
   * Get nested property value
   */
  private getNestedValue(obj: any, path: string): any {
    if (!path || !obj) return obj;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value == null) return value;
      value = value[key];
    }
    
    return value;
  }

  /**
   * Set nested property value
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    if (!path || !obj) return;
    
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }
}

