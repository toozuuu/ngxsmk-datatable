/**
 * Advanced Theming System
 * Theme builder and customization
 */

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Theme name */
  name: string;
  
  /** Theme type */
  type?: 'light' | 'dark' | 'auto';
  
  /** Base theme to extend */
  extends?: string;
  
  /** Color palette */
  colors?: ThemeColors;
  
  /** Typography */
  typography?: ThemeTypography;
  
  /** Spacing */
  spacing?: ThemeSpacing;
  
  /** Borders */
  borders?: ThemeBorders;
  
  /** Shadows */
  shadows?: ThemeShadows;
  
  /** Animations */
  animations?: ThemeAnimations;
  
  /** Component overrides */
  components?: ComponentThemeOverrides;
  
  /** CSS variables */
  cssVariables?: Record<string, string>;
  
  /** Custom CSS */
  customCss?: string;
}

/**
 * Theme colors
 */
export interface ThemeColors {
  /** Primary color */
  primary?: string;
  
  /** Secondary color */
  secondary?: string;
  
  /** Success color */
  success?: string;
  
  /** Warning color */
  warning?: string;
  
  /** Danger/error color */
  danger?: string;
  
  /** Info color */
  info?: string;
  
  /** Background color */
  background?: string;
  
  /** Surface color */
  surface?: string;
  
  /** Text color */
  text?: string;
  
  /** Text secondary color */
  textSecondary?: string;
  
  /** Border color */
  border?: string;
  
  /** Divider color */
  divider?: string;
  
  /** Disabled color */
  disabled?: string;
  
  /** Hover color */
  hover?: string;
  
  /** Active color */
  active?: string;
  
  /** Selected color */
  selected?: string;
  
  /** Header background */
  headerBackground?: string;
  
  /** Header text */
  headerText?: string;
  
  /** Row background */
  rowBackground?: string;
  
  /** Alternate row background */
  alternateRowBackground?: string;
  
  /** Footer background */
  footerBackground?: string;
  
  /** Scrollbar color */
  scrollbar?: string;
  
  /** Custom colors */
  custom?: Record<string, string>;
}

/**
 * Theme typography
 */
export interface ThemeTypography {
  /** Font family */
  fontFamily?: string;
  
  /** Font size base */
  fontSize?: string;
  
  /** Font weight normal */
  fontWeight?: number;
  
  /** Font weight bold */
  fontWeightBold?: number;
  
  /** Line height */
  lineHeight?: number;
  
  /** Letter spacing */
  letterSpacing?: string;
  
  /** Heading font family */
  headingFontFamily?: string;
  
  /** Heading font weight */
  headingFontWeight?: number;
  
  /** Font sizes */
  fontSizes?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };
}

/**
 * Theme spacing
 */
export interface ThemeSpacing {
  /** Base unit (px) */
  unit?: number;
  
  /** Cell padding */
  cellPadding?: string;
  
  /** Row padding */
  rowPadding?: string;
  
  /** Header padding */
  headerPadding?: string;
  
  /** Container padding */
  containerPadding?: string;
  
  /** Gap */
  gap?: string;
}

/**
 * Theme borders
 */
export interface ThemeBorders {
  /** Border width */
  width?: string;
  
  /** Border style */
  style?: string;
  
  /** Border color */
  color?: string;
  
  /** Border radius */
  radius?: string;
  
  /** Table border */
  tableBorder?: string;
  
  /** Cell border */
  cellBorder?: string;
  
  /** Row border */
  rowBorder?: string;
}

/**
 * Theme shadows
 */
export interface ThemeShadows {
  /** Small shadow */
  sm?: string;
  
  /** Medium shadow */
  md?: string;
  
  /** Large shadow */
  lg?: string;
  
  /** Extra large shadow */
  xl?: string;
  
  /** Table shadow */
  table?: string;
  
  /** Header shadow */
  header?: string;
}

/**
 * Theme animations
 */
export interface ThemeAnimations {
  /** Animation duration */
  duration?: string;
  
  /** Animation timing function */
  timing?: string;
  
  /** Hover animation */
  hover?: string;
  
  /** Selection animation */
  selection?: string;
  
  /** Sort animation */
  sort?: string;
  
  /** Row animation */
  row?: string;
}

/**
 * Component theme overrides
 */
export interface ComponentThemeOverrides {
  /** Table overrides */
  table?: Record<string, any>;
  
  /** Header overrides */
  header?: Record<string, any>;
  
  /** Row overrides */
  row?: Record<string, any>;
  
  /** Cell overrides */
  cell?: Record<string, any>;
  
  /** Pager overrides */
  pager?: Record<string, any>;
  
  /** Filter overrides */
  filter?: Record<string, any>;
  
  /** Toolbar overrides */
  toolbar?: Record<string, any>;
}

/**
 * Theme builder configuration
 */
export interface ThemeBuilderConfig {
  /** Enable theme builder UI */
  enabled?: boolean;
  
  /** Show color picker */
  showColorPicker?: boolean;
  
  /** Show typography editor */
  showTypographyEditor?: boolean;
  
  /** Show spacing editor */
  showSpacingEditor?: boolean;
  
  /** Allow export */
  allowExport?: boolean;
  
  /** Allow import */
  allowImport?: boolean;
  
  /** Live preview */
  livePreview?: boolean;
  
  /** Save to localStorage */
  saveToStorage?: boolean;
  
  /** Storage key */
  storageKey?: string;
}

/**
 * Predefined themes
 */
export enum PredefinedThemes {
  MATERIAL = 'material',
  MATERIAL_DARK = 'material-dark',
  BOOTSTRAP = 'bootstrap',
  FLUENT = 'fluent',
  ANTD = 'antd',
  TAILWIND = 'tailwind',
  MINIMAL = 'minimal',
  CLASSIC = 'classic',
  MODERN = 'modern',
  CORPORATE = 'corporate',
  VIBRANT = 'vibrant'
}

/**
 * Theme export format
 */
export interface ThemeExport {
  /** Theme configuration */
  theme: ThemeConfig;
  
  /** Export version */
  version: string;
  
  /** Export date */
  exportDate: string;
  
  /** Generated CSS */
  css?: string;
  
  /** CSS variables */
  cssVariables?: Record<string, string>;
}

/**
 * Color scheme
 */
export interface ColorScheme {
  /** Scheme name */
  name: string;
  
  /** Primary color */
  primary: string;
  
  /** Accent color */
  accent: string;
  
  /** Background */
  background: string;
  
  /** Text color */
  text: string;
  
  /** Generated palette */
  palette?: string[];
}

