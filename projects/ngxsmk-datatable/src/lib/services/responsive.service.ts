import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

/**
 * Breakpoint definitions
 */
export interface Breakpoints {
  xs: number;  // Extra small (mobile)
  sm: number;  // Small (tablet)
  md: number;  // Medium (small desktop)
  lg: number;  // Large (desktop)
  xl: number;  // Extra large (large desktop)
}

/**
 * Device type
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Display mode
 */
export type DisplayMode = 'table' | 'card' | 'list';

/**
 * Responsive configuration
 */
export interface ResponsiveConfig {
  /** Enable responsive mode */
  enabled?: boolean;
  /** Breakpoints */
  breakpoints?: Partial<Breakpoints>;
  /** Display mode per breakpoint */
  displayModes?: {
    mobile?: DisplayMode;
    tablet?: DisplayMode;
    desktop?: DisplayMode;
  };
  /** Columns to hide on mobile */
  hiddenColumnsOnMobile?: string[];
  /** Columns to hide on tablet */
  hiddenColumnsOnTablet?: string[];
}

/**
 * Responsive state
 */
export interface ResponsiveState {
  /** Current viewport width */
  width: number;
  /** Current viewport height */
  height: number;
  /** Current device type */
  deviceType: DeviceType;
  /** Current display mode */
  displayMode: DisplayMode;
  /** Is mobile */
  isMobile: boolean;
  /** Is tablet */
  isTablet: boolean;
  /** Is desktop */
  isDesktop: boolean;
  /** Orientation */
  orientation: 'portrait' | 'landscape';
}

/**
 * Service for managing responsive behavior
 */
@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private breakpoints: Breakpoints = {
    xs: 480,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1920
  };

  private state$ = new BehaviorSubject<ResponsiveState>(
    this.calculateState(window.innerWidth, window.innerHeight)
  );

  /**
   * Observable of responsive state
   */
  readonly responsiveState$: Observable<ResponsiveState> = this.state$.asObservable();

  constructor() {
    // Listen to window resize
    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(200),
          map(() => ({
            width: window.innerWidth,
            height: window.innerHeight
          })),
          distinctUntilChanged((prev, curr) =>
            prev.width === curr.width && prev.height === curr.height
          )
        )
        .subscribe(({ width, height }) => {
          this.state$.next(this.calculateState(width, height));
        });
    }
  }

  /**
   * Get current state
   */
  getState(): ResponsiveState {
    return this.state$.value;
  }

  /**
   * Set custom breakpoints
   */
  setBreakpoints(breakpoints: Partial<Breakpoints>): void {
    this.breakpoints = { ...this.breakpoints, ...breakpoints };
    const state = this.calculateState(window.innerWidth, window.innerHeight);
    this.state$.next(state);
  }

  /**
   * Calculate responsive state
   */
  private calculateState(width: number, height: number): ResponsiveState {
    const deviceType = this.getDeviceType(width);
    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType === 'tablet';
    const isDesktop = deviceType === 'desktop';
    const orientation = height > width ? 'portrait' : 'landscape';
    const displayMode = this.getDisplayMode(deviceType);

    return {
      width,
      height,
      deviceType,
      displayMode,
      isMobile,
      isTablet,
      isDesktop,
      orientation
    };
  }

  /**
   * Determine device type from width
   */
  private getDeviceType(width: number): DeviceType {
    if (width < this.breakpoints.sm) {
      return 'mobile';
    } else if (width < this.breakpoints.md) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * Get display mode for device type
   */
  private getDisplayMode(deviceType: DeviceType): DisplayMode {
    switch (deviceType) {
      case 'mobile':
        return 'card';
      case 'tablet':
        return 'table';
      case 'desktop':
        return 'table';
    }
  }

  /**
   * Check if current viewport matches breakpoint
   */
  matches(breakpoint: keyof Breakpoints): boolean {
    const state = this.getState();
    return state.width >= this.breakpoints[breakpoint];
  }

  /**
   * Check if viewport is between breakpoints
   */
  matchesBetween(min: keyof Breakpoints, max: keyof Breakpoints): boolean {
    const state = this.getState();
    return (
      state.width >= this.breakpoints[min] &&
      state.width < this.breakpoints[max]
    );
  }

  /**
   * Get visible columns based on device type
   */
  getVisibleColumns(
    allColumns: any[],
    config: ResponsiveConfig
  ): any[] {
    const state = this.getState();
    
    if (!config.enabled) {
      return allColumns;
    }

    let hiddenIds: string[] = [];
    
    if (state.isMobile && config.hiddenColumnsOnMobile) {
      hiddenIds = config.hiddenColumnsOnMobile;
    } else if (state.isTablet && config.hiddenColumnsOnTablet) {
      hiddenIds = config.hiddenColumnsOnTablet;
    }

    return allColumns.filter(col => !hiddenIds.includes(col.id));
  }

  /**
   * Should use card view
   */
  shouldUseCardView(config?: ResponsiveConfig): boolean {
    const state = this.getState();
    
    if (!config?.enabled) {
      return false;
    }

    const mobileMode = config.displayModes?.mobile || 'card';
    return state.isMobile && mobileMode === 'card';
  }

  /**
   * Should use list view
   */
  shouldUseListView(config?: ResponsiveConfig): boolean {
    const state = this.getState();
    
    if (!config?.enabled) {
      return false;
    }

    const mobileMode = config.displayModes?.mobile || 'card';
    return state.isMobile && mobileMode === 'list';
  }

  /**
   * Get column priority for responsive hiding
   */
  getColumnPriority(column: any): number {
    return column.responsivePriority || 999;
  }

  /**
   * Sort columns by responsive priority
   */
  sortColumnsByPriority(columns: any[]): any[] {
    return [...columns].sort((a, b) => {
      const priorityA = this.getColumnPriority(a);
      const priorityB = this.getColumnPriority(b);
      return priorityA - priorityB;
    });
  }

  /**
   * Calculate optimal column count for viewport
   */
  getOptimalColumnCount(viewportWidth: number, minColumnWidth: number = 150): number {
    return Math.max(1, Math.floor(viewportWidth / minColumnWidth));
  }

  /**
   * Check if touch device
   */
  isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }

  /**
   * Get optimal row height for device
   */
  getOptimalRowHeight(): number {
    const state = this.getState();
    
    if (state.isMobile) {
      return this.isTouchDevice() ? 56 : 48; // Larger for touch
    } else if (state.isTablet) {
      return 50;
    } else {
      return 48;
    }
  }

  /**
   * Check if landscape mode on mobile
   */
  isMobileLandscape(): boolean {
    const state = this.getState();
    return state.isMobile && state.orientation === 'landscape';
  }

  /**
   * Get CSS classes for responsive state
   */
  getResponsiveClasses(): string[] {
    const state = this.getState();
    const classes: string[] = [];

    classes.push(`device-${state.deviceType}`);
    classes.push(`orientation-${state.orientation}`);
    classes.push(`display-${state.displayMode}`);

    if (this.isTouchDevice()) {
      classes.push('touch-device');
    }

    return classes;
  }
}

