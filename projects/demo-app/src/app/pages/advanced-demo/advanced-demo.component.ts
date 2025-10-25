import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig, RowDetailView } from 'ngxsmk-datatable';

@Component({
  selector: 'app-advanced-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <nav class="breadcrumb">
        <a routerLink="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Advanced Features</span>
      </nav>

      <h2 class="demo-header">
        <i class="fas fa-cogs"></i>
        Advanced Features Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          This demo showcases advanced features including column pinning, row details, custom templates, and more.
        </div>

        <div class="demo-controls">
          <div class="form-group">
            <label class="form-label">Selection Type:</label>
            <select [(ngModel)]="selectionType" (change)="onSelectionTypeChange()" class="form-control">
              <option value="single">Single Row</option>
              <option value="multi">Multiple Rows</option>
              <option value="checkbox">Checkbox Selection</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Column Mode:</label>
            <select [(ngModel)]="columnMode" (change)="onColumnModeChange()" class="form-control">
              <option value="standard">Standard</option>
              <option value="flex">Flex</option>
              <option value="force">Force Fill</option>
            </select>
          </div>

          <div class="form-check">
            <input type="checkbox" id="rowDetails" [(ngModel)]="enableRowDetails" (change)="onRowDetailsToggle()" class="form-check-input">
            <label for="rowDetails" class="form-check-label">Enable Row Details</label>
          </div>

          <div class="form-check">
            <input type="checkbox" id="columnPinning" [(ngModel)]="enableColumnPinning" (change)="onColumnPinningToggle()" class="form-check-input">
            <label for="columnPinning" class="form-check-label">Enable Column Pinning</label>
          </div>

          <button class="btn btn-primary" (click)="toggleTheme()">
            <i class="fas fa-palette"></i>
            Toggle Theme
          </button>
        </div>

        <div class="datatable-container">
          <!-- Template definitions (must be outside @if) -->
          <ng-template #headerTemplate let-column="column">
              <div class="custom-header">
                <i [class]="getColumnIcon(column.id)"></i>
                {{ column.name }}
                @if (column.frozen) {
                  <span class="frozen-indicator">📌</span>
                }
              </div>
            </ng-template>

            <!-- Custom avatar cell template -->
            <ng-template #avatarTemplate let-row="row" let-value="value">
              <div class="user-avatar">
                <img [src]="value" [alt]="row['name']" class="avatar-image">
                <div class="user-info">
                  <div class="user-name">{{ row['name'] }}</div>
                  <div class="user-role">{{ row['role'] }}</div>
                </div>
              </div>
            </ng-template>

            <!-- Custom status cell template -->
            <ng-template #statusTemplate let-row="row" let-value="value">
              <div class="status-container">
                <span [class]="getStatusClass(value)">
                  <i [class]="getStatusIcon(value)"></i>
                  {{ value }}
                </span>
                <div class="status-indicator" [class]="getStatusIndicatorClass(value)"></div>
              </div>
            </ng-template>

            <!-- Custom progress cell template -->
            <ng-template #progressTemplate let-row="row" let-value="value">
              <div class="progress-container">
                <div class="progress-bar" [style.width.%]="value"></div>
                <span class="progress-text">{{ value }}%</span>
              </div>
            </ng-template>

            <!-- Custom actions cell template -->
            <ng-template #actionsTemplate let-row="row">
              <div class="action-buttons">
                <button class="btn btn-sm btn-primary" (click)="viewDetails(row)" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" (click)="editUser(row)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-warning" (click)="toggleStatus(row)" title="Toggle Status">
                  <i class="fas fa-toggle-on"></i>
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteUser(row)" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </ng-template>

            <!-- Row detail template -->
            <ng-template #rowDetailTemplate let-row="row" let-rowIndex="rowIndex">
              <div class="row-detail-content">
                <div class="detail-header">
                  <h4>{{ row['name'] }} - Details</h4>
                  <span class="detail-id">ID: {{ row['id'] }}</span>
                </div>
                <div class="detail-body">
                  <div class="detail-section">
                    <h5>Personal Information</h5>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <label>Email:</label>
                        <span>{{ row['email'] }}</span>
                      </div>
                      <div class="detail-item">
                        <label>Role:</label>
                        <span class="role-badge" [class]="getRoleClass(row['role'])">{{ row['role'] }}</span>
                      </div>
                      <div class="detail-item">
                        <label>Status:</label>
                        <span [class]="getStatusClass(row['status'])">{{ row['status'] }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="detail-section">
                    <h5>Activity</h5>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <label>Last Login:</label>
                        <span>{{ row['lastLogin'] }}</span>
                      </div>
                      <div class="detail-item">
                        <label>Progress:</label>
                        <div class="progress-container">
                          <div class="progress-bar" [style.width.%]="row['progress']"></div>
                          <span class="progress-text">{{ row['progress'] }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="detail-actions">
                    <button class="btn btn-primary" (click)="editUser(row)">
                      <i class="fas fa-edit"></i> Edit User
                    </button>
                    <button class="btn btn-secondary" (click)="viewProfile(row)">
                      <i class="fas fa-user"></i> View Profile
                    </button>
                    <button class="btn btn-warning" (click)="sendMessage(row)">
                      <i class="fas fa-envelope"></i> Send Message
                    </button>
                  </div>
                </div>
              </div>
            </ng-template>

          @if (!templatesReady) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading templates...</p>
            </div>
          } @else if (loading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading data...</p>
            </div>
          } @else {
            <ngxsmk-datatable
              [columns]="getColumns()"
              [rows]="rows"
              [virtualScrolling]="true"
              [selectionType]="selectionType"
              [pagination]="paginationConfig"
              [rowDetail]="getRowDetailConfig()"
              [class]="getTableClass()"
              (select)="onSelect($event)"
              (sort)="onSort($event)"
              (page)="onPage($event)"
              (rowDetailToggle)="onRowDetailToggle($event)"
              (columnResize)="onColumnResize($event)"
              (columnReorder)="onColumnReorder($event)">
            </ngxsmk-datatable>
          }
        </div>

        <!-- Event log -->
        <div class="card">
          <div class="card-header">
            <h4>Event Log</h4>
            <button class="btn btn-sm btn-secondary" (click)="clearEvents()">Clear</button>
          </div>
          <div class="card-body">
            <div class="event-log">
              @for (event of events.slice(-10); track event.time) {
                <div class="event-item">
                <span class="event-time">{{ event.time | date:'HH:mm:ss' }}</span>
                <span class="event-type">{{ event.type }}</span>
                <span class="event-message">{{ event.message }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .breadcrumb-item {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .breadcrumb-item:hover:not(.active) {
      color: #3b82f6;
    }

    .breadcrumb-item.active {
      color: #1f2937;
      font-weight: 600;
    }

    .breadcrumb-separator {
      color: #d1d5db;
      font-weight: 400;
    }

    .demo-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-control {
      padding: 10px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .form-control:hover {
      border-color: #3b82f6;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
    }

    .form-check-input {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #3b82f6;
    }

    .form-check-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      user-select: none;
    }

    .datatable-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      min-height: 600px;
    }

    .datatable-container ::ng-deep ngxsmk-datatable {
      height: 600px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 600px;
      gap: 20px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p {
      font-size: 16px;
      color: #6b7280;
      font-weight: 500;
    }

    .custom-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .frozen-indicator {
      font-size: 12px;
      color: #2196f3;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
    }

    .user-role {
      font-size: 12px;
      color: #666;
    }

    .status-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-indicator-active {
      background: #28a745;
    }

    .status-indicator-inactive {
      background: #dc3545;
    }

    .status-indicator-pending {
      background: #ffc107;
    }

    .progress-container {
      position: relative;
      background: #f0f0f0;
      border-radius: 4px;
      height: 20px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      transition: width 0.3s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 11px;
      font-weight: 500;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }

    .btn-sm {
      padding: 6px 10px;
      font-size: 13px;
      min-width: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .btn-sm:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .row-detail-content {
      padding: 30px;
      background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
      border-left: 4px solid #3b82f6;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e5e7eb;
    }

    .detail-header h4 {
      margin: 0;
      color: #1f2937;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .detail-header h4::before {
      content: '📋';
      font-size: 24px;
    }

    .detail-id {
      font-size: 13px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-family: 'Courier New', monospace;
    }

    .detail-section {
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .detail-section h5 {
      margin: 0 0 16px 0;
      color: #374151;
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }

    .detail-section h5::before {
      content: '';
      width: 4px;
      height: 16px;
      background: #3b82f6;
      border-radius: 2px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
    }

    .detail-item label {
      font-weight: 700;
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item span {
      font-size: 15px;
      color: #1f2937;
      font-weight: 500;
    }

    .role-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .role-admin {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
    }

    .role-user {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
      color: white;
    }

    .role-manager {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: white;
    }

    .role-guest {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      color: white;
    }

    .detail-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 2px solid #e5e7eb;
      flex-wrap: wrap;
    }

    .detail-actions .btn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .detail-actions .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .status-active {
      color: #059669;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-active::before {
      content: '●';
      font-size: 14px;
      color: #10b981;
    }

    .status-inactive {
      color: #dc2626;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-inactive::before {
      content: '●';
      font-size: 14px;
      color: #ef4444;
    }

    .status-pending {
      color: #d97706;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-pending::before {
      content: '●';
      font-size: 14px;
      color: #f59e0b;
    }

    .event-log {
      max-height: 200px;
      overflow-y: auto;
    }

    .event-item {
      display: flex;
      gap: 10px;
      padding: 5px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .event-time {
      font-size: 12px;
      color: #666;
      min-width: 80px;
    }

    .event-type {
      font-weight: 500;
      min-width: 120px;
    }

    .event-message {
      color: #666;
    }

    .theme-dark {
      background: #1e1e1e;
      color: #ffffff;
    }

    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .detail-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdvancedDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('avatarTemplate') avatarTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('progressTemplate') progressTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('rowDetailTemplate') rowDetailTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  selectedRows: NgxsmkRow[] = [];
  loading = false;
  templatesReady = false;
  
  selectionType: 'single' | 'multi' | 'checkbox' = 'checkbox';
  columnMode: 'standard' | 'flex' | 'force' = 'standard';
  enableRowDetails = true;
  enableColumnPinning = true;
  isDarkTheme = false;

  paginationConfig: PaginationConfig = {
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    showPageSizeOptions: true,
    showFirstLastButtons: true,
    showRangeLabels: true,
    showTotalItems: true,
    totalItems: 0,
    currentPage: 1,
    maxSize: 5
  };

  events: Array<{time: Date, type: string, message: string}> = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Data will be loaded after templates are ready
  }

  ngAfterViewInit() {
    console.log('AdvancedDemo - AfterViewInit called');
    console.log('Templates:', {
      avatar: this.avatarTemplate,
      status: this.statusTemplate,
      progress: this.progressTemplate,
      actions: this.actionsTemplate,
      rowDetail: this.rowDetailTemplate
    });
    setTimeout(() => {
      this.initializeColumns();
      this.loadData();
      this.templatesReady = true;
      console.log('AdvancedDemo - Initialized, columns:', this.columns.length, 'rows:', this.rows.length);
      this.cdr.detectChanges();
    });
  }

  private initializeColumns() {
    this.columns = [
      {
        id: 'avatar',
        name: 'User',
        prop: 'avatar',
        width: 250,
        cellTemplate: this.avatarTemplate,
        sortable: false,
        frozen: this.enableColumnPinning ? 'left' : false
      },
      {
        id: 'email',
        name: 'Email',
        prop: 'email',
        width: 250,
        sortable: true
      },
      {
        id: 'role',
        name: 'Role',
        prop: 'role',
        width: 120,
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
        id: 'progress',
        name: 'Progress',
        prop: 'progress',
        width: 150,
        cellTemplate: this.progressTemplate,
        sortable: true
      },
      {
        id: 'lastLogin',
        name: 'Last Login',
        prop: 'lastLogin',
        width: 150,
        sortable: true
      },
      {
        id: 'actions',
        name: 'Actions',
        prop: 'actions',
        width: 200,
        cellTemplate: this.actionsTemplate,
        sortable: false,
        frozen: this.enableColumnPinning ? 'right' : false
      }
    ];
  }

  getColumns(): NgxsmkColumn[] {
    return this.columns.map(col => ({
      ...col,
      frozen: this.enableColumnPinning ? col.frozen : false
    }));
  }

  getRowDetailConfig(): RowDetailView | null {
    if (!this.enableRowDetails) return null;
    
    return {
      template: this.rowDetailTemplate,
      rowHeight: 200,
      toggleOnClick: true,
      expandOnInit: false
    };
  }

  getTableClass(): string {
    return this.isDarkTheme ? 'theme-dark' : '';
  }

  getColumnIcon(columnId: string): string {
    const icons = {
      'avatar': 'fas fa-user',
      'email': 'fas fa-envelope',
      'role': 'fas fa-user-tag',
      'status': 'fas fa-circle',
      'progress': 'fas fa-chart-line',
      'lastLogin': 'fas fa-clock',
      'actions': 'fas fa-cogs'
    };
    return icons[columnId as keyof typeof icons] || 'fas fa-columns';
  }

  loadData() {
    this.loading = true;
    this.logEvent('Data Loading', 'Loading advanced demo data...');
    
    setTimeout(() => {
      this.rows = this.generateMockData(100);
      this.paginationConfig.totalItems = this.rows.length;
      this.loading = false;
      this.logEvent('Data Loaded', `${this.rows.length} users loaded`);
      console.log('AdvancedDemo - Data loaded:', {
        rowsCount: this.rows.length,
        columnsCount: this.columns.length,
        firstRow: this.rows[0],
        templatesReady: this.templatesReady,
        enableRowDetails: this.enableRowDetails
      });
    }, 1000);
  }

  onSelect(event: any) {
    this.selectedRows = event.selected;
    this.logEvent('Selection Changed', `${event.selected.length} rows selected`);
  }

  onSort(event: any) {
    this.logEvent('Sort Changed', `Sorting by ${event.column.name} (${event.newValue})`);
  }

  onPage(event: any) {
    this.logEvent('Page Changed', `Page ${event.page}`);
  }

  onRowDetailToggle(event: any) {
    this.logEvent('Row Detail Toggle', `Row ${event.rowIndex} ${event.expanded ? 'expanded' : 'collapsed'}`);
  }

  onColumnResize(event: any) {
    this.logEvent('Column Resized', `Column ${event.column.name} resized to ${event.newWidth}px`);
  }

  onColumnReorder(event: any) {
    this.logEvent('Column Reordered', `Column ${event.column.name} moved to position ${event.newIndex}`);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusIcon(status: string): string {
    const icons = {
      'Active': 'fas fa-check-circle',
      'Inactive': 'fas fa-times-circle',
      'Pending': 'fas fa-clock'
    };
    return icons[status as keyof typeof icons] || 'fas fa-question';
  }

  getStatusIndicatorClass(status: string): string {
    return `status-indicator-${status.toLowerCase()}`;
  }

  getRoleClass(role: string): string {
    return `role-${role.toLowerCase()}`;
  }

  viewDetails(row: NgxsmkRow) {
    this.logEvent('View Details', `Viewing details for ${row['name']}`);
  }

  editUser(row: NgxsmkRow) {
    this.logEvent('Edit User', `Editing user: ${row['name']}`);
  }

  toggleStatus(row: NgxsmkRow) {
    row['status'] = row['status'] === 'Active' ? 'Inactive' : 'Active';
    this.logEvent('Status Toggled', `${row['name']} status changed to ${row['status']}`);
  }

  deleteUser(row: NgxsmkRow) {
    this.logEvent('Delete User', `Deleting user: ${row['name']}`);
  }

  viewProfile(row: NgxsmkRow) {
    this.logEvent('View Profile', `Viewing profile for ${row['name']}`);
  }

  sendMessage(row: NgxsmkRow) {
    this.logEvent('Send Message', `Sending message to ${row['name']}`);
  }

  onSelectionTypeChange() {
    this.logEvent('Selection Type Changed', `Selection type: ${this.selectionType}`);
    this.selectedRows = [];
    this.cdr.detectChanges();
  }

  onColumnModeChange() {
    this.logEvent('Column Mode Changed', `Column mode: ${this.columnMode}`);
    this.cdr.detectChanges();
  }

  onRowDetailsToggle() {
    this.logEvent('Row Details Toggle', `Row details ${this.enableRowDetails ? 'enabled' : 'disabled'}`);
    this.cdr.detectChanges();
  }

  onColumnPinningToggle() {
    this.logEvent('Column Pinning Toggle', `Column pinning ${this.enableColumnPinning ? 'enabled' : 'disabled'}`);
    this.initializeColumns();
    this.cdr.detectChanges();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.logEvent('Theme Toggled', `Switched to ${this.isDarkTheme ? 'dark' : 'light'} theme`);
  }

  clearEvents() {
    this.events = [];
  }

  private generateMockData(count: number): NgxsmkRow[] {
    const roles = ['Admin', 'User', 'Manager', 'Guest'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const data = [];

    for (let i = 1; i <= count; i++) {
      data.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        progress: Math.floor(Math.random() * 100),
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }

    return data;
  }

  private logEvent(type: string, message: string) {
    this.events.push({
      time: new Date(),
      type,
      message
    });
  }
}
