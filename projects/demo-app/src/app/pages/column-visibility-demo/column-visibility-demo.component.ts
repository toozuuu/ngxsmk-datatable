import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent } from 'ngxsmk-datatable';
import type { NgxsmkColumn } from 'ngxsmk-datatable';

@Component({
  selector: 'app-column-visibility-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-container">
      <h2>Column Visibility Control (PR #2152)</h2>
      <p class="demo-description">
        Advanced column visibility control feature - dynamically show/hide columns based on user preferences.
      </p>

      <div class="feature-grid">
        <!-- Column Visibility Panel -->
        <div class="control-panel">
          <h3>Column Visibility Controls</h3>
          <div class="checkbox-group">
            <label *ngFor="let col of columns" class="checkbox-label">
              <input 
                type="checkbox" 
                [checked]="isColumnVisible(col)"
                (change)="toggleColumn(col)"
              />
              <span>{{ col.name }}</span>
            </label>
          </div>

          <div class="action-buttons" style="margin-top: 20px;">
            <button (click)="showAllColumns()" class="btn btn-primary">
              Show All
            </button>
            <button (click)="hideAllColumns()" class="btn btn-secondary">
              Hide All
            </button>
            <button (click)="resetToDefaults()" class="btn btn-outline">
              Reset Defaults
            </button>
          </div>
        </div>

        <!-- Data Table with Refresh Button -->
        <div class="table-container">
          <ngxsmk-datatable
            [columns]="visibleColumns"
            [rows]="employees"
            [pagination]="{
              pageSize: 10,
              totalItems: employees.length,
              currentPage: 1,
              maxSize: 7,
              showPageSizeOptions: true,
              pageSizeOptions: [5, 10, 25, 50],
              showFirstLastButtons: true,
              showRangeLabels: true,
              showTotalItems: true
            }"
            [columnVisibilityEnabled]="true"
            [showRefreshButton]="true"
            [selectionType]="'multi'"
            [rowHeight]="50"
            (refreshData)="onRefreshData()"
            (columnVisibilityChange)="onColumnVisibilityChange($event)"
          >
          </ngxsmk-datatable>

          @if (lastRefreshTime) {
            <div class="refresh-info">
              Last refreshed: {{ lastRefreshTime | date: 'medium' }}
            </div>
          }
        </div>
      </div>

      <!-- Feature Information -->
      <div class="demo-info">
        <h4>✨ Feature Highlights (from ngx-datatable)</h4>
        <ul>
          <li><strong>PR #2152 - Column Visibility:</strong> Show/hide columns dynamically with full state management</li>
          <li><strong>PR #2184 - Refresh Button:</strong> Built-in refresh button in pagination footer</li>
          <li><strong>PR #2138 - Memory Leak Fixes:</strong> Proper cleanup and subscription management</li>
          <li><strong>Flexible Display:</strong> Save column visibility preferences (localStorage ready)</li>
          <li><strong>User Control:</strong> Let users customize their table view</li>
        </ul>

        <h4>📋 Usage Example</h4>
        <pre class="code-block"><code>{{ usageExample }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 30px;
      max-width: 1400px;
      margin: 0 auto;
    }

    h2 {
      color: #1f2937;
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: 700;
    }

    .demo-description {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 30px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    .control-panel {
      background: #f9fafb;
      padding: 25px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .control-panel h3 {
      margin: 0 0 20px 0;
      color: #374151;
      font-size: 18px;
      font-weight: 600;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .checkbox-label:hover {
      background: #e5e7eb;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-label span {
      color: #374151;
      font-size: 14px;
      font-weight: 500;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .refresh-info {
      padding: 15px;
      background: #f0fdf4;
      border-top: 1px solid #bbf7d0;
      color: #166534;
      font-size: 14px;
      text-align: center;
      font-weight: 500;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-right: 10px;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-outline {
      background: white;
      color: #3b82f6;
      border: 2px solid #3b82f6;
    }

    .btn-outline:hover {
      background: #eff6ff;
    }

    .demo-info {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 25px;
      border-left: 4px solid #3b82f6;
      margin-top: 30px;
    }

    .demo-info h4 {
      margin: 0 0 15px 0;
      color: #3b82f6;
      font-size: 18px;
      font-weight: 600;
    }

    .demo-info ul {
      margin: 0 0 20px 0;
      padding-left: 20px;
      list-style-type: disc;
    }

    .demo-info li {
      margin-bottom: 10px;
      line-height: 1.6;
      color: #495057;
    }

    .demo-info strong {
      color: #212529;
      font-weight: 600;
    }

    .code-block {
      background: #1f2937;
      color: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-color-scheme: dark) {
      h2 {
        color: #f3f4f6;
      }

      .demo-description {
        color: #d1d5db;
      }

      .control-panel {
        background: #1f2937;
        border-color: #374151;
      }

      .control-panel h3 {
        color: #f3f4f6;
      }

      .checkbox-label span {
        color: #e5e7eb;
      }

      .checkbox-label:hover {
        background: #374151;
      }

      .table-container {
        background: #111827;
      }

      .demo-info {
        background: #1f2937;
        border-left-color: #60a5fa;
      }

      .demo-info h4 {
        color: #60a5fa;
      }

      .demo-info li {
        color: #d1d5db;
      }

      .demo-info strong {
        color: #f3f4f6;
      }
    }
  `]
})
export class ColumnVisibilityDemoComponent implements OnInit {
  columns: NgxsmkColumn[] = [
    { id: 'id', name: 'ID', prop: 'id', sortable: true, width: 80 },
    { id: 'name', name: 'Name', prop: 'name', sortable: true, width: 180 },
    { id: 'position', name: 'Position', prop: 'position', sortable: true, width: 200 },
    { id: 'department', name: 'Department', prop: 'department', sortable: true, width: 150 },
    { id: 'email', name: 'Email', prop: 'email', sortable: true, width: 250 },
    { id: 'phone', name: 'Phone', prop: 'phone', sortable: false, width: 150 },
    { id: 'hireDate', name: 'Hire Date', prop: 'hireDate', sortable: true, width: 120 },
    { id: 'salary', name: 'Salary', prop: 'salary', sortable: true, width: 120 },
  ];

  columnVisibility: { [key: string]: boolean } = {
    id: true,
    name: true,
    position: true,
    department: true,
    email: false, // Hidden by default
    phone: false, // Hidden by default
    hireDate: true,
    salary: true,
  };

  employees: any[] = [];
  lastRefreshTime: Date | null = null;

  usageExample = `<ngxsmk-datatable
  [columns]="visibleColumns"
  [rows]="employees"
  [columnVisibilityEnabled]="true"
  [showRefreshButton]="true"
  [pagination]="{ pageSize: 10, showPageSizeOptions: true }"
  (refreshData)="onRefreshData()"
  (columnVisibilityChange)="onColumnVisibilityChange($event)"
>
</ngxsmk-datatable>

// In component:
toggleColumn(column: NgxsmkColumn) {
  this.columnVisibility[column.id] = !this.columnVisibility[column.id];
}`;

  ngOnInit(): void {
    this.generateEmployees();
  }

  get visibleColumns(): NgxsmkColumn[] {
    return this.columns.filter(col => this.columnVisibility[col.id]);
  }

  isColumnVisible(column: NgxsmkColumn): boolean {
    return this.columnVisibility[column.id];
  }

  toggleColumn(column: NgxsmkColumn): void {
    this.columnVisibility[column.id] = !this.columnVisibility[column.id];
  }

  showAllColumns(): void {
    this.columns.forEach(col => {
      this.columnVisibility[col.id] = true;
    });
  }

  hideAllColumns(): void {
    // Keep at least ID and Name visible
    this.columns.forEach(col => {
      if (col.id !== 'id' && col.id !== 'name') {
        this.columnVisibility[col.id] = false;
      }
    });
  }

  resetToDefaults(): void {
    this.columnVisibility = {
      id: true,
      name: true,
      position: true,
      department: true,
      email: false,
      phone: false,
      hireDate: true,
      salary: true,
    };
  }

  onRefreshData(): void {
    this.lastRefreshTime = new Date();
    console.log('Refreshing data...', this.lastRefreshTime);
    // Simulate data refresh
    this.generateEmployees();
  }

  onColumnVisibilityChange(event: { column: NgxsmkColumn; visible: boolean }): void {
    console.log('Column visibility changed:', event);
  }

  private generateEmployees(): void {
    const positions = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Analyst', 'DevOps Engineer'];
    const departments = ['Engineering', 'Product', 'Design', 'Analytics', 'Operations'];
    const names = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Adams', 'Frank Castle', 'Grace Lee', 'Henry Ford'];

    this.employees = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      position: positions[Math.floor(Math.random() * positions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@company.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      hireDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      salary: `$${(Math.floor(Math.random() * 100) + 60) * 1000}`,
    }));
  }
}

