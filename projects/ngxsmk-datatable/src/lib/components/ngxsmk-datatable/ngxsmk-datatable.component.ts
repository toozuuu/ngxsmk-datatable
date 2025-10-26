import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  TemplateRef,
  ContentChild,
  AfterViewInit,
  SimpleChanges,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NgxsmkColumn } from '../../interfaces/column.interface';
import { NgxsmkRow, RowDetailView } from '../../interfaces/row.interface';
import { SelectionType, SelectionEvent } from '../../interfaces/selection.interface';
import { PaginationConfig, PageEvent } from '../../interfaces/pagination.interface';
import { SortEvent, SortDirection } from '../../interfaces/sorting.interface';
import { VirtualScrollService } from '../../services/virtual-scroll.service';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { NgxsmkPagerComponent } from '../ngxsmk-pager/ngxsmk-pager.component';
import { ColumnResizeService } from '../../services/column-resize.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'ngxsmk-datatable',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe, NgxsmkPagerComponent],
  providers: [VirtualScrollService, ColumnResizeService, SelectionService],
  templateUrl: './ngxsmk-datatable.component.html',
  styleUrls: ['./ngxsmk-datatable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NgxsmkDatatableComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() columns: NgxsmkColumn[] = [];
  @Input() rows: NgxsmkRow[] = [];
  @Input() virtualScrolling = true;
  @Input() rowHeight: number = 50; // PR #2133: Support for 'auto' height (simplified to number for now)
  @Input() headerHeight: number = 50;
  @Input() footerHeight: number = 50;
  @Input() scrollbarH = true;
  @Input() scrollbarV = true;
  @Input() scrollX = false;
  @Input() scrollY = false;
  @Input() selectionType: SelectionType = 'single';
  @Input() selected: NgxsmkRow[] = [];
  @Input() selectCheckboxPosition: 'left' | 'right' = 'left';
  @Input() pagination: PaginationConfig | null = null;
  @Input() externalPaging = false;
  @Input() externalSorting = false;
  @Input() loadingIndicator = false;
  @Input() emptyMessage = 'No data available';
  @Input() emptyIconClass = 'icon-empty';
  @Input() showRefreshButton = false; // PR #2184: Add refresh button feature
  @Input() columnVisibilityEnabled = false; // PR #2152: Column visibility control
  @Input() class = '';
  @Input() headerClass = '';
  @Input() footerClass = '';
  @Input() rowClass: string | ((row: NgxsmkRow, index: number) => string) = '';
  @Input() trackByProp = 'id';
  @Input() rowIdentity: (row: NgxsmkRow) => any = (row: NgxsmkRow) => {
    // Enhanced trackBy implementation - Issue #2234 fix
    if (this.trackByProp && row && typeof row === 'object') {
      return row[this.trackByProp];
    }
    return row;
  };
  @Input() rowDetail: RowDetailView | null = null;
  @Input() frozenRowsTop: NgxsmkRow[] = []; // PR #2149: Rows frozen at top
  @Input() frozenRowsBottom: NgxsmkRow[] = []; // PR #2149: Rows frozen at bottom

  @Output() activate = new EventEmitter<any>();
  @Output() select = new EventEmitter<SelectionEvent>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() columnResize = new EventEmitter<any>();
  @Output() columnReorder = new EventEmitter<any>();
  @Output() rowDetailToggle = new EventEmitter<any>();
  @Output() refreshData = new EventEmitter<void>(); // PR #2184: Refresh event (renamed to avoid conflict)
  @Output() columnVisibilityChange = new EventEmitter<{ column: NgxsmkColumn; visible: boolean }>(); // PR #2152

  @ViewChild('datatableContainer', { static: true }) container!: ElementRef;
  @ViewChild('headerElement', { static: true }) headerElement!: ElementRef;
  @ViewChild('bodyElement', { static: true }) bodyElement!: ElementRef;
  @ViewChild('footerElement', { static: true }) footerElement!: ElementRef;

  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;
  @ContentChild('rowDetailTemplate') rowDetailTemplate!: TemplateRef<any>;

  // Internal state
  private destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;
  private scrollSubject = new Subject<{ scrollTop: number; scrollLeft: number }>();
  private resizingColumn: NgxsmkColumn | null = null;
  private resizeStartX = 0;
  private resizeStartWidth = 0;
  private isSorting = false; // Prevent pagination callbacks during sort - Issue #2235 fix

  // Virtual scrolling state
  visibleRows: NgxsmkRow[] = [];
  visibleStartIndex = 0;
  visibleEndIndex = 0;
  totalHeight = 0;
  scrollTop = 0;
  scrollLeft = 0;

  // Column state
  columnWidths: { [key: string]: number } = {};
  columnVisibility: { [key: string]: boolean } = {}; // PR #2152: Track column visibility
  frozenLeftColumns: NgxsmkColumn[] = [];
  frozenRightColumns: NgxsmkColumn[] = [];
  scrollableColumns: NgxsmkColumn[] = [];
  visibleColumns: NgxsmkColumn[] = []; // PR #2152: Filtered visible columns

  // Selection state
  selectionModel: any = {
    selected: [],
    isSelected: () => false,
    select: () => {},
    deselect: () => {},
    toggle: () => {},
    clear: () => {},
    isAllSelected: () => false,
    isIndeterminate: () => false
  };

  // Sorting state
  sorts: { prop: string; dir: SortDirection }[] = [];

  // Pagination state
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private virtualScrollService: VirtualScrollService,
    private columnResizeService: ColumnResizeService,
    private selectionService: SelectionService
  ) {
    // Initialize selection model immediately
    this.selectionModel = this.selectionService.createSelectionModel();
  }

  ngOnInit(): void {
    this.initializePagination();
    this.initializeComponent();
    this.setupEventListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let needsUpdate = false;

    if (changes['pagination']) {
      this.initializePagination();
      this.updateVirtualScrolling();
      needsUpdate = true;
    }
    if (changes['columns']) {
      this.processColumns();
      needsUpdate = true;
    }
    if (changes['rows']) {
      this.processRows();
      needsUpdate = true;
    }
    if (changes['selected']) {
      this.updateSelection();
      needsUpdate = true;
    }

    // Single change detection cycle for all changes
    if (needsUpdate) {
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    this.setupResizeObserver();
    this.setupScrollListener();
    this.calculateDimensions();
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions and observers
    this.destroy$.next();
    this.destroy$.complete();
    
    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    
    // Clean up event listeners
    if (this.resizingColumn) {
      document.removeEventListener('mousemove', this.onResizing.bind(this));
      document.removeEventListener('mouseup', this.onResizeEnd.bind(this));
    }
    
    // Clear references
    this.visibleRows = [];
    this.rows = [];
    this.columns = [];
  }

  private initializeComponent(): void {
    this.processColumns();
    this.processRows();
    this.updateSelection();
  }

  private processColumns(): void {
    this.frozenLeftColumns = this.columns.filter(col => col.frozen === 'left');
    this.frozenRightColumns = this.columns.filter(col => col.frozen === 'right');
    this.scrollableColumns = this.columns.filter(col => !col.frozen);
    
    this.calculateColumnWidths();
  }

  private processRows(): void {
    // For external paging, keep the totalItems from pagination config
    // For client-side paging, use rows.length
    if (!this.externalPaging) {
      this.totalItems = this.rows.length;
    }
    this.updateVirtualScrolling();
  }

  private initializePagination(): void {
    if (this.pagination) {
      this.pageSize = this.pagination.pageSize || 10;
      this.currentPage = this.pagination.currentPage || 1;
      this.totalItems = this.pagination.totalItems || 0;
    }
  }

  private calculateColumnWidths(): void {
    this.columns.forEach(column => {
      // Set initial width - prioritize explicit width, then flexGrow, then default
      if (column.width) {
        this.columnWidths[column.id] = typeof column.width === 'number' 
          ? column.width 
          : parseInt(column.width.toString(), 10);
      } else if (!this.columnWidths[column.id]) {
        // Set default width if not already set
        this.columnWidths[column.id] = 150; // Default column width
      }
    });
  }

  private updateVirtualScrolling(): void {
    // Get the rows to display (paginated or all)
    let displayRows = this.rows;
    
    // Apply client-side pagination if enabled
    if (this.pagination && !this.externalPaging) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      displayRows = this.rows.slice(startIndex, endIndex);
    }

    // Apply virtual scrolling if enabled
    if (!this.virtualScrolling) {
      // Only update if changed
      if (this.visibleRows !== displayRows || this.visibleRows.length !== displayRows.length) {
        this.visibleRows = displayRows;
        this.visibleStartIndex = 0;
        this.visibleEndIndex = displayRows.length - 1;
        this.totalHeight = displayRows.length * this.rowHeight;
      }
      return;
    }

    const containerHeight = this.container?.nativeElement?.clientHeight || 0;
    const visibleRowCount = Math.ceil(containerHeight / this.rowHeight);
    const bufferSize = Math.min(5, Math.floor(visibleRowCount / 2));

    const newStartIndex = Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - bufferSize);
    const newEndIndex = Math.min(
      displayRows.length - 1,
      newStartIndex + visibleRowCount + bufferSize
    );

    // Only update if indices changed (performance optimization)
    if (newStartIndex !== this.visibleStartIndex || newEndIndex !== this.visibleEndIndex) {
      this.visibleStartIndex = newStartIndex;
      this.visibleEndIndex = newEndIndex;
      this.visibleRows = displayRows.slice(this.visibleStartIndex, this.visibleEndIndex + 1);
    }

    this.totalHeight = displayRows.length * this.rowHeight;
  }

  private setupEventListeners(): void {
    this.scrollSubject
      .pipe(
        debounceTime(16),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(({ scrollTop, scrollLeft }) => {
        this.scrollTop = scrollTop;
        this.scrollLeft = scrollLeft;
        this.updateVirtualScrolling();
        this.cdr.markForCheck();
      });
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateDimensions();
        this.updateVirtualScrolling();
        this.cdr.detectChanges();
      });
      this.resizeObserver.observe(this.container.nativeElement);
    }
  }

  private setupScrollListener(): void {
    if (this.bodyElement?.nativeElement) {
      this.bodyElement.nativeElement.addEventListener('scroll', (event: Event) => {
        const target = event.target as HTMLElement;
        this.scrollSubject.next({
          scrollTop: target.scrollTop,
          scrollLeft: target.scrollLeft
        });
      });
    }
  }

  private calculateDimensions(): void {
    // Calculate container dimensions and update virtual scrolling
    this.updateVirtualScrolling();
  }

  private updateSelection(): void {
    if (this.selected && this.selected.length > 0) {
      this.selectionModel.clear();
      this.selected.forEach(row => this.selectionModel.select(row));
    }
  }

  // Event handlers
  onRowClick(event: Event, row: NgxsmkRow, rowIndex: number): void {
    console.log('Row clicked:', { 
      row, 
      rowIndex, 
      hasRowDetail: !!this.rowDetail, 
      toggleOnClick: this.rowDetail?.toggleOnClick,
      template: this.rowDetail?.template,
      currentExpanded: row.$$expanded
    });
    
    // Toggle row detail if toggleOnClick is enabled
    if (this.rowDetail && this.rowDetail.toggleOnClick) {
      this.toggleRowDetail(event, row, rowIndex);
    }
    
    if (this.selectionType !== 'none') {
      this.handleRowSelection(event, row);
    }
    this.activate.emit({ event, row, rowIndex });
  }

  onCellClick(event: Event, row: NgxsmkRow, column: NgxsmkColumn, value: any): void {
    if (this.selectionType === 'cell') {
      this.handleCellSelection(event, row, column, value);
    }
  }

  onHeaderClick(event: Event, column: NgxsmkColumn): void {
    // Prevent sorting when clicking on resize handle
    const target = event.target as HTMLElement;
    if (target.classList.contains('ngxsmk-datatable__resize-handle')) {
      return;
    }

    if (column.sortable) {
      // Issue #2235 fix: Set sorting flag to prevent pagination callbacks
      this.isSorting = true;
      this.handleSort(column);
      // Reset sorting flag after a brief delay
      setTimeout(() => {
        this.isSorting = false;
      }, 100);
    }
  }

  onColumnResize(event: any): void {
    this.columnResize.emit(event);
  }

  onColumnReorder(event: any): void {
    this.columnReorder.emit(event);
  }

  onPageChange(event: PageEvent): void {
    // Issue #2235 fix: Don't emit page event if we're sorting
    if (this.isSorting) {
      return;
    }
    
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.page.emit(event);
    
    // Update visible rows when page changes (for client-side pagination)
    if (!this.externalPaging) {
      this.updateVirtualScrolling();
      this.cdr.detectChanges();
    }
  }

  toggleRowDetail(event: Event, row: NgxsmkRow, rowIndex: number): void {
    // Only stop propagation if clicking on a detail toggle button, not the row itself
    const target = event.target as HTMLElement;
    if (target.closest('.ngxsmk-datatable__detail-toggle-button')) {
      event.stopPropagation();
    }
    
    const wasExpanded = row.$$expanded;
    row.$$expanded = !row.$$expanded;
    
    console.log('Toggle row detail:', {
      rowIndex,
      wasExpanded,
      nowExpanded: row.$$expanded,
      hasTemplate: !!(this.rowDetail?.template),
      rowDetailConfig: this.rowDetail
    });
    
    // PR #2149: Handle frozen row detail state
    if (this.rowDetail?.frozen && row.$$expanded) {
      row.$$frozen = true;
    } else if (!row.$$expanded) {
      row.$$frozen = false;
    }
    
    this.rowDetailToggle.emit({
      row,
      rowIndex,
      expanded: row.$$expanded,
      frozen: row.$$frozen
    });
    
    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  // PR #2149: Check if row is frozen
  isRowFrozen(row: NgxsmkRow): boolean {
    return row.$$frozen === true || 
           this.frozenRowsTop.includes(row) || 
           this.frozenRowsBottom.includes(row);
  }

  // PR #2149: Get all frozen rows
  getAllFrozenRows(): NgxsmkRow[] {
    const frozenExpanded = this.rows.filter(row => row.$$frozen && row.$$expanded);
    return [...this.frozenRowsTop, ...frozenExpanded, ...this.frozenRowsBottom];
  }

  handleRowSelection(event: Event, row: NgxsmkRow): void {
    if (this.selectionType === 'single') {
      this.selectionModel.clear();
      this.selectionModel.select(row);
    } else if (this.selectionType === 'multi' || this.selectionType === 'multiClick') {
      this.selectionModel.toggle(row);
    }

    this.select.emit({
      selected: this.getSelectedRows(),
      event
    });
  }

  private handleCellSelection(event: Event, row: NgxsmkRow, column: NgxsmkColumn, value: any): void {
    // Handle cell selection logic
    this.select.emit({
      selected: [row],
      event
    });
  }

  private handleSort(column: NgxsmkColumn): void {
    const existingSort = this.sorts.find(s => s.prop === column.prop);
    
    if (existingSort) {
      existingSort.dir = existingSort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sorts = [{ prop: column.prop || column.id, dir: 'asc' }];
    }

    this.sort.emit({
      column,
      prevValue: existingSort?.dir === 'asc' ? 'desc' : 'asc',
      newValue: this.sorts[0].dir,
      sorts: this.sorts
    });

    // Perform client-side sorting if not using external sorting
    if (!this.externalSorting) {
      this.sortRows();
      this.updateVirtualScrolling();
      this.cdr.detectChanges();
    }
  }

  private sortRows(): void {
    if (!this.sorts || this.sorts.length === 0) {
      return;
    }

    const sort = this.sorts[0];
    const prop = sort.prop;
    const dir = sort.dir;

    this.rows = [...this.rows].sort((a, b) => {
      const aVal = this.getNestedValue(a, prop);
      const bVal = this.getNestedValue(b, prop);

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir === 'asc' ? 1 : -1;
      if (bVal == null) return dir === 'asc' ? -1 : 1;

      // Compare values
      let result = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        result = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        result = aVal - bVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        result = aVal.getTime() - bVal.getTime();
      } else {
        // Fallback to string comparison
        result = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
      }

      return dir === 'asc' ? result : -result;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    if (!path || !obj) return obj;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value == null) return value;
      value = value[key];
    }
    
    return value;
  }

  // Utility methods
  private getSelectedRows(): NgxsmkRow[] {
    return this.rows.filter(row => this.selectionModel.isSelected(row));
  }

  getRowClass(row: NgxsmkRow, index: number): string {
    if (typeof this.rowClass === 'function') {
      return this.rowClass(row, index);
    }
    return this.rowClass;
  }

  getCellClass(row: NgxsmkRow, column: NgxsmkColumn, value: any, rowIndex: number): string {
    if (typeof column.cellClass === 'function') {
      return column.cellClass(row, column, value, rowIndex);
    }
    return column.cellClass || '';
  }

  getHeaderClass(column: NgxsmkColumn): string {
    return column.headerClass || '';
  }

  trackByRow(index: number, row: NgxsmkRow): any {
    return this.rowIdentity(row);
  }

  trackByColumn(index: number, column: NgxsmkColumn): string {
    return column.id;
  }

  // Column resizing methods
  onResizeStart(event: MouseEvent, column: NgxsmkColumn): void {
    event.preventDefault();
    event.stopPropagation();

    this.resizingColumn = column;
    this.resizeStartX = event.clientX;
    
    // Ensure column has a width before resizing
    if (!this.columnWidths[column.id]) {
      this.columnWidths[column.id] = column.width ? 
        (typeof column.width === 'number' ? column.width : parseInt(column.width.toString(), 10)) : 
        150;
    }
    
    this.resizeStartWidth = this.columnWidths[column.id];

    // Add document-level event listeners
    document.addEventListener('mousemove', this.onResizing);
    document.addEventListener('mouseup', this.onResizeEnd);
    
    // Add body class to prevent text selection during resize
    document.body.classList.add('ngxsmk-resizing');
    
    console.log('Resize started:', {
      column: column.name,
      startWidth: this.resizeStartWidth,
      startX: this.resizeStartX
    });
  }

  private onResizing = (event: MouseEvent): void => {
    if (!this.resizingColumn) return;

    event.preventDefault();
    
    const deltaX = event.clientX - this.resizeStartX;
    const minWidth = this.resizingColumn.minWidth || 50;
    const maxWidth = this.resizingColumn.maxWidth || 1000;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, this.resizeStartWidth + deltaX));
    
    this.columnWidths[this.resizingColumn.id] = newWidth;
    
    // Force layout recalculation to prevent overlap
    this.cdr.detectChanges();
  };

  private onResizeEnd = (event: MouseEvent): void => {
    if (!this.resizingColumn) return;

    // Remove document-level event listeners
    document.removeEventListener('mousemove', this.onResizing);
    document.removeEventListener('mouseup', this.onResizeEnd);
    
    // Remove body class
    document.body.classList.remove('ngxsmk-resizing');
    
    // Emit resize event
    const resizeEvent = {
      column: this.resizingColumn,
      newWidth: this.columnWidths[this.resizingColumn.id],
      oldWidth: this.resizeStartWidth
    };
    this.columnResize.emit(resizeEvent);
    
    // Reset resize state
    this.resizingColumn = null;
    this.cdr.detectChanges();
  };

  isResizingColumn(column: NgxsmkColumn): boolean {
    return this.resizingColumn?.id === column.id;
  }

  // PR #2184: Refresh button handler
  onRefreshClick(): void {
    this.refreshData.emit();
  }

  // PR #2152: Column visibility methods
  toggleColumnVisibility(column: NgxsmkColumn): void {
    const newVisibility = !this.columnVisibility[column.id];
    this.columnVisibility[column.id] = newVisibility;
    this.columnVisibilityChange.emit({ column, visible: newVisibility });
    this.processColumns();
    this.cdr.detectChanges();
  }

  isColumnVisible(column: NgxsmkColumn): boolean {
    return this.columnVisibility[column.id] !== false;
  }

  showColumn(column: NgxsmkColumn): void {
    this.columnVisibility[column.id] = true;
    this.columnVisibilityChange.emit({ column, visible: true });
    this.processColumns();
    this.cdr.detectChanges();
  }

  hideColumn(column: NgxsmkColumn): void {
    this.columnVisibility[column.id] = false;
    this.columnVisibilityChange.emit({ column, visible: false });
    this.processColumns();
    this.cdr.detectChanges();
  }

  // Public API methods
  scrollToRow(rowIndex: number): void {
    if (this.virtualScrolling && this.bodyElement?.nativeElement) {
      const scrollTop = rowIndex * this.rowHeight;
      this.bodyElement.nativeElement.scrollTop = scrollTop;
    }
  }

  scrollToColumn(columnIndex: number): void {
    if (this.bodyElement?.nativeElement) {
      const column = this.columns[columnIndex];
      if (column) {
        const scrollLeft = this.getColumnOffset(columnIndex);
        this.bodyElement.nativeElement.scrollLeft = scrollLeft;
      }
    }
  }

  private getColumnOffset(columnIndex: number): number {
    let offset = 0;
    for (let i = 0; i < columnIndex; i++) {
      const column = this.columns[i];
      offset += this.columnWidths[column.id] || 100;
    }
    return offset;
  }

  selectAll(): void {
    if (this.selectionModel.isAllSelected(this.rows)) {
      this.selectionModel.deselectAll();
      this.select.emit({
        selected: [],
        event: new Event('deselectAll')
      });
    } else {
      this.selectionModel.selectAll(this.rows);
      this.select.emit({
        selected: this.getSelectedRows(),
        event: new Event('selectAll')
      });
    }
  }

  deselectAll(): void {
    this.selectionModel.clear();
    this.select.emit({
      selected: [],
      event: new Event('deselectAll')
    });
  }

  refresh(): void {
    this.updateVirtualScrolling();
    this.cdr.detectChanges();
  }

  // Helper methods for template bindings
  isColumnSorted(column: NgxsmkColumn): boolean {
    return this.sorts.some(s => s.prop === column.prop);
  }

  isColumnSortedAsc(column: NgxsmkColumn): boolean {
    return this.sorts.some(s => s.prop === column.prop && s.dir === 'asc');
  }

  isColumnSortedDesc(column: NgxsmkColumn): boolean {
    return this.sorts.some(s => s.prop === column.prop && s.dir === 'desc');
  }
}
