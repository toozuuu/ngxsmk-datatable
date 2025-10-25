import { NgxsmkColumn } from './column.interface';
import { NgxsmkRow } from './row.interface';
import { SelectionType } from './selection.interface';
import { PaginationConfig } from './pagination.interface';
import { SortConfig } from './sorting.interface';
import { RowDetailView } from './row.interface';
import { ColumnMode } from './column.interface';

export interface NgxsmkDatatableConfig {
  // Basic configuration
  columns: NgxsmkColumn[];
  rows: NgxsmkRow[];
  
  // Virtual scrolling
  virtualScrolling: boolean;
  rowHeight: number;
  headerHeight: number;
  footerHeight: number;
  
  // Scrolling
  scrollbarH: boolean;
  scrollbarV: boolean;
  scrollX: boolean;
  scrollY: boolean;
  
  // Column configuration
  columnMode: ColumnMode;
  sortType: 'single' | 'multiple';
  sortProp: string;
  sortAscending: boolean;
  
  // Selection
  selectionType: SelectionType;
  selected: NgxsmkRow[];
  selectCheckboxPosition: 'left' | 'right';
  
  // Pagination
  pagination: PaginationConfig;
  externalPaging: boolean;
  externalSorting: boolean;
  
  // Row details
  rowDetail: RowDetailView;
  
  // Styling
  class: string;
  headerClass: string;
  footerClass: string;
  rowClass: string | ((row: NgxsmkRow, index: number) => string);
  
  // Loading and empty states
  loadingIndicator: boolean;
  emptyMessage: string;
  emptyIconClass: string;
  
  // Accessibility
  trackByProp: string;
  rowIdentity: (row: NgxsmkRow) => any;
  
  // Events
  onActivate: (event: any) => void;
  onSelect: (event: any) => void;
  onSort: (event: any) => void;
  onPage: (event: any) => void;
  onColumnResize: (event: any) => void;
  onColumnReorder: (event: any) => void;
  onRowDetailToggle: (event: any) => void;
}
