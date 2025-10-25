import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VirtualScrollState {
  startIndex: number;
  endIndex: number;
  visibleItems: any[];
  totalHeight: number;
  scrollTop: number;
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
}