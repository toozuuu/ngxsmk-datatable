import { NgxsmkColumn } from '../../interfaces/column.interface';
import { NgxsmkRow } from '../../interfaces/row.interface';
import { SortState } from '../../interfaces/sorting.interface';
import { Filter } from '../../interfaces/filtering.interface';

/**
 * Core virtual scroll state (for headless architecture)
 */
export interface CoreVirtualScrollState {
  readonly enabled: boolean;
  readonly visibleStartIndex: number;
  readonly visibleEndIndex: number;
  readonly totalHeight: number;
  readonly scrollTop: number;
  readonly scrollLeft: number;
  readonly bufferSize: number;
}

/**
 * Immutable datatable state
 * All properties are readonly to enforce immutability
 */
export interface DatatableState<T = any> {
  /** All rows in the dataset */
  readonly rows: ReadonlyArray<Readonly<T>>;
  
  /** Column definitions */
  readonly columns: ReadonlyArray<Readonly<NgxsmkColumn<T>>>;
  
  /** Current sorting state */
  readonly sorting: ReadonlyArray<Readonly<SortState>>;
  
  /** Active filters */
  readonly filtering: ReadonlyArray<Readonly<Filter>>;
  
  /** Selected row IDs */
  readonly selection: ReadonlyArray<string | number>;
  
  /** Pagination state */
  readonly pagination: Readonly<{
    page: number;
    pageSize: number;
    total: number;
    cursor?: string;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;
  
  /** Virtual scroll state */
  readonly virtualScroll: Readonly<CoreVirtualScrollState>;
  
  /** Loading state */
  readonly loading: boolean;
  
  /** Error state */
  readonly error: Error | null;
  
  /** Metadata */
  readonly metadata: Readonly<DatatableMetadata>;
}

/**
 * Datatable metadata
 */
export interface DatatableMetadata {
  readonly lastUpdate: Date;
  readonly version: number;
  readonly dataSource: 'client' | 'server';
}

/**
 * State change event
 */
export interface StateChangeEvent<T> {
  readonly type: StateChangeType;
  readonly previousState: DatatableState<T>;
  readonly currentState: DatatableState<T>;
  readonly timestamp: Date;
}

/**
 * State change types
 */
export type StateChangeType =
  | 'ROWS_UPDATED'
  | 'COLUMNS_UPDATED'
  | 'SORTING_CHANGED'
  | 'FILTERING_CHANGED'
  | 'SELECTION_CHANGED'
  | 'PAGINATION_CHANGED'
  | 'SCROLL_CHANGED'
  | 'LOADING_STARTED'
  | 'LOADING_FINISHED'
  | 'ERROR_OCCURRED';

/**
 * Creates initial state with defaults
 */
export function createInitialState<T>(): DatatableState<T> {
  return {
    rows: [],
    columns: [],
    sorting: [],
    filtering: [],
    selection: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      hasNextPage: false,
      hasPrevPage: false
    },
    virtualScroll: {
      enabled: false,
      visibleStartIndex: 0,
      visibleEndIndex: 0,
      totalHeight: 0,
      scrollTop: 0,
      scrollLeft: 0,
      bufferSize: 3
    },
    loading: false,
    error: null,
    metadata: {
      lastUpdate: new Date(),
      version: 0,
      dataSource: 'client'
    }
  };
}

/**
 * Creates a deep readonly copy of state (for immutability)
 */
export function freezeState<T>(state: DatatableState<T>): DatatableState<T> {
  if (Object.isFrozen(state)) {
    return state;
  }
  return Object.freeze({
    ...state,
    rows: Object.freeze([...state.rows].map(row => Object.freeze({ ...row }))),
    columns: Object.freeze([...state.columns].map(col => Object.freeze({ ...col }))),
    sorting: Object.freeze([...state.sorting].map(sort => Object.freeze({ ...sort }))),
    filtering: Object.freeze([...state.filtering].map(filter => Object.freeze({ ...filter }))),
    selection: Object.freeze([...state.selection]),
    pagination: Object.freeze({ ...state.pagination }),
    virtualScroll: Object.freeze({ ...state.virtualScroll }),
    metadata: Object.freeze({ ...state.metadata })
  });
}

