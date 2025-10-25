import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeSettings {
  selectedTheme: string;
  rowHeight: number;
  fontSize: number;
  stripedRows: boolean;
  hoverEffects: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private defaultSettings: ThemeSettings = {
    selectedTheme: 'default',
    rowHeight: 50,
    fontSize: 14,
    stripedRows: true,
    hoverEffects: true
  };

  private settingsSubject = new BehaviorSubject<ThemeSettings>(this.defaultSettings);
  public settings$: Observable<ThemeSettings> = this.settingsSubject.asObservable();

  constructor() {}

  getSettings(): ThemeSettings {
    return this.settingsSubject.value;
  }

  updateSettings(settings: Partial<ThemeSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, ...settings };
    this.settingsSubject.next(newSettings);
  }

  setTheme(theme: string): void {
    this.updateSettings({ selectedTheme: theme });
  }

  setRowHeight(height: number): void {
    this.updateSettings({ rowHeight: height });
  }

  setFontSize(size: number): void {
    this.updateSettings({ fontSize: size });
  }

  setStripedRows(enabled: boolean): void {
    this.updateSettings({ stripedRows: enabled });
  }

  setHoverEffects(enabled: boolean): void {
    this.updateSettings({ hoverEffects: enabled });
  }

  resetToDefaults(): void {
    this.settingsSubject.next(this.defaultSettings);
  }

  getTableClass(): string {
    const settings = this.getSettings();
    let classes = `theme-${settings.selectedTheme}`;
    if (settings.stripedRows) classes += ' striped-rows';
    if (settings.hoverEffects) classes += ' hover-effects';
    return classes;
  }
}

