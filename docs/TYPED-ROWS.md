# 🎯 Strongly Typed Rows

One of the key advantages of `ngxsmk-datatable` over Angular Material tables is **full type safety** for row data in templates. This means you get IntelliSense, compile-time type checking, and refactoring safety when working with your data.

## Table of Contents
- [Why Type Safety Matters](#why-type-safety-matters)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Template Contexts](#template-contexts)
- [Advanced Examples](#advanced-examples)
- [Migration Guide](#migration-guide)

## Why Type Safety Matters

### ❌ Without Type Safety (Angular Material)
```typescript
<ng-template matCellDef let-element>
  {{ element.invalidProperty }}  <!-- No error until runtime! -->
</ng-template>
```

### ✅ With Type Safety (ngxsmk-datatable)
```typescript
<ng-template #cellTemplate let-row="row" let-value="value">
  {{ row.invalidProperty }}  <!-- TypeScript error at compile time! -->
  {{ row.name }}             <!-- ✓ Works perfectly with IntelliSense -->
</ng-template>
```

## Quick Start

### 1. Define Your Data Model

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager';
  status: 'Active' | 'Inactive';
  salary: number;
}
```

### 2. Use Typed Columns and Rows

```typescript
import { NgxsmkColumn, NgxsmkRow } from 'ngxsmk-datatable';

@Component({
  // ...
})
export class MyComponent {
  // Strongly typed columns
  columns: NgxsmkColumn<User>[] = [
    {
      id: 'name',
      name: 'Name',
      prop: 'name',
      cellTemplate: this.nameTemplate
    },
    {
      id: 'status',
      name: 'Status',
      prop: 'status',
      cellTemplate: this.statusTemplate
    }
  ];

  // Strongly typed rows
  rows: NgxsmkRow<User>[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      salary: 85000
    }
  ];
}
```

### 3. Create Type-Safe Templates

```typescript
@Component({
  template: `
    <!-- Cell template with typed context -->
    <ng-template #nameTemplate let-row="row" let-value="value">
      <div>
        <strong>{{ row.name }}</strong>
        <small>{{ row.email }}</small>
      </div>
    </ng-template>

    <!-- Status template - value is typed as 'Active' | 'Inactive' -->
    <ng-template #statusTemplate let-value="value">
      <span [class]="'status-' + value.toLowerCase()">
        {{ value }}
      </span>
    </ng-template>

    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows">
    </ngxsmk-datatable>
  `
})
export class MyComponent {
  @ViewChild('nameTemplate') nameTemplate!: TemplateRef<NgxsmkCellTemplateContext<User>>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<NgxsmkCellTemplateContext<User, User['status']>>;
}
```

## How It Works

### Generic Types

The library uses TypeScript generics to provide type safety:

```typescript
// The datatable component is generic
export class NgxsmkDatatableComponent<T = any> { }

// Columns accept the row type
export interface NgxsmkColumn<T = any> {
  cellTemplate?: TemplateRef<NgxsmkCellTemplateContext<T>>;
  // ...
}

// Rows extend your data type
export interface NgxsmkRow<T = any> extends Partial<NgxsmkRowMetadata> {
  // Your data properties here
}
```

## Template Contexts

### Cell Template Context

```typescript
export interface NgxsmkCellTemplateContext<T = any, V = any> {
  $implicit: T;        // The row data (default)
  row: T;              // The row data
  column: NgxsmkColumn<T>;  // The column definition
  value: V;            // The cell value (typed!)
  rowIndex: number;    // The row index
}
```

**Usage:**
```html
<ng-template #template let-row="row" let-value="value" let-index="rowIndex">
  <!-- row is fully typed as your interface -->
  <!-- value is typed as the property type -->
  {{ row.name }} - {{ value }} - Index: {{ index }}
</ng-template>
```

### Header Template Context

```typescript
export interface NgxsmkHeaderTemplateContext<T = any> {
  $implicit: NgxsmkColumn<T>;  // The column definition
  column: NgxsmkColumn<T>;     // The column definition
}
```

**Usage:**
```html
<ng-template #headerTemplate let-column="column">
  <strong>{{ column.name }}</strong>
</ng-template>
```

### Row Detail Template Context

```typescript
export interface NgxsmkRowDetailTemplateContext<T = any> {
  $implicit: T;     // The row data
  row: T;           // The row data
  rowIndex: number; // The row index
}
```

**Usage:**
```html
<ng-template #rowDetailTemplate let-row="row">
  <div>Detailed info for: {{ row.name }}</div>
</ng-template>
```

## Advanced Examples

### Example 1: Strongly Typed Value

When you specify the property type, the `value` in your template is fully typed:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

// Template for price column
<ng-template #priceTemplate let-value="value">
  <!-- TypeScript knows 'value' is a number -->
  {{ value.toFixed(2) }}
  {{ value > 100 ? 'Expensive' : 'Affordable' }}
</ng-template>

// Template for stock column
<ng-template #stockTemplate let-value="value">
  <!-- TypeScript knows 'value' is a boolean -->
  {{ value ? 'In Stock' : 'Out of Stock' }}
</ng-template>
```

### Example 2: Complex Object Properties

```typescript
interface Employee {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  skills: string[];
}

<ng-template #addressTemplate let-row="row">
  <!-- Full type safety for nested properties -->
  <div>
    {{ row.address.street }}<br>
    {{ row.address.city }}, {{ row.address.zipCode }}
  </div>
</ng-template>

<ng-template #skillsTemplate let-row="row">
  <!-- TypeScript knows skills is a string array -->
  <div>
    @for (skill of row.skills; track skill) {
      <span class="badge">{{ skill }}</span>
    }
  </div>
</ng-template>
```

### Example 3: Union Types

```typescript
interface Task {
  id: number;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: User | null;
}

<ng-template #priorityTemplate let-value="value">
  <!-- TypeScript knows value is 'Low' | 'Medium' | 'High' | 'Critical' -->
  <span [class]="'priority-' + value.toLowerCase()">
    {{ value }}
  </span>
</ng-template>

<ng-template #assigneeTemplate let-value="value">
  <!-- TypeScript knows value can be User or null -->
  @if (value) {
    <span>{{ value.name }}</span>
  } @else {
    <span class="unassigned">Unassigned</span>
  }
</ng-template>
```

### Example 4: Type-Safe Cell Class Functions

```typescript
columns: NgxsmkColumn<User>[] = [
  {
    id: 'status',
    name: 'Status',
    prop: 'status',
    // cellClass function is fully typed
    cellClass: (row: User, column, value, rowIndex) => {
      // TypeScript knows row is User
      // TypeScript knows value matches the property type
      return row.status === 'Active' ? 'status-active' : 'status-inactive';
    }
  }
];
```

### Example 5: Type-Safe Event Handlers

```typescript
editUser(user: NgxsmkRow<User>) {
  // TypeScript ensures user has all User properties
  console.log(user.name, user.email);
  // user.invalidProp; // TypeScript error!
}

onSelect(event: SelectionEvent<User>) {
  // event.selected is typed as NgxsmkRow<User>[]
  event.selected.forEach(user => {
    console.log(user.name); // Type-safe!
  });
}
```

## Migration Guide

### Migrating Existing Code

If you have existing code without types, you can gradually add type safety:

**Before:**
```typescript
columns: NgxsmkColumn[] = [ /* ... */ ];
rows: NgxsmkRow[] = [ /* ... */ ];
```

**After:**
```typescript
interface MyData {
  id: number;
  name: string;
  // ... your properties
}

columns: NgxsmkColumn<MyData>[] = [ /* ... */ ];
rows: NgxsmkRow<MyData>[] = [ /* ... */ ];
```

### Backward Compatibility

The library maintains full backward compatibility. If you don't provide a type parameter, it defaults to `any`:

```typescript
// Still works, but without type safety
columns: NgxsmkColumn[] = [ /* ... */ ];
rows: NgxsmkRow[] = [ /* ... */ ];
```

## Benefits Summary

✅ **IntelliSense**: Get autocomplete suggestions for row properties in templates  
✅ **Compile-Time Errors**: Catch typos and invalid property access before runtime  
✅ **Refactoring Safety**: Rename properties confidently with IDE refactoring tools  
✅ **Documentation**: Types serve as inline documentation for your data structure  
✅ **Better DX**: Improved developer experience with less debugging time  
✅ **Backward Compatible**: Works with existing code, opt-in type safety  

## See Also

- [API Documentation](./API.md)
- [Examples](./EXAMPLES.md)
- [Basic Usage](./README.md)

---

**Need help?** Check out the typed demo in the demo application for a complete working example.

