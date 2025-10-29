/**
 * Mobile App Integration
 * Helpers for Ionic and Capacitor
 */

/**
 * Mobile integration configuration
 */
export interface MobileIntegrationConfig {
  /** Enable mobile optimizations */
  enabled?: boolean;
  
  /** Platform */
  platform?: 'ios' | 'android' | 'web' | 'auto';
  
  /** Touch optimizations */
  touchOptimizations?: boolean;
  
  /** Gesture support */
  gestureSupport?: boolean;
  
  /** Native features */
  nativeFeatures?: MobileNativeFeatures;
  
  /** Offline support */
  offlineSupport?: boolean;
  
  /** Performance mode */
  performanceMode?: 'default' | 'optimized' | 'battery-saver';
  
  /** Adaptive layout */
  adaptiveLayout?: boolean;
  
  /** Device features */
  deviceFeatures?: MobileDeviceFeatures;
}

/**
 * Mobile native features
 */
export interface MobileNativeFeatures {
  /** Camera integration */
  camera?: boolean;
  
  /** File system access */
  fileSystem?: boolean;
  
  /** Share API */
  share?: boolean;
  
  /** Clipboard */
  clipboard?: boolean;
  
  /** Haptic feedback */
  haptics?: boolean;
  
  /** Local notifications */
  notifications?: boolean;
  
  /** Biometric auth */
  biometrics?: boolean;
  
  /** QR code scanner */
  qrScanner?: boolean;
  
  /** Barcode scanner */
  barcodeScanner?: boolean;
}

/**
 * Mobile device features
 */
export interface MobileDeviceFeatures {
  /** Device orientation */
  orientation?: 'portrait' | 'landscape' | 'auto';
  
  /** Status bar */
  statusBar?: StatusBarConfig;
  
  /** Safe area */
  safeArea?: boolean;
  
  /** Keyboard */
  keyboard?: KeyboardConfig;
  
  /** Screen brightness */
  brightness?: number;
  
  /** Keep screen awake */
  keepAwake?: boolean;
}

/**
 * Status bar configuration
 */
export interface StatusBarConfig {
  /** Show status bar */
  show?: boolean;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Style */
  style?: 'light' | 'dark';
  
  /** Overlay */
  overlay?: boolean;
}

/**
 * Keyboard configuration
 */
export interface KeyboardConfig {
  /** Resize mode */
  resize?: 'body' | 'native' | 'ionic' | 'none';
  
  /** Auto-scroll */
  autoScroll?: boolean;
  
  /** Accessory bar */
  accessoryBar?: boolean;
}

/**
 * Touch gesture configuration
 */
export interface TouchGestureConfig {
  /** Enable swipe */
  swipe?: boolean;
  
  /** Swipe threshold */
  swipeThreshold?: number;
  
  /** Enable long press */
  longPress?: boolean;
  
  /** Long press duration (ms) */
  longPressDuration?: number;
  
  /** Enable pinch zoom */
  pinchZoom?: boolean;
  
  /** Enable double tap */
  doubleTap?: boolean;
  
  /** Double tap delay (ms) */
  doubleTapDelay?: number;
  
  /** Enable pull to refresh */
  pullToRefresh?: boolean;
}

/**
 * Ionic integration
 */
export interface IonicIntegration {
  /** Use Ionic components */
  useIonicComponents?: boolean;
  
  /** Modal mode */
  modalMode?: boolean;
  
  /** Ion-infinite-scroll */
  infiniteScroll?: boolean;
  
  /** Ion-refresher */
  refresher?: boolean;
  
  /** Ion-searchbar */
  searchbar?: boolean;
  
  /** Ion-fab for actions */
  floatingActionButton?: boolean;
  
  /** Ionic theme */
  theme?: 'ios' | 'md' | 'auto';
}

/**
 * Capacitor integration
 */
export interface CapacitorIntegration {
  /** Capacitor plugins */
  plugins?: CapacitorPlugins;
  
