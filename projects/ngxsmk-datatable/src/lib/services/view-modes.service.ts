import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ViewMode,
  ViewModeConfig,
  GanttConfig,
  CalendarConfig,
  KanbanConfig
} from '../interfaces/view-modes.interface';

/**
 * View Modes Service
 * Manages alternative view modes (Gantt, Calendar, Kanban)
 */
@Injectable({
  providedIn: 'root'
})
export class ViewModesService {
  private currentModeSubject = new BehaviorSubject<ViewMode>('table');
  private configSubject = new BehaviorSubject<ViewModeConfig | null>(null);

  readonly currentMode$ = this.currentModeSubject.asObservable();
  readonly config$ = this.configSubject.asObservable();

  constructor() {}

  /**
   * Initialize view modes
   */
  initialize(config: ViewModeConfig): void {
    this.configSubject.next(config);
    
    if (config.mode) {
      this.setMode(config.mode);
    } else if (config.defaultMode) {
      this.setMode(config.defaultMode);
    }

    // Restore saved mode if enabled
    if (config.rememberMode) {
      const savedMode = localStorage.getItem('ngxsmk-view-mode');
      if (savedMode && this.isValidMode(savedMode as ViewMode, config)) {
        this.setMode(savedMode as ViewMode);
      }
    }
  }

  /**
   * Set current view mode
   */
  setMode(mode: ViewMode): void {
    const config = this.configSubject.value;
    
    if (config && !this.isValidMode(mode, config)) {
      console.warn(`View mode "${mode}" is not available`);
      return;
    }

    this.currentModeSubject.next(mode);

    // Remember mode if enabled
    if (config?.rememberMode) {
      localStorage.setItem('ngxsmk-view-mode', mode);
    }
  }

  /**
   * Get current mode
   */
  getCurrentMode(): ViewMode {
    return this.currentModeSubject.value;
  }

  /**
   * Check if mode is valid
   */
  private isValidMode(mode: ViewMode, config: ViewModeConfig): boolean {
    if (!config.availableModes || config.availableModes.length === 0) {
      return true;
    }
    return config.availableModes.includes(mode);
  }

  /**
   * Transform data for Gantt view
   */
  transformToGantt(data: any[], config: GanttConfig): any[] {
    return data.map(item => ({
      id: item.id || item[config.nameField],
      name: item[config.nameField],
      start: new Date(item[config.startDateField]),
      end: new Date(item[config.endDateField]),
      progress: item[config.progressField!] || 0,
      dependencies: item[config.dependenciesField!] || [],
      resource: item[config.resourceField!],
      color: item[config.colorField!],
      type: item[config.typeField!] || 'task',
      parent: item[config.parentField!],
      metadata: item
    }));
  }

  /**
   * Transform data for Calendar view
   */
  transformToCalendar(data: any[], config: CalendarConfig): any[] {
    return data.map(item => ({
      id: item.id || item[config.titleField],
      title: item[config.titleField],
      start: new Date(item[config.startDateField]),
      end: item[config.endDateField!] ? new Date(item[config.endDateField!]) : undefined,
      description: item[config.descriptionField!],
      color: item[config.colorField!],
      category: item[config.categoryField!],
      allDay: item[config.allDayField!] || false,
      metadata: item
    }));
  }

  /**
   * Transform data for Kanban view
   */
  transformToKanban(data: any[], config: KanbanConfig): any[] {
    return data.map(item => ({
      id: item.id || item[config.titleField],
      title: item[config.titleField],
      status: item[config.statusField],
      description: item[config.descriptionField!],
      assignee: item[config.assigneeField!],
      priority: item[config.priorityField!],
      tags: item[config.tagsField!] || [],
      color: item[config.colorField!],
      dueDate: item[config.dueDateField!] ? new Date(item[config.dueDateField!]) : undefined,
      order: item.order || 0,
      metadata: item
    }));
  }
}

