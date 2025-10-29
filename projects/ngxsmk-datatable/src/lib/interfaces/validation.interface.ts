/**
 * Advanced Data Validation Rules
 * Cell-level and row-level validation
 */

/**
 * Validation configuration
 */
export interface ValidationConfig {
  /** Enable validation */
  enabled?: boolean;
  
  /** Validation mode */
  mode?: 'immediate' | 'onBlur' | 'onSubmit';
  
  /** Show validation errors inline */
  showInlineErrors?: boolean;
  
  /** Show validation summary */
  showSummary?: boolean;
  
  /** Prevent invalid data save */
  preventInvalidSave?: boolean;
  
  /** Highlight invalid cells */
  highlightInvalid?: boolean;
  
  /** Custom error messages */
  errorMessages?: Record<string, string>;
  
  /** Validation debounce (ms) */
  debounce?: number;
}

/**
 * Data validation rule (for advanced validation)
 * Note: For simple validation, see ValidationRule in inline-editing.service.ts
 */
export interface DataValidationRule {
  /** Rule name */
  name: string;
  
  /** Rule type */
  type: ValidationType;
  
  /** Validator function */
  validator: (value: any, row?: any, context?: ValidationContext) => boolean | Promise<boolean>;
  
  /** Error message */
  message: string;
  
  /** Error message template */
  messageTemplate?: (value: any, params?: any) => string;
  
  /** Rule parameters */
  params?: any;
  
  /** Async validation */
  async?: boolean;
  
  /** Validation order */
  order?: number;
  
  /** Skip if empty */
  skipIfEmpty?: boolean;
}

/**
 * Validation types
 */
export enum ValidationType {
  REQUIRED = 'required',
  MIN = 'min',
  MAX = 'max',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  PATTERN = 'pattern',
  EMAIL = 'email',
  URL = 'url',
  NUMERIC = 'numeric',
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  PHONE = 'phone',
  DATE = 'date',
  DATE_RANGE = 'dateRange',
  TIME = 'time',
  CUSTOM = 'custom',
  UNIQUE = 'unique',
  MATCH = 'match',
  FUNCTION = 'function',
  CONDITIONAL = 'conditional'
}

/**
 * Column validation configuration
 */
export interface ColumnValidationConfig {
  /** Column field */
  field: string;
  
  /** Validation rules */
  rules: DataValidationRule[];
  
  /** Required */
  required?: boolean;
  
  /** Custom validators */
  validators?: Array<(value: any, row?: any) => boolean | Promise<boolean>>;
  
  /** Error message */
  errorMessage?: string;
  
  /** Warning message */
  warningMessage?: string;
}

/**
 * Row validation configuration
 */
export interface RowValidationConfig {
  /** Validation function */
  validator: (row: any) => ValidationResult | Promise<ValidationResult>;
  
  /** Error message */
  errorMessage?: string;
  
  /** Validation dependencies */
  dependencies?: string[];
}

/**
 * Validation context
 */
export interface ValidationContext {
  /** Current row data */
  row: any;
  
  /** All rows */
  allRows?: any[];
  
  /** Row index */
  rowIndex?: number;
  
  /** Column field */
  field?: string;
  
  /** Previous value */
  previousValue?: any;
  
  /** Form data */
  formData?: any;
  
  /** Custom context */
  custom?: Record<string, any>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Valid status */
  valid: boolean;
  
  /** Errors */
  errors?: ValidationError[];
  
  /** Warnings */
  warnings?: ValidationWarning[];
  
  /** Field-specific errors */
  fieldErrors?: Record<string, string[]>;
  
  /** Validation time (ms) */
  validationTime?: number;
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Field */
  field?: string;
  
  /** Error message */
  message: string;
  
  /** Error code */
  code?: string;
  
  /** Rule name */
  rule?: string;
  
  /** Severity */
  severity?: 'error' | 'warning';
  
  /** Value */
  value?: any;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  /** Field */
  field?: string;
  
  /** Warning message */
  message: string;
  
  /** Warning code */
  code?: string;
}

/**
 * Built-in validators
 */
export interface BuiltInValidators {
  required: (value: any) => boolean;
  email: (value: string) => boolean;
  url: (value: string) => boolean;
  numeric: (value: any) => boolean;
  integer: (value: any) => boolean;
  min: (value: number, min: number) => boolean;
  max: (value: number, max: number) => boolean;
  minLength: (value: string, length: number) => boolean;
  maxLength: (value: string, length: number) => boolean;
  pattern: (value: string, pattern: RegExp) => boolean;
  phone: (value: string) => boolean;
  date: (value: any) => boolean;
  unique: (value: any, field: string, allRows: any[]) => boolean;
  match: (value: any, matchValue: any) => boolean;
}

/**
 * Async validation result
 */
export interface AsyncValidationResult {
  /** Valid status */
  valid: boolean;
  
  /** Error message */
  error?: string;
  
  /** Validation pending */
  pending?: boolean;
}

/**
 * Validation state
 */
export interface ValidationState {
  /** Valid status */
  valid: boolean;
  
  /** Validating */
  validating: boolean;
  
  /** Errors */
  errors: ValidationError[];
  
  /** Warnings */
  warnings: ValidationWarning[];
  
  /** Field states */
  fields: Record<string, FieldValidationState>;
  
  /** Last validation time */
  lastValidated?: number;
}

/**
 * Field validation state
 */
export interface FieldValidationState {
  /** Valid */
  valid: boolean;
  
  /** Dirty */
  dirty: boolean;
  
  /** Touched */
  touched: boolean;
  
  /** Errors */
  errors: string[];
  
  /** Warnings */
  warnings: string[];
  
  /** Validating */
  validating: boolean;
}

/**
 * Validation event
 */
export interface ValidationEvent {
  /** Event type */
  type: 'validate' | 'error' | 'warning' | 'success';
  
  /** Field */
  field?: string;
  
  /** Row index */
  rowIndex?: number;
  
  /** Result */
  result: ValidationResult;
  
  /** Timestamp */
  timestamp: number;
}

