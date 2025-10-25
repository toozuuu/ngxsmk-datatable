import { NgxsmkRow } from './row.interface';

export type SelectionType = 'single' | 'multi' | 'multiClick' | 'cell' | 'checkbox' | 'none';

export interface SelectionEvent {
  selected: NgxsmkRow[];
  event: Event;
}

export interface CellSelectionEvent {
  row: NgxsmkRow;
  column: string;
  value: any;
  event: Event;
}

export interface SelectionCheckboxEvent {
  row: NgxsmkRow;
  checked: boolean;
  event: Event;
}

export interface SelectAllEvent {
  selected: boolean;
  event: Event;
}

export interface SelectionModel {
  selected: Set<string>;
  deselected: Set<string>;
  isSelected: (row: NgxsmkRow) => boolean;
  isDeselected: (row: NgxsmkRow) => boolean;
  select: (row: NgxsmkRow) => void;
  deselect: (row: NgxsmkRow) => void;
  clear: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggle: (row: NgxsmkRow) => void;
}
