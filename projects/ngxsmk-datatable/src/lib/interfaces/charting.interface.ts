/**
 * Advanced Charting Integration
 * Sparklines, mini charts, and inline visualizations
 */

/**
 * Chart types supported
 */
export type ChartType = 
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'sparkline'
  | 'bullet'
  | 'progress'
  | 'gauge';

/**
 * Charting configuration
 */
export interface ChartingConfig {
  /** Enable charting */
  enabled?: boolean;
  
  /** Default chart height */
  defaultHeight?: number;
  
  /** Default chart width */
  defaultWidth?: number;
  
  /** Color scheme */
  colorScheme?: string[];
  
  /** Animation enabled */
  animated?: boolean;
  
  /** Animation duration (ms) */
  animationDuration?: number;
  
  /** Show tooltips */
  showTooltips?: boolean;
  
  /** Tooltip formatter */
  tooltipFormatter?: (value: any) => string;
  
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Column chart configuration
 */
export interface ColumnChartConfig {
  /** Chart type */
  type: ChartType;
  
  /** Data field(s) to chart */
  dataField: string | string[];
  
  /** Chart width */
  width?: number;
  
  /** Chart height */
  height?: number;
  
  /** Chart colors */
  colors?: string[];
  
  /** Minimum value */
  min?: number;
  
  /** Maximum value */
  max?: number;
  
  /** Show labels */
  showLabels?: boolean;
  
  /** Show grid */
  showGrid?: boolean;
  
  /** Show axis */
  showAxis?: boolean;
  
  /** Custom renderer */
  renderer?: (data: any[], config: ColumnChartConfig) => string;
  
  /** Chart options specific to type */
  options?: SparklineOptions | BulletChartOptions | GaugeOptions | ProgressOptions;
}

/**
 * Sparkline chart options
 */
export interface SparklineOptions {
  /** Line width */
  lineWidth?: number;
  
  /** Line color */
  lineColor?: string;
  
  /** Fill area */
  fillArea?: boolean;
  
  /** Fill color */
  fillColor?: string;
  
  /** Show dots */
  showDots?: boolean;
  
  /** Dot radius */
  dotRadius?: number;
  
  /** Highlight min/max */
  highlightMinMax?: boolean;
  
  /** Min color */
  minColor?: string;
  
  /** Max color */
  maxColor?: string;
  
  /** Show last value */
  showLastValue?: boolean;
  
  /** Curve type */
  curve?: 'linear' | 'smooth' | 'step';
}

/**
 * Bullet chart options
 */
export interface BulletChartOptions {
  /** Current value */
  value: number;
  
  /** Target value */
  target?: number;
  
  /** Ranges for performance */
  ranges?: BulletRange[];
  
  /** Bar height */
  barHeight?: number;
  
  /** Value color */
  valueColor?: string;
  
  /** Target color */
  targetColor?: string;
  
  /** Show labels */
  showLabels?: boolean;
  
  /** Label format */
  labelFormat?: (value: number) => string;
}

/**
 * Bullet chart range
 */
export interface BulletRange {
  /** Range start */
  from: number;
  
  /** Range end */
  to: number;
  
  /** Range color */
  color: string;
  
  /** Range label */
  label?: string;
}

/**
 * Gauge options
 */
export interface GaugeOptions {
  /** Current value */
  value: number;
  
  /** Minimum value */
  min?: number;
  
  /** Maximum value */
  max?: number;
  
  /** Gauge type */
  gaugeType?: 'full' | 'semi' | 'arch';
  
  /** Threshold zones */
  zones?: GaugeZone[];
  
  /** Needle color */
  needleColor?: string;
  
  /** Show value */
  showValue?: boolean;
  
  /** Value format */
  valueFormat?: (value: number) => string;
  
  /** Label */
  label?: string;
}

/**
 * Gauge zone
 */
export interface GaugeZone {
  /** Zone start */
  from: number;
  
  /** Zone end */
  to: number;
  
  /** Zone color */
  color: string;
}

/**
 * Progress bar options
 */
export interface ProgressOptions {
  /** Current value */
  value: number;
  
  /** Maximum value */
  max?: number;
  
  /** Progress color */
  color?: string;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Show percentage */
  showPercentage?: boolean;
  
  /** Bar height */
  height?: number;
  
  /** Border radius */
  borderRadius?: number;
  
  /** Striped */
  striped?: boolean;
  
  /** Animated stripes */
  animated?: boolean;
  
  /** Status */
  status?: 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  /** X value */
  x?: number | string | Date;
  
  /** Y value */
  y: number;
  
  /** Label */
  label?: string;
  
  /** Color */
  color?: string;
  
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Mini chart configuration for row
 */
export interface MiniChartConfig {
  /** Chart type */
  type: ChartType;
  
  /** Data */
  data: ChartDataPoint[];
  
  /** Width */
  width?: number;
  
  /** Height */
  height?: number;
  
  /** Options */
  options?: any;
}

