import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GroupConfig,
  GroupedRow,
  AggregateFunction,
  GroupState,
  GroupExpanded
} from '../interfaces/grouping.interface';

/**
 * Service for managing row grouping and aggregation in the datatable
 */
@Injectable({
  providedIn: 'root'
})
export class GroupingService {
  private groupState$ = new BehaviorSubject<GroupState>({
    groupedBy: [],
    expandedGroups: new Set(),
    collapsedGroups: new Set()
  });

  /**
   * Get current group state
   */
  get state$(): Observable<GroupState> {
    return this.groupState$.asObservable();
  }

  /**
   * Get current state snapshot
   */
  getState(): GroupState {
    return this.groupState$.value;
  }

  /**
   * Group rows by specified fields
   */
  groupRows<T = any>(
    rows: T[],
    groupBy: string[],
    config: Partial<GroupConfig> = {}
  ): GroupedRow<T>[] {
    if (!groupBy || groupBy.length === 0) {
      return rows.map(row => ({ type: 'row', data: row, level: 0 }));
    }

    const grouped = this.createGroupHierarchy(rows, groupBy, 0);
    return this.flattenGroups(grouped, config);
  }

  /**
   * Create hierarchical group structure
   */
  private createGroupHierarchy<T>(
    rows: T[],
    groupBy: string[],
    level: number
  ): Map<any, { rows: T[]; subGroups?: Map<any, any> }> {
    const field = groupBy[level];
    const groups = new Map<any, { rows: T[]; subGroups?: Map<any, any> }>();

    for (const row of rows) {
      const value = (row as any)[field];
      
      if (!groups.has(value)) {
        groups.set(value, { rows: [] });
      }
      
      groups.get(value)!.rows.push(row);
    }

    // Recursively group sub-levels
    if (level < groupBy.length - 1) {
      for (const [value, group] of groups.entries()) {
        group.subGroups = this.createGroupHierarchy(
          group.rows,
          groupBy,
          level + 1
        );
      }
    }

    return groups;
  }

  /**
   * Flatten group hierarchy into array with headers
   */
  private flattenGroups<T>(
    groups: Map<any, { rows: T[]; subGroups?: Map<any, any> }>,
    config: Partial<GroupConfig>,
    level: number = 0,
    parentKey: string = ''
  ): GroupedRow<T>[] {
    const result: GroupedRow<T>[] = [];
    const state = this.getState();

    for (const [value, group] of groups.entries()) {
      const groupKey = parentKey ? `${parentKey}/${value}` : String(value);
      const isExpanded = this.isGroupExpanded(groupKey);

      // Add group header
      const groupHeader: GroupedRow<T> = {
        type: 'group-header',
        groupKey,
        groupValue: value,
        groupField: config.groupBy ? config.groupBy[level] : '',
        level,
        isExpanded,
        count: group.rows.length,
        aggregates: this.calculateAggregates(group.rows, config.aggregates || [])
      };

      result.push(groupHeader);

      // Add children if expanded
      if (isExpanded) {
        if (group.subGroups) {
          // Recursively add sub-groups
          result.push(...(this.flattenGroups(
            group.subGroups,
            config,
            level + 1,
            groupKey
          ) as GroupedRow<T>[]));
        } else {
          // Add data rows
          result.push(...group.rows.map(row => ({
            type: 'row' as const,
            data: row,
            level: level + 1,
            groupKey
          })));
        }
      }

      // Add group footer if configured
      if (config.showGroupFooter && isExpanded) {
        result.push({
          type: 'group-footer',
          groupKey,
          groupValue: value,
          groupField: config.groupBy ? config.groupBy[level] : '',
          level,
          count: group.rows.length,
          aggregates: this.calculateAggregates(group.rows, config.aggregates || [])
        });
      }
    }

    return result;
  }

