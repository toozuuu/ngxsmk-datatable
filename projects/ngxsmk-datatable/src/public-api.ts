// Core components
export * from './lib/components/ngxsmk-datatable/ngxsmk-datatable.component';
export * from './lib/components/ngxsmk-pager/ngxsmk-pager.component';

// Interfaces and types
export * from './lib/interfaces/column.interface';
export * from './lib/interfaces/row.interface';
export * from './lib/interfaces/selection.interface';
export * from './lib/interfaces/pagination.interface';
export * from './lib/interfaces/sorting.interface';
export * from './lib/interfaces/datatable-config.interface';
export * from './lib/interfaces/keyboard-navigation.interface';
export * from './lib/interfaces/context-menu.interface';
export * from './lib/interfaces/filtering.interface';
export * from './lib/interfaces/grouping.interface';
export * from './lib/interfaces/tree-table.interface';
export * from './lib/interfaces/clipboard.interface';
export * from './lib/interfaces/undo-redo.interface';
export * from './lib/interfaces/export.interface';
export * from './lib/interfaces/drag-drop.interface';

// New v1.7.0 Interfaces
export * from './lib/interfaces/pdf-export.interface';
export * from './lib/interfaces/collaborative-editing.interface';
export * from './lib/interfaces/charting.interface';
export * from './lib/interfaces/formula.interface';
export * from './lib/interfaces/view-modes.interface';
export * from './lib/interfaces/theming.interface';
export * from './lib/interfaces/plugin.interface';
export * from './lib/interfaces/batch-operations.interface';
export * from './lib/interfaces/validation.interface';
export * from './lib/interfaces/conditional-formatting.interface';
export * from './lib/interfaces/frozen-rows.interface';
export * from './lib/interfaces/sheets.interface';
export * from './lib/interfaces/data-import.interface';
export * from './lib/interfaces/mobile-integration.interface';

// Services
export * from './lib/services/virtual-scroll.service';
export * from './lib/services/column-resize.service';
export * from './lib/services/selection.service';
export * from './lib/services/keyboard-navigation.service';
export * from './lib/services/filtering.service';
export * from './lib/services/clipboard.service';
export * from './lib/services/export.service';
export * from './lib/services/inline-editing.service';
export * from './lib/services/undo-redo.service';
export * from './lib/services/drag-drop.service';
export * from './lib/services/grouping.service';
export * from './lib/services/tree-table.service';
export * from './lib/services/accessibility.service';
export * from './lib/services/cell-merge.service';
export * from './lib/services/column-group.service';
export * from './lib/services/responsive.service';

// New v1.7.0 Services
export * from './lib/services/pdf-export.service';
export * from './lib/services/collaborative-editing.service';
export * from './lib/services/charting.service';
export * from './lib/services/formula.service';
export * from './lib/services/view-modes.service';
export * from './lib/services/theming.service';
export * from './lib/services/plugin.service';
export * from './lib/services/batch-operations.service';
export * from './lib/services/validation.service';
export * from './lib/services/conditional-formatting.service';
export * from './lib/services/data-import.service';
export * from './lib/services/sheets.service';
export * from './lib/services/mobile-integration.service';

// Core - Headless Architecture
export * from './lib/core/state/datatable.state';
export * from './lib/core/state/datatable.store';
export * from './lib/core/state/datatable.facade';
export * from './lib/core/providers/data-provider.interface';
export * from './lib/core/providers/rest-data-provider';
export * from './lib/core/providers/graphql-data-provider';

// Directives
export * from './lib/directives/column-template.directive';
export * from './lib/directives/header-template.directive';
export * from './lib/directives/row-detail-template.directive';

// Pipes
export * from './lib/pipes/safe-html.pipe';

// Note: All components are standalone. Import them directly for better tree-shaking.
// For NgModule-based apps, import the standalone components in your module's imports array.
