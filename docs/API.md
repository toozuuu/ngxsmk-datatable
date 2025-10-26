# API Reference

Complete reference for all inputs, outputs, and interfaces.

---

## Table of Contents

- [Component Inputs](#component-inputs)
- [Component Outputs](#component-outputs)
- [Interfaces](#interfaces)
- [Methods](#methods)
- [CSS Classes](#css-classes)
- [CSS Variables](#css-variables)

---

## Component Inputs

### Core Inputs

#### `columns: NgxsmkColumn[]`
**Type:** `NgxsmkColumn[]`  
**Default:** `[]`  
**Description:** Array of column definitions

```typescript
columns = [
  {
    id: 'name',
    name: 'Name',
    prop: 'name',
    width: 200,
    sortable: true,
    resizable: true
  }
];
```

#### `rows: NgxsmkRow[]`
**Type:** `NgxsmkRow[]`  
**Default:** `[]`  
**Description:** Array of row data

```typescript
rows = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];
```

#### `selectionType: SelectionType`
**Type:** `'single' | 'multi' | 'checkbox' | 'cell' | 'none'`  
**Default:** `'single'`  
**Description:** Row selection mode

```typescript
<ngxsmk-datatable [selectionType]="'checkbox'">
</ngxsmk-datatable>
```

#### `selected: NgxsmkRow[]`
**Type:** `NgxsmkRow[]`  
**Default:** `[]`  
**Description:** Currently selected rows (two-way binding)

```typescript
<ngxsmk-datatable [(selected)]="selectedRows">
</ngxsmk-datatable>
```

### Display Inputs

#### `virtualScrolling: boolean`
**Type:** `boolean`  
**Default:** `true`  
**Description:** Enable virtual scrolling for large datasets

```typescript
<ngxsmk-datatable [virtualScrolling]="true">
</ngxsmk-datatable>
```

#### `rowHeight: number`
**Type:** `number`  
**Default:** `50`  
**Description:** Height of each row in pixels

```typescript
<ngxsmk-datatable [rowHeight]="60">
</ngxsmk-datatable>
```

#### `headerHeight: number`
**Type:** `number | 'auto'`  
**Default:** `'auto'`  
**Description:** Height of header row

```typescript
<ngxsmk-datatable [headerHeight]="60">
</ngxsmk-datatable>
```

#### `footerHeight: number`
**Type:** `number`  
**Default:** `55`  
**Description:** Height of footer section

### Pagination Inputs

#### `pagination: PaginationConfig | null`
**Type:** `PaginationConfig | null`  
**Default:** `null`  
**Description:** Pagination configuration

```typescript
pagination = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  showPageSizeOptions: true,
  showFirstLastButtons: true,
  currentPage: 1,
  totalItems: 100
};
```

#### `externalPaging: boolean`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Use server-side pagination

```typescript
<ngxsmk-datatable 
  [externalPaging]="true"
  (page)="loadPage($event)">
</ngxsmk-datatable>
```

### Sorting Inputs

#### `externalSorting: boolean`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Use server-side sorting

```typescript
<ngxsmk-datatable 
  [externalSorting]="true"
  (sort)="loadSortedData($event)">
</ngxsmk-datatable>
```

### Row Detail Inputs

#### `rowDetail: RowDetailView | null`
**Type:** `RowDetailView | null`  
**Default:** `null`  
**Description:** Row detail configuration

```typescript
rowDetail = {
  template: this.detailTemplate,
  rowHeight: 200,
  toggleOnClick: true,
  expandOnInit: false,
  frozen: false
};
```

### Column Inputs

#### `columnVisibilityEnabled: boolean`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Enable column visibility toggle

```typescript
<ngxsmk-datatable [columnVisibilityEnabled]="true">
</ngxsmk-datatable>
```

### Loading Inputs

#### `loadingIndicator: boolean`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Show loading spinner

```typescript
<ngxsmk-datatable [loadingIndicator]="loading">
</ngxsmk-datatable>
```

#### `emptyMessage: string`
**Type:** `string`  
**Default:** `'No data available'`  
**Description:** Message shown when table is empty

### Styling Inputs

#### `class: string`
**Type:** `string`  
**Default:** `''`  
**Description:** Additional CSS class for the component

```typescript
<ngxsmk-datatable [class]="'theme-dark'">
</ngxsmk-datatable>
```

---

## Component Outputs

### Selection Events

#### `(select): SelectionEvent`
**Type:** `EventEmitter<SelectionEvent>`  
**Description:** Emitted when row selection changes

```typescript
<ngxsmk-datatable (select)="onSelect($event)">
</ngxsmk-datatable>

onSelect(event: SelectionEvent) {
  console.log('Selected rows:', event.selected);
}
```

**Event Structure:**
```typescript
interface SelectionEvent {
  selected: NgxsmkRow[];
  row?: NgxsmkRow;
  event?: Event;
}
```

### Sorting Events

#### `(sort): SortEvent`
**Type:** `EventEmitter<SortEvent>`  
**Description:** Emitted when column sort changes

```typescript
<ngxsmk-datatable (sort)="onSort($event)">
</ngxsmk-datatable>

onSort(event: SortEvent) {
  console.log('Sort:', event.column.name, event.newValue);
}
```

**Event Structure:**
```typescript
interface SortEvent {
  column: NgxsmkColumn;
  prevValue: SortDirection;
  newValue: SortDirection;
}

type SortDirection = 'asc' | 'desc' | '';
```

### Pagination Events

#### `(page): PageEvent`
**Type:** `EventEmitter<PageEvent>`  
**Description:** Emitted when page changes

```typescript
<ngxsmk-datatable (page)="onPage($event)">
</ngxsmk-datatable>

onPage(event: PageEvent) {
  console.log('Page:', event.page);
}
```

**Event Structure:**
```typescript
interface PageEvent {
  page: number;
  pageSize: number;
  offset: number;
  totalPages: number;
}
```

### Column Events

#### `(columnResize): ColumnResizeEvent`
**Type:** `EventEmitter<any>`  
**Description:** Emitted when column is resized

```typescript
<ngxsmk-datatable (columnResize)="onResize($event)">
</ngxsmk-datatable>

onResize(event: any) {
  console.log('Column resized:', event.column.name, event.newWidth);
}
```

#### `(columnVisibilityChange): { column, visible }`
**Type:** `EventEmitter<{ column: NgxsmkColumn; visible: boolean }>`  
**Description:** Emitted when column visibility changes

```typescript
<ngxsmk-datatable (columnVisibilityChange)="onVisibilityChange($event)">
</ngxsmk-datatable>

onVisibilityChange(event: { column: NgxsmkColumn; visible: boolean }) {
  console.log(`Column ${event.column.name} is now ${event.visible ? 'visible' : 'hidden'}`);
}
```

### Row Detail Events

#### `(rowDetailToggle): RowDetailEvent`
**Type:** `EventEmitter<any>`  
**Description:** Emitted when row detail is toggled

```typescript
<ngxsmk-datatable (rowDetailToggle)="onDetailToggle($event)">
</ngxsmk-datatable>

onDetailToggle(event: any) {
  console.log('Row detail:', event.expanded ? 'expanded' : 'collapsed');
}
```

### Other Events

#### `(activate): ActivateEvent`
**Type:** `EventEmitter<any>`  
**Description:** Emitted when row or cell is activated (clicked)

```typescript
<ngxsmk-datatable (activate)="onActivate($event)">
</ngxsmk-datatable>

onActivate(event: any) {
  console.log('Activated:', event.row);
}
```

#### `(refreshData): void`
**Type:** `EventEmitter<void>`  
**Description:** Emitted when refresh button is clicked

```typescript
<ngxsmk-datatable (refreshData)="loadData()">
</ngxsmk-datatable>
```

---

## Interfaces

### NgxsmkColumn

```typescript
interface NgxsmkColumn {
  // Required
  id: string;                    // Unique identifier
  name: string;                  // Display name
  
  // Optional
  prop?: string;                 // Property key in row data
  width?: number;                // Fixed width in pixels
  minWidth?: number;             // Minimum width in pixels
  maxWidth?: number;             // Maximum width in pixels
  flexGrow?: number;             // Flex grow factor (responsive width)
  sortable?: boolean;            // Enable sorting
  resizable?: boolean;           // Enable resizing
  frozen?: 'left' | 'right' | false;  // Pin column
  
  // Templates
  cellTemplate?: TemplateRef<any>;     // Custom cell template
  headerTemplate?: TemplateRef<any>;   // Custom header template
  
  // Styling
  cellClass?: string | Function;       // CSS class for cells
  headerClass?: string;                // CSS class for header
}
```

### NgxsmkRow

```typescript
interface NgxsmkRow {
  [key: string]: any;           // Any properties for your data
  
  // Internal properties (added by component)
  $$expanded?: boolean;          // Row detail expanded state
  $$frozen?: boolean;            // Row detail frozen state
  $$index?: number;              // Row index
}
```

### PaginationConfig

```typescript
interface PaginationConfig {
  pageSize: number;                    // Rows per page
  pageSizeOptions?: number[];          // Available page sizes
  showPageSizeOptions?: boolean;       // Show page size dropdown
  showFirstLastButtons?: boolean;      // Show first/last buttons
  showRangeLabels?: boolean;           // Show "1-10 of 100"
  showTotalItems?: boolean;            // Show total count
  totalItems?: number;                 // Total number of rows
  currentPage?: number;                // Current page (1-based)
  maxSize?: number;                    // Max page buttons to show
}
```

### RowDetailView

```typescript
interface RowDetailView {
  template: TemplateRef<any>;          // Detail template
  rowHeight?: number;                  // Detail row height
  toggleOnClick?: boolean;             // Toggle on row click
  expandOnInit?: boolean;              // Expand all on init
  frozen?: boolean;                    // Keep details frozen during scroll
}
```

### SelectionEvent

```typescript
interface SelectionEvent {
  selected: NgxsmkRow[];               // Currently selected rows
  row?: NgxsmkRow;                     // Row that triggered event
  event?: Event;                       // Original DOM event
}
```

---

## Methods

### Public Methods

#### `selectAll(): void`
Select all rows in the current page

```typescript
@ViewChild(NgxsmkDatatableComponent) table!: NgxsmkDatatableComponent;

selectAllRows() {
  this.table.selectAll();
}
```

#### `deselectAll(): void`
Clear all selections

```typescript
clearSelection() {
  this.table.deselectAll();
}
```

---

## CSS Classes

Main component classes that can be targeted for styling:

```scss
// Main container
.ngxsmk-datatable { }

// Header
.ngxsmk-datatable__header { }
.ngxsmk-datatable__header-cell { }
.ngxsmk-datatable__header-cell--sortable { }
.ngxsmk-datatable__header-cell--sorted { }

// Body
.ngxsmk-datatable__body { }
.ngxsmk-datatable__row { }
.ngxsmk-datatable__row--selected { }
.ngxsmk-datatable__row--odd { }
.ngxsmk-datatable__row--even { }

// Cells
.ngxsmk-datatable__cell { }
.ngxsmk-datatable__cell--frozen-left { }
.ngxsmk-datatable__cell--frozen-right { }

// Row details
.ngxsmk-datatable__row-detail { }
.ngxsmk-datatable__row-detail--expanded { }

// Footer
.ngxsmk-datatable__footer { }

// Loading
.ngxsmk-datatable__loading { }
.ngxsmk-datatable__empty { }
```

---

## CSS Variables

All customizable CSS variables:

```scss
// Colors
--ngxsmk-dt-primary-color: #3b82f6;
--ngxsmk-dt-primary-hover: #2563eb;
--ngxsmk-dt-bg-white: #ffffff;
--ngxsmk-dt-bg-light: #f3f4f6;
--ngxsmk-dt-bg-hover: #f0f4ff;
--ngxsmk-dt-bg-selected: #e8f0ff;

// Text
--ngxsmk-dt-text-primary: #1f2937;
--ngxsmk-dt-text-secondary: #6b7280;

// Borders
--ngxsmk-dt-border-light: #f0f1f3;
--ngxsmk-dt-border-medium: #e5e7eb;

// Dimensions
--ngxsmk-dt-row-height: 54px;
--ngxsmk-dt-padding: 16px;
--ngxsmk-dt-font-size: 14px;
--ngxsmk-dt-radius-lg: 10px;

// Shadows
--ngxsmk-dt-shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
```

See [Customization Guide](./CUSTOMIZATION.md) for complete list.

---

## Related Documentation

- [Installation Guide](./INSTALLATION.md)
- [Customization Guide](./CUSTOMIZATION.md)
- [Performance Tips](./PERFORMANCE.md)
- [Examples](./EXAMPLES.md)