  /**
   * Calculate aggregate values for a group
   */
  calculateAggregates<T = any>(
    rows: T[],
    aggregates: AggregateFunction[]
  ): { [key: string]: any } {
    const result: { [key: string]: any } = {};

    for (const agg of aggregates) {
      const values = rows.map(row => (row as any)[agg.field]);
      
      switch (agg.function) {
        case 'sum':
          result[agg.field] = values.reduce((a, b) => (a || 0) + (b || 0), 0);
          break;
        
        case 'avg':
          const sum = values.reduce((a, b) => (a || 0) + (b || 0), 0);
          result[agg.field] = sum / values.length;
          break;
        
        case 'min':
          result[agg.field] = Math.min(...values.filter(v => v != null));
          break;
        
        case 'max':
          result[agg.field] = Math.max(...values.filter(v => v != null));
          break;
        
        case 'count':
          result[agg.field] = values.length;
          break;
        
        case 'countDistinct':
          result[agg.field] = new Set(values).size;
          break;
        
        case 'first':
          result[agg.field] = values[0];
          break;
        
        case 'last':
          result[agg.field] = values[values.length - 1];
          break;
        
        case 'custom':
          if (agg.customFunction) {
            result[agg.field] = agg.customFunction(values, rows);
          }
          break;
      }
    }

    return result;
  }

  /**
   * Toggle group expansion
   */
  toggleGroup(groupKey: string): void {
    const state = this.getState();
    const expanded = new Set(state.expandedGroups);
    const collapsed = new Set(state.collapsedGroups);

    if (expanded.has(groupKey)) {
      expanded.delete(groupKey);
      collapsed.add(groupKey);
    } else {
      expanded.add(groupKey);
      collapsed.delete(groupKey);
    }

    this.groupState$.next({
      ...state,
      expandedGroups: expanded,
      collapsedGroups: collapsed
    });
  }

  /**
   * Expand a group
   */
  expandGroup(groupKey: string): void {
    const state = this.getState();
    const expanded = new Set(state.expandedGroups);
    const collapsed = new Set(state.collapsedGroups);

    expanded.add(groupKey);
    collapsed.delete(groupKey);

    this.groupState$.next({
      ...state,
      expandedGroups: expanded,
      collapsedGroups: collapsed
    });
  }

  /**
   * Collapse a group
   */
  collapseGroup(groupKey: string): void {
    const state = this.getState();
    const expanded = new Set(state.expandedGroups);
    const collapsed = new Set(state.collapsedGroups);

    expanded.delete(groupKey);
    collapsed.add(groupKey);

    this.groupState$.next({
      ...state,
      expandedGroups: expanded,
      collapsedGroups: collapsed
    });
  }

  /**
   * Expand all groups
   */
  expandAll(groupKeys: string[]): void {
    const state = this.getState();
    
    this.groupState$.next({
      ...state,
      expandedGroups: new Set(groupKeys),
      collapsedGroups: new Set()
    });
  }

  /**
   * Collapse all groups
   */
  collapseAll(): void {
    const state = this.getState();
    
    this.groupState$.next({
      ...state,
      expandedGroups: new Set(),
      collapsedGroups: new Set(state.expandedGroups)
    });
  }

  /**
   * Check if a group is expanded
   */
  isGroupExpanded(groupKey: string): boolean {
    const state = this.getState();
    
    // If not explicitly collapsed, default to expanded
    if (state.collapsedGroups.has(groupKey)) {
      return false;
    }
    
    return true;
  }

  /**
   * Set groups to be tracked
   */
  setGroupBy(fields: string[]): void {
    const state = this.getState();
    
    this.groupState$.next({
      ...state,
      groupedBy: fields
    });
  }

  /**
   * Clear all grouping
   */
  clearGrouping(): void {
    this.groupState$.next({
      groupedBy: [],
      expandedGroups: new Set(),
      collapsedGroups: new Set()
    });
  }

  /**
   * Get all group keys from grouped rows
   */
  getAllGroupKeys(groupedRows: GroupedRow<any>[]): string[] {
    return groupedRows
      .filter(row => row.type === 'group-header')
      .map(row => row.groupKey!)
      .filter((key): key is string => key !== undefined);
  }

  /**
   * Format aggregate value
   */
  formatAggregate(
    value: any,
    agg: AggregateFunction
  ): string {
    if (value == null) {
      return '-';
    }

    if (agg.format) {
      return agg.format(value);
    }

    switch (agg.function) {
      case 'avg':
        return typeof value === 'number' ? value.toFixed(2) : String(value);
      case 'sum':
      case 'min':
      case 'max':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      default:
        return String(value);
    }
  }
}

