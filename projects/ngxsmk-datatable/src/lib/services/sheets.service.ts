import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  SheetsConfig,
  Sheet,
  SheetTemplate,
  SheetOperation,
  SheetOperationType,
  SheetState
} from '../interfaces/sheets.interface';

/**
 * Sheets Service
 * Multiple sheet support with tabs
 */
@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  private config: SheetsConfig | null = null;
  private sheetsSubject = new BehaviorSubject<Sheet[]>([]);
  private activeSheetSubject = new BehaviorSubject<Sheet | null>(null);
  private stateSubject = new BehaviorSubject<SheetState>({
    activeSheet: null,
    sheets: [],
    count: 0,
    modifiedSheets: []
  });

  readonly sheets$ = this.sheetsSubject.asObservable();
  readonly activeSheet$ = this.activeSheetSubject.asObservable();
  readonly state$ = this.stateSubject.asObservable();

  constructor() {}

  /**
   * Initialize sheets
   */
  initialize(config: SheetsConfig): void {
    this.config = config;
    this.sheetsSubject.next(config.sheets || []);

    if (config.activeSheetId) {
      const sheet = config.sheets.find(s => s.id === config.activeSheetId);
      if (sheet) {
        this.setActiveSheet(sheet.id);
      }
    } else if (config.sheets.length > 0) {
      this.setActiveSheet(config.sheets[0].id);
    }

    this.updateState();
  }

  /**
   * Add sheet
   */
  addSheet(sheet: Partial<Sheet>): Sheet {
    if (!this.config?.allowAdd) {
      throw new Error('Adding sheets is not allowed');
    }

    if (this.config.maxSheets && this.sheetsSubject.value.length >= this.config.maxSheets) {
      throw new Error(`Maximum number of sheets (${this.config.maxSheets}) reached`);
    }

    const newSheet: Sheet = {
      id: sheet.id || this.generateSheetId(),
      name: sheet.name || `Sheet ${this.sheetsSubject.value.length + 1}`,
      data: sheet.data || [],
      columns: sheet.columns,
      config: sheet.config,
      color: sheet.color,
      icon: sheet.icon,
      protected: sheet.protected || false,
      visible: sheet.visible !== false,
      order: sheet.order ?? this.sheetsSubject.value.length,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      metadata: sheet.metadata || {}
    };

    const sheets = [...this.sheetsSubject.value, newSheet];
    this.sheetsSubject.next(sheets);
    this.updateState();

    this.recordOperation({
      type: 'add',
      sheetId: newSheet.id,
      timestamp: Date.now()
    });

    return newSheet;
  }

  /**
   * Delete sheet
   */
  deleteSheet(sheetId: string): void {
    if (!this.config?.allowDelete) {
      throw new Error('Deleting sheets is not allowed');
    }

    const sheet = this.getSheet(sheetId);
    if (sheet?.protected) {
      throw new Error('Cannot delete protected sheet');
    }

    const sheets = this.sheetsSubject.value.filter(s => s.id !== sheetId);
    
    if (sheets.length === 0) {
      throw new Error('Cannot delete the last sheet');
    }

    this.sheetsSubject.next(sheets);

    // Switch to another sheet if deleted sheet was active
    if (this.activeSheetSubject.value?.id === sheetId) {
      this.setActiveSheet(sheets[0].id);
    }

    this.updateState();
    this.recordOperation({
      type: 'delete',
      sheetId,
      timestamp: Date.now()
    });
  }

  /**
   * Rename sheet
   */
  renameSheet(sheetId: string, newName: string): void {
    if (!this.config?.allowRename) {
      throw new Error('Renaming sheets is not allowed');
    }

    const sheets = this.sheetsSubject.value.map(s => 
      s.id === sheetId ? { ...s, name: newName, modifiedAt: Date.now() } : s
    );

    this.sheetsSubject.next(sheets);
    this.updateState();
    this.markModified(sheetId);

    this.recordOperation({
      type: 'rename',
      sheetId,
      data: { newName },
      timestamp: Date.now()
    });
  }

  /**
   * Duplicate sheet
   */
  duplicateSheet(sheetId: string): Sheet {
    if (!this.config?.allowDuplicate) {
      throw new Error('Duplicating sheets is not allowed');
    }

    const original = this.getSheet(sheetId);
    if (!original) {
      throw new Error(`Sheet ${sheetId} not found`);
    }

    const duplicate: Partial<Sheet> = {
      name: `${original.name} (Copy)`,
      data: JSON.parse(JSON.stringify(original.data)),
      columns: JSON.parse(JSON.stringify(original.columns)),
      config: JSON.parse(JSON.stringify(original.config)),
      color: original.color,
      icon: original.icon
    };

    return this.addSheet(duplicate);
  }

  /**
   * Reorder sheets
   */
  reorderSheets(sheetIds: string[]): void {
    if (!this.config?.allowReorder) {
      throw new Error('Reordering sheets is not allowed');
    }

    const sheetsMap = new Map(this.sheetsSubject.value.map(s => [s.id, s]));
    const reordered = sheetIds
      .map(id => sheetsMap.get(id))
      .filter((s): s is Sheet => s !== undefined)
      .map((s, index) => ({ ...s, order: index }));

    this.sheetsSubject.next(reordered);
    this.updateState();

    this.recordOperation({
      type: 'reorder',
      sheetId: '',
      data: { order: sheetIds },
      timestamp: Date.now()
    });
  }

  /**
   * Set active sheet
   */
  setActiveSheet(sheetId: string): void {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      throw new Error(`Sheet ${sheetId} not found`);
    }

    if (!sheet.visible) {
      throw new Error('Cannot activate hidden sheet');
    }

    this.activeSheetSubject.next(sheet);
    this.updateState();
  }

  /**
   * Get sheet
   */
  getSheet(sheetId: string): Sheet | undefined {
    return this.sheetsSubject.value.find(s => s.id === sheetId);
  }

  /**
   * Get all sheets
   */
  getAllSheets(): Sheet[] {
    return this.sheetsSubject.value;
  }

  /**
   * Update sheet data
   */
  updateSheetData(sheetId: string, data: any[]): void {
    const sheets = this.sheetsSubject.value.map(s => 
      s.id === sheetId ? { ...s, data, modifiedAt: Date.now() } : s
    );

    this.sheetsSubject.next(sheets);
    
    // Update active sheet if it's the one being modified
    const activeSheet = this.activeSheetSubject.value;
    if (activeSheet?.id === sheetId) {
      this.activeSheetSubject.next({ ...activeSheet, data });
    }

    this.markModified(sheetId);
    this.updateState();
  }

  /**
   * Protect sheet
   */
  protectSheet(sheetId: string): void {
    this.updateSheetProperty(sheetId, 'protected', true);
    this.recordOperation({
      type: 'protect',
      sheetId,
      timestamp: Date.now()
    });
  }

  /**
   * Unprotect sheet
   */
  unprotectSheet(sheetId: string): void {
    this.updateSheetProperty(sheetId, 'protected', false);
    this.recordOperation({
      type: 'unprotect',
      sheetId,
      timestamp: Date.now()
    });
  }

  /**
   * Hide sheet
   */
  hideSheet(sheetId: string): void {
    const visibleSheets = this.sheetsSubject.value.filter(s => s.visible);
    if (visibleSheets.length <= 1) {
      throw new Error('Cannot hide the last visible sheet');
    }

    this.updateSheetProperty(sheetId, 'visible', false);
    
    // Switch to another sheet if hidden sheet was active
    if (this.activeSheetSubject.value?.id === sheetId) {
      const nextVisible = visibleSheets.find(s => s.id !== sheetId);
      if (nextVisible) {
        this.setActiveSheet(nextVisible.id);
      }
    }

    this.recordOperation({
      type: 'hide',
      sheetId,
      timestamp: Date.now()
    });
  }

  /**
   * Show sheet
   */
  showSheet(sheetId: string): void {
    this.updateSheetProperty(sheetId, 'visible', true);
    this.recordOperation({
      type: 'show',
      sheetId,
      timestamp: Date.now()
    });
  }

  /**
   * Create from template
   */
  createFromTemplate(template: SheetTemplate): Sheet {
    return this.addSheet({
      name: template.name,
      columns: template.columns,
      config: template.config,
      data: template.sampleData || [],
      icon: template.icon
    });
  }

  /**
   * Update sheet property
   */
  private updateSheetProperty(sheetId: string, property: keyof Sheet, value: any): void {
    const sheets = this.sheetsSubject.value.map(s => 
      s.id === sheetId ? { ...s, [property]: value, modifiedAt: Date.now() } : s
    );

    this.sheetsSubject.next(sheets);
    this.updateState();
  }

  /**
   * Mark sheet as modified
   */
  private markModified(sheetId: string): void {
    const state = this.stateSubject.value;
    if (!state.modifiedSheets.includes(sheetId)) {
      this.stateSubject.next({
        ...state,
        modifiedSheets: [...state.modifiedSheets, sheetId]
      });
    }
  }

  /**
   * Update state
   */
  private updateState(): void {
    const sheets = this.sheetsSubject.value;
    const activeSheet = this.activeSheetSubject.value;
    const currentState = this.stateSubject.value;

    this.stateSubject.next({
      activeSheet,
      sheets,
      count: sheets.length,
      modifiedSheets: currentState.modifiedSheets
    });
  }

  /**
   * Generate unique sheet ID
   */
  private generateSheetId(): string {
    return `sheet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Record operation
   */
  private recordOperation(operation: SheetOperation): void {
    // Could be used for undo/redo functionality
    console.log('Sheet operation:', operation);
  }
}

