import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ColumnResizeState {
  columnId: string;
  newWidth: number;
  oldWidth: number;
  minWidth: number;
  maxWidth: number;
}

export interface ColumnWidths {
  [columnId: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class ColumnResizeService {
  private resizeStateSubject = new BehaviorSubject<ColumnResizeState | null>(null);
  private columnWidthsSubject = new BehaviorSubject<ColumnWidths>({});

  public resizeState$ = this.resizeStateSubject.asObservable();
  public columnWidths$ = this.columnWidthsSubject.asObservable();

  private columnWidths: ColumnWidths = {};
  private isResizing = false;
  private resizeStartX = 0;
  private resizeStartWidth = 0;
  private resizeColumnId = '';

  startResize(columnId: string, startX: number, currentWidth: number): void {
    this.isResizing = true;
    this.resizeStartX = startX;
    this.resizeStartWidth = currentWidth;
    this.resizeColumnId = columnId;
  }

  updateResize(currentX: number, minWidth: number = 50, maxWidth: number = 1000): number {
    if (!this.isResizing) return 0;

    const deltaX = currentX - this.resizeStartX;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, this.resizeStartWidth + deltaX));
    
    this.columnWidths[this.resizeColumnId] = newWidth;
    this.columnWidthsSubject.next({ ...this.columnWidths });

    return newWidth;
  }

  endResize(): ColumnResizeState | null {
    if (!this.isResizing) return null;

    const oldWidth = this.resizeStartWidth;
    const newWidth = this.columnWidths[this.resizeColumnId];
    
    const resizeState: ColumnResizeState = {
      columnId: this.resizeColumnId,
      newWidth,
      oldWidth,
      minWidth: 50,
      maxWidth: 1000
    };

    this.resizeStateSubject.next(resizeState);
    this.isResizing = false;
    this.resizeColumnId = '';

    return resizeState;
  }

  cancelResize(): void {
    if (this.isResizing) {
      this.columnWidths[this.resizeColumnId] = this.resizeStartWidth;
      this.columnWidthsSubject.next({ ...this.columnWidths });
    }
    this.isResizing = false;
    this.resizeColumnId = '';
  }

  setColumnWidth(columnId: string, width: number): void {
    this.columnWidths[columnId] = width;
    this.columnWidthsSubject.next({ ...this.columnWidths });
  }

  getColumnWidth(columnId: string): number {
    return this.columnWidths[columnId] || 100;
  }

  setColumnWidths(widths: ColumnWidths): void {
    this.columnWidths = { ...widths };
    this.columnWidthsSubject.next(this.columnWidths);
  }

  resetColumnWidths(): void {
    this.columnWidths = {};
    this.columnWidthsSubject.next({});
  }

  isResizingColumn(): boolean {
    return this.isResizing;
  }

  getResizingColumnId(): string {
    return this.resizeColumnId;
  }
}