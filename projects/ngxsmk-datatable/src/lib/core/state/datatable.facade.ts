import { Observable, combineLatest, map } from 'rxjs';
import { DatatableStore } from './datatable.store';
import { DatatableState, StateChangeEvent } from './datatable.state';
import { NgxsmkColumn } from '../../interfaces/column.interface';
import { NgxsmkRow } from '../../interfaces/row.interface';
import { SortState } from '../../interfaces/sorting.interface';
import { Filter } from '../../interfaces/filtering.interface';

/**
 * Facade configuration
 */
export interface DatatableFacadeConfig<T> {
  /** TrackBy function for rows */
  trackRowsBy?: (index: number, row: T) => any;
  
  /** TrackBy function for columns */
  trackColumnsBy?: (index: number, column: NgxsmkColumn<T>) => any;
  
  /** Enable OnPush change detection optimization */
  onPush?: boolean;
  
  /** Enable immutability checks (development only) */
  immutable?: boolean;
  
  /** Enable performance monitoring */
  monitoring?: boolean;
}

/**
 * Facade for datatable state management
 * Provides a clean, type-safe API for UI components
 * 
 * This is the main entry point for interacting with the datatable.
 * It wraps the store and provides high-level operations.
 * 
 * Note: This class is not decorated with @Injectable because it's meant to be 
 * instantiated directly, not injected.
 * 
 * @example
 * const facade = new DatatableFacade<User>({
 *   trackRowsBy: (i, row) => row.id,
 *   onPush: true
 * });
 * 
 * facade.setRows(users);
 * facade.rows$.subscribe(rows => console.log(rows));
 */
export class DatatableFacade<T = any> {
  private readonly store: DatatableStore<T>;
  private config: DatatableFacadeConfig<T>;

  // ======================
  // Observables (for UI binding)
  // ======================

  /** All rows */
  readonly rows$: Observable<ReadonlyArray<Readonly<T>>>;

  /** All columns */
  readonly columns$: Observable<ReadonlyArray<Readonly<NgxsmkColumn<T>>>>;

  /** Current sorting */
  readonly sorting$: Observable<ReadonlyArray<Readonly<SortState>>>;

  /** Active filters */
  readonly filtering$: Observable<ReadonlyArray<Readonly<Filter>>>;

  /** Selected row IDs */
  readonly selection$: Observable<ReadonlyArray<string | number>>;

  /** Pagination state */
  readonly pagination$: Observable<any>;

  /** Virtual scroll state */
  readonly virtualScroll$: Observable<any>;

  /** Loading state */
  readonly loading$: Observable<boolean>;

  /** Error state */
  readonly error$: Observable<Error | null>;

  /** Entire state (use sparingly) */
  readonly state$: Observable<DatatableState<T>>;

  /** State change events */
  readonly stateChanges$: Observable<StateChangeEvent<T> | null>;

  constructor(config: DatatableFacadeConfig<T> = {}) {
    this.store = new DatatableStore<T>();
    this.config = {
      trackRowsBy: (index, row: any) => row?.id ?? index,
      trackColumnsBy: (index, column) => column.id,
      onPush: true,
      immutable: true,
      monitoring: false,
      ...config
    };

    // Initialize observables after store is created
    this.rows$ = this.store.select(state => state.rows);
    this.columns$ = this.store.select(state => state.columns);
    this.sorting$ = this.store.select(state => state.sorting);
    this.filtering$ = this.store.select(state => state.filtering);
    this.selection$ = this.store.select(state => state.selection);
    this.pagination$ = this.store.select(state => state.pagination);
    this.virtualScroll$ = this.store.select(state => state.virtualScroll);
    this.loading$ = this.store.select(state => state.loading);
    this.error$ = this.store.select(state => state.error);
    this.state$ = this.store.state$;
    this.stateChanges$ = this.store.stateChanges$;

    // Initialize computed observables
    this.visibleRows$ = combineLatest([
      this.rows$,
      this.filtering$,
      this.sorting$,
      this.pagination$
    ]).pipe(
      map(([rows, filters, sorts, pagination]) => {
        let result = [...rows];

        // Apply filtering (simplified - actual implementation would use filtering service)
        if (filters.length > 0) {
          // TODO: Implement filtering logic
        }

        // Apply sorting (simplified - actual implementation would use sorting service)
        if (sorts.length > 0) {
          // TODO: Implement sorting logic
        }

        // Apply pagination
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        result = result.slice(start, end);

        return result;
      })
    );

    this.selectedRows$ = combineLatest([
      this.rows$,
      this.selection$
    ]).pipe(
      map(([rows, selection]) =>
        rows.filter((row: any) => selection.includes(row.id))
      )
    );

    this.totalRows$ = this.rows$.pipe(map(rows => rows.length));

    this.hasSelection$ = this.selection$.pipe(map(sel => sel.length > 0));

    this.allVisibleSelected$ = combineLatest([
      this.visibleRows$,
      this.selection$
    ]).pipe(
      map(([visible, selection]) =>
        visible.length > 0 && visible.every((row: any) => selection.includes(row.id))
      )
    );
  }

  // ======================
  // Computed Observables
  // ======================

  /** Visible rows (after filtering, sorting, pagination) */
  readonly visibleRows$: Observable<ReadonlyArray<Readonly<T>>>;

  /** Selected rows (full objects) */
  readonly selectedRows$: Observable<ReadonlyArray<Readonly<T>>>;

  /** Total row count */
  readonly totalRows$: Observable<number>;

  /** Is any row selected? */
  readonly hasSelection$: Observable<boolean>;

  /** Are all visible rows selected? */
  readonly allVisibleSelected$: Observable<boolean>;

  // ======================
  // Commands (void return for performance)
  // ======================

  /**
   * Set all rows (replaces existing)
   */
  setRows(rows: T[]): void {
    this.store.update(
      state => ({
        ...state,
        rows: rows,
        pagination: {
          ...state.pagination,
          total: rows.length
        }
      }),
      'ROWS_UPDATED'
    );
  }

  /**
   * Add rows (appends to existing)
   */
  addRows(rows: T[]): void {
    this.store.update(
      state => ({
        ...state,
        rows: [...state.rows, ...rows],
        pagination: {
          ...state.pagination,
          total: state.rows.length + rows.length
        }
      }),
      'ROWS_UPDATED'
    );
  }

  /**
   * Update a single row
   */
  updateRow(id: string | number, updates: Partial<T>): void {
    this.store.update(
      state => ({
        ...state,
        rows: state.rows.map((row: any) =>
          row.id === id ? { ...row, ...updates } : row
        )
      }),
      'ROWS_UPDATED'
    );
  }

  /**
   * Delete rows by ID
   */
  deleteRows(ids: (string | number)[]): void {
    this.store.update(
      state => ({
        ...state,
        rows: state.rows.filter((row: any) => !ids.includes(row.id)),
        pagination: {
          ...state.pagination,
          total: state.rows.length - ids.length
        }
      }),
      'ROWS_UPDATED'
    );
  }

  /**
   * Set columns
   */
  setColumns(columns: NgxsmkColumn<T>[]): void {
    this.store.update(
      state => ({ ...state, columns }),
      'COLUMNS_UPDATED'
    );
  }

  /**
   * Sort by column
   */
  sortBy(column: NgxsmkColumn<T>, direction?: 'asc' | 'desc'): void {
    const newDirection = direction || (this.getSortDirection(column) === 'asc' ? 'desc' : 'asc');
    
    this.store.update(
      state => ({
        ...state,
        sorting: [{
          field: column.prop || column.id,
          direction: newDirection
        }]
      }),
      'SORTING_CHANGED'
    );
  }

  /**
   * Add to multi-sort (Shift+Click)
   */
  addSort(column: NgxsmkColumn<T>, direction?: 'asc' | 'desc'): void {
    const field = column.prop || column.id;
    const newDirection = direction || 'asc';
    
    this.store.update(
      state => {
        const existing = state.sorting.filter(s => s.field !== field);
        return {
          ...state,
          sorting: [...existing, { field, direction: newDirection }]
        };
      },
      'SORTING_CHANGED'
    );
  }

  /**
   * Clear sorting
   */
  clearSorting(): void {
    this.store.update(
      state => ({ ...state, sorting: [] }),
      'SORTING_CHANGED'
    );
  }

  /**
   * Select row
   */
  selectRow(id: string | number): void {
    this.store.update(
      state => ({
        ...state,
        selection: [...state.selection, id]
      }),
      'SELECTION_CHANGED'
    );
  }

  /**
   * Deselect row
   */
  deselectRow(id: string | number): void {
    this.store.update(
      state => ({
        ...state,
        selection: state.selection.filter(selectedId => selectedId !== id)
      }),
      'SELECTION_CHANGED'
    );
  }

  /**
   * Toggle row selection
   */
  toggleRowSelection(id: string | number): void {
    const isSelected = this.store.state.selection.includes(id);
    if (isSelected) {
      this.deselectRow(id);
    } else {
      this.selectRow(id);
    }
  }

  /**
   * Select all rows
   */
  selectAll(): void {
    this.store.update(
      state => ({
        ...state,
        selection: state.rows.map((row: any) => row.id)
      }),
      'SELECTION_CHANGED'
    );
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.store.update(
      state => ({ ...state, selection: [] }),
      'SELECTION_CHANGED'
    );
  }

  /**
   * Go to page
   */
  goToPage(page: number): void {
    this.store.update(
      state => ({
        ...state,
        pagination: {
          ...state.pagination,
          page,
          hasPrevPage: page > 1,
          hasNextPage: page < Math.ceil(state.pagination.total / state.pagination.pageSize)
        }
      }),
      'PAGINATION_CHANGED'
    );
  }

  /**
   * Set page size
   */
  setPageSize(pageSize: number): void {
    this.store.update(
      state => ({
        ...state,
        pagination: {
          ...state.pagination,
          pageSize,
          page: 1 // Reset to first page
        }
      }),
      'PAGINATION_CHANGED'
    );
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.store.update(
      state => ({ ...state, loading }),
      loading ? 'LOADING_STARTED' : 'LOADING_FINISHED'
    );
  }

  /**
   * Set error state
   */
  setError(error: Error | null): void {
    this.store.update(
      state => ({ ...state, error }),
      'ERROR_OCCURRED'
    );
  }

  // ======================
  // Queries (pure functions, return values)
  // ======================

  /**
   * Get row by ID
   */
  getRow(id: string | number): T | undefined {
    return this.store.state.rows.find((row: any) => row.id === id) as T | undefined;
  }

  /**
   * Get selected rows
   */
  getSelectedRows(): T[] {
    const { rows, selection } = this.store.state;
    return rows.filter((row: any) => selection.includes(row.id)) as T[];
  }

  /**
   * Get total row count
   */
  getTotalRows(): number {
    return this.store.state.rows.length;
  }

  /**
   * Get current sort direction for column
   */
  getSortDirection(column: NgxsmkColumn<T>): 'asc' | 'desc' | null {
    const field = column.prop || column.id;
    const sort = this.store.state.sorting.find(s => s.field === field);
    return sort?.direction || null;
  }

  /**
   * Is column sorted?
   */
  isColumnSorted(column: NgxsmkColumn<T>): boolean {
    const field = column.prop || column.id;
    return this.store.state.sorting.some(s => s.field === field);
  }

  /**
   * Is row selected?
   */
  isRowSelected(id: string | number): boolean {
    return this.store.state.selection.includes(id);
  }

  /**
   * Get TrackBy function for rows
   */
  get trackRowsBy() {
    return this.config.trackRowsBy!;
  }

  /**
   * Get TrackBy function for columns
   */
  get trackColumnsBy() {
    return this.config.trackColumnsBy!;
  }

  /**
   * Get current state snapshot
   */
  getState(): DatatableState<T> {
    return this.store.state;
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.store.reset();
  }
}

