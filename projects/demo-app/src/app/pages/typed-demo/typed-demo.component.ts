import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgxsmkDatatableComponent, 
  NgxsmkColumn, 
  NgxsmkRow,
  NgxsmkCellTemplateContext,
  PaginationConfig 
} from 'ngxsmk-datatable';

/**
 * STRONGLY TYPED USER INTERFACE
 * Define your data model with precise types
 */
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager' | 'Guest';
  status: 'Active' | 'Inactive' | 'Pending';
  salary: number;
  joinDate: Date;
  department: string;
}

/**
 * Example of typed row with metadata
 */
type UserRow = NgxsmkRow<User>;

@Component({
  selector: 'app-typed-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-shield-alt"></i>
        <div class="header-content">
          <h1 class="header-title">🎯 Strongly Typed Rows</h1>
          <p class="header-description">
            Type-safe templates that catch errors at compile time!
          </p>
        </div>
        <span class="header-badge">Advanced</span>
      </div>
      
      <div class="demo-content">
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Type Safety Benefits:</strong>
            <ul style="margin-top: 8px; margin-bottom: 0;">
              <li>✅ IntelliSense autocomplete in templates</li>
              <li>✅ Compile-time type checking</li>
              <li>✅ Refactoring safety (rename properties with confidence)</li>
              <li>✅ Catch errors before runtime</li>
            </ul>
          </div>
        </div>

        <!-- 
          TYPED TEMPLATES
          Note: In the templates below, 'row' and 'value' are fully typed!
          Try accessing an invalid property - TypeScript will catch it at compile time.
        -->
        
        <!-- Status Template - value is typed as 'Active' | 'Inactive' | 'Pending' -->
        <ng-template #statusTemplate let-row="row" let-value="value">
          <span [class]="'status-badge status-' + value.toLowerCase()">
            <i [class]="getStatusIcon(value)"></i>
            {{ value }}
          </span>
        </ng-template>

        <!-- Role Template - value is typed as 'Admin' | 'User' | 'Manager' | 'Guest' -->
        <ng-template #roleTemplate let-row="row" let-value="value">
          <span [class]="'role-badge role-' + value.toLowerCase()">
            <i [class]="getRoleIcon(value)"></i>
            {{ value }}
          </span>
        </ng-template>

        <!-- Salary Template - value is typed as number -->
        <ng-template #salaryTemplate let-row="row" let-value="value">
          <span class="salary-display">
            {{ value | currency:'USD':'symbol':'1.0-0' }}
          </span>
          <!-- TypeScript knows 'value' is a number, so you can use number methods -->
          <small class="text-muted" style="display: block; font-size: 0.85em;">
            {{ value > 80000 ? '💰 High earner' : value > 50000 ? '✅ Good' : '📊 Entry level' }}
          </small>
        </ng-template>

        <!-- User Info Template - row is fully typed as User -->
        <ng-template #userTemplate let-row="row">
          <div class="user-info">
            <div class="user-avatar">
              {{ row.name.charAt(0) }}
            </div>
            <div class="user-details">
              <div class="user-name">{{ row.name }}</div>
              <div class="user-email">{{ row.email }}</div>
              <!-- TypeScript ensures these properties exist on User -->
              <div class="user-meta">
                {{ row.department }} • Joined {{ row.joinDate | date:'MMM yyyy' }}
              </div>
            </div>
          </div>
        </ng-template>

        <!-- Actions Template -->
        <ng-template #actionsTemplate let-row="row">
          <div class="action-buttons">
            <button 
              class="btn btn-sm btn-primary" 
              (click)="editUser(row)"
              [title]="'Edit ' + row.name">
              <i class="fas fa-edit"></i>
            </button>
            <button 
              class="btn btn-sm btn-danger" 
              (click)="deleteUser(row)"
              [title]="'Delete ' + row.name"
              [disabled]="row.role === 'Admin'">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </ng-template>

        <div class="datatable-container with-header">
          <div class="datatable-header">
            <h3 class="datatable-title">
              <i class="fas fa-users"></i>
              Typed User Table
            </h3>
            <div class="datatable-actions">
              <span class="badge badge-info">{{rows.length}} users</span>
              <button class="btn btn-sm btn-primary" (click)="addUser()" style="margin-left: 8px;">
                <i class="fas fa-plus"></i>
                Add User
              </button>
            </div>
          </div>
          
          <div class="datatable-wrapper">
            <ngxsmk-datatable
              [columns]="columns"
              [rows]="rows"
              [pagination]="paginationConfig"
              [selectionType]="'multi'"
              [rowHeight]="60"
              class="ngxsmk-datatable--material"
              (select)="onSelect($event)"
            >
            </ngxsmk-datatable>
          </div>
        </div>

        <!-- Code Example Section -->
        <h2 class="section-header">
          <i class="fas fa-code"></i>
          How to Use Typed Rows
        </h2>
        
        <div class="card">
          <div class="card-header">
            <span style="font-weight: 600;">TypeScript Code Example</span>
          </div>
          <div class="card-body">
            <pre class="code-block">{{ codeExample }}</pre>
          </div>
        </div>

        <!-- Type Safety Demo -->
        <h2 class="section-header">
          <i class="fas fa-bug"></i>
          Type Safety in Action
        </h2>
        
        <div class="card">
          <div class="card-header">
            <span style="font-weight: 600;">Compile-Time Error Detection</span>
          </div>
          <div class="card-body">
            <div class="type-safety-examples">
              <div class="example-item">
                <div class="example-label error">❌ This would cause a TypeScript error:</div>
                <pre class="code-block error">&lt;ng-template #template let-row="row"&gt;
  {{ "{{ row.invalidProperty }}" }} &lt;!-- Error: Property 'invalidProperty' does not exist --&gt;
&lt;/ng-template&gt;</pre>
              </div>
              
              <div class="example-item">
                <div class="example-label success">✅ This is type-safe and works:</div>
                <pre class="code-block success">&lt;ng-template #template let-row="row"&gt;
  {{ "{{ row.name }}" }} &lt;!-- Success: 'name' exists on User interface --&gt;
  {{ "{{ row.email }}" }} &lt;!-- Success: 'email' exists on User interface --&gt;
&lt;/ng-template&gt;</pre>
              </div>

              <div class="example-item">
                <div class="example-label success">✅ Type-aware value in cell templates:</div>
                <pre class="code-block success">&lt;ng-template #salaryTemplate let-value="value"&gt;
  {{ "{{ value.toFixed(2) }}" }} &lt;!-- TypeScript knows value is a number --&gt;
&lt;/ng-template&gt;</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    .status-active {
      background: #e8f5e9;
      color: #2e7d32;
    }
    
    .status-inactive {
      background: #ffebee;
      color: #c62828;
    }
    
    .status-pending {
      background: #fff3e0;
      color: #ef6c00;
    }

    .role-badge {
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.85em;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    .role-admin {
      background: #e8eaf6;
      color: #3f51b5;
    }
    
    .role-manager {
      background: #f3e5f5;
      color: #7b1fa2;
    }
    
    .role-user {
      background: #e0f2f1;
      color: #00695c;
    }
    
    .role-guest {
      background: #f5f5f5;
      color: #616161;
    }

    .salary-display {
      font-weight: 600;
      font-size: 1.1em;
      color: #2e7d32;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1em;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.95em;
    }

    .user-email {
      font-size: 0.85em;
      color: #666;
    }

    .user-meta {
      font-size: 0.75em;
      color: #999;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .code-block {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
      line-height: 1.5;
      margin: 0;
    }

    .code-block.error {
      background: #3d1a1a;
      border-left: 4px solid #f44336;
    }

    .code-block.success {
      background: #1a3d1a;
      border-left: 4px solid #4caf50;
    }

    .type-safety-examples {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .example-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .example-label {
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
    }

    .example-label.error {
      background: #ffebee;
      color: #c62828;
    }

    .example-label.success {
      background: #e8f5e9;
      color: #2e7d32;
    }
  `]
})
export class TypedDemoComponent implements OnInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<NgxsmkCellTemplateContext<User, User['status']>>;
  @ViewChild('roleTemplate') roleTemplate!: TemplateRef<NgxsmkCellTemplateContext<User, User['role']>>;
  @ViewChild('salaryTemplate') salaryTemplate!: TemplateRef<NgxsmkCellTemplateContext<User, number>>;
  @ViewChild('userTemplate') userTemplate!: TemplateRef<NgxsmkCellTemplateContext<User>>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<NgxsmkCellTemplateContext<User>>;

  // Strongly typed columns
  columns: NgxsmkColumn<User>[] = [];
  
  // Strongly typed rows
  rows: UserRow[] = [];

  paginationConfig: PaginationConfig = {
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    showPageSizeOptions: true,
    showFirstLastButtons: true,
    totalItems: 0,
    currentPage: 1
  };

  codeExample = `// 1. Define your data model
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager' | 'Guest';
  status: 'Active' | 'Inactive' | 'Pending';
  salary: number;
  joinDate: Date;
  department: string;
}

// 2. Use typed columns and rows
columns: NgxsmkColumn<User>[] = [
  {
    id: 'name',
    name: 'Name',
    prop: 'name',
    cellTemplate: this.userTemplate
  },
  {
    id: 'status',
    name: 'Status',
    prop: 'status',
    cellTemplate: this.statusTemplate
  }
];

rows: NgxsmkRow<User>[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    salary: 85000,
    joinDate: new Date('2022-01-15'),
    department: 'Engineering'
  }
];

// 3. Create typed templates with full IntelliSense
<ng-template #statusTemplate let-row="row" let-value="value">
  <!-- 'row' is typed as User -->
  <!-- 'value' is typed as 'Active' | 'Inactive' | 'Pending' -->
  <span>{{ value }}</span>
</ng-template>`;

  ngOnInit() {
    this.loadSampleData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeColumns();
    });
  }

  private initializeColumns() {
    // Columns are strongly typed - TypeScript will enforce User properties
    this.columns = [
      {
        id: 'user',
        name: 'User',
        prop: 'name',
        width: 280,
        cellTemplate: this.userTemplate,
        sortable: true
      },
      {
        id: 'role',
        name: 'Role',
        prop: 'role',
        width: 120,
        cellTemplate: this.roleTemplate,
        sortable: true
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        width: 120,
        cellTemplate: this.statusTemplate,
        sortable: true
      },
      {
        id: 'salary',
        name: 'Salary',
        prop: 'salary',
        width: 150,
        cellTemplate: this.salaryTemplate,
        sortable: true
      },
      {
        id: 'actions',
        name: 'Actions',
        prop: 'id',
        width: 120,
        cellTemplate: this.actionsTemplate,
        sortable: false,
        frozen: 'right'
      }
    ];
  }

  private loadSampleData() {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations'];
    const names = [
      'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown',
      'Emma Davis', 'Frank Miller', 'Grace Wilson', 'Henry Moore',
      'Iris Taylor', 'Jack Anderson', 'Kate Thomas', 'Liam Jackson'
    ];

    this.rows = names.map((name, index) => {
      const roles: User['role'][] = ['Admin', 'User', 'Manager', 'Guest'];
      const statuses: User['status'][] = ['Active', 'Inactive', 'Pending'];
      
      return {
        id: index + 1,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        salary: Math.floor(Math.random() * 100000) + 40000,
        joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
        department: departments[Math.floor(Math.random() * departments.length)]
      };
    });

    this.paginationConfig.totalItems = this.rows.length;
  }

  // Type-safe event handlers
  onSelect(event: any) {
    console.log('Selected users:', event.selected);
  }

  // TypeScript ensures parameter is UserRow
  editUser(user: UserRow) {
    alert(`Editing user: ${user.name} (${user.email})`);
  }

  deleteUser(user: UserRow) {
    if (confirm(`Delete ${user.name}?`)) {
      this.rows = this.rows.filter(r => r.id !== user.id);
      this.paginationConfig.totalItems = this.rows.length;
    }
  }

  addUser() {
    const newId = Math.max(...this.rows.map(r => r.id), 0) + 1;
    const newUser: UserRow = {
      id: newId,
      name: `New User ${newId}`,
      email: `user${newId}@company.com`,
      role: 'User',
      status: 'Pending',
      salary: 50000,
      joinDate: new Date(),
      department: 'Engineering'
    };
    
    this.rows = [newUser, ...this.rows];
    this.paginationConfig.totalItems = this.rows.length;
  }

  // Type-safe helper methods - parameter types are enforced
  getStatusIcon(status: User['status']): string {
    const icons = {
      'Active': 'fas fa-check-circle',
      'Inactive': 'fas fa-times-circle',
      'Pending': 'fas fa-clock'
    };
    return icons[status];
  }

  getRoleIcon(role: User['role']): string {
    const icons = {
      'Admin': 'fas fa-crown',
      'Manager': 'fas fa-user-tie',
      'User': 'fas fa-user',
      'Guest': 'fas fa-user-circle'
    };
    return icons[role];
  }
}

