import { Injectable } from '@angular/core';

/**
 * Cell merge information
 */
export interface CellMergeInfo {
  /** Starting row index */
  startRow: number;
  /** Ending row index */
  endRow: number;
  /** Starting column index */
  startCol: number;
  /** Ending column index */
  endCol: number;
  /** Row span count */
  rowSpan: number;
  /** Column span count */
  colSpan: number;
  /** Is this the master cell (top-left) */
  isMaster: boolean;
  /** Is this cell part of a merged group but hidden */
  isHidden: boolean;
}

/**
 * Service for managing cell merging operations
 */
@Injectable({
  providedIn: 'root'
})
export class CellMergeService {
  
  /**
   * Calculate cell merges for a dataset
   */
  calculateMerges<T = any>(
    rows: T[],
    columns: any[],
    mergeRules: { [columnId: string]: (current: any, previous: any) => boolean }
  ): Map<string, CellMergeInfo> {
    const merges = new Map<string, CellMergeInfo>();

    for (const column of columns) {
      if (!column.mergeable || !mergeRules[column.id]) {
        continue;
      }

      const mergeRule = mergeRules[column.id];
      const colIndex = columns.indexOf(column);
      
      let mergeStartRow = 0;
      
      for (let rowIndex = 1; rowIndex <= rows.length; rowIndex++) {
        const currentRow = rows[rowIndex];
        const previousRow = rows[rowIndex - 1];
        
        const shouldMerge = rowIndex < rows.length && 
                           mergeRule(currentRow, previousRow);
        
        if (!shouldMerge || rowIndex === rows.length) {
          // End current merge group
          if (rowIndex - mergeStartRow > 1) {
            // Create merge info for master cell
            const masterKey = `${mergeStartRow}-${colIndex}`;
            merges.set(masterKey, {
              startRow: mergeStartRow,
              endRow: rowIndex - 1,
              startCol: colIndex,
              endCol: colIndex,
              rowSpan: rowIndex - mergeStartRow,
              colSpan: 1,
              isMaster: true,
              isHidden: false
            });
            
            // Mark hidden cells
            for (let r = mergeStartRow + 1; r < rowIndex; r++) {
              const hiddenKey = `${r}-${colIndex}`;
              merges.set(hiddenKey, {
                startRow: mergeStartRow,
                endRow: rowIndex - 1,
                startCol: colIndex,
                endCol: colIndex,
                rowSpan: rowIndex - mergeStartRow,
                colSpan: 1,
                isMaster: false,
                isHidden: true
              });
            }
          }
          
          mergeStartRow = rowIndex;
        }
      }
    }

    return merges;
  }

  /**
   * Get merge info for a cell
   */
  getCellMergeInfo(
    rowIndex: number,
    colIndex: number,
    merges: Map<string, CellMergeInfo>
  ): CellMergeInfo | null {
    const key = `${rowIndex}-${colIndex}`;
    return merges.get(key) || null;
  }

  /**
   * Check if cell should be hidden due to merging
   */
  isCellHidden(
    rowIndex: number,
    colIndex: number,
    merges: Map<string, CellMergeInfo>
  ): boolean {
    const info = this.getCellMergeInfo(rowIndex, colIndex, merges);
    return info ? info.isHidden : false;
  }

  /**
   * Get rowspan for a cell
   */
  getRowSpan(
    rowIndex: number,
    colIndex: number,
    merges: Map<string, CellMergeInfo>
  ): number {
    const info = this.getCellMergeInfo(rowIndex, colIndex, merges);
    return info && info.isMaster ? info.rowSpan : 1;
  }

  /**
   * Get colspan for a cell
   */
  getColSpan(
    rowIndex: number,
    colIndex: number,
    merges: Map<string, CellMergeInfo>
  ): number {
    const info = this.getCellMergeInfo(rowIndex, colIndex, merges);
    return info && info.isMaster ? info.colSpan : 1;
  }

  /**
   * Create horizontal merge (merge columns in same row)
   */
  createHorizontalMerge(
    rowIndex: number,
    startColIndex: number,
    endColIndex: number,
    merges: Map<string, CellMergeInfo>
  ): void {
    const colSpan = endColIndex - startColIndex + 1;
    
    // Master cell
    const masterKey = `${rowIndex}-${startColIndex}`;
    merges.set(masterKey, {
      startRow: rowIndex,
      endRow: rowIndex,
      startCol: startColIndex,
      endCol: endColIndex,
      rowSpan: 1,
      colSpan,
      isMaster: true,
      isHidden: false
    });
    
    // Hidden cells
    for (let col = startColIndex + 1; col <= endColIndex; col++) {
      const hiddenKey = `${rowIndex}-${col}`;
      merges.set(hiddenKey, {
        startRow: rowIndex,
        endRow: rowIndex,
        startCol: startColIndex,
        endCol: endColIndex,
        rowSpan: 1,
        colSpan,
        isMaster: false,
        isHidden: true
      });
    }
  }

  /**
   * Create vertical merge (merge rows in same column)
   */
  createVerticalMerge(
    colIndex: number,
    startRowIndex: number,
    endRowIndex: number,
    merges: Map<string, CellMergeInfo>
  ): void {
    const rowSpan = endRowIndex - startRowIndex + 1;
    
    // Master cell
    const masterKey = `${startRowIndex}-${colIndex}`;
    merges.set(masterKey, {
      startRow: startRowIndex,
      endRow: endRowIndex,
      startCol: colIndex,
      endCol: colIndex,
      rowSpan,
      colSpan: 1,
      isMaster: true,
      isHidden: false
    });
    
    // Hidden cells
    for (let row = startRowIndex + 1; row <= endRowIndex; row++) {
      const hiddenKey = `${row}-${colIndex}`;
      merges.set(hiddenKey, {
        startRow: startRowIndex,
        endRow: endRowIndex,
        startCol: colIndex,
        endCol: colIndex,
        rowSpan,
        colSpan: 1,
        isMaster: false,
        isHidden: true
      });
    }
  }

  /**
   * Create area merge (merge rectangular area)
   */
  createAreaMerge(
    startRowIndex: number,
    endRowIndex: number,
    startColIndex: number,
    endColIndex: number,
    merges: Map<string, CellMergeInfo>
  ): void {
    const rowSpan = endRowIndex - startRowIndex + 1;
    const colSpan = endColIndex - startColIndex + 1;
    
    // Master cell
    const masterKey = `${startRowIndex}-${startColIndex}`;
    merges.set(masterKey, {
      startRow: startRowIndex,
      endRow: endRowIndex,
      startCol: startColIndex,
      endCol: endColIndex,
      rowSpan,
      colSpan,
      isMaster: true,
      isHidden: false
    });
    
    // Hidden cells
    for (let row = startRowIndex; row <= endRowIndex; row++) {
      for (let col = startColIndex; col <= endColIndex; col++) {
        if (row === startRowIndex && col === startColIndex) {
          continue; // Skip master
        }
        
        const hiddenKey = `${row}-${col}`;
        merges.set(hiddenKey, {
          startRow: startRowIndex,
          endRow: endRowIndex,
          startCol: startColIndex,
          endCol: endColIndex,
          rowSpan,
          colSpan,
          isMaster: false,
          isHidden: true
        });
      }
    }
  }

  /**
   * Remove merge from a cell
   */
  removeMerge(
    rowIndex: number,
    colIndex: number,
    merges: Map<string, CellMergeInfo>
  ): void {
    const key = `${rowIndex}-${colIndex}`;
    const info = merges.get(key);
    
    if (!info) return;
    
    // Remove all cells in the merge group
    for (let row = info.startRow; row <= info.endRow; row++) {
      for (let col = info.startCol; col <= info.endCol; col++) {
        merges.delete(`${row}-${col}`);
      }
    }
  }

  /**
   * Clear all merges
   */
  clearAllMerges(merges: Map<string, CellMergeInfo>): void {
    merges.clear();
  }

  /**
   * Get all master cells
   */
  getAllMasterCells(merges: Map<string, CellMergeInfo>): CellMergeInfo[] {
    return Array.from(merges.values()).filter(info => info.isMaster);
  }

  /**
   * Check if any merges exist
   */
  hasMerges(merges: Map<string, CellMergeInfo>): boolean {
    return merges.size > 0;
  }
}

