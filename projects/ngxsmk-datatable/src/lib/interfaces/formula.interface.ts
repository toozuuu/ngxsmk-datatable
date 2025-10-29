/**
 * Custom Formula Support
 * Excel-like calculations and computed columns
 */

/**
 * Formula configuration
 */
export interface FormulaConfig {
  /** Enable formulas */
  enabled?: boolean;
  
  /** Custom functions */
  customFunctions?: Record<string, FormulaFunction>;
  
  /** Auto-recalculate on data change */
  autoRecalculate?: boolean;
  
  /** Circular reference detection */
  detectCircularReferences?: boolean;
  
  /** Maximum calculation depth */
  maxDepth?: number;
  
  /** Error handling strategy */
  errorHandling?: 'throw' | 'return-error' | 'return-null';
  
  /** Cache results */
  cacheResults?: boolean;
  
  /** Precision for decimal calculations */
  precision?: number;
}

/**
 * Formula function type
 */
export type FormulaFunction = (...args: any[]) => any;

/**
 * Computed column with formula
 */
export interface ComputedColumn {
  /** Column field name */
  field: string;
  
  /** Formula expression */
  formula: string;
  
  /** Dependencies (other column fields) */
  dependencies?: string[];
  
  /** Format result */
  format?: (value: any) => string;
  
  /** Cache result */
  cache?: boolean;
  
  /** Recalculate on row change */
  recalculateOnChange?: boolean;
}

/**
 * Formula expression
 */
export interface FormulaExpression {
  /** Original formula string */
  raw: string;
  
  /** Parsed tokens */
  tokens: FormulaToken[];
  
  /** Dependencies */
  dependencies: string[];
  
  /** Compiled function */
  compiled?: Function;
  
  /** Error if invalid */
  error?: string;
}

/**
 * Formula token
 */
export interface FormulaToken {
  /** Token type */
  type: 'function' | 'operator' | 'field' | 'value' | 'parenthesis';
  
  /** Token value */
  value: string;
  
  /** Token position in expression */
  position: number;
}

/**
 * Built-in formula functions
 */
export enum FormulaFunctions {
  // Math functions
  SUM = 'SUM',
  AVERAGE = 'AVERAGE',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
  COUNT = 'COUNT',
  ROUND = 'ROUND',
  FLOOR = 'FLOOR',
  CEIL = 'CEIL',
  ABS = 'ABS',
  SQRT = 'SQRT',
  POW = 'POW',
  
  // String functions
  CONCAT = 'CONCAT',
  UPPER = 'UPPER',
  LOWER = 'LOWER',
  TRIM = 'TRIM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  MID = 'MID',
  LEN = 'LEN',
  FIND = 'FIND',
  REPLACE = 'REPLACE',
  
  // Date functions
  NOW = 'NOW',
  TODAY = 'TODAY',
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  DAY = 'DAY',
  DATE = 'DATE',
  DATEDIFF = 'DATEDIFF',
  
  // Logical functions
  IF = 'IF',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  ISNULL = 'ISNULL',
  ISEMPTY = 'ISEMPTY',
  
  // Lookup functions
  VLOOKUP = 'VLOOKUP',
  HLOOKUP = 'HLOOKUP',
  INDEX = 'INDEX',
  MATCH = 'MATCH',
  
  // Statistical functions
  MEDIAN = 'MEDIAN',
  MODE = 'MODE',
  STDEV = 'STDEV',
  VAR = 'VAR',
  PERCENTILE = 'PERCENTILE'
}

/**
 * Formula calculation context
 */
export interface FormulaContext {
  /** Current row data */
  row: any;
  
  /** All rows data */
  allRows?: any[];
  
  /** Row index */
  rowIndex?: number;
  
  /** Custom variables */
  variables?: Record<string, any>;
  
  /** Functions available */
  functions?: Record<string, FormulaFunction>;
}

/**
 * Formula calculation result
 */
export interface FormulaResult {
  /** Calculated value */
  value: any;
  
  /** Success status */
  success: boolean;
  
  /** Error if failed */
  error?: string;
  
  /** Calculation time (ms) */
  calculationTime?: number;
  
  /** From cache */
  cached?: boolean;
}

/**
 * Formula validation result
 */
export interface FormulaValidation {
  /** Valid formula */
  valid: boolean;
  
  /** Error message */
  error?: string;
  
  /** Error position */
  errorPosition?: number;
  
  /** Warnings */
  warnings?: string[];
  
  /** Detected dependencies */
  dependencies?: string[];
  
  /** Circular reference detected */
  circularReference?: boolean;
}

/**
 * Aggregation formula
 */
export interface AggregationFormula {
  /** Field to aggregate */
  field: string;
  
  /** Aggregation function */
  function: FormulaFunctions;
  
  /** Filter condition */
  filter?: string;
  
  /** Group by field */
  groupBy?: string;
  
  /** Format result */
  format?: (value: any) => string;
}