  /** Storage provider */
  storage?: 'sqlite' | 'filesystem' | 'preferences';
  
  /** Camera provider */
  camera?: 'native' | 'web';
  
  /** Network status */
  networkStatus?: boolean;
  
  /** App state */
  appState?: boolean;
}

/**
 * Capacitor plugins configuration
 */
export interface CapacitorPlugins {
  /** Camera */
  camera?: boolean;
  
  /** Filesystem */
  filesystem?: boolean;
  
  /** Share */
  share?: boolean;
  
  /** Clipboard */
  clipboard?: boolean;
  
  /** Haptics */
  haptics?: boolean;
  
  /** Toast */
  toast?: boolean;
  
  /** Dialog */
  dialog?: boolean;
  
  /** Storage */
  storage?: boolean;
  
  /** Network */
  network?: boolean;
  
  /** Device */
  device?: boolean;
}

/**
 * Offline mode configuration
 */
export interface OfflineModeConfig {
  /** Enable offline mode */
  enabled?: boolean;
  
  /** Sync strategy */
  syncStrategy?: 'manual' | 'auto' | 'on-connect';
  
  /** Storage type */
  storageType?: 'localstorage' | 'indexeddb' | 'sqlite';
  
  /** Cache size limit (MB) */
  cacheSizeLimit?: number;
  
  /** Sync on connect */
  syncOnConnect?: boolean;
  
  /** Show sync status */
  showSyncStatus?: boolean;
  
  /** Conflict resolution */
  conflictResolution?: 'local' | 'remote' | 'manual';
}

/**
 * Mobile performance options
 */
export interface MobilePerformanceOptions {
  /** Virtual scrolling */
  virtualScrolling?: boolean;
  
  /** Lazy loading */
  lazyLoading?: boolean;
  
  /** Image optimization */
  imageOptimization?: boolean;
  
  /** Reduce animations */
  reduceAnimations?: boolean;
  
  /** Throttle scroll events */
  throttleScroll?: boolean;
  
  /** Debounce search */
  debounceSearch?: number;
  
  /** Max rendered rows */
  maxRenderedRows?: number;
}

/**
 * Camera capture options
 */
export interface CameraCaptureOptions {
  /** Quality (0-100) */
  quality?: number;
  
  /** Result type */
  resultType?: 'base64' | 'uri' | 'dataUrl';
  
  /** Source */
  source?: 'camera' | 'photos' | 'prompt';
  
  /** Allow editing */
  allowEditing?: boolean;
  
  /** Width */
  width?: number;
  
  /** Height */
  height?: number;
  
  /** Save to gallery */
  saveToGallery?: boolean;
}

/**
 * Share options
 */
export interface ShareOptions {
  /** Title */
  title?: string;
  
  /** Text */
  text?: string;
  
  /** URL */
  url?: string;
  
  /** Files */
  files?: string[];
  
  /** Dialog title */
  dialogTitle?: string;
}

/**
 * Haptic feedback types
 */
export type HapticFeedbackType = 
  | 'impact-light'
  | 'impact-medium'
  | 'impact-heavy'
  | 'notification-success'
  | 'notification-warning'
  | 'notification-error'
  | 'selection';

/**
 * Mobile orientation
 */
export interface MobileOrientation {
  /** Current orientation */
  current: 'portrait' | 'landscape';
  
  /** Lock orientation */
  lock?: 'portrait' | 'landscape' | 'any';
  
  /** Listen to changes */
  listen?: boolean;
}

/**
 * Network status
 */
export interface NetworkStatus {
  /** Connected */
  connected: boolean;
  
  /** Connection type */
  connectionType?: 'wifi' | 'cellular' | 'none' | 'unknown';
  
  /** Online */
  online: boolean;
}

/**
 * App state
 */
export interface AppState {
  /** Active */
  isActive: boolean;
  
  /** State */
  state: 'active' | 'inactive' | 'background';
}

