import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  DragDropConfig,
  DragStartEvent,
  DragOverEvent,
  DropEvent,
  DragState,
  RowReorderEvent
} from '../interfaces/drag-drop.interface';
import { ColumnReorderEvent } from '../interfaces/column.interface';

/**
 * Service for managing drag-and-drop operations in the datatable
 */
@Injectable()
export class DragDropService {
  private dragState$ = new BehaviorSubject<DragState>({
    isDragging: false,
    type: null,
    item: null,
    sourceIndex: -1,
    targetIndex: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    dragElement: null
  });

  private columnReorder$ = new Subject<ColumnReorderEvent>();
  private rowReorder$ = new Subject<RowReorderEvent>();
  private dragStart$ = new Subject<DragStartEvent>();
  private dragOver$ = new Subject<DragOverEvent>();
  private drop$ = new Subject<DropEvent>();

  private config: DragDropConfig = {
    enableColumnReorder: true,
    enableRowReorder: false,
    dragHandleClass: 'drag-handle',
    showDragPreview: true,
    dragThreshold: 5,
    animationDuration: 200
  };

  /**
   * Get current drag state as observable
   */
  get state$(): Observable<DragState> {
    return this.dragState$.asObservable();
  }

  /**
   * Get column reorder events
   */
  get onColumnReorder$(): Observable<ColumnReorderEvent> {
    return this.columnReorder$.asObservable();
  }

  /**
   * Get row reorder events
   */
  get onRowReorder$(): Observable<RowReorderEvent> {
    return this.rowReorder$.asObservable();
  }

  /**
   * Get drag start events
   */
  get onDragStart$(): Observable<DragStartEvent> {
    return this.dragStart$.asObservable();
  }

  /**
   * Get drag over events
   */
  get onDragOver$(): Observable<DragOverEvent> {
    return this.dragOver$.asObservable();
  }

  /**
   * Get drop events
   */
  get onDrop$(): Observable<DropEvent> {
    return this.drop$.asObservable();
  }

  /**
   * Get current drag state snapshot
   */
  getState(): DragState {
    return this.dragState$.value;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<DragDropConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   */
  getConfig(): DragDropConfig {
    return { ...this.config };
  }

  /**
   * Start dragging a column
   */
  startDragColumn<T>(column: T, index: number, event: DragEvent): void {
    if (!this.config.enableColumnReorder) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    const dragStartEvent: DragStartEvent<T> = {
      type: 'column',
      item: column,
      index,
      event,
      startX: event.clientX,
      startY: event.clientY
    };

    this.dragState$.next({
      isDragging: true,
      type: 'column',
      item: column,
      sourceIndex: index,
      targetIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      dragElement: event.target as HTMLElement
    });

    this.dragStart$.next(dragStartEvent);

    // Set drag data
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', index.toString());

    // Create drag image if enabled
    if (this.config.showDragPreview) {
      const dragImage = this.createDragImage(event.target as HTMLElement);
      if (dragImage) {
        event.dataTransfer!.setDragImage(dragImage, 0, 0);
      }
    }
  }

  /**
   * Start dragging a row
   */
  startDragRow<T>(row: T, index: number, event: DragEvent): void {
    if (!this.config.enableRowReorder) return;

    const dragStartEvent: DragStartEvent<T> = {
      type: 'row',
      item: row,
      index,
      event,
      startX: event.clientX,
      startY: event.clientY
    };

    this.dragState$.next({
      isDragging: true,
      type: 'row',
      item: row,
      sourceIndex: index,
      targetIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      dragElement: event.target as HTMLElement
    });

    this.dragStart$.next(dragStartEvent);

    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', index.toString());
  }

  /**
   * Handle drag over
   */
  dragOver<T>(targetItem: T, targetIndex: number, event: DragEvent): void {
    event.preventDefault();
    
    const state = this.getState();
    if (!state.isDragging) return;

    const dragOverEvent: DragOverEvent = {
      type: state.type!,
      sourceItem: state.item,
      sourceIndex: state.sourceIndex,
      targetItem,
      targetIndex,
      event,
      currentX: event.clientX,
      currentY: event.clientY
    };

    this.dragState$.next({
      ...state,
      targetIndex,
      currentX: event.clientX,
      currentY: event.clientY
    });

    this.dragOver$.next(dragOverEvent);

    event.dataTransfer!.dropEffect = 'move';
  }

  /**
   * Handle drop
   */
  drop<T>(items: T[], event: DragEvent): void {
    event.preventDefault();

    const state = this.getState();
    if (!state.isDragging) return;

    const moved = state.sourceIndex !== state.targetIndex;

    const dropEvent: DropEvent = {
      type: state.type!,
      sourceItem: state.item,
      sourceIndex: state.sourceIndex,
      targetIndex: state.targetIndex,
      event,
      moved
    };

    this.drop$.next(dropEvent);

    if (moved) {
      // Reorder the array
      const reorderedItems = this.reorderArray(
        items,
        state.sourceIndex,
        state.targetIndex
      );

      // Emit specific event based on type
      if (state.type === 'column') {
        this.columnReorder$.next({
          column: state.item,
          oldIndex: state.sourceIndex,
          newIndex: state.targetIndex
        });
      } else if (state.type === 'row') {
        this.rowReorder$.next({
          row: state.item,
          previousIndex: state.sourceIndex,
          newIndex: state.targetIndex,
          rows: reorderedItems
        });
      }
    }

    this.endDrag();
  }

  /**
   * End drag operation
   */
  endDrag(): void {
    this.dragState$.next({
      isDragging: false,
      type: null,
      item: null,
      sourceIndex: -1,
      targetIndex: -1,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      dragElement: null
    });
  }

  /**
   * Reorder an array by moving an item from one index to another
   */
  private reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const result = [...array];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }

  /**
   * Create drag image element
   */
  private createDragImage(element: HTMLElement): HTMLElement | null {
    try {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.opacity = '0.8';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);
      
      // Clean up after a short delay
      setTimeout(() => {
        if (document.body.contains(clone)) {
          document.body.removeChild(clone);
        }
      }, 0);
      
      return clone;
    } catch (error) {
      console.error('Failed to create drag image:', error);
      return null;
    }
  }

  /**
   * Calculate drop position based on mouse position
   */
  calculateDropPosition(
    targetElement: HTMLElement,
    mouseX: number,
    mouseY: number,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): 'before' | 'after' {
    const rect = targetElement.getBoundingClientRect();
    
    if (orientation === 'horizontal') {
      const midpoint = rect.left + rect.width / 2;
      return mouseX < midpoint ? 'before' : 'after';
    } else {
      const midpoint = rect.top + rect.height / 2;
      return mouseY < midpoint ? 'before' : 'after';
    }
  }

  /**
   * Check if dragging is currently active
   */
  isDragging(): boolean {
    return this.dragState$.value.isDragging;
  }

  /**
   * Get the type of current drag operation
   */
  getDragType(): 'column' | 'row' | null {
    return this.dragState$.value.type;
  }

  /**
   * Get source index of current drag
   */
  getSourceIndex(): number {
    return this.dragState$.value.sourceIndex;
  }

  /**
   * Get target index of current drag
   */
  getTargetIndex(): number {
    return this.dragState$.value.targetIndex;
  }

  /**
   * Clean up service
   */
  ngOnDestroy(): void {
    this.dragState$.complete();
    this.columnReorder$.complete();
    this.rowReorder$.complete();
    this.dragStart$.complete();
    this.dragOver$.complete();
    this.drop$.complete();
  }
}

