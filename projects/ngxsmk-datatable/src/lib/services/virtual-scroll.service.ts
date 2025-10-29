import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VirtualScrollState {
  startIndex: number;
  endIndex: number;
  visibleItems: any[];
  totalHeight: number;
  scrollTop: number;
}

export interface HorizontalVirtualScrollState {
  startColumnIndex: number;
  endColumnIndex: number;
  visibleColumns: any[];
  totalWidth: number;
  scrollLeft: number;
  leftOffset: number;
}

@Injectable({
  providedIn: 'root'
})
export class VirtualScrollService {
  private stateSubject = new BehaviorSubject<VirtualScrollState>({
    startIndex: 0,
    endIndex: 0,
    visibleItems: [],
    totalHeight: 0,
    scrollTop: 0
  });

  public state$ = this.stateSubject.asObservable();

  calculateVisibleItems(
    items: any[],
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    bufferSize: number = 5
  ): VirtualScrollState {
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleItemCount + bufferSize
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const totalHeight = items.length * itemHeight;

    const state: VirtualScrollState = {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight,
      scrollTop
    };

    this.stateSubject.next(state);
    return state;
  }

  scrollToItem(
    itemIndex: number,
    itemHeight: number,
    containerHeight: number
  ): number {
    const maxScrollTop = Math.max(0, (itemIndex + 1) * itemHeight - containerHeight);
    return Math.min(itemIndex * itemHeight, maxScrollTop);
  }

  getItemOffset(itemIndex: number, itemHeight: number): number {
    return itemIndex * itemHeight;
  }

  isItemVisible(
    itemIndex: number,
    startIndex: number,
    endIndex: number
  ): boolean {
    return itemIndex >= startIndex && itemIndex <= endIndex;
  }

  getVisibleRange(
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    bufferSize: number = 5
  ): { start: number; end: number } {
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const end = Math.min(totalItems - 1, start + visibleItemCount + bufferSize);
    
    return { start, end };
  }

  calculateScrollPosition(
    targetIndex: number,
    itemHeight: number,
    containerHeight: number
  ): number {
    const itemOffset = targetIndex * itemHeight;
    const maxScrollTop = Math.max(0, (targetIndex + 1) * itemHeight - containerHeight);
    return Math.min(itemOffset, maxScrollTop);
  }

  getSpacerHeight(
    startIndex: number,
    endIndex: number,
    itemHeight: number,
    totalItems: number
  ): { top: number; bottom: number } {
    const topHeight = startIndex * itemHeight;
    const bottomHeight = Math.max(0, (totalItems - endIndex - 1) * itemHeight);
    
    return { top: topHeight, bottom: bottomHeight };
  }

  // ============================================
  // Horizontal Virtual Scrolling Methods
  // ============================================

  /**
   * Calculate visible columns based on horizontal scroll position
   */
  calculateVisibleColumns(
    columns: any[],
    columnWidths: { [key: string]: number },
    containerWidth: number,
    scrollLeft: number,
    bufferSize: number = 2
  ): HorizontalVirtualScrollState {
    if (!columns || columns.length === 0) {
      return {
        startColumnIndex: 0,
        endColumnIndex: 0,
        visibleColumns: [],
        totalWidth: 0,
        scrollLeft: 0,
        leftOffset: 0
      };
    }

    // Calculate cumulative widths
    const cumulativeWidths: number[] = [];
    let totalWidth = 0;
    
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const width = columnWidths[col.id] || col.width || 150;
      totalWidth += width;
      cumulativeWidths.push(totalWidth);
    }

    // Find start column index
    let startColumnIndex = 0;
    for (let i = 0; i < cumulativeWidths.length; i++) {
      if (cumulativeWidths[i] > scrollLeft) {
        startColumnIndex = Math.max(0, i - bufferSize);
        break;
      }
    }

    // Find end column index
    const visibleWidth = scrollLeft + containerWidth;
    let endColumnIndex = columns.length - 1;
    for (let i = startColumnIndex; i < cumulativeWidths.length; i++) {
      if (cumulativeWidths[i] > visibleWidth) {
        endColumnIndex = Math.min(columns.length - 1, i + bufferSize);
        break;
      }
    }

    // Calculate left offset for visible columns
    const leftOffset = startColumnIndex > 0 ? cumulativeWidths[startColumnIndex - 1] : 0;

    // Get visible columns
    const visibleColumns = columns.slice(startColumnIndex, endColumnIndex + 1);

    return {
      startColumnIndex,
      endColumnIndex,
      visibleColumns,
      totalWidth,
      scrollLeft,
      leftOffset
    };
  }

  /**
   * Scroll to a specific column
   */
  scrollToColumn(
    columnIndex: number,
    columnWidths: { [key: string]: number },
    columns: any[],
    containerWidth: number
  ): number {
    if (columnIndex < 0 || columnIndex >= columns.length) {
      return 0;
    }

    let targetScrollLeft = 0;
    for (let i = 0; i < columnIndex; i++) {
      const col = columns[i];
      const width = columnWidths[col.id] || col.width || 150;
      targetScrollLeft += width;
    }

    return targetScrollLeft;
  }

  /**
   * Get spacer widths for horizontal virtual scrolling
   */
  getHorizontalSpacerWidth(
    startColumnIndex: number,
    endColumnIndex: number,
    columnWidths: { [key: string]: number },
    columns: any[]
  ): { left: number; right: number } {
    let leftWidth = 0;
    for (let i = 0; i < startColumnIndex; i++) {
      const col = columns[i];
      const width = columnWidths[col.id] || col.width || 150;
      leftWidth += width;
    }

    let rightWidth = 0;
    for (let i = endColumnIndex + 1; i < columns.length; i++) {
      const col = columns[i];
      const width = columnWidths[col.id] || col.width || 150;
      rightWidth += width;
    }

    return { left: leftWidth, right: rightWidth };
  }

  /**
   * Check if a column is currently visible in the viewport
   */
  isColumnVisible(
    columnIndex: number,
    startColumnIndex: number,
    endColumnIndex: number
  ): boolean {
    return columnIndex >= startColumnIndex && columnIndex <= endColumnIndex;
  }

  /**
   * Get total width of all columns
   */
  getTotalColumnsWidth(
    columns: any[],
    columnWidths: { [key: string]: number }
  ): number {
    let totalWidth = 0;
    for (const col of columns) {
      const width = columnWidths[col.id] || col.width || 150;
      totalWidth += width;
    }
    return totalWidth;
  }
}