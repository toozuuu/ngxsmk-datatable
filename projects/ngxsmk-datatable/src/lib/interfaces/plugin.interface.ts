/**
 * Plugin System
 * Extensible architecture for custom plugins
 */

/**
 * Plugin configuration
 */
export interface PluginConfig {
  /** Enable plugin system */
  enabled?: boolean;
  
  /** Registered plugins */
  plugins?: Plugin[];
  
  /** Auto-load plugins */
  autoLoad?: boolean;
  
  /** Plugin load order */
  loadOrder?: string[];
  
  /** Allow third-party plugins */
  allowThirdParty?: boolean;
  
  /** Plugin sandbox mode */
  sandboxMode?: boolean;
}

/**
 * Base plugin interface
 */
export interface Plugin {
  /** Plugin ID */
  id: string;
  
  /** Plugin name */
  name: string;
  
  /** Plugin version */
  version: string;
  
  /** Plugin description */
  description?: string;
  
  /** Plugin author */
  author?: string;
  
  /** Plugin dependencies */
  dependencies?: string[];
  
  /** Plugin initialization */
  initialize?: (context: PluginContext) => void | Promise<void>;
  
  /** Plugin destroy/cleanup */
  destroy?: () => void | Promise<void>;
  
  /** Plugin enabled */
  enabled?: boolean;
  
  /** Plugin configuration */
  config?: Record<string, any>;
  
  /** Plugin hooks */
  hooks?: PluginHooks;
  
  /** Plugin API */
  api?: Record<string, Function>;
}

/**
 * Plugin context
 */
export interface PluginContext {
  /** Datatable instance */
  datatable: any;
  
  /** Plugin manager */
  pluginManager: PluginManager;
  
  /** Event emitter */
  events: PluginEventEmitter;
  
  /** Storage API */
  storage: PluginStorage;
  
  /** HTTP client */
  http?: any;
  
  /** Logger */
  logger?: PluginLogger;
  
  /** Configuration */
  config: Record<string, any>;
}

/**
 * Plugin hooks
 */
export interface PluginHooks {
  /** Before data load */
  beforeDataLoad?: (data: any[]) => any[] | Promise<any[]>;
  
  /** After data load */
  afterDataLoad?: (data: any[]) => void | Promise<void>;
  
  /** Before render */
  beforeRender?: (data: any[]) => void | Promise<void>;
  
  /** After render */
  afterRender?: () => void | Promise<void>;
  
  /** Before cell render */
  beforeCellRender?: (cell: any) => any;
  
  /** After cell render */
  afterCellRender?: (cell: any, element: HTMLElement) => void;
  
  /** Before row render */
  beforeRowRender?: (row: any) => any;
  
  /** After row render */
  afterRowRender?: (row: any, element: HTMLElement) => void;
  
  /** Before sort */
  beforeSort?: (field: string, direction: string) => boolean;
  
  /** After sort */
  afterSort?: (field: string, direction: string) => void;
  
  /** Before filter */
  beforeFilter?: (filters: any) => any;
  
  /** After filter */
  afterFilter?: (filters: any) => void;
  
  /** Before selection */
  beforeSelection?: (rows: any[]) => boolean;
  
  /** After selection */
  afterSelection?: (rows: any[]) => void;
  
  /** Before edit */
  beforeEdit?: (row: any, field: string, value: any) => boolean;
  
  /** After edit */
  afterEdit?: (row: any, field: string, value: any) => void;
  
  /** Before export */
  beforeExport?: (data: any[], format: string) => any[];
  
  /** After export */
  afterExport?: (blob: Blob, format: string) => void;
  
  /** Custom hooks */
  custom?: Record<string, Function>;
}

/**
 * Plugin manager
 */
export interface PluginManager {
  /** Register plugin */
  register(plugin: Plugin): void;
  
  /** Unregister plugin */
  unregister(pluginId: string): void;
  
  /** Get plugin */
  get(pluginId: string): Plugin | undefined;
  
  /** Get all plugins */
  getAll(): Plugin[];
  
  /** Enable plugin */
  enable(pluginId: string): void;
  
  /** Disable plugin */
  disable(pluginId: string): void;
  
  /** Check if plugin is loaded */
  isLoaded(pluginId: string): boolean;
  
  /** Execute hook */
  executeHook(hookName: string, ...args: any[]): Promise<any>;
  
  /** Call plugin API */
  callApi(pluginId: string, method: string, ...args: any[]): any;
}

/**
 * Plugin event emitter
 */
export interface PluginEventEmitter {
  /** Emit event */
  emit(event: string, data?: any): void;
  
  /** Listen to event */
  on(event: string, handler: (data: any) => void): () => void;
  
  /** Listen to event once */
  once(event: string, handler: (data: any) => void): void;
  
  /** Remove event listener */
  off(event: string, handler?: (data: any) => void): void;
}

/**
 * Plugin storage
 */
export interface PluginStorage {
  /** Get item */
  get(key: string): any;
  
  /** Set item */
  set(key: string, value: any): void;
  
  /** Remove item */
  remove(key: string): void;
  
  /** Clear all */
  clear(): void;
  
  /** Check if key exists */
  has(key: string): boolean;
}

/**
 * Plugin logger
 */
export interface PluginLogger {
  /** Log info */
  info(message: string, ...args: any[]): void;
  
  /** Log warning */
  warn(message: string, ...args: any[]): void;
  
  /** Log error */
  error(message: string, ...args: any[]): void;
  
  /** Log debug */
  debug(message: string, ...args: any[]): void;
}

/**
 * Plugin lifecycle
 */
export enum PluginLifecycle {
  REGISTERED = 'registered',
  INITIALIZING = 'initializing',
  INITIALIZED = 'initialized',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  DESTROYING = 'destroying',
  DESTROYED = 'destroyed',
  ERROR = 'error'
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  /** Plugin ID */
  id: string;
  
  /** Load time */
  loadTime?: number;
  
  /** Lifecycle state */
  state: PluginLifecycle;
  
  /** Error if failed */
  error?: string;
  
  /** Statistics */
  stats?: {
    hooksExecuted?: number;
    apiCalls?: number;
    eventsEmitted?: number;
  };
}

/**
 * Plugin validation result
 */
export interface PluginValidation {
  /** Valid plugin */
  valid: boolean;
  
  /** Errors */
  errors?: string[];
  
  /** Warnings */
  warnings?: string[];
  
  /** Missing dependencies */
  missingDependencies?: string[];
}

