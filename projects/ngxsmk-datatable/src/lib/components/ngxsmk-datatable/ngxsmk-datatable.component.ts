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
/**
 * High-performance datatable component with virtual scrolling and strongly-typed rows.
 * 
 * @template T - The type of your row data for full type safety in templates
 * 
 * @remarks
 * This component provides a feature-rich datatable with support for:
 * - Virtual scrolling for large datasets
 * - Client-side and server-side pagination
 * - Client-side and server-side sorting
 * - Row selection (single, multi, checkbox)
 * - Column resizing and freezing
 * - Row details expansion
 * - Strongly-typed templates for enhanced developer experience
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 *   status: 'Active' | 'Inactive';
 * }
 * 
 * columns: NgxsmkColumn<User>[] = [
 *   { id: 'name', name: 'Name', prop: 'name', sortable: true },
 *   { id: 'email', name: 'Email', prop: 'email', sortable: true }
 * ];
 * 
 * rows: NgxsmkRow<User>[] = [
 *   { id: 1, name: 'John', email: 'john@example.com', status: 'Active' }
 * ];
 * ```
 */
export class NgxsmkDatatableComponent<T = any> implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  /** Column definitions for the datatable */
  @Input() columns: NgxsmkColumn<T>[] = [];
  
  /** Row data for the datatable */
  @Input() rows: NgxsmkRow<T>[] = [];
  
  /** Enable virtual scrolling for better performance with large datasets */
  @Input() virtualScrolling = true;
  
  /** Height of each row in pixels */
  @Input() rowHeight: number = 50;
  
  /** Height of the header in pixels */
  @Input() headerHeight: number = 50;
  
  /** Height of the footer in pixels */
  @Input() footerHeight: number = 50;
  
  /** Enable horizontal scrollbar */
  @Input() scrollbarH = true;
  
  /** Enable vertical scrollbar */
  @Input() scrollbarV = true;
  
  /** Enable horizontal scrolling */
  @Input() scrollX = false;
  
  /** Enable vertical scrolling */
  @Input() scrollY = false;
  
  /** Type of row selection: 'single', 'multi', 'multiClick', 'checkbox', or 'none' */
  @Input() selectionType: SelectionType = 'single';
  
  /** Array of currently selected rows */
  @Input() selected: NgxsmkRow<T>[] = [];
  
  /** Position of selection checkbox: 'left' or 'right' */
  @Input() selectCheckboxPosition: 'left' | 'right' = 'left';
  
  /** Configuration for pagination */
  @Input() pagination: PaginationConfig | null = null;
  
  /** Use external pagination (server-side) */
  @Input() externalPaging = false;
  
  /** Use external sorting (server-side) */
  @Input() externalSorting = false;
  
  /** Show loading indicator overlay */
  @Input() loadingIndicator = false;
  
  /** Message to display when table is empty */
  @Input() emptyMessage = 'No data available';
  
  /** CSS class for empty state icon */
  @Input() emptyIconClass = 'icon-empty';
  
  /** Show refresh button in footer */
  @Input() showRefreshButton = false;
  
  /** Enable column visibility controls */
  @Input() columnVisibilityEnabled = false;
  
  /** Additional CSS class for the datatable container */
  @Input() class = '';
  
  /** Additional CSS class for the header */
  @Input() headerClass = '';
  
  /** Additional CSS class for the footer */
  @Input() footerClass = '';
  
  /** CSS class or function to apply to rows */
  @Input() rowClass: string | ((row: NgxsmkRow<T>, index: number) => string) = '';
  
  /** Property name to use for tracking rows (default: 'id') */
  @Input() trackByProp = 'id';
  
  /** Function to identify unique rows for change detection */
  @Input() rowIdentity: (row: NgxsmkRow<T>) => any = (row: NgxsmkRow<T>) => {
    if (this.trackByProp && row && typeof row === 'object') {
      return row[this.trackByProp];
    }
    return row;
  };
  
  /** Configuration for expandable row details */
  @Input() rowDetail: RowDetailView | null = null;
  
  /** Rows to freeze at the top of the table */
  @Input() frozenRowsTop: NgxsmkRow<T>[] = [];
  
  /** Rows to freeze at the bottom of the table */
  @Input() frozenRowsBottom: NgxsmkRow<T>[] = [];

  /** Emitted when a row or cell is activated (clicked) */
  @Output() activate = new EventEmitter<any>();
  
  /** Emitted when row selection changes */
  @Output() select = new EventEmitter<SelectionEvent>();
  
  /** Emitted when column sorting changes */
  @Output() sort = new EventEmitter<SortEvent>();
  
  /** Emitted when page changes */
  @Output() page = new EventEmitter<PageEvent>();
  
  /** Emitted when a column is resized */
  @Output() columnResize = new EventEmitter<any>();
  
  /** Emitted when columns are reordered */
  @Output() columnReorder = new EventEmitter<any>();
  
  /** Emitted when row detail is expanded or collapsed */
  @Output() rowDetailToggle = new EventEmitter<any>();
  
  /** Emitted when refresh button is clicked */
  @Output() refreshData = new EventEmitter<void>();
  
  /** Emitted when column visibility changes */
  @Output() columnVisibilityChange = new EventEmitter<{ column: NgxsmkColumn; visible: boolean }>();

  @ViewChild('datatableContainer', { static: true }) container!: ElementRef;
  @ViewChild('headerElement', { static: false }) headerElement!: ElementRef;
  @ViewChild('bodyElement', { static: false }) bodyElement!: ElementRef;
  @ViewChild('footerElement', { static: false }) footerElement!: ElementRef;

  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;
  @ContentChild('rowDetailTemplate') rowDetailTemplate!: TemplateRef<any>;

  /** Observable for component cleanup */
  private destroy$ = new Subject<void>();
  
  /** ResizeObserver instance for responsive behavior */
  private resizeObserver?: ResizeObserver;
  
  /** Subject for scroll events with debouncing */
  private scrollSubject = new Subject<{ scrollTop: number; scrollLeft: number }>();
  
  /** Currently resizing column */
  private resizingColumn: NgxsmkColumn<T> | null = null;
  
  /** X position when resize started */
  private resizeStartX = 0;
  
  /** Column width when resize started */
  private resizeStartWidth = 0;
  
  /** Flag to prevent pagination events during sorting */
  private isSorting = false;

  /** Rows currently visible in viewport (for virtual scrolling) */
  visibleRows: NgxsmkRow<T>[] = [];
  
  /** Index of first visible row */
  visibleStartIndex = 0;
  
  /** Index of last visible row */
  visibleEndIndex = 0;
  
  /** Total height of all rows */
  totalHeight = 0;
  
  /** Current vertical scroll position */
  scrollTop = 0;
  
  /** Current horizontal scroll position */
  scrollLeft = 0;
  
  /** Flag indicating if scroll listener is attached */
  private scrollListenerAttached = false;

  /** Map of column IDs to their widths */
  columnWidths: { [key: string]: number } = {};
  
  /** Map of column IDs to their visibility state */
  columnVisibility: { [key: string]: boolean } = {};
  
  /** Columns frozen to the left side */
  frozenLeftColumns: NgxsmkColumn<T>[] = [];
  
  /** Columns frozen to the right side */
  frozenRightColumns: NgxsmkColumn<T>[] = [];
  
  /** Scrollable (non-frozen) columns */
  scrollableColumns: NgxsmkColumn<T>[] = [];
  
  /** Currently visible columns (after filtering) */
  visibleColumns: NgxsmkColumn<T>[] = [];

  /** Selection model for managing row selection */
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

  /** Current sort configuration */
  sorts: { prop: string; dir: SortDirection }[] = [];

  /** Current page number (1-based) */
  currentPage = 1;
  
  /** Number of rows per page */
  pageSize = 10;
  
  /** Total number of items across all pages */
  totalItems = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private virtualScrollService: VirtualScrollService,
    private columnResizeService: ColumnResizeService,
    private selectionService: SelectionService
  ) {
    this.selectionModel = this.selectionService.createSelectionModel();
  }

  ngOnInit(): void {
    this.initializePagination();
    this.initializeComponent();
    this.setupEventListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let needsUpdate = false;

    if (changes['rows']) {
      this.processRows();
      needsUpdate = true;
      
      if (!this.scrollListenerAttached && this.rows.length > 0) {
        setTimeout(() => {
          if (!this.scrollListenerAttached) {
            this.setupScrollListener();
            this.setupResizeObserver();
          }
        }, 0);
      }
    }
    
    if (changes['columns']) {
      this.processColumns();
      needsUpdate = true;
    }
    
    if (changes['pagination']) {
      this.initializePagination();
      needsUpdate = true;
    }
    
    if (changes['rows'] || changes['pagination']) {
      this.updateVirtualScrolling();
    }
    
    if (changes['selected']) {
      this.updateSelection();
      needsUpdate = true;
    }

    if (needsUpdate) {
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupResizeObserver();
      this.setupScrollListener();
      this.calculateDimensions();
      this.updateVirtualScrolling();
      this.cdr.detectChanges();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    
    if (this.resizingColumn) {
      document.removeEventListener('mousemove', this.onResizing.bind(this));
      document.removeEventListener('mouseup', this.onResizeEnd.bind(this));
    }
    
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

  /**
   * Processes row data and updates internal state
   * @private
   */
  private processRows(): void {
    if (!this.externalPaging) {
      this.totalItems = this.rows.length;
    }
    
    if (!this.externalSorting && this.sorts && this.sorts.length > 0) {
      this.sortRows();
    }
    
    this.updateVirtualScrolling();
  }

  /**
   * Initializes pagination configuration
   * @private
   */
  private initializePagination(): void {
    if (this.pagination) {
      this.pageSize = this.pagination.pageSize || 10;
      this.currentPage = this.pagination.currentPage || 1;
      
      if (this.externalPaging) {
        this.totalItems = this.pagination.totalItems || 0;
      } else {
        this.totalItems = this.rows?.length || 0;
      }
    }
  }

  /**
   * Calculates and stores column widths
   * @private
   */
  private calculateColumnWidths(): void {
    this.columns.forEach(column => {
      if (column.width) {
        this.columnWidths[column.id] = typeof column.width === 'number' 
          ? column.width 
          : parseInt(column.width.toString(), 10);
      } else if (!this.columnWidths[column.id]) {
        this.columnWidths[column.id] = 150;
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

    // Calculate total height including expanded row details
    const detailHeight = this.rowDetail?.rowHeight || 0;
    const expandedCount = displayRows.filter(row => row.$$expanded).length;
    this.totalHeight = (displayRows.length * this.rowHeight) + (expandedCount * detailHeight);

    // Apply virtual scrolling if enabled
    if (!this.virtualScrolling) {
      this.visibleRows = displayRows;
      this.visibleStartIndex = 0;
      this.visibleEndIndex = displayRows.length - 1;
      return;
    }

    // Use bodyElement height for virtual scrolling, not container height
    const bodyHeight = this.bodyElement?.nativeElement?.clientHeight || 0;
    const containerHeight = this.container?.nativeElement?.clientHeight || 0;
    
    // Prefer bodyElement height as it's the actual scrolling container
    const effectiveHeight = bodyHeight || containerHeight;
    
    // If no height available, use a sensible default
    if (effectiveHeight === 0) {
      // Set some visible rows anyway
      this.visibleStartIndex = 0;
      this.visibleEndIndex = Math.min(19, displayRows.length - 1); // Show first 20 rows
      this.visibleRows = [...displayRows.slice(0, 20)];
      // Total height already calculated above
      return;
    }
    
    const visibleRowCount = Math.ceil(effectiveHeight / this.rowHeight);
    const bufferSize = Math.min(5, Math.floor(visibleRowCount / 2));

    const newStartIndex = Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - bufferSize);
    const newEndIndex = Math.min(
      displayRows.length - 1,
      newStartIndex + visibleRowCount + bufferSize * 2
    );

    this.visibleStartIndex = newStartIndex;
    this.visibleEndIndex = newEndIndex;
    
    // Create a NEW array reference to ensure change detection triggers
    this.visibleRows = [...displayRows.slice(this.visibleStartIndex, this.visibleEndIndex + 1)];
    // Total height already calculated above (includes expanded row details)
  }

  private setupEventListeners(): void {
    this.scrollSubject
      .pipe(
        debounceTime(16),
        distinctUntilChanged((prev, curr) => {
          // Compare by value, not reference
          return prev.scrollTop === curr.scrollTop && prev.scrollLeft === curr.scrollLeft;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(({ scrollTop, scrollLeft }) => {
        this.scrollTop = scrollTop;
        this.scrollLeft = scrollLeft;
        this.updateVirtualScrolling();
        // Force immediate change detection for OnPush strategy
        this.cdr.detectChanges();
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
      this.scrollListenerAttached = true;
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

  /**
   * Handles row click events
   * @param event - The click event
   * @param row - The clicked row
   * @param rowIndex - Index of the clicked row
   */
  onRowClick(event: Event, row: NgxsmkRow<T>, rowIndex: number): void {
    if (this.rowDetail && this.rowDetail.toggleOnClick) {
      this.toggleRowDetail(event, row, rowIndex);
    }
    
    // For checkbox selection, only handle selection from checkbox clicks, not row clicks
    if (this.selectionType !== 'none' && this.selectionType !== 'checkbox') {
      this.handleRowSelection(event, row);
    }
    
    this.activate.emit({ event, row, rowIndex });
  }

  onCellClick(event: Event, row: NgxsmkRow<T>, column: NgxsmkColumn<T>, value: any): void {
    if (this.selectionType === 'cell') {
      this.handleCellSelection(event, row, column, value);
    }
  }

  /**
   * Handles header column click events
   * @param event - The click event
   * @param column - The clicked column
   */
  onHeaderClick(event: Event, column: NgxsmkColumn<T>): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('ngxsmk-datatable__resize-handle')) {
      return;
    }

    if (column.sortable) {
      this.isSorting = true;
      this.handleSort(column);
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

  /**
   * Handles page change events
   * @param event - The page change event
   */
  onPageChange(event: PageEvent): void {
    if (this.isSorting) {
      return;
    }
    
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    
    this.updateVirtualScrolling();
    this.cdr.detectChanges();
    
    this.page.emit(event);
  }

  /**
   * Toggles the expanded state of a row detail
   * @param event - The click event
   * @param row - The row to toggle
   * @param rowIndex - Index of the row
   */
  toggleRowDetail(event: Event, row: NgxsmkRow<T>, rowIndex: number): void {
    const target = event.target as HTMLElement;
    if (target.closest('.ngxsmk-datatable__detail-toggle-button')) {
      event.stopPropagation();
    }
    
    const wasExpanded = row.$$expanded;
    row.$$expanded = !row.$$expanded;
    
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
    
    this.updateVirtualScrolling();
    this.cdr.detectChanges();
  }

  /**
   * Checks if a row is frozen
   * @param row - The row to check
   * @returns True if the row is frozen
   */
  isRowFrozen(row: NgxsmkRow<T>): boolean {
    return row.$$frozen === true || 
           this.frozenRowsTop.includes(row) || 
           this.frozenRowsBottom.includes(row);
  }

  /**
   * Gets all frozen rows including frozen expanded rows
   * @returns Array of frozen rows
   */
  getAllFrozenRows(): NgxsmkRow<T>[] {
    const frozenExpanded = this.rows.filter(row => row.$$frozen && row.$$expanded);
    return [...this.frozenRowsTop, ...frozenExpanded, ...this.frozenRowsBottom];
  }

  /**
   * Handles row selection for different selection types
   * @param event - The selection event
   * @param row - The row being selected
   */
  handleRowSelection(event: Event, row: NgxsmkRow<T>): void {
    if (this.selectionType === 'single') {
      this.selectionModel.clear();
      this.selectionModel.select(row);
    } else if (this.selectionType === 'multi' || this.selectionType === 'multiClick' || this.selectionType === 'checkbox') {
      this.selectionModel.toggle(row);
    }

    this.select.emit({
      selected: this.getSelectedRows(),
      event
    });
    
    this.cdr.markForCheck();
  }

  private handleCellSelection(event: Event, row: NgxsmkRow<T>, column: NgxsmkColumn<T>, value: any): void {
    // Handle cell selection logic
    this.select.emit({
      selected: [row],
      event
    });
  }

  /**
   * Handles column sorting
   * @param column - The column to sort
   * @private
   */
  private handleSort(column: NgxsmkColumn<T>): void {
    const columnKey = column.prop || column.id;
    const existingSort = this.sorts.find(s => s.prop === columnKey);
    
    let newDir: SortDirection;
    let prevValue: SortDirection | undefined;
    
    if (existingSort) {
      prevValue = existingSort.dir;
      if (existingSort.dir === 'asc') {
        existingSort.dir = 'desc';
        newDir = 'desc';
      } else {
        this.sorts = this.sorts.filter(s => s.prop !== columnKey);
        newDir = '' as SortDirection;
      }
    } else {
      this.sorts = [{ prop: columnKey, dir: 'asc' }];
      newDir = 'asc';
      prevValue = '' as SortDirection;
    }

    this.sort.emit({
      column,
      prevValue: prevValue,
      newValue: newDir,
      sorts: this.sorts
    });

    if (!this.externalSorting) {
      this.sortRows();
      this.updateVirtualScrolling();
      this.cdr.detectChanges();
    }
  }

  /**
   * Performs client-side sorting on rows
   * @private
   */
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

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir === 'asc' ? 1 : -1;
      if (bVal == null) return dir === 'asc' ? -1 : 1;

      let result = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        result = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        result = aVal - bVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        result = aVal.getTime() - bVal.getTime();
      } else {
        result = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
      }

      return dir === 'asc' ? result : -result;
    });
  }

  /**
   * Gets a nested property value from an object using dot notation
   * @param obj - The object to get the value from
   * @param path - The property path (e.g., 'address.city')
   * @returns The nested property value
   * @private
   */
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

  /**
   * Gets all currently selected rows
   * @returns Array of selected rows
   * @private
   */
  private getSelectedRows(): NgxsmkRow<T>[] {
    return this.rows.filter(row => this.selectionModel.isSelected(row));
  }

  getRowClass(row: NgxsmkRow<T>, index: number): string {
    if (typeof this.rowClass === 'function') {
      return this.rowClass(row, index);
    }
    return this.rowClass;
  }

  /**
   * Track by function for virtual scrolling that ensures proper DOM updates
   * @param index - The index in the visible rows array
   * @param row - The row data
   * @returns A unique identifier for the row
   */
  trackByIndex(index: number, row: NgxsmkRow<T>): any {
    const rowId = this.rowIdentity(row);
    return `${this.visibleStartIndex + index}_${rowId}`;
  }

  getCellClass(row: NgxsmkRow<T>, column: NgxsmkColumn<T>, value: any, rowIndex: number): string {
    if (typeof column.cellClass === 'function') {
      return column.cellClass(row, column, value, rowIndex);
    }
    return column.cellClass || '';
  }

  getHeaderClass(column: NgxsmkColumn<T>): string {
    return column.headerClass || '';
  }

  trackByRow(index: number, row: NgxsmkRow<T>): any {
    return this.rowIdentity(row);
  }

  trackByColumn(index: number, column: NgxsmkColumn<T>): string {
    return column.id;
  }

  /**
   * Handles the start of a column resize operation
   * @param event - The mouse event
   * @param column - The column being resized
   */
  onResizeStart(event: MouseEvent, column: NgxsmkColumn<T>): void {
    event.preventDefault();
    event.stopPropagation();

    this.resizingColumn = column;
    this.resizeStartX = event.clientX;
    
    if (!this.columnWidths[column.id]) {
      this.columnWidths[column.id] = column.width ? 
        (typeof column.width === 'number' ? column.width : parseInt(column.width.toString(), 10)) : 
        150;
    }
    
    this.resizeStartWidth = this.columnWidths[column.id];

    document.addEventListener('mousemove', this.onResizing);
    document.addEventListener('mouseup', this.onResizeEnd);
    
    document.body.classList.add('ngxsmk-resizing');
  }

  /**
   * Handles column resizing as the mouse moves
   * @param event - The mouse event
   * @private
   */
  private onResizing = (event: MouseEvent): void => {
    if (!this.resizingColumn) return;

    event.preventDefault();
    
    const deltaX = event.clientX - this.resizeStartX;
    const minWidth = this.resizingColumn.minWidth || 50;
    const maxWidth = this.resizingColumn.maxWidth || 1000;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, this.resizeStartWidth + deltaX));
    
    this.columnWidths[this.resizingColumn.id] = newWidth;
    
    this.cdr.detectChanges();
  };

  /**
   * Handles the end of a column resize operation
   * @param event - The mouse event
   * @private
   */
  private onResizeEnd = (event: MouseEvent): void => {
    if (!this.resizingColumn) return;

    document.removeEventListener('mousemove', this.onResizing);
    document.removeEventListener('mouseup', this.onResizeEnd);
    
    document.body.classList.remove('ngxsmk-resizing');
    
    const resizeEvent = {
      column: this.resizingColumn,
      newWidth: this.columnWidths[this.resizingColumn.id],
      oldWidth: this.resizeStartWidth
    };
    this.columnResize.emit(resizeEvent);
    
    this.resizingColumn = null;
    this.cdr.detectChanges();
  };

  isResizingColumn(column: NgxsmkColumn<T>): boolean {
    return this.resizingColumn?.id === column.id;
  }

  /**
   * Handles refresh button click
   */
  onRefreshClick(): void {
    this.refreshData.emit();
  }

  /**
   * Toggles the visibility of a column
   * @param column - The column to toggle
   */
  toggleColumnVisibility(column: NgxsmkColumn<T>): void {
    const newVisibility = !this.columnVisibility[column.id];
    this.columnVisibility[column.id] = newVisibility;
    this.columnVisibilityChange.emit({ column, visible: newVisibility });
    this.processColumns();
    this.cdr.detectChanges();
  }

  /**
   * Checks if a column is visible
   * @param column - The column to check
   * @returns True if the column is visible
   */
  isColumnVisible(column: NgxsmkColumn<T>): boolean {
    return this.columnVisibility[column.id] !== false;
  }

  /**
   * Shows a hidden column
   * @param column - The column to show
   */
  showColumn(column: NgxsmkColumn<T>): void {
    this.columnVisibility[column.id] = true;
    this.columnVisibilityChange.emit({ column, visible: true });
    this.processColumns();
    this.cdr.detectChanges();
  }

  /**
   * Hides a visible column
   * @param column - The column to hide
   */
  hideColumn(column: NgxsmkColumn<T>): void {
    this.columnVisibility[column.id] = false;
    this.columnVisibilityChange.emit({ column, visible: false });
    this.processColumns();
    this.cdr.detectChanges();
  }

  /**
   * Scrolls the table to a specific row
   * @param rowIndex - The index of the row to scroll to
   */
  scrollToRow(rowIndex: number): void {
    if (this.virtualScrolling && this.bodyElement?.nativeElement) {
      const scrollTop = rowIndex * this.rowHeight;
      this.bodyElement.nativeElement.scrollTop = scrollTop;
    }
  }

  /**
   * Scrolls the table to a specific column
   * @param columnIndex - The index of the column to scroll to
   */
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

  /**
   * Selects or deselects all rows
   */
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

  /**
   * Deselects all currently selected rows
   */
  deselectAll(): void {
    this.selectionModel.clear();
    this.select.emit({
      selected: [],
      event: new Event('deselectAll')
    });
  }

  /**
   * Refreshes the table display
   */
  refresh(): void {
    this.updateVirtualScrolling();
    this.cdr.detectChanges();
  }

  /**
   * Checks if a column is currently sorted
   * @param column - The column to check
   * @returns True if the column is sorted
   */
  isColumnSorted(column: NgxsmkColumn<T>): boolean {
    const columnKey = column.prop || column.id;
    return this.sorts.some(s => s.prop === columnKey);
  }

  /**
   * Checks if a column is sorted in ascending order
   * @param column - The column to check
   * @returns True if the column is sorted ascending
   */
  isColumnSortedAsc(column: NgxsmkColumn<T>): boolean {
    const columnKey = column.prop || column.id;
    return this.sorts.some(s => s.prop === columnKey && s.dir === 'asc');
  }

  /**
   * Checks if a column is sorted in descending order
   * @param column - The column to check
   * @returns True if the column is sorted descending
   */
  isColumnSortedDesc(column: NgxsmkColumn<T>): boolean {
    const columnKey = column.prop || column.id;
    return this.sorts.some(s => s.prop === columnKey && s.dir === 'desc');
  }

  /**
   * Calculates the height of the bottom spacer for virtual scrolling
   * @returns Height in pixels
   */
  getBottomSpacerHeight(): number {
    let displayRowCount = this.rows.length;
    
    if (this.pagination && !this.externalPaging) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      displayRowCount = Math.min(this.pageSize, this.rows.length - startIndex);
    }
    
    const bottomRows = Math.max(0, displayRowCount - this.visibleEndIndex - 1);
    return bottomRows * this.rowHeight;
  }

  /**
   * Gets the actual row index accounting for pagination
   * @param visibleIndex - Index in the visible rows array
   * @returns The actual row index in the full dataset
   */
  getActualRowIndex(visibleIndex: number): number {
    let actualIndex = this.visibleStartIndex + visibleIndex;
    
    if (this.pagination && !this.externalPaging) {
      const paginationOffset = (this.currentPage - 1) * this.pageSize;
      actualIndex += paginationOffset;
    }
    
    return actualIndex;
  }
}
