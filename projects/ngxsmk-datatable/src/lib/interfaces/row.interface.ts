import { NgxsmkColumn } from './column.interface';

export interface NgxsmkRow {
  $$index?: number;
  $$expanded?: boolean;
  $$selected?: boolean;
  $$disabled?: boolean;
  $$height?: number;
  $$frozen?: boolean; // PR #2149: Frozen row support
  $$treeStatus?: 'collapsed' | 'expanded' | 'loading' | 'disabled';
  $$treeLevel?: number;
  $$treeParent?: NgxsmkRow;
  $$treeChildren?: NgxsmkRow[];
  [key: string]: any;
}

export interface RowDetailView {
  template: any;
  rowHeight?: number;
  toggleOnClick?: boolean;
  expandOnInit?: boolean;
  frozen?: boolean; // PR #2149: Keep row details frozen during scroll
}

export interface TreeRow {
  $$treeLevel: number;
  $$treeStatus: 'collapsed' | 'expanded' | 'loading' | 'disabled';
  $$treeParent?: TreeRow;
  $$treeChildren?: TreeRow[];
}

export interface RowActivateEvent {
  type: 'click' | 'dblclick' | 'keydown';
  event: Event;
  row: NgxsmkRow;
  column: NgxsmkColumn;
  value: any;
  cellElement: HTMLElement;
}

export interface RowContextEvent {
  type: 'click' | 'dblclick' | 'keydown';
  event: Event;
  row: NgxsmkRow;
  column: NgxsmkColumn;
  value: any;
  cellElement: HTMLElement;
}
