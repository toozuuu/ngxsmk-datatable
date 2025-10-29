import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  MobileIntegrationConfig,
  TouchGestureConfig,
  HapticFeedbackType,
  NetworkStatus,
  AppState,
  CameraCaptureOptions,
  ShareOptions,
  OfflineModeConfig
} from '../interfaces/mobile-integration.interface';

/**
 * Mobile Integration Service
 * Helpers for Ionic and Capacitor
 */
@Injectable({
  providedIn: 'root'
})
export class MobileIntegrationService {
  private config: MobileIntegrationConfig | null = null;
  private networkStatusSubject = new BehaviorSubject<NetworkStatus>({
    connected: true,
    online: true,
    connectionType: 'unknown'
  });
  private appStateSubject = new BehaviorSubject<AppState>({
    isActive: true,
    state: 'active'
  });

  readonly networkStatus$ = this.networkStatusSubject.asObservable();
  readonly appState$ = this.appStateSubject.asObservable();

  private capacitorAvailable = false;
  private ionicAvailable = false;

  constructor() {
    this.detectPlatform();
    this.initializeListeners();
  }

  /**
   * Initialize mobile integration
   */
  async initialize(config: MobileIntegrationConfig): Promise<void> {
    this.config = config;

    // Setup touch optimizations
    if (config.touchOptimizations) {
      this.setupTouchOptimizations();
    }

    // Setup device features
    if (config.deviceFeatures) {
      await this.setupDeviceFeatures();
    }

    // Setup offline support
    if (config.offlineSupport) {
      this.setupOfflineSupport();
    }
  }

  /**
   * Check if running on mobile
   */
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Get platform
   */
  getPlatform(): 'ios' | 'android' | 'web' {
    if (this.config?.platform && this.config.platform !== 'auto') {
      return this.config.platform;
    }

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      return 'ios';
    }
    
    if (/Android/.test(navigator.userAgent)) {
      return 'android';
    }

    return 'web';
  }

  /**
   * Capture photo
   */
  async capturePhoto(options?: CameraCaptureOptions): Promise<string> {
    if (!this.capacitorAvailable) {
      throw new Error('Camera not available');
    }

    try {
      // @ts-ignore - Optional peer dependency
      const { Camera } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: options?.quality || 90,
        resultType: options?.resultType as any || 'base64',
        source: options?.source as any || 'prompt',
        allowEditing: options?.allowEditing,
        width: options?.width,
        height: options?.height,
        saveToGallery: options?.saveToGallery
      });

      return image.base64String || image.webPath || '';
    } catch (error) {
      throw new Error('Failed to capture photo');
    }
  }

  /**
   * Share content
   */
  async share(options: ShareOptions): Promise<void> {
    if (!this.capacitorAvailable) {
      // Fallback to Web Share API
      if (navigator.share) {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url
        });
        return;
      }
      throw new Error('Share not available');
    }

    try {
      // @ts-ignore - Optional peer dependency
      const { Share } = await import('@capacitor/share');
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle
      });
    } catch (error) {
      throw new Error('Failed to share');
    }
  }

  /**
   * Copy to clipboard
   */
  async copyToClipboard(text: string): Promise<void> {
    if (this.capacitorAvailable) {
      try {
        // @ts-ignore - Optional peer dependency
        const { Clipboard } = await import('@capacitor/clipboard');
        await Clipboard.write({ string: text });
        return;
      } catch {}
    }

    // Fallback to web API
    await navigator.clipboard.writeText(text);
  }

  /**
   * Haptic feedback
   */
  async hapticFeedback(type: HapticFeedbackType = 'impact-light'): Promise<void> {
    if (!this.capacitorAvailable || !this.config?.nativeFeatures?.haptics) {
      return;
    }

    try {
      // @ts-ignore - Optional peer dependency
      const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');

      if (type.startsWith('impact-')) {
        const style = type === 'impact-heavy' ? ImpactStyle.Heavy :
                     type === 'impact-medium' ? ImpactStyle.Medium :
                     ImpactStyle.Light;
        await Haptics.impact({ style });
      } else if (type.startsWith('notification-')) {
        const notifType = type === 'notification-success' ? NotificationType.Success :
                         type === 'notification-warning' ? NotificationType.Warning :
                         NotificationType.Error;
        await Haptics.notification({ type: notifType });
      } else if (type === 'selection') {
        await Haptics.selectionStart();
        await Haptics.selectionChanged();
        await Haptics.selectionEnd();
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Show toast message
   */
  async showToast(message: string, duration = 2000): Promise<void> {
    if (this.capacitorAvailable) {
      try {
        // @ts-ignore - Optional peer dependency
        const { Toast } = await import('@capacitor/toast');
        await Toast.show({
          text: message,
          duration: duration === 2000 ? 'short' : 'long'
        });
        return;
      } catch {}
    }

    // Fallback: Create simple toast
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:12px 24px;border-radius:4px;z-index:9999';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, duration);
  }

  /**
   * Get network status
   */
  getNetworkStatus(): NetworkStatus {
    return this.networkStatusSubject.value;
  }

  /**
   * Get app state
   */
  getAppState(): AppState {
    return this.appStateSubject.value;
  }

  /**
   * Setup touch optimizations
   */
  private setupTouchOptimizations(): void {
    // Add touch-friendly CSS
    const style = document.createElement('style');
    style.textContent = `
      .ngxsmk-datatable {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      .ngxsmk-datatable-row {
        min-height: 44px; /* iOS recommended touch target */
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup device features
   */
  private async setupDeviceFeatures(): Promise<void> {
    if (!this.capacitorAvailable) return;

    const features = this.config?.deviceFeatures;

    // Keep screen awake
    if (features?.keepAwake) {
      try {
        // @ts-ignore - Optional peer dependency
        const { KeepAwake } = await import('@capacitor-community/keep-awake');
        await KeepAwake.keepAwake();
      } catch {}
    }

    // Setup status bar
    if (features?.statusBar) {
      try {
        // @ts-ignore - Optional peer dependency
        const { StatusBar } = await import('@capacitor/status-bar');
        if (features.statusBar.show) {
          await StatusBar.show();
        } else {
          await StatusBar.hide();
        }
        
        if (features.statusBar.backgroundColor) {
          await StatusBar.setBackgroundColor({
            color: features.statusBar.backgroundColor
          });
        }
      } catch {}
    }
  }

  /**
   * Setup offline support
   */
  private setupOfflineSupport(): void {
    // Monitor network status
    window.addEventListener('online', () => {
      this.networkStatusSubject.next({
        connected: true,
        online: true,
        connectionType: 'unknown'
      });
    });

    window.addEventListener('offline', () => {
      this.networkStatusSubject.next({
        connected: false,
        online: false,
        connectionType: 'none'
      });
    });
  }

  /**
   * Detect platform capabilities
   */
  private detectPlatform(): void {
    // Check for Capacitor
    this.capacitorAvailable = !!(window as any).Capacitor;
    
    // Check for Ionic
    this.ionicAvailable = !!(window as any).Ionic;
  }

  /**
   * Initialize listeners
   */
  private initializeListeners(): void {
    // App state listeners
    document.addEventListener('visibilitychange', () => {
      const isActive = document.visibilityState === 'visible';
      this.appStateSubject.next({
        isActive,
        state: isActive ? 'active' : 'background'
      });
    });

    // Capacitor app state
    if (this.capacitorAvailable) {
      this.initializeCapacitorListeners();
    }
  }

  /**
   * Initialize Capacitor listeners
   */
  private async initializeCapacitorListeners(): Promise<void> {
    try {
      // @ts-ignore - Optional peer dependency
      const { App } = await import('@capacitor/app');
      
      App.addListener('appStateChange', (state: any) => {
        this.appStateSubject.next({
          isActive: state.isActive,
          state: state.isActive ? 'active' : 'background'
        });
      });
    } catch (error) {
      console.warn('Failed to setup Capacitor listeners:', error);
    }
  }
}

