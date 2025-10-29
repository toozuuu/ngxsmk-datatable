import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Plugin,
  PluginConfig,
  PluginContext,
  PluginManager,
  PluginMetadata,
  PluginLifecycle,
  PluginValidation,
  PluginEventEmitter,
  PluginStorage,
  PluginLogger
} from '../interfaces/plugin.interface';

/**
 * Plugin Service
 * Extensible plugin system for custom extensions
 */
@Injectable({
  providedIn: 'root'
})
export class PluginService implements PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private metadata: Map<string, PluginMetadata> = new Map();
  private config: PluginConfig | null = null;
  private datatableInstance: any;

  private pluginsSubject = new BehaviorSubject<Plugin[]>([]);
  readonly plugins$ = this.pluginsSubject.asObservable();

  private eventEmitter: PluginEventEmitter = this.createEventEmitter();
  private storage: PluginStorage = this.createStorage();
  private logger: PluginLogger = this.createLogger();

  constructor() {}

  /**
   * Initialize plugin system
   */
  async initialize(config: PluginConfig, datatableInstance: any): Promise<void> {
    this.config = config;
    this.datatableInstance = datatableInstance;

    if (config.autoLoad && config.plugins) {
      for (const plugin of config.plugins) {
        await this.register(plugin);
      }
    }
  }

  /**
   * Register plugin
   */
  async register(plugin: Plugin): Promise<void> {
    // Validate plugin
    const validation = this.validatePlugin(plugin);
    if (!validation.valid) {
      throw new Error(`Plugin validation failed: ${validation.errors?.join(', ')}`);
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const depId of plugin.dependencies) {
        if (!this.isLoaded(depId)) {
          throw new Error(`Missing dependency: ${depId}`);
        }
      }
    }

    this.plugins.set(plugin.id, plugin);
    
    // Initialize metadata
    this.metadata.set(plugin.id, {
      id: plugin.id,
      state: PluginLifecycle.REGISTERED,
      stats: {
        hooksExecuted: 0,
        apiCalls: 0,
        eventsEmitted: 0
      }
    });

    // Initialize plugin
    if (plugin.initialize) {
      try {
        this.updateMetadata(plugin.id, { state: PluginLifecycle.INITIALIZING });
        
        const context = this.createContext();
        await plugin.initialize(context);
        
        this.updateMetadata(plugin.id, { state: PluginLifecycle.INITIALIZED });
      } catch (error: any) {
        this.updateMetadata(plugin.id, { 
          state: PluginLifecycle.ERROR,
          error: error.message
        });
        throw error;
      }
    }

    // Enable if specified
    if (plugin.enabled !== false) {
      this.enable(plugin.id);
    }

    this.pluginsSubject.next(Array.from(this.plugins.values()));
  }

  /**
   * Unregister plugin
   */
  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    // Destroy plugin
    if (plugin.destroy) {
      this.updateMetadata(pluginId, { state: PluginLifecycle.DESTROYING });
      await plugin.destroy();
    }

    this.plugins.delete(pluginId);
    this.metadata.delete(pluginId);
    
    this.pluginsSubject.next(Array.from(this.plugins.values()));
  }

  /**
   * Get plugin
   */
  get(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all plugins
   */
  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Enable plugin
   */
  enable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = true;
      this.updateMetadata(pluginId, { state: PluginLifecycle.ENABLED });
    }
  }

  /**
   * Disable plugin
   */
  disable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = false;
      this.updateMetadata(pluginId, { state: PluginLifecycle.DISABLED });
    }
  }

  /**
   * Check if plugin is loaded
   */
  isLoaded(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  /**
   * Execute hook
   */
  async executeHook(hookName: string, ...args: any[]): Promise<any> {
    const results: any[] = [];

    for (const plugin of this.plugins.values()) {
      if (!plugin.enabled || !plugin.hooks) continue;

      const hook = (plugin.hooks as any)[hookName];
      if (typeof hook === 'function') {
        try {
          const result = await hook(...args);
          results.push(result);
          
          // Update stats
          const meta = this.metadata.get(plugin.id);
          if (meta?.stats) {
            meta.stats.hooksExecuted = (meta.stats.hooksExecuted || 0) + 1;
          }
        } catch (error) {
          this.logger.error(`Error executing hook ${hookName} in plugin ${plugin.id}:`, error);
        }
      }
    }

    // Return last non-undefined result or original args
    return results.filter(r => r !== undefined).pop() || args[0];
  }

  /**
   * Call plugin API
   */
  callApi(pluginId: string, method: string, ...args: any[]): any {
    const plugin = this.plugins.get(pluginId);
    if (!plugin?.api) {
      throw new Error(`Plugin ${pluginId} has no API`);
    }

    const fn = (plugin.api as any)[method];
    if (typeof fn !== 'function') {
      throw new Error(`Method ${method} not found in plugin ${pluginId} API`);
    }

    // Update stats
    const meta = this.metadata.get(pluginId);
    if (meta?.stats) {
      meta.stats.apiCalls = (meta.stats.apiCalls || 0) + 1;
    }

    return fn(...args);
  }

  /**
   * Validate plugin
   */
  private validatePlugin(plugin: Plugin): PluginValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!plugin.id) errors.push('Plugin ID is required');
    if (!plugin.name) errors.push('Plugin name is required');
    if (!plugin.version) errors.push('Plugin version is required');

    if (this.plugins.has(plugin.id)) {
      errors.push(`Plugin with ID ${plugin.id} is already registered`);
    }

    const missingDependencies: string[] = [];
    if (plugin.dependencies) {
      for (const depId of plugin.dependencies) {
        if (!this.isLoaded(depId)) {
          missingDependencies.push(depId);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      missingDependencies: missingDependencies.length > 0 ? missingDependencies : undefined
    };
  }

  /**
   * Create plugin context
   */
  private createContext(): PluginContext {
    return {
      datatable: this.datatableInstance,
      pluginManager: this,
      events: this.eventEmitter,
      storage: this.storage,
      logger: this.logger,
      config: this.config?.plugins || []
    };
  }

  /**
   * Create event emitter
   */
  private createEventEmitter(): PluginEventEmitter {
    const listeners = new Map<string, Set<Function>>();

    return {
      emit: (event: string, data?: any) => {
        const eventListeners = listeners.get(event);
        if (eventListeners) {
          eventListeners.forEach(handler => handler(data));
        }
      },
      on: (event: string, handler: (data: any) => void) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set());
        }
        listeners.get(event)!.add(handler);
        return () => this.eventEmitter.off(event, handler);
      },
      once: (event: string, handler: (data: any) => void) => {
        const wrappedHandler = (data: any) => {
          handler(data);
          this.eventEmitter.off(event, wrappedHandler);
        };
        this.eventEmitter.on(event, wrappedHandler);
      },
      off: (event: string, handler?: (data: any) => void) => {
        if (!handler) {
          listeners.delete(event);
        } else {
          listeners.get(event)?.delete(handler);
        }
      }
    };
  }

  /**
   * Create storage
   */
  private createStorage(): PluginStorage {
    const storageKey = 'ngxsmk-plugin-storage';
    
    const getStorage = (): Record<string, any> => {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    };

    const setStorage = (data: Record<string, any>) => {
      localStorage.setItem(storageKey, JSON.stringify(data));
    };

    return {
      get: (key: string) => {
        return getStorage()[key];
      },
      set: (key: string, value: any) => {
        const storage = getStorage();
        storage[key] = value;
        setStorage(storage);
      },
      remove: (key: string) => {
        const storage = getStorage();
        delete storage[key];
        setStorage(storage);
      },
      clear: () => {
        localStorage.removeItem(storageKey);
      },
      has: (key: string) => {
        return key in getStorage();
      }
    };
  }

  /**
   * Create logger
   */
  private createLogger(): PluginLogger {
    const createLog = (level: string) => (message: string, ...args: any[]) => {
      console[level as 'log'](`[PluginSystem] ${message}`, ...args);
    };

    return {
      info: createLog('log'),
      warn: createLog('warn'),
      error: createLog('error'),
      debug: createLog('debug')
    };
  }

  /**
   * Update plugin metadata
   */
  private updateMetadata(pluginId: string, updates: Partial<PluginMetadata>): void {
    const current = this.metadata.get(pluginId);
    if (current) {
      this.metadata.set(pluginId, { ...current, ...updates });
    }
  }
}

