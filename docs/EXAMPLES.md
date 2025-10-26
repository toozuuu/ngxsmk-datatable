# Examples

Practical examples and code snippets for common use cases.

---

## Table of Contents

- [Basic Examples](#basic-examples)
- [Advanced Examples](#advanced-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Integration Examples](#integration-examples)

---

## Basic Examples

### 1. Simple Table

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableComponent } from 'ngxsmk-datatable';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [NgxsmkDatatableComponent],
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows">
    </ngxsmk-datatable>
  `
})
export class SimpleTableComponent {
  columns = [
    { id: 'name', name: 'Name', prop: 'name' },
    { id: 'age', name: 'Age', prop: 'age' },
    { id: 'email', name: 'Email', prop: 'email' }
  ];

  rows = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' }
  ];
}
```

### 2. Sortable Table

```typescript
@Component({
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows"
      (sort)="onSort($event)">
    </ngxsmk-datatable>
  `
})
export class SortableTableComponent {
  columns = [
    { id: 'name', name: 'Name', prop: 'name', sortable: true },
    { id: 'age', name: 'Age', prop: 'age', sortable: true },
    { id: 'email', name: 'Email', prop: 'email', sortable: true }
  ];

  rows = [...]; // your data

  onSort(event: any) {
    console.log('Sorted by:', event.column.name, event.newValue);
  }
}
```

### 3. Paginated Table

```typescript
@Component({
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows"
      [pagination]="paginationConfig">
    </ngxsmk-datatable>
  `
})
export class PaginatedTableComponent {
  columns = [...];
  rows = [...]; // 100 rows

  paginationConfig = {
    pageSize: 10,
    pageSizeOptions: [10, 25, 50],
    showPageSizeOptions: true,
    totalItems: 100
  };
}
```

---

## Advanced Examples

### 4. Custom Cell Templates

```typescript
@Component({
  template: `
    <ngxsmk-datatable [columns]="columns" [rows]="rows">
      <!-- Status Badge -->
      <ng-template #statusTemplate let-value="value">
        <span [class]="'badge badge-' + value.toLowerCase()">
          {{ value }}
        </span>
      </ng-template>

      <!-- Avatar with Name -->
      <ng-template #userTemplate let-row="row">
        <div class="user-cell">
          <img [src]="row.avatar" class="avatar">
          <div>
            <div class="name">{{ row.name }}</div>
            <div class="email">{{ row.email }}</div>
          </div>
        </div>
      </ng-template>

      <!-- Action Buttons -->
      <ng-template #actionsTemplate let-row="row">
        <button (click)="edit(row)" class="btn-edit">Edit</button>
        <button (click)="delete(row)" class="btn-delete">Delete</button>
      </ng-template>
    </ngxsmk-datatable>
  `,
  styles: [`
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-active { background: #d1fae5; color: #065f46; }
    .badge-inactive { background: #fee2e2; color: #991b1b; }
    
    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .name { font-weight: 600; }
    .email { font-size: 12px; color: #6b7280; }
  `]
})
export class CustomTemplatesComponent implements AfterViewInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('userTemplate') userTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: any[] = [];
  rows = [...];

  ngAfterViewInit() {
    this.columns = [
      {
        id: 'user',
        name: 'User',
        prop: 'name',
        cellTemplate: this.userTemplate,
        width: 250
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        cellTemplate: this.statusTemplate,
        width: 120
      },
      {
        id: 'actions',
        name: 'Actions',
        cellTemplate: this.actionsTemplate,
        width: 150,
        sortable: false
      }
    ];
  }

  edit(row: any) {
    console.log('Edit:', row);
  }

  delete(row: any) {
    console.log('Delete:', row);
  }
}
```

### 5. Row Details

```typescript
@Component({
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows"
      [rowDetail]="rowDetailConfig">
      
      <ng-template #detailTemplate let-row="row">
        <div class="row-detail">
          <h3>Additional Information</h3>
          <div class="detail-grid">
            <div><label>Full Name:</label> {{ row.fullName }}</div>
            <div><label>Phone:</label> {{ row.phone }}</div>
            <div><label>Address:</label> {{ row.address }}</div>
            <div><label>Joined:</label> {{ row.joinedDate | date }}</div>
          </div>
        </div>
      </ng-template>
    </ngxsmk-datatable>
  `,
  styles: [`
    .row-detail {
      padding: 20px;
      background: #f9fafb;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 16px;
    }
    .detail-grid label {
      font-weight: 600;
      margin-right: 8px;
    }
  `]
})
export class RowDetailsComponent implements AfterViewInit {
  @ViewChild('detailTemplate') detailTemplate!: TemplateRef<any>;

  columns = [...];
  rows = [...];
  rowDetailConfig: any;

  ngAfterViewInit() {
    this.rowDetailConfig = {
      template: this.detailTemplate,
      rowHeight: 150,
      toggleOnClick: true
    };
  }
}
```

### 6. Selection with Actions

```typescript
@Component({
  template: `
    <div class="selection-actions">
      @if (selectedRows.length > 0) {
        <span>{{ selectedRows.length }} selected</span>
        <button (click)="bulkDelete()">Delete Selected</button>
        <button (click)="bulkExport()">Export Selected</button>
        <button (click)="clearSelection()">Clear</button>
      }
    </div>

    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows"
      [selectionType]="'checkbox'"
      [(selected)]="selectedRows"
      (select)="onSelect($event)">
    </ngxsmk-datatable>
  `
})
export class SelectionActionsComponent {
  columns = [...];
  rows = [...];
  selectedRows: any[] = [];

  onSelect(event: any) {
    console.log('Selection changed:', event.selected.length);
  }

  bulkDelete() {
    if (confirm(`Delete ${this.selectedRows.length} items?`)) {
      // Delete logic
      this.selectedRows = [];
    }
  }

  bulkExport() {
    console.log('Exporting:', this.selectedRows);
  }

  clearSelection() {
    this.selectedRows = [];
  }
}
```

---

## Real-World Scenarios

### 7. User Management Table

```typescript
@Component({
  template: `
    <div class="user-management">
      <div class="toolbar">
        <input 
          type="search" 
          placeholder="Search users..."
          (input)="onSearch($event)">
        <button (click)="addUser()">Add User</button>
      </div>

      <ngxsmk-datatable
        [columns]="columns"
        [rows]="filteredRows"
        [pagination]="paginationConfig"
        [selectionType]="'checkbox'"
        [loadingIndicator]="loading">
        
        <ng-template #avatarTemplate let-row="row">
          <div class="user-avatar">
            <img [src]="row.avatar">
            <div>
              <div class="name">{{ row.name }}</div>
              <div class="role">{{ row.role }}</div>
            </div>
          </div>
        </ng-template>

        <ng-template #statusTemplate let-value="value">
          <span [class]="'status-' + value">
            <i [class]="getStatusIcon(value)"></i>
            {{ value }}
          </span>
        </ng-template>

        <ng-template #actionsTemplate let-row="row">
          <button (click)="editUser(row)">Edit</button>
          <button (click)="resetPassword(row)">Reset Password</button>
          <button (click)="deleteUser(row)">Delete</button>
        </ng-template>
      </ngxsmk-datatable>
    </div>
  `
})
export class UserManagementComponent implements AfterViewInit {
  @ViewChild('avatarTemplate') avatarTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: any[] = [];
  rows: any[] = [];
  filteredRows: any[] = [];
  loading = false;

  paginationConfig = {
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showPageSizeOptions: true
  };

  ngAfterViewInit() {
    this.columns = [
      {
        id: 'user',
        name: 'User',
        cellTemplate: this.avatarTemplate,
        width: 250,
        sortable: true
      },
      { id: 'email', name: 'Email', prop: 'email', sortable: true },
      {
        id: 'status',
        name: 'Status',
        cellTemplate: this.statusTemplate,
        width: 120
      },
      { id: 'lastLogin', name: 'Last Login', prop: 'lastLogin' },
      {
        id: 'actions',
        name: 'Actions',
        cellTemplate: this.actionsTemplate,
        width: 200,
        frozen: 'right'
      }
    ];

    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    // API call
    setTimeout(() => {
      this.rows = this.generateMockUsers(100);
      this.filteredRows = [...this.rows];
      this.loading = false;
    }, 1000);
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredRows = this.rows.filter(row =>
      row.name.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term)
    );
  }

  editUser(row: any) {
    // Open edit dialog
  }

  deleteUser(row: any) {
    if (confirm(`Delete user ${row.name}?`)) {
      this.rows = this.rows.filter(r => r.id !== row.id);
      this.filteredRows = [...this.rows];
    }
  }

  generateMockUsers(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      role: ['Admin', 'User', 'Manager'][i % 3],
      status: ['Active', 'Inactive'][i % 2],
      lastLogin: new Date()
    }));
  }

  getStatusIcon(status: string) {
    return status === 'Active' ? 'fa-check-circle' : 'fa-times-circle';
  }
}
```

### 8. E-commerce Product Table

```typescript
@Component({
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="products"
      [pagination]="{ pageSize: 25 }">
      
      <ng-template #imageTemplate let-row="row">
        <img [src]="row.image" class="product-image">
      </ng-template>

      <ng-template #priceTemplate let-value="value">
        <span class="price">{{ value | currency }}</span>
      </ng-template>

      <ng-template #stockTemplate let-value="value">
        <span [class]="getStockClass(value)">
          {{ value }} units
        </span>
      </ng-template>

      <ng-template #actionsTemplate let-row="row">
        <button (click)="editProduct(row)">Edit</button>
        <button (click)="viewDetails(row)">Details</button>
      </ng-template>
    </ngxsmk-datatable>
  `
})
export class ProductTableComponent {
  // Implementation similar to above
}
```

### 9. Server-Side Data Loading

```typescript
@Component({
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows"
      [pagination]="paginationConfig"
      [externalPaging]="true"
      [externalSorting]="true"
      [loadingIndicator]="loading"
      (page)="onPage($event)"
      (sort)="onSort($event)">
    </ngxsmk-datatable>
  `
})
export class ServerSideComponent {
  columns = [...];
  rows: any[] = [];
  loading = false;

