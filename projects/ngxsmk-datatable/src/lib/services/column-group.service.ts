import { Injectable } from '@angular/core';
import { ColumnGroup } from '../interfaces/grouping.interface';

/**
 * Column header group information
 */
export interface ColumnHeaderGroup {
  /** Group ID */
  id: string;
  /** Group name/title */
  name: string;
  /** Column IDs in this group */
  columnIds: string[];
  /** Start column index */
  startIndex: number;
  /** End column index */
  endIndex: number;
  /** Column span */
  colSpan: number;
  /** Total width of group */
  totalWidth: number;
  /** Group level (for multi-level headers) */
  level: number;
  /** Parent group ID */
  parentGroupId?: string;
  /** CSS class */
  headerClass?: string;
}

/**
 * Service for managing column grouping in headers
 */
@Injectable({
  providedIn: 'root'
})
export class ColumnGroupService {
  
  /**
   * Create column header groups from configuration
   */
  createHeaderGroups(
    columns: any[],
    groupConfig: ColumnGroup[],
    columnWidths: { [key: string]: number }
  ): ColumnHeaderGroup[] {
    const groups: ColumnHeaderGroup[] = [];

    for (const config of groupConfig) {
      const columnIndices: number[] = [];
      const columnIds: string[] = [];
      let totalWidth = 0;

      // Find columns that belong to this group
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (config.columns.includes(column.id)) {
          columnIndices.push(i);
          columnIds.push(column.id);
          totalWidth += columnWidths[column.id] || column.width || 150;
        }
      }

      if (columnIndices.length > 0) {
        groups.push({
          id: config.name.toLowerCase().replace(/\s+/g, '-'),
          name: config.name,
          columnIds,
          startIndex: Math.min(...columnIndices),
          endIndex: Math.max(...columnIndices),
          colSpan: columnIndices.length,
          totalWidth,
          level: 0,
          headerClass: config.headerClass
        });
      }
    }

    return groups;
  }

  /**
   * Create multi-level header groups
   */
  createMultiLevelGroups(
    columns: any[],
    groupConfigs: ColumnGroup[][],
    columnWidths: { [key: string]: number }
  ): ColumnHeaderGroup[][] {
    return groupConfigs.map((levelConfig, level) =>
      this.createHeaderGroups(columns, levelConfig, columnWidths).map(group => ({
        ...group,
        level
      }))
    );
  }

  /**
   * Get columns for a group
   */
  getGroupColumns(group: ColumnHeaderGroup, allColumns: any[]): any[] {
    return allColumns.filter(col => group.columnIds.includes(col.id));
  }

  /**
   * Check if column belongs to a group
   */
  isColumnInGroup(columnId: string, groups: ColumnHeaderGroup[]): boolean {
    return groups.some(group => group.columnIds.includes(columnId));
  }

  /**
   * Get group for a column
   */
  getColumnGroup(columnId: string, groups: ColumnHeaderGroup[]): ColumnHeaderGroup | null {
    return groups.find(group => group.columnIds.includes(columnId)) || null;
  }

  /**
   * Calculate group position and width
   */
  calculateGroupLayout(
    group: ColumnHeaderGroup,
    columns: any[],
    columnWidths: { [key: string]: number }
  ): { left: number; width: number } {
    let left = 0;
    let width = 0;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const colWidth = columnWidths[column.id] || column.width || 150;

      if (i < group.startIndex) {
        left += colWidth;
      }

      if (group.columnIds.includes(column.id)) {
        width += colWidth;
      }
    }

    return { left, width };
  }

  /**
   * Validate group configuration
   */
  validateGroupConfig(
    groupConfig: ColumnGroup[],
    columns: any[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allColumnIds = columns.map(c => c.id);
    const usedColumns = new Set<string>();

    for (const group of groupConfig) {
      // Check if columns exist
      for (const colId of group.columns) {
        if (!allColumnIds.includes(colId)) {
          errors.push(`Column "${colId}" in group "${group.name}" does not exist`);
        }

        // Check for duplicates
        if (usedColumns.has(colId)) {
          errors.push(`Column "${colId}" is used in multiple groups`);
        }
        usedColumns.add(colId);
      }

      // Check if group is empty
      if (group.columns.length === 0) {
        errors.push(`Group "${group.name}" has no columns`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Sort groups by start index
   */
  sortGroups(groups: ColumnHeaderGroup[]): ColumnHeaderGroup[] {
    return [...groups].sort((a, b) => a.startIndex - b.startIndex);
  }

  /**
   * Merge adjacent groups if they have same parent
   */
  mergeAdjacentGroups(groups: ColumnHeaderGroup[]): ColumnHeaderGroup[] {
    if (groups.length <= 1) return groups;

    const merged: ColumnHeaderGroup[] = [];
    let current = groups[0];

    for (let i = 1; i < groups.length; i++) {
      const next = groups[i];

      // Check if adjacent and have same parent
      if (
        current.endIndex + 1 === next.startIndex &&
        current.parentGroupId === next.parentGroupId
      ) {
        // Merge
        current = {
          ...current,
          endIndex: next.endIndex,
          colSpan: current.colSpan + next.colSpan,
          columnIds: [...current.columnIds, ...next.columnIds],
          totalWidth: current.totalWidth + next.totalWidth
        };
      } else {
        merged.push(current);
        current = next;
      }
    }

    merged.push(current);
    return merged;
  }

  /**
   * Get ungrouped columns
   */
  getUngroupedColumns(columns: any[], groups: ColumnHeaderGroup[]): any[] {
    const groupedIds = new Set(groups.flatMap(g => g.columnIds));
    return columns.filter(col => !groupedIds.has(col.id));
  }

  /**
   * Create placeholder groups for ungrouped columns
   */
  createPlaceholderGroups(
    ungroupedColumns: any[],
    allColumns: any[],
    columnWidths: { [key: string]: number }
  ): ColumnHeaderGroup[] {
    return ungroupedColumns.map(col => {
      const colIndex = allColumns.indexOf(col);
      const width = columnWidths[col.id] || col.width || 150;

      return {
        id: `placeholder-${col.id}`,
        name: '',
        columnIds: [col.id],
        startIndex: colIndex,
        endIndex: colIndex,
        colSpan: 1,
        totalWidth: width,
        level: 0
      };
    });
  }

  /**
   * Get total number of header rows
   */
  getHeaderRowCount(multiLevelGroups: ColumnHeaderGroup[][]): number {
    return multiLevelGroups.length + 1; // +1 for column headers
  }
}

