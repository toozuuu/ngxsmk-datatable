import { Injectable } from '@angular/core';

/**
 * Service for managing accessibility features (WCAG 2.1 AA compliance)
 */
@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  
  /**
   * Generate accessible label for table
   */
  getTableLabel(totalRows: number, totalColumns: number): string {
    return `Data table with ${totalRows} rows and ${totalColumns} columns`;
  }

  /**
   * Generate row label
   */
  getRowLabel(rowIndex: number, totalRows: number, selected: boolean = false): string {
    const position = `Row ${rowIndex + 1} of ${totalRows}`;
    const state = selected ? ', selected' : '';
    return `${position}${state}`;
  }

  /**
   * Generate cell label
   */
  getCellLabel(
    columnName: string,
    rowIndex: number,
    colIndex: number,
    value: any
  ): string {
    return `${columnName}, row ${rowIndex + 1}, column ${colIndex + 1}: ${value}`;
  }

  /**
   * Generate header label
   */
  getHeaderLabel(
    columnName: string,
    sortable: boolean = false,
    sorted: 'asc' | 'desc' | null = null
  ): string {
    let label = columnName;
    
    if (sortable) {
      label += ', sortable';
      if (sorted) {
        label += `, sorted ${sorted === 'asc' ? 'ascending' : 'descending'}`;
      }
    }
    
    return label;
  }

  /**
   * Generate group header label
   */
  getGroupHeaderLabel(
    groupName: string,
    count: number,
    expanded: boolean
  ): string {
    const state = expanded ? 'expanded' : 'collapsed';
    return `${groupName}, ${count} items, ${state}`;
  }

  /**
   * Generate tree node label
   */
  getTreeNodeLabel(
    nodeName: string,
    level: number,
    hasChildren: boolean,
    expanded: boolean = false
  ): string {
    let label = `${nodeName}, level ${level}`;
    
    if (hasChildren) {
      const state = expanded ? 'expanded' : 'collapsed';
      label += `, ${state}`;
    }
    
    return label;
  }

  /**
   * Generate pagination label
   */
  getPaginationLabel(
    currentPage: number,
    totalPages: number,
    pageSize: number
  ): string {
    return `Page ${currentPage} of ${totalPages}, ${pageSize} items per page`;
  }

  /**
   * Generate selection summary
   */
  getSelectionSummary(selectedCount: number, totalCount: number): string {
    if (selectedCount === 0) {
      return 'No items selected';
    } else if (selectedCount === totalCount) {
      return `All ${totalCount} items selected`;
    } else {
      return `${selectedCount} of ${totalCount} items selected`;
    }
  }

  /**
   * Generate filter summary
   */
  getFilterSummary(activeFilters: number, totalRows: number, filteredRows: number): string {
    if (activeFilters === 0) {
      return `Showing all ${totalRows} rows`;
    }
    return `${activeFilters} filters active, showing ${filteredRows} of ${totalRows} rows`;
  }

  /**
   * Generate keyboard shortcut description
   */
  getKeyboardShortcut(action: string): string {
    const shortcuts: { [key: string]: string } = {
      'navigate': 'Use arrow keys to navigate cells',
      'select': 'Use Space to select rows',
      'selectAll': 'Use Ctrl+A to select all',
      'copy': 'Use Ctrl+C to copy selected cells',
      'paste': 'Use Ctrl+V to paste',
      'undo': 'Use Ctrl+Z to undo',
      'redo': 'Use Ctrl+Y or Ctrl+Shift+Z to redo',
      'search': 'Use Ctrl+F to search',
      'sort': 'Use Enter to sort by column',
      'expand': 'Use Enter or Space to expand/collapse',
      'edit': 'Use Enter to edit cell',
      'cancel': 'Use Escape to cancel'
    };
    
    return shortcuts[action] || '';
  }

  /**
   * Get ARIA role for element type
   */
  getAriaRole(elementType: string): string {
    const roles: { [key: string]: string } = {
      'table': 'grid',
      'row': 'row',
      'cell': 'gridcell',
      'header': 'columnheader',
      'group': 'rowgroup',
      'checkbox': 'checkbox',
      'button': 'button'
    };
    
    return roles[elementType] || '';
  }

  /**
   * Announce to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Check if high contrast mode is active
   */
  isHighContrastMode(): boolean {
    // Check for Windows high contrast mode
    if (window.matchMedia) {
      return window.matchMedia('(-ms-high-contrast: active)').matches ||
             window.matchMedia('(prefers-contrast: high)').matches;
    }
    return false;
  }

  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion(): boolean {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }

  /**
   * Generate focus trap instructions
   */
  getFocusTrapInstructions(context: string): string {
    return `Focus is trapped in ${context}. Press Escape to exit.`;
  }

  /**
   * Get accessible table navigation hints
   */
  getNavigationHints(): string[] {
    return [
      'Use arrow keys to move between cells',
      'Press Home to go to first cell in row',
      'Press End to go to last cell in row',
      'Press Ctrl+Home to go to first cell in table',
      'Press Ctrl+End to go to last cell in table',
      'Press Page Up/Down to scroll by page',
      'Press Enter to activate cell or sort column',
      'Press Space to select row'
    ];
  }
}

