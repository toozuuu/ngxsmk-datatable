import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { 
  KeyboardNavigationConfig,
  KeyboardNavigationEvent,
  CellPosition,
  CellSelectionRange
} from '../interfaces/keyboard-navigation.interface';

@Injectable()
export class KeyboardNavigationService {
  private config: KeyboardNavigationConfig = {
    enabled: true,
    arrowKeys: true,
    tabNavigation: true,
    enterToEdit: true,
    escapeToCancel: true,
    homeEndKeys: true,
    pageKeys: true,
    copyEnabled: true,
    pasteEnabled: true,
    undoEnabled: true,
    redoEnabled: true,
    selectAllEnabled: true,
    f2ToEdit: true
  };

  private currentCell: CellPosition | null = null;
  private selectionRange: CellSelectionRange | null = null;
  
  public keyboardEvent$ = new Subject<KeyboardNavigationEvent>();
  public cellFocus$ = new Subject<CellPosition>();
  public cellSelection$ = new Subject<CellSelectionRange>();

  constructor() {}

  /**
   * Set keyboard navigation configuration
   */
  setConfig(config: Partial<KeyboardNavigationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): KeyboardNavigationConfig {
    return this.config;
  }

  /**
   * Handle keyboard event
   */
  handleKeyboardEvent(event: KeyboardEvent, rowIndex: number, columnIndex: number, value: any): void {
    if (!this.config.enabled) return;

    const navEvent: KeyboardNavigationEvent = {
      key: event.key,
      event,
      rowIndex,
      columnIndex,
      value,
      preventDefault: false
    };

    // Arrow keys navigation
    if (this.config.arrowKeys && this.isArrowKey(event.key)) {
      this.handleArrowKey(event, rowIndex, columnIndex);
      navEvent.preventDefault = true;
    }

    // Tab navigation
    if (this.config.tabNavigation && event.key === 'Tab') {
      this.handleTabKey(event, rowIndex, columnIndex);
      navEvent.preventDefault = true;
    }

    // Enter key
    if (this.config.enterToEdit && event.key === 'Enter' && !event.ctrlKey) {
      // Emit event for edit mode
      navEvent.preventDefault = true;
    }

    // Escape key
    if (this.config.escapeToCancel && event.key === 'Escape') {
      // Emit event to cancel edit
      navEvent.preventDefault = true;
    }

    // Home/End keys
    if (this.config.homeEndKeys && (event.key === 'Home' || event.key === 'End')) {
      this.handleHomeEndKey(event, rowIndex, columnIndex);
      navEvent.preventDefault = true;
    }

    // Page Up/Down
    if (this.config.pageKeys && (event.key === 'PageUp' || event.key === 'PageDown')) {
      navEvent.preventDefault = true;
    }

    // F2 key
    if (this.config.f2ToEdit && event.key === 'F2') {
      navEvent.preventDefault = true;
    }

    // Ctrl+C (Copy)
    if (this.config.copyEnabled && event.ctrlKey && event.key === 'c') {
      navEvent.preventDefault = false; // Let browser handle copy
    }

    // Ctrl+V (Paste)
    if (this.config.pasteEnabled && event.ctrlKey && event.key === 'v') {
      navEvent.preventDefault = false; // Let browser handle paste
    }

    // Ctrl+Z (Undo)
    if (this.config.undoEnabled && event.ctrlKey && event.key === 'z') {
      navEvent.preventDefault = true;
    }

    // Ctrl+Y (Redo)
    if (this.config.redoEnabled && event.ctrlKey && event.key === 'y') {
      navEvent.preventDefault = true;
    }

    // Ctrl+A (Select All)
    if (this.config.selectAllEnabled && event.ctrlKey && event.key === 'a') {
      navEvent.preventDefault = true;
    }

    if (navEvent.preventDefault) {
      event.preventDefault();
    }

    this.keyboardEvent$.next(navEvent);
  }

  /**
   * Set current focused cell
   */
  setCurrentCell(position: CellPosition): void {
    this.currentCell = position;
    this.cellFocus$.next(position);
  }

  /**
   * Get current focused cell
   */
  getCurrentCell(): CellPosition | null {
    return this.currentCell;
  }

  /**
   * Set cell selection range
   */
  setSelectionRange(range: CellSelectionRange): void {
    this.selectionRange = range;
    this.cellSelection$.next(range);
  }

  /**
   * Get cell selection range
   */
  getSelectionRange(): CellSelectionRange | null {
    return this.selectionRange;
  }

  /**
   * Move focus to next cell
   */
  moveToNextCell(currentRow: number, currentCol: number, totalRows: number, totalCols: number): CellPosition {
    let newCol = currentCol + 1;
    let newRow = currentRow;

    if (newCol >= totalCols) {
      newCol = 0;
      newRow = currentRow + 1;
    }

    if (newRow >= totalRows) {
      newRow = totalRows - 1;
      newCol = totalCols - 1;
    }

    return { rowIndex: newRow, columnIndex: newCol };
  }

  /**
   * Move focus to previous cell
   */
  moveToPreviousCell(currentRow: number, currentCol: number, totalCols: number): CellPosition {
    let newCol = currentCol - 1;
    let newRow = currentRow;

    if (newCol < 0) {
      newCol = totalCols - 1;
      newRow = currentRow - 1;
    }

    if (newRow < 0) {
      newRow = 0;
      newCol = 0;
    }

    return { rowIndex: newRow, columnIndex: newCol };
  }

  private isArrowKey(key: string): boolean {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key);
  }

  private handleArrowKey(event: KeyboardEvent, rowIndex: number, columnIndex: number): void {
    let newPosition: CellPosition = { rowIndex, columnIndex };

    switch (event.key) {
      case 'ArrowUp':
        newPosition.rowIndex = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        newPosition.rowIndex = rowIndex + 1;
        break;
      case 'ArrowLeft':
        newPosition.columnIndex = Math.max(0, columnIndex - 1);
        break;
      case 'ArrowRight':
        newPosition.columnIndex = columnIndex + 1;
        break;
    }

    this.setCurrentCell(newPosition);
  }

  private handleTabKey(event: KeyboardEvent, rowIndex: number, columnIndex: number): void {
    // Tab forward, Shift+Tab backward
    // This will be handled by the component
  }

  private handleHomeEndKey(event: KeyboardEvent, rowIndex: number, columnIndex: number): void {
    let newPosition: CellPosition = { rowIndex, columnIndex };

    if (event.key === 'Home') {
      if (event.ctrlKey) {
        // Ctrl+Home: Go to first cell
        newPosition = { rowIndex: 0, columnIndex: 0 };
      } else {
        // Home: Go to first column in current row
        newPosition.columnIndex = 0;
      }
    } else if (event.key === 'End') {
      if (event.ctrlKey) {
        // Ctrl+End: Go to last cell (will be handled by component)
        newPosition = { rowIndex: -1, columnIndex: -1 }; // -1 indicates last
      } else {
        // End: Go to last column in current row
        newPosition.columnIndex = -1; // -1 indicates last
      }
    }

    this.setCurrentCell(newPosition);
  }
}

