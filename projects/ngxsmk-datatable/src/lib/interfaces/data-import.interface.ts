/**
 * Data Import Wizard
 * Import from CSV, Excel, and JSON
 */

/**
 * Data import configuration
 */
export interface DataImportConfig {
  /** Enable data import */
  enabled?: boolean;
  
  /** Supported formats */
  supportedFormats?: ImportFormat[];
  
  /** Maximum file size (bytes) */
  maxFileSize?: number;
  
  /** Show import wizard */
  showWizard?: boolean;
  
  /** Auto-detect format */
  autoDetectFormat?: boolean;
  
  /** Auto-map columns */
  autoMapColumns?: boolean;
  
  /** Allow data preview */
  allowPreview?: boolean;
  
  /** Preview rows */
  previewRows?: number;
  
  /** Validation on import */
  validateOnImport?: boolean;
  
  /** Import mode */
  importMode?: 'replace' | 'append' | 'merge';
  
  /** Show progress */
  showProgress?: boolean;
}

/**
 * Import formats
 */
export type ImportFormat = 'csv' | 'excel' | 'json' | 'xml' | 'tsv' | 'txt';

/**
 * Import wizard steps
 */
export enum ImportWizardStep {
  UPLOAD = 'upload',
  FORMAT = 'format',
  MAPPING = 'mapping',
  PREVIEW = 'preview',
  VALIDATE = 'validate',
  IMPORT = 'import',
  COMPLETE = 'complete'
}

/**
 * Import options
 */
export interface ImportOptions {
  /** File format */
  format: ImportFormat;
  
  /** Import mode */
  mode?: 'replace' | 'append' | 'merge';
  
  /** Skip first row (headers) */
  skipFirstRow?: boolean;
  
  /** Delimiter (for CSV/TSV) */
  delimiter?: string;
  
  /** Quote character */
  quoteChar?: string;
  
  /** Escape character */
  escapeChar?: string;
  
  /** Encoding */
  encoding?: string;
  
  /** Sheet name (for Excel) */
  sheetName?: string;
  
  /** Sheet index (for Excel) */
  sheetIndex?: number;
  
  /** JSON path */
  jsonPath?: string;
  
  /** Column mapping */
  columnMapping?: ColumnMapping[];
  
  /** Transform functions */
  transforms?: Record<string, TransformFunction>;
  
  /** Validation rules */
  validationRules?: Record<string, any>;
  
  /** Date format */
  dateFormat?: string;
  
  /** Number format */
  numberFormat?: string;
  
  /** Trim whitespace */
  trimWhitespace?: boolean;
  
  /** Skip empty rows */
  skipEmptyRows?: boolean;
}

/**
 * Column mapping
 */
export interface ColumnMapping {
  /** Source column name/index */
  source: string | number;
  
  /** Target column field */
  target: string;
  
  /** Transform function */
  transform?: TransformFunction;
  
  /** Default value if empty */
  defaultValue?: any;
  
  /** Skip column */
  skip?: boolean;
}

/**
 * Transform function
 */
export type TransformFunction = (value: any, row?: any) => any;

/**
 * Import result
 */
export interface ImportResult {
  /** Success status */
  success: boolean;
  
  /** Imported data */
  data?: any[];
  
  /** Total rows in file */
  totalRows: number;
  
  /** Imported rows */
  importedRows: number;
  
  /** Skipped rows */
  skippedRows: number;
  
  /** Failed rows */
  failedRows: number;
  
  /** Errors */
  errors?: ImportError[];
  
  /** Warnings */
  warnings?: ImportWarning[];
  
  /** Import time (ms) */
  importTime?: number;
  
  /** File info */
  fileInfo?: FileInfo;
}

/**
 * Import error
 */
export interface ImportError {
  /** Row number */
  row: number;
  
  /** Column */
  column?: string;
  
  /** Error message */
  message: string;
  
  /** Error code */
  code?: string;
  
  /** Raw value */
  value?: any;
}

/**
 * Import warning
 */
export interface ImportWarning {
  /** Row number */
  row?: number;
  
  /** Column */
  column?: string;
  
  /** Warning message */
  message: string;
  
  /** Warning code */
  code?: string;
}

/**
 * File info
 */
export interface FileInfo {
  /** File name */
  name: string;
  
  /** File size (bytes) */
  size: number;
  
  /** File type */
  type: string;
  
  /** Last modified */
  lastModified?: number;
  
  /** Detected format */
  detectedFormat?: ImportFormat;
}

/**
 * Import preview
 */
export interface ImportPreview {
  /** Preview data */
  data: any[];
  
  /** Detected columns */
  columns: string[];
  
  /** Sample rows */
  sampleRows: number;
  
  /** Total rows */
  totalRows: number;
  
  /** Detected delimiter */
  detectedDelimiter?: string;
  
  /** Has headers */
  hasHeaders?: boolean;
}

/**
 * CSV import options
 */
export interface CsvImportOptions extends ImportOptions {
  /** Delimiter */
  delimiter?: ',' | ';' | '\t' | '|' | string;
  
  /** Has headers */
  hasHeaders?: boolean;
  
  /** Quote character */
  quoteChar?: '"' | "'" | string;
  
  /** Comments character */
  commentsChar?: string;
  
  /** Skip lines */
  skipLines?: number;
}

/**
 * Excel import options
 */
export interface ExcelImportOptions extends ImportOptions {
  /** Sheet name */
  sheetName?: string;
  
  /** Sheet index */
  sheetIndex?: number;
  
  /** Import all sheets */
  importAllSheets?: boolean;
  
  /** Start row */
  startRow?: number;
  
  /** End row */
  endRow?: number;
  
  /** Start column */
  startColumn?: string | number;
  
  /** End column */
  endColumn?: string | number;
  
  /** Read formulas */
  readFormulas?: boolean;
  
  /** Evaluate formulas */
  evaluateFormulas?: boolean;
}

/**
 * JSON import options
 */
export interface JsonImportOptions extends ImportOptions {
  /** JSON path to data array */
  jsonPath?: string;
  
  /** Flatten nested objects */
  flattenNested?: boolean;
  
  /** Nested delimiter */
  nestedDelimiter?: string;
  
  /** Array handling */
  arrayHandling?: 'join' | 'first' | 'last' | 'ignore';
}

/**
 * Import validation result
 */
export interface ImportValidationResult {
  /** Valid */
  valid: boolean;
  
  /** Validation errors */
  errors: ImportError[];
  
  /** Validation warnings */
  warnings: ImportWarning[];
  
  /** Valid rows */
  validRows: number;
  
  /** Invalid rows */
  invalidRows: number;
}

/**
 * Import template
 */
export interface ImportTemplate {
  /** Template name */
  name: string;
  
  /** Template description */
  description?: string;
  
  /** Column mappings */
  columnMappings: ColumnMapping[];
  
  /** Import options */
  options: ImportOptions;
  
  /** Validation rules */
  validationRules?: Record<string, any>;
}

