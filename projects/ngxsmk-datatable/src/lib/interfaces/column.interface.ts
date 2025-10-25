import { TemplateRef } from '@angular/core';

export interface NgxsmkColumn {
  id: string;
  name: string;
  prop?: string;
  sortable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  frozen?: 'left' | 'right' | false;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  flexGrow?: number;
  cellClass?: string | ((row: any, column: NgxsmkColumn, value: any, rowIndex: number) => string);
  headerClass?: string;
  sortProp?: string;
  comparator?: (propA: any, propB: any) => number;
  pipe?: any;
  pipeArgs?: any[];
  checkboxable?: boolean;
  headerCheckboxable?: boolean;
  canAutoResize?: boolean;
  resizeable?: boolean;
  frozenLeft?: boolean;
  frozenRight?: boolean;
  isTreeColumn?: boolean;
  treeLevelIndent?: number;
  summaryFunc?: (cells: any[]) => any;
  summaryTemplate?: TemplateRef<any>;
  cellTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  footerTemplate?: TemplateRef<any>;
}

export interface ColumnWidth {
  column: NgxsmkColumn;
  width: number;
  minWidth: number;
  maxWidth: number;
}

export interface ColumnResizeEvent {
  column: NgxsmkColumn;
  newWidth: number;
  oldWidth: number;
}

export interface ColumnReorderEvent {
  column: NgxsmkColumn;
  newIndex: number;
  oldIndex: number;
}

export type ColumnMode = 'standard' | 'flex' | 'force';
