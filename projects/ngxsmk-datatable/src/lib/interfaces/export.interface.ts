import { NgxsmkColumn } from './column.interface';

/**
 * Export configuration
 */
export interface ExportConfig {
  /** Export format */
  format: ExportFormat;
  /** File name */
  fileName?: string;
  /** Include headers */
  includeHeaders?: boolean;
  /** Columns to export (null = all visible columns) */
  columns?: NgxsmkColumn[];
  /** Custom data formatter */
  dataFormatter?: (value: any, column: NgxsmkColumn) => any;
}

/**
 * Export format
 */
export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

/**
 * PDF export options
 */
export interface PdfExportOptions {
  /** Page orientation */
  orientation?: 'portrait' | 'landscape';
  /** Page size */
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  /** Title */
  title?: string;
  /** Header text */
  header?: string;
  /** Footer text */
  footer?: string;
  /** Show page numbers */
  showPageNumbers?: boolean;
  /** Custom styles */
  styles?: any;
}

