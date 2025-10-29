/**
 * PDF Export Configuration and Types
 * Provides comprehensive PDF generation with custom templates
 */

/**
 * PDF page orientation
 */
export type PdfOrientation = 'portrait' | 'landscape';

/**
 * PDF page size
 */
export type PdfPageSize = 'A4' | 'A3' | 'letter' | 'legal' | 'tabloid';

/**
 * PDF export format options (Advanced)
 * Note: For simple exports, see PdfExportOptions in export.interface.ts
 */
export interface PdfAdvancedExportOptions {
  /** Document orientation */
  orientation?: PdfOrientation;
  
  /** Page size */
  pageSize?: PdfPageSize;
  
  /** Document title */
  title?: string;
  
  /** Document author */
  author?: string;
  
  /** Include header on each page */
  includeHeader?: boolean;
  
  /** Include footer on each page */
  includeFooter?: boolean;
  
  /** Custom header template */
  headerTemplate?: string | ((pageNum: number, totalPages: number) => string);
  
  /** Custom footer template */
  footerTemplate?: string | ((pageNum: number, totalPages: number) => string);
  
  /** Include table borders */
  includeBorders?: boolean;
  
  /** Include alternating row colors */
  includeAlternatingRows?: boolean;
  
  /** Custom styles */
  styles?: PdfStyleConfig;
  
  /** Columns to include (if not specified, all visible columns) */
  columns?: string[];
  
  /** Include images */
  includeImages?: boolean;
  
  /** Compress PDF */
  compress?: boolean;
  
  /** Add watermark */
  watermark?: PdfWatermark;
  
  /** Page margins */
  margins?: PdfMargins;
  
  /** Font size */
  fontSize?: number;
  
  /** Font family */
  fontFamily?: string;
  
  /** Logo to include in header */
  logo?: string | Blob;
  
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * PDF style configuration
 */
export interface PdfStyleConfig {
  /** Header background color */
  headerBackground?: string;
  
  /** Header text color */
  headerColor?: string;
  
  /** Row background color */
  rowBackground?: string;
  
  /** Alternating row background color */
  alternateRowBackground?: string;
  
  /** Text color */
  textColor?: string;
  
  /** Border color */
  borderColor?: string;
  
  /** Border width */
  borderWidth?: number;
  
  /** Cell padding */
  cellPadding?: number;
  
  /** Line height */
  lineHeight?: number;
}

/**
 * PDF watermark configuration
 */
export interface PdfWatermark {
  /** Watermark text */
  text: string;
  
  /** Opacity (0-1) */
  opacity?: number;
  
  /** Font size */
  fontSize?: number;
  
  /** Color */
  color?: string;
  
  /** Angle (degrees) */
  angle?: number;
}

/**
 * PDF page margins
 */
export interface PdfMargins {
  /** Top margin */
  top?: number;
  
  /** Right margin */
  right?: number;
  
  /** Bottom margin */
  bottom?: number;
  
  /** Left margin */
  left?: number;
}

/**
 * PDF generation result
 */
export interface PdfExportResult {
  /** Generated blob */
  blob: Blob;
  
  /** File size in bytes */
  size: number;
  
  /** Number of pages */
  pages: number;
  
  /** Generation time in ms */
  generationTime: number;
  
  /** Success status */
  success: boolean;
  
  /** Error message if failed */
  error?: string;
}

/**
 * PDF template configuration
 */
export interface PdfTemplate {
  /** Template name */
  name: string;
  
  /** Template description */
  description?: string;
  
  /** Header template HTML */
  header?: string;
  
  /** Footer template HTML */
  footer?: string;
  
  /** Body template HTML */
  body?: string;
  
  /** Template styles */
  styles?: PdfStyleConfig;
  
  /** Template options */
  options?: PdfAdvancedExportOptions;
}

