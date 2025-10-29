/**
 * Conditional Formatting
 * Dynamic styling based on cell values and conditions
 */

/**
 * Conditional formatting configuration
 */
export interface ConditionalFormattingConfig {
  /** Enable conditional formatting */
  enabled?: boolean;
  
  /** Formatting rules */
  rules?: ConditionalFormattingRule[];
  
  /** Global rules (apply to all columns) */
  globalRules?: ConditionalFormattingRule[];
  
  /** Priority mode */
  priorityMode?: 'first-match' | 'highest-priority' | 'all';
  
  /** Cache formatted styles */
  cacheStyles?: boolean;
  
  /** Recalculate on data change */
  recalculateOnChange?: boolean;
}

/**
 * Conditional formatting rule
 */
export interface ConditionalFormattingRule {
  /** Rule ID */
  id: string;
  
  /** Rule name */
  name?: string;
  
  /** Rule type */
  type: FormattingRuleType;
  
  /** Column field(s) to apply to */
  fields?: string[];
  
  /** Condition */
  condition: FormattingCondition;
  
  /** Format/style to apply */
  format: CellFormat;
  
  /** Priority (higher = more important) */
  priority?: number;
  
  /** Enabled */
  enabled?: boolean;
  
  /** Stop processing if matched */
  stopIfTrue?: boolean;
}

/**
 * Formatting rule types
 */
export type FormattingRuleType = 
  | 'value'
  | 'range'
  | 'top-bottom'
  | 'above-below-average'
  | 'duplicate'
  | 'unique'
  | 'text-contains'
  | 'date'
  | 'color-scale'
  | 'data-bar'
  | 'icon-set'
  | 'formula'
  | 'custom';

/**
 * Formatting condition
 */
export interface FormattingCondition {
  /** Condition type */
  type: ConditionType;
  
  /** Comparison operator */
  operator?: ComparisonOperator;
  
  /** Value(s) to compare */
  value?: any;
  
  /** Second value (for between) */
  value2?: any;
  
  /** Custom function */
  customFunction?: (cellValue: any, row: any, context: FormattingContext) => boolean;
  
  /** Formula expression */
  formula?: string;
  
  /** Case sensitive (for text conditions) */
  caseSensitive?: boolean;
}

/**
 * Condition types
 */
export enum ConditionType {
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  BETWEEN = 'between',
  NOT_BETWEEN = 'notBetween',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
  TOP_N = 'topN',
  BOTTOM_N = 'bottomN',
  TOP_PERCENT = 'topPercent',
  BOTTOM_PERCENT = 'bottomPercent',
  ABOVE_AVERAGE = 'aboveAverage',
  BELOW_AVERAGE = 'belowAverage',
  DUPLICATE = 'duplicate',
  UNIQUE = 'unique',
  CUSTOM = 'custom'
}

/**
 * Comparison operators
 */
export type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between' | 'contains';

/**
 * Cell format
 */
export interface CellFormat {
  /** Background color */
  backgroundColor?: string;
  
  /** Text color */
  color?: string;
  
  /** Font weight */
  fontWeight?: string | number;
  
  /** Font style */
  fontStyle?: string;
  
  /** Font size */
  fontSize?: string;
  
  /** Text decoration */
  textDecoration?: string;
  
  /** Border */
  border?: string;
  
  /** Border color */
  borderColor?: string;
  
  /** Icon */
  icon?: string;
  
  /** Icon color */
  iconColor?: string;
  
  /** Icon position */
  iconPosition?: 'left' | 'right' | 'before' | 'after';
  
  /** Data bar */
  dataBar?: DataBarFormat;
  
  /** Color scale */
  colorScale?: ColorScaleFormat;
  
  /** Icon set */
  iconSet?: IconSetFormat;
  
  /** Custom CSS */
  customCss?: string;
  
  /** CSS classes */
  cssClasses?: string[];
}

/**
 * Data bar format
 */
export interface DataBarFormat {
  /** Bar color */
  color?: string;
  
  /** Gradient */
  gradient?: boolean;
  
  /** Show value */
  showValue?: boolean;
  
  /** Min value */
  min?: number;
  
  /** Max value */
  max?: number;
  
  /** Direction */
  direction?: 'ltr' | 'rtl';
  
  /** Bar width percentage */
  width?: number;
}

/**
 * Color scale format
 */
export interface ColorScaleFormat {
  /** Type */
  type: '2-color' | '3-color';
  
  /** Minimum color */
  minColor: string;
  
  /** Maximum color */
  maxColor: string;
  
  /** Midpoint color (for 3-color) */
  midColor?: string;
  
  /** Midpoint value */
  midpoint?: number | 'percentile' | 'percent' | 'formula';
  
  /** Min value */
  min?: number;
  
  /** Max value */
  max?: number;
}

/**
 * Icon set format
 */
export interface IconSetFormat {
  /** Icon set name */
  name: 'arrows' | 'traffic-lights' | 'ratings' | 'indicators' | 'custom';
  
  /** Custom icons */
  icons?: string[];
  
  /** Thresholds */
  thresholds?: number[];
  
  /** Reverse order */
  reverse?: boolean;
  
  /** Show icon only */
  iconOnly?: boolean;
}

/**
 * Formatting context
 */
export interface FormattingContext {
  /** Cell value */
  value: any;
  
  /** Row data */
  row: any;
  
  /** Column field */
  field: string;
  
  /** Row index */
  rowIndex?: number;
  
  /** Column index */
  columnIndex?: number;
  
  /** All rows */
  allRows?: any[];
  
  /** Column statistics */
  stats?: ColumnStatistics;
}

/**
 * Column statistics
 */
export interface ColumnStatistics {
  /** Count */
  count: number;
  
  /** Sum */
  sum?: number;
  
  /** Average */
  average?: number;
  
  /** Min value */
  min?: number;
  
  /** Max value */
  max?: number;
  
  /** Median */
  median?: number;
  
  /** Standard deviation */
  stdDev?: number;
  
  /** Unique values */
  uniqueValues?: any[];
}

/**
 * Formatting result
 */
export interface FormattingResult {
  /** Matched rules */
  matchedRules: ConditionalFormattingRule[];
  
  /** Applied format */
  format: CellFormat;
  
  /** CSS classes */
  cssClasses: string[];
  
  /** Inline styles */
  inlineStyles: Record<string, string>;
}

/**
 * Preset formatting rules
 */
export enum PresetFormattingRules {
  HIGHLIGHT_DUPLICATES = 'highlightDuplicates',
  HIGHLIGHT_UNIQUE = 'highlightUnique',
  HIGHLIGHT_TOP_10 = 'highlightTop10',
  HIGHLIGHT_BOTTOM_10 = 'highlightBottom10',
  HIGHLIGHT_ABOVE_AVERAGE = 'highlightAboveAverage',
  HIGHLIGHT_BELOW_AVERAGE = 'highlightBelowAverage',
  DATA_BARS = 'dataBars',
  COLOR_SCALE = 'colorScale',
  ICON_SET = 'iconSet',
  HIGHLIGHT_ERRORS = 'highlightErrors',
  HIGHLIGHT_BLANKS = 'highlightBlanks'
}

