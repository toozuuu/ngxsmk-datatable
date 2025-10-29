import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ThemeConfig,
  ThemeBuilderConfig,
  ThemeExport,
  PredefinedThemes,
  ColorScheme
} from '../interfaces/theming.interface';

/**
 * Theming Service
 * Advanced theme builder and customization
 */
@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  private currentThemeSubject = new BehaviorSubject<ThemeConfig | null>(null);
  private themes: Map<string, ThemeConfig> = new Map();

  readonly currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.initializePredefinedThemes();
  }

  /**
   * Apply theme
   */
  applyTheme(theme: ThemeConfig | string): void {
    let themeConfig: ThemeConfig;

    if (typeof theme === 'string') {
      const savedTheme = this.themes.get(theme);
      if (!savedTheme) {
        console.warn(`Theme "${theme}" not found`);
        return;
      }
      themeConfig = savedTheme;
    } else {
      themeConfig = theme;
    }

    // Apply CSS variables
    this.applyCssVariables(themeConfig);

    // Apply custom CSS
    if (themeConfig.customCss) {
      this.applyCustomCss(themeConfig.customCss);
    }

    this.currentThemeSubject.next(themeConfig);

    // Save to localStorage if builder is enabled
    localStorage.setItem('ngxsmk-current-theme', themeConfig.name);
  }

  /**
   * Register theme
   */
  registerTheme(theme: ThemeConfig): void {
    this.themes.set(theme.name, theme);
  }

  /**
   * Get theme
   */
  getTheme(name: string): ThemeConfig | undefined {
    return this.themes.get(name);
  }

  /**
   * Get all themes
   */
  getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  /**
   * Export theme
   */
  exportTheme(theme: ThemeConfig): ThemeExport {
    const cssVariables = this.generateCssVariables(theme);
    const css = this.generateCss(theme);

    return {
      theme,
      version: '1.0',
      exportDate: new Date().toISOString(),
      css,
      cssVariables
    };
  }

  /**
   * Import theme
   */
  importTheme(themeExport: ThemeExport): void {
    this.registerTheme(themeExport.theme);
  }

  /**
   * Create custom theme
   */
  createCustomTheme(name: string, baseTheme?: string, overrides?: Partial<ThemeConfig>): ThemeConfig {
    let base: Partial<ThemeConfig> = {};

    if (baseTheme) {
      const baseConfig = this.themes.get(baseTheme);
      if (baseConfig) {
        base = { ...baseConfig };
      }
    }

    const theme: ThemeConfig = {
      name,
      ...base,
      ...overrides
    };

    this.registerTheme(theme);
    return theme;
  }

  /**
   * Generate color scheme
   */
  generateColorScheme(primaryColor: string): ColorScheme {
    // Simple color generation - in production use a proper color library
    const palette = this.generatePalette(primaryColor);

    return {
      name: 'Custom',
      primary: primaryColor,
      accent: palette[3],
      background: '#ffffff',
      text: '#000000',
      palette
    };
  }

  /**
   * Apply CSS variables
   */
  private applyCssVariables(theme: ThemeConfig): void {
    const root = document.documentElement;
    const variables = this.generateCssVariables(theme);

    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  /**
   * Generate CSS variables
   */
  private generateCssVariables(theme: ThemeConfig): Record<string, string> {
    const variables: Record<string, string> = {};

    // Colors
    if (theme.colors) {
      if (theme.colors.primary) variables['--ngxsmk-primary'] = theme.colors.primary;
      if (theme.colors.secondary) variables['--ngxsmk-secondary'] = theme.colors.secondary;
      if (theme.colors.background) variables['--ngxsmk-background'] = theme.colors.background;
      if (theme.colors.text) variables['--ngxsmk-text'] = theme.colors.text;
      if (theme.colors.border) variables['--ngxsmk-border'] = theme.colors.border;
      if (theme.colors.headerBackground) variables['--ngxsmk-header-bg'] = theme.colors.headerBackground;
      if (theme.colors.headerText) variables['--ngxsmk-header-text'] = theme.colors.headerText;
      if (theme.colors.rowBackground) variables['--ngxsmk-row-bg'] = theme.colors.rowBackground;
      if (theme.colors.alternateRowBackground) variables['--ngxsmk-alt-row-bg'] = theme.colors.alternateRowBackground;
    }

    // Typography
    if (theme.typography) {
      if (theme.typography.fontFamily) variables['--ngxsmk-font-family'] = theme.typography.fontFamily;
      if (theme.typography.fontSize) variables['--ngxsmk-font-size'] = theme.typography.fontSize;
      if (theme.typography.lineHeight) variables['--ngxsmk-line-height'] = String(theme.typography.lineHeight);
    }

    // Spacing
    if (theme.spacing) {
      if (theme.spacing.cellPadding) variables['--ngxsmk-cell-padding'] = theme.spacing.cellPadding;
      if (theme.spacing.rowPadding) variables['--ngxsmk-row-padding'] = theme.spacing.rowPadding;
    }

    // Borders
    if (theme.borders) {
      if (theme.borders.width) variables['--ngxsmk-border-width'] = theme.borders.width;
      if (theme.borders.radius) variables['--ngxsmk-border-radius'] = theme.borders.radius;
    }

    // Custom variables
    if (theme.cssVariables) {
      Object.assign(variables, theme.cssVariables);
    }

    return variables;
  }

  /**
   * Generate CSS
   */
  private generateCss(theme: ThemeConfig): string {
    let css = '.ngxsmk-datatable {';

    const variables = this.generateCssVariables(theme);
    Object.entries(variables).forEach(([key, value]) => {
      css += `\n  ${key}: ${value};`;
    });

    css += '\n}';
    return css;
  }

  /**
   * Apply custom CSS
   */
  private applyCustomCss(css: string): void {
    const styleId = 'ngxsmk-custom-theme';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = css;
  }

  /**
   * Generate color palette
   */
  private generatePalette(baseColor: string): string[] {
    // Simplified palette generation
    return [
      this.lighten(baseColor, 0.3),
      this.lighten(baseColor, 0.15),
      baseColor,
      this.darken(baseColor, 0.15),
      this.darken(baseColor, 0.3)
    ];
  }

  /**
   * Lighten color
   */
  private lighten(color: string, percent: number): string {
    // Simplified - use a proper color library in production
    return color;
  }

  /**
   * Darken color
   */
  private darken(color: string, percent: number): string {
    // Simplified - use a proper color library in production
    return color;
  }

  /**
   * Initialize predefined themes
   */
  private initializePredefinedThemes(): void {
    // Material theme
    this.registerTheme({
      name: PredefinedThemes.MATERIAL,
      type: 'light',
      colors: {
        primary: '#3f51b5',
        secondary: '#ff4081',
        background: '#fafafa',
        text: '#000000',
        headerBackground: '#3f51b5',
        headerText: '#ffffff',
        alternateRowBackground: '#f5f5f5'
      }
    });

    // Material Dark theme
    this.registerTheme({
      name: PredefinedThemes.MATERIAL_DARK,
      type: 'dark',
      colors: {
        primary: '#3f51b5',
        secondary: '#ff4081',
        background: '#303030',
        text: '#ffffff',
        headerBackground: '#212121',
        headerText: '#ffffff',
        alternateRowBackground: '#424242'
      }
    });

    // Bootstrap theme
    this.registerTheme({
      name: PredefinedThemes.BOOTSTRAP,
      type: 'light',
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        background: '#ffffff',
        text: '#212529',
        headerBackground: '#e9ecef',
        headerText: '#212529',
        alternateRowBackground: '#f8f9fa'
      }
    });
  }
}