  paginationConfig = {
    pageSize: 50,
    currentPage: 1,
    totalItems: 0
  };

  currentSort = { column: '', direction: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    const params = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.pageSize,
      sortBy: this.currentSort.column,
      sortDir: this.currentSort.direction
    };

    this.apiService.getUsers(params).subscribe({
      next: (response) => {
        this.rows = response.data;
        this.paginationConfig.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  onPage(event: any) {
    this.paginationConfig.currentPage = event.page;
    this.paginationConfig.pageSize = event.pageSize;
    this.loadData();
  }

  onSort(event: any) {
    this.currentSort = {
      column: event.column.prop,
      direction: event.newValue
    };
    this.paginationConfig.currentPage = 1; // Reset to first page
    this.loadData();
  }
}
```

---

## Integration Examples

### 10. With Angular Forms

```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <ngxsmk-datatable
        [columns]="columns"
        [rows]="rows"
        [selectionType]="'checkbox'"
        [(selected)]="selectedItems">
      </ngxsmk-datatable>

      <button type="submit" [disabled]="selectedItems.length === 0">
        Process Selected ({{ selectedItems.length }})
      </button>
    </form>
  `
})
export class FormIntegrationComponent {
  form = this.fb.group({
    items: [[]]
  });

  selectedItems: any[] = [];

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    this.form.patchValue({ items: this.selectedItems });
    console.log('Form value:', this.form.value);
  }
}
```

### 11. With RxJS

```typescript
@Component({
  template: `
    <input 
      type="search" 
      [formControl]="searchControl"
      placeholder="Search...">

    <ngxsmk-datatable
      [columns]="columns"
      [rows]="filteredRows$ | async"
      [loadingIndicator]="loading$ | async">
    </ngxsmk-datatable>
  `
})
export class RxJSIntegrationComponent implements OnInit {
  searchControl = new FormControl('');
  
  rows$ = new BehaviorSubject<any[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  
  filteredRows$ = combineLatest([
    this.rows$,
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300)
    )
  ]).pipe(
    map(([rows, searchTerm]) =>
      rows.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading$.next(true);
    this.dataService.getData().subscribe(data => {
      this.rows$.next(data);
      this.loading$.next(false);
    });
  }
}
```

### 12. With State Management (NgRx)

```typescript
@Component({
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="users$ | async"
      [loadingIndicator]="loading$ | async"
      [pagination]="paginationConfig$ | async"
      (page)="onPage($event)"
      (select)="onSelect($event)">
    </ngxsmk-datatable>
  `
})
export class NgRxIntegrationComponent {
  users$ = this.store.select(selectUsers);
  loading$ = this.store.select(selectLoading);
  paginationConfig$ = this.store.select(selectPagination);

  columns = [...];

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadUsers());
  }

  onPage(event: any) {
    this.store.dispatch(changePage({ page: event.page }));
  }

  onSelect(event: any) {
    this.store.dispatch(selectUsers({ users: event.selected }));
  }
}
```

---

## Running the Examples

All examples are available in the demo application:

```bash
git clone <repository-url>
cd ngxsmk-datatable
npm install
npm start
```

Navigate to `http://localhost:4200` and explore the examples.

---

## Related Documentation

- [API Reference](./API.md)
- [Installation Guide](./INSTALLATION.md)
- [Customization Guide](./CUSTOMIZATION.md)
- [Performance Tips](./PERFORMANCE.md)

