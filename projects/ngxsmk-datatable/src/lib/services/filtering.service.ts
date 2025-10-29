import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  FilteringConfig,
  ColumnFilter,
  FilterEvent,
  FilterOperator
} from '../interfaces/filtering.interface';
import { NgxsmkRow } from '../interfaces/row.interface';

@Injectable()
export class FilteringService {
  private config: FilteringConfig = {
    enabled: true,
    mode: 'simple',
    showFilterRow: true,
    externalFiltering: false,
    debounceTime: 300,
    caseSensitive: false
  };

  private activeFilters: ColumnFilter[] = [];
  private filterInput$ = new Subject<{filter: ColumnFilter, value: any}>();
  
  public filterChange$ = new BehaviorSubject<FilterEvent>({ filters: [] });

  constructor() {
    // Setup debounced filter input
    this.filterInput$
      .pipe(
        debounceTime(this.config.debounceTime || 300),
        distinctUntilChanged((prev, curr) => 
          prev.filter.column.id === curr.filter.column.id && prev.value === curr.value
        )
      )
      .subscribe(({filter, value}) => {
        this.updateFilter(filter, value);
      });
  }

  /**
   * Set filtering configuration
   */
  setConfig(config: Partial<FilteringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): FilteringConfig {
    return this.config;
  }

  /**
   * Add or update a filter
   */
  setFilter(filter: ColumnFilter): void {
    const existingIndex = this.activeFilters.findIndex(
      f => f.column.id === filter.column.id
    );

    if (existingIndex >= 0) {
      if (filter.value === null || filter.value === undefined || filter.value === '') {
        // Remove filter if value is empty
        this.activeFilters.splice(existingIndex, 1);
      } else {
        // Update existing filter
        this.activeFilters[existingIndex] = filter;
      }
    } else if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
      // Add new filter
      this.activeFilters.push(filter);
    }

    this.emitFilterChange();
  }

  /**
   * Set filter with debounce (for text input)
   */
  setFilterDebounced(filter: ColumnFilter, value: any): void {
    this.filterInput$.next({ filter, value });
  }

  /**
   * Remove a specific filter
   */
  removeFilter(columnId: string): void {
    this.activeFilters = this.activeFilters.filter(f => f.column.id !== columnId);
    this.emitFilterChange();
  }

  /**
   * Clear all filters
   */
  clearAllFilters(): void {
    this.activeFilters = [];
    this.emitFilterChange();
  }

  /**
   * Get active filters
   */
  getActiveFilters(): ColumnFilter[] {
    return [...this.activeFilters];
  }

  /**
   * Filter rows based on active filters
   */
  filterRows(rows: NgxsmkRow[]): NgxsmkRow[] {
    if (!this.config.enabled || this.config.externalFiltering || this.activeFilters.length === 0) {
      return rows;
    }

    return rows.filter(row => this.matchesAllFilters(row));
  }

  /**
   * Check if a row matches all active filters
   */
  private matchesAllFilters(row: NgxsmkRow): boolean {
    return this.activeFilters.every(filter => this.matchesFilter(row, filter));
  }

  /**
   * Check if a row matches a specific filter
   */
  private matchesFilter(row: NgxsmkRow, filter: ColumnFilter): boolean {
    const prop = filter.column.prop || filter.column.id;
    const cellValue = this.getNestedValue(row, prop);
    const filterValue = filter.value;

    if (cellValue === null || cellValue === undefined) {
      return filter.operator === 'isEmpty';
    }

    const caseSensitive = this.config.caseSensitive || false;
    const cellStr = caseSensitive ? String(cellValue) : String(cellValue).toLowerCase();
    const filterStr = caseSensitive ? String(filterValue) : String(filterValue).toLowerCase();

    switch (filter.operator) {
      case 'equals':
        return cellStr === filterStr;
      
      case 'notEquals':
        return cellStr !== filterStr;
      
      case 'contains':
        return cellStr.includes(filterStr);
      
      case 'notContains':
        return !cellStr.includes(filterStr);
      
      case 'startsWith':
        return cellStr.startsWith(filterStr);
      
      case 'endsWith':
        return cellStr.endsWith(filterStr);
      
      case 'greaterThan':
        return Number(cellValue) > Number(filterValue);
      
      case 'greaterThanOrEqual':
        return Number(cellValue) >= Number(filterValue);
      
      case 'lessThan':
        return Number(cellValue) < Number(filterValue);
      
      case 'lessThanOrEqual':
        return Number(cellValue) <= Number(filterValue);
      
      case 'between':
        if (Array.isArray(filterValue) && filterValue.length === 2) {
          const val = Number(cellValue);
          return val >= Number(filterValue[0]) && val <= Number(filterValue[1]);
        }
        return false;
      
      case 'in':
        if (Array.isArray(filterValue)) {
          return filterValue.some(v => 
            caseSensitive ? cellValue === v : cellStr === String(v).toLowerCase()
          );
        }
        return false;
      
      case 'notIn':
        if (Array.isArray(filterValue)) {
          return !filterValue.some(v => 
            caseSensitive ? cellValue === v : cellStr === String(v).toLowerCase()
          );
        }
        return true;
      
      case 'isEmpty':
        return cellValue === null || cellValue === undefined || cellValue === '';
      
      case 'isNotEmpty':
        return cellValue !== null && cellValue !== undefined && cellValue !== '';
      
      default:
        return true;
    }
  }

  /**
   * Update filter and emit change
   */
  private updateFilter(filter: ColumnFilter, value: any): void {
    filter.value = value;
    this.setFilter(filter);
  }

  /**
   * Emit filter change event
   */
  private emitFilterChange(): void {
    this.filterChange$.next({
      filters: this.getActiveFilters()
    });
  }

  /**
   * Get nested property value
   */
  private getNestedValue(obj: any, path: string): any {
    if (!path || !obj) return obj;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value == null) return value;
      value = value[key];
    }
    
    return value;
  }
}

