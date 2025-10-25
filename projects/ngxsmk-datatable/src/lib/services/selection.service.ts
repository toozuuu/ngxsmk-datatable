import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NgxsmkSelectionModel {
  selected: Set<string>;
  deselected: Set<string>;
  isSelected: (row: any) => boolean;
  isDeselected: (row: any) => boolean;
  select: (row: any) => void;
  deselect: (row: any) => void;
  clear: () => void;
  selectAll: (rows: any[]) => void;
  deselectAll: () => void;
  toggle: (row: any) => void;
  isAllSelected: (rows: any[]) => boolean;
  isIndeterminate: (rows: any[]) => boolean;
  getSelectedRows: () => any[];
  getSelectedCount: () => number;
}

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private selectionSubject = new BehaviorSubject<NgxsmkSelectionModel | null>(null);
  private selectedRowsSubject = new BehaviorSubject<any[]>([]);

  public selection$ = this.selectionSubject.asObservable();
  public selectedRows$ = this.selectedRowsSubject.asObservable();

  createSelectionModel(
    rowIdentity: (row: any) => any = (row: any) => row.id || row,
    multiSelect: boolean = true
  ): NgxsmkSelectionModel {
    const selected = new Set<string>();
    const deselected = new Set<string>();

    const getRowId = (row: any): string => {
      const id = rowIdentity(row);
      return typeof id === 'string' ? id : JSON.stringify(id);
    };

    const selectionModel: NgxsmkSelectionModel = {
      selected,
      deselected,
      
      isSelected: (row: any) => {
        const rowId = getRowId(row);
        return selected.has(rowId);
      },
      
      isDeselected: (row: any) => {
        const rowId = getRowId(row);
        return deselected.has(rowId);
      },
      
      select: (row: any) => {
        const rowId = getRowId(row);
        selected.add(rowId);
        deselected.delete(rowId);
        this.updateSelectedRows();
      },
      
      deselect: (row: any) => {
        const rowId = getRowId(row);
        selected.delete(rowId);
        deselected.add(rowId);
        this.updateSelectedRows();
      },
      
      clear: () => {
        selected.clear();
        deselected.clear();
        this.updateSelectedRows();
      },
      
      selectAll: (rows: any[]) => {
        selected.clear();
        deselected.clear();
        rows.forEach(row => {
          const rowId = getRowId(row);
          selected.add(rowId);
        });
        this.updateSelectedRows();
      },
      
      deselectAll: () => {
        selected.clear();
        deselected.clear();
        this.updateSelectedRows();
      },
      
      toggle: (row: any) => {
        const rowId = getRowId(row);
        if (selected.has(rowId)) {
          selected.delete(rowId);
          deselected.add(rowId);
        } else {
          selected.add(rowId);
          deselected.delete(rowId);
        }
        this.updateSelectedRows();
      },
      
      isAllSelected: (rows: any[]) => {
        if (rows.length === 0) return false;
        return rows.every(row => selected.has(getRowId(row)));
      },
      
      isIndeterminate: (rows: any[]) => {
        if (rows.length === 0) return false;
        const selectedCount = rows.filter(row => selected.has(getRowId(row))).length;
        return selectedCount > 0 && selectedCount < rows.length;
      },
      
      getSelectedRows: () => {
        return Array.from(selected);
      },
      
      getSelectedCount: () => {
        return selected.size;
      }
    };

    this.selectionSubject.next(selectionModel);
    return selectionModel;
  }

  private updateSelectedRows(): void {
    const selectionModel = this.selectionSubject.value;
    if (selectionModel) {
      const selectedRows = selectionModel.getSelectedRows();
      this.selectedRowsSubject.next(selectedRows);
    }
  }
}