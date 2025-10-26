import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig } from 'ngxsmk-datatable';

@Component({
  selector: 'app-inline-editing-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-edit"></i>
        Inline Editing Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          Click on any cell to edit inline. Changes are saved automatically.
        </div>

        <div class="demo-stats">
          <div class="stat-card">
            <div class="stat-value">{{ editCount }}</div>
            <div class="stat-label">Total Edits</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ rows.length }}</div>
            <div class="stat-label">Total Records</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ changedRows.size }}</div>
            <div class="stat-label">Modified Rows</div>
          </div>
        </div>

        <div class="datatable-container">
          @if (isReady) {
            <ngxsmk-datatable
              [columns]="columns"
              [rows]="rows"
              [pagination]="paginationConfig">
              
              <ng-template #editableNameTemplate let-row="row" let-value="value" let-rowIndex="rowIndex">
                <div class="editable-cell" (click)="startEdit('name', rowIndex)">
                  @if (editingCell.row === rowIndex && editingCell.column === 'name') {
                    <input 
                      type="text" 
                      [(ngModel)]="row['name']"
                      (blur)="saveEdit(row, 'name', rowIndex)"
                      (keyup.enter)="saveEdit(row, 'name', rowIndex)"
                      (keyup.escape)="cancelEdit()"
                      class="edit-input"
                      #nameInput>
                  } @else {
                    <span class="cell-value">{{ value }}</span>
                    <i class="fas fa-pen edit-icon"></i>
                  }
                </div>
              </ng-template>

              <ng-template #editableEmailTemplate let-row="row" let-value="value" let-rowIndex="rowIndex">
                <div class="editable-cell" (click)="startEdit('email', rowIndex)">
                  @if (editingCell.row === rowIndex && editingCell.column === 'email') {
                    <input 
                      type="email" 
                      [(ngModel)]="row['email']"
                      (blur)="saveEdit(row, 'email', rowIndex)"
                      (keyup.enter)="saveEdit(row, 'email', rowIndex)"
                      (keyup.escape)="cancelEdit()"
                      class="edit-input">
                  } @else {
                    <span class="cell-value">{{ value }}</span>
                    <i class="fas fa-pen edit-icon"></i>
                  }
                </div>
              </ng-template>

              <ng-template #editableRoleTemplate let-row="row" let-value="value" let-rowIndex="rowIndex">
                <div class="editable-cell" (click)="startEdit('role', rowIndex)">
                  @if (editingCell.row === rowIndex && editingCell.column === 'role') {
                    <select 
                      [(ngModel)]="row['role']"
                      (blur)="saveEdit(row, 'role', rowIndex)"
                      (change)="saveEdit(row, 'role', rowIndex)"
                      class="edit-select">
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                      <option value="Guest">Guest</option>
                    </select>
                  } @else {
                    <span class="cell-value">{{ value }}</span>
                    <i class="fas fa-pen edit-icon"></i>
                  }
                </div>
              </ng-template>

              <ng-template #statusTemplate let-row="row" let-value="value" let-rowIndex="rowIndex">
                <div class="status-cell" (click)="toggleStatus(row, rowIndex)">
                  <span [class]="'status-badge status-' + value.toLowerCase()">
                    {{ value }}
                  </span>
                </div>
              </ng-template>
            </ngxsmk-datatable>
          }
        </div>

        <div class="actions-panel">
          <button class="btn btn-primary" (click)="saveAll()">
            <i class="fas fa-save"></i> Save All Changes
          </button>
          <button class="btn btn-secondary" (click)="resetChanges()">
            <i class="fas fa-undo"></i> Reset Changes
          </button>
          <button class="btn btn-success" (click)="exportChanges()">
            <i class="fas fa-download"></i> Export Modified Rows
          </button>
        </div>

        <div class="changes-log" *ngIf="changeLog.length > 0">
          <h4>Recent Changes</h4>
          <div class="log-items">
            @for (log of changeLog.slice(-5).reverse(); track log.timestamp) {
              <div class="log-item">
                <span class="log-time">{{ log.timestamp | date:'HH:mm:ss' }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`

    .demo-header {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .alert {
      padding: 16px;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1e40af;
    }

    .demo-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .datatable-container {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
      height: 600px;
    }

    .editable-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
      min-height: 32px;
    }

    .editable-cell:hover {
      background: #f3f4f6;
    }

    .cell-value {
      flex: 1;
    }

    .edit-icon {
      opacity: 0;
      color: #3b82f6;
      font-size: 12px;
      transition: opacity 0.2s ease;
    }

    .editable-cell:hover .edit-icon {
      opacity: 1;
    }

    .edit-input,
    .edit-select {
      width: 100%;
      padding: 6px 10px;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
      background: white;
    }

    .edit-input:focus,
    .edit-select:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .status-cell {
      cursor: pointer;
      display: inline-block;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .status-badge:hover {
      transform: scale(1.05);
    }

    .status-active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .actions-panel {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .changes-log {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
    }

    .changes-log h4 {
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .log-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .log-item {
      display: flex;
      gap: 12px;
      padding: 8px 12px;
      background: #f9fafb;
      border-radius: 6px;
      font-size: 13px;
    }

    .log-time {
      color: #6b7280;
      font-weight: 600;
      min-width: 70px;
    }

    .log-message {
      color: #374151;
    }
  `]
})
export class InlineEditingDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('editableNameTemplate') editableNameTemplate!: TemplateRef<any>;
  @ViewChild('editableEmailTemplate') editableEmailTemplate!: TemplateRef<any>;
  @ViewChild('editableRoleTemplate') editableRoleTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  isReady = false;

  editingCell = { row: -1, column: '' };
  editCount = 0;
  changedRows = new Set<number>();
  changeLog: Array<{ timestamp: Date; message: string }> = [];
  originalData: NgxsmkRow[] = [];

  paginationConfig: PaginationConfig = {
    pageSize: 10,
    totalItems: 0,
    currentPage: 1,
    maxSize: 5,
    pageSizeOptions: [10, 25, 50],
    showPageSizeOptions: true,
    showFirstLastButtons: true,
    showRangeLabels: true,
    showTotalItems: true
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeColumns();
      this.loadData();
      this.isReady = true;
    });
  }

  initializeColumns() {
    this.columns = [
      { id: 'id', name: 'ID', prop: 'id', width: 80, sortable: true },
      { 
        id: 'name', 
        name: 'Name', 
        prop: 'name', 
        width: 200, 
        sortable: true,
        cellTemplate: this.editableNameTemplate
      },
      { 
        id: 'email', 
        name: 'Email', 
        prop: 'email', 
        width: 250, 
        sortable: true,
        cellTemplate: this.editableEmailTemplate
      },
      { 
        id: 'role', 
        name: 'Role', 
        prop: 'role', 
        width: 150, 
        sortable: true,
        cellTemplate: this.editableRoleTemplate
      },
      { 
        id: 'status', 
        name: 'Status', 
        prop: 'status', 
        width: 120, 
        sortable: true,
        cellTemplate: this.statusTemplate
      }
    ];
  }

  loadData() {
    this.rows = this.generateMockData(50);
    this.originalData = JSON.parse(JSON.stringify(this.rows));
    this.paginationConfig.totalItems = this.rows.length;
  }

  generateMockData(count: number): NgxsmkRow[] {
    const roles = ['Admin', 'User', 'Manager', 'Guest'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length]
    }));
  }

  startEdit(column: string, rowIndex: number) {
    this.editingCell = { row: rowIndex, column };
    this.cdr.detectChanges();
    
    setTimeout(() => {
      const input = document.querySelector('.edit-input, .edit-select') as HTMLInputElement;
      if (input) {
        input.focus();
        if (input.type === 'text' || input.type === 'email') {
          input.select();
        }
      }
    });
  }

  saveEdit(row: NgxsmkRow, column: string, rowIndex: number) {
    if (this.editingCell.row === rowIndex && this.editingCell.column === column) {
      this.editCount++;
      this.changedRows.add(row['id'] as number);
      
      this.changeLog.push({
        timestamp: new Date(),
        message: `Updated ${column} for ${row['name']} to "${row[column]}"`
      });
      
      this.editingCell = { row: -1, column: '' };
      this.cdr.detectChanges();
    }
  }

  cancelEdit() {
    this.editingCell = { row: -1, column: '' };
    this.cdr.detectChanges();
  }

  toggleStatus(row: NgxsmkRow, rowIndex: number) {
    const statuses = ['Active', 'Inactive', 'Pending'];
    const currentIndex = statuses.indexOf(row['status'] as string);
    row['status'] = statuses[(currentIndex + 1) % statuses.length];
    
    this.editCount++;
    this.changedRows.add(row['id'] as number);
    
    this.changeLog.push({
      timestamp: new Date(),
      message: `Changed status for ${row['name']} to ${row['status']}`
    });
    
    this.cdr.detectChanges();
  }

  saveAll() {
    alert(`Saving ${this.changedRows.size} modified rows to server...`);
    this.changeLog.push({
      timestamp: new Date(),
      message: `Saved all changes (${this.changedRows.size} rows modified)`
    });
  }

  resetChanges() {
    this.rows = JSON.parse(JSON.stringify(this.originalData));
    this.changedRows.clear();
    this.editCount = 0;
    this.changeLog.push({
      timestamp: new Date(),
      message: 'Reset all changes to original data'
    });
    this.cdr.detectChanges();
  }

  exportChanges() {
    const modifiedRows = this.rows.filter(row => this.changedRows.has(row['id'] as number));
    console.log('Modified rows:', modifiedRows);
    alert(`Exporting ${modifiedRows.length} modified rows...`);
    
    this.changeLog.push({
      timestamp: new Date(),
      message: `Exported ${modifiedRows.length} modified rows`
    });
  }
}

