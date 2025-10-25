import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig, SelectionEvent, SortEvent, PageEvent } from 'ngxsmk-datatable';
import { ThemeService, ThemeSettings } from '../../shared/theme.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-play"></i>
        Basic Usage Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          This demo shows the basic features of ngxsmk-datatable including sorting, pagination, and selection.
        </div>

        <div class="demo-controls">
          <button class="btn btn-primary" (click)="addRandomUser()">
            <i class="fas fa-plus"></i>
            Add Random User
          </button>
          <button class="btn btn-secondary" (click)="clearData()">
            <i class="fas fa-trash"></i>
            Clear Data
          </button>
          <button class="btn btn-success" (click)="loadSampleData()">
            <i class="fas fa-download"></i>
            Load Sample Data
          </button>
          <div class="form-check">
            <input type="checkbox" id="virtualScrolling" [(ngModel)]="virtualScrolling" class="form-check-input">
            <label for="virtualScrolling" class="form-check-label">Virtual Scrolling</label>
          </div>
        </div>

        <!-- Template definitions (outside datatable) -->
        <ng-template #statusTemplate let-row="row" let-value="value">
          <span [class]="getStatusClass(value)">
            <i [class]="getStatusIcon(value)"></i>
            {{ value }}
          </span>
        </ng-template>

        <ng-template #avatarTemplate let-row="row" let-value="value">
          <div class="user-avatar">
            <img [src]="value" [alt]="row['name']" class="avatar-image">
            <span class="user-name">{{ row['name'] }}</span>
          </div>
        </ng-template>

        <ng-template #actionsTemplate let-row="row">
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" (click)="editUser(row)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" (click)="deleteUser(row)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </ng-template>

        @if (isReady) {
          <ngxsmk-datatable
            [columns]="columns"
            [rows]="rows"
            [virtualScrolling]="virtualScrolling"
            [selectionType]="'multi'"
            [pagination]="paginationConfig"
            [loadingIndicator]="loading"
            [emptyMessage]="'No users found'"
            [rowHeight]="themeSettings.rowHeight"
            [class]="getTableClass()"
            [style.font-size.px]="themeSettings.fontSize"
            (select)="onSelect($event)"
            (sort)="onSort($event)"
            (page)="onPage($event)"
            (activate)="onActivate($event)"
          >
          </ngxsmk-datatable>
        }

        <!-- Selection summary -->
        @if (selectedRows.length > 0) {
          <div class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          {{ selectedRows.length }} row(s) selected
          <button class="btn btn-sm btn-secondary" (click)="clearSelection()">
            Clear Selection
          </button>
          </div>
        }

        <!-- Event log -->
        <div class="card">
          <div class="card-header">
            <h4>Event Log</h4>
          </div>
          <div class="card-body">
            <div class="event-log">
              @for (event of events.slice(-5); track event.time) {
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
  `
})
export class BasicDemoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('avatarTemplate') avatarTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  selectedRows: NgxsmkRow[] = [];
  loading = false;
  virtualScrolling = true;
  isReady = false;
  themeSettings!: ThemeSettings;

  private destroy$ = new Subject<void>();

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

  constructor(
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Load current theme settings
    this.themeSettings = this.themeService.getSettings();

    // Subscribe to theme changes
    this.themeService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.themeSettings = settings;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    console.log('BasicDemo - AfterViewInit called');
    console.log('Templates:', {
      avatar: this.avatarTemplate,
      status: this.statusTemplate,
      actions: this.actionsTemplate
    });
    setTimeout(() => {
      this.initializeColumns();
      this.isReady = true;
      this.loadSampleData();
      console.log('BasicDemo - Initialized, columns:', this.columns.length);
    });
  }

  private initializeColumns() {
    this.columns = [
      {
        id: 'avatar',
        name: 'User',
        prop: 'avatar',
        width: 200,
        cellTemplate: this.avatarTemplate,
        sortable: false
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
        width: 100,
        cellTemplate: this.statusTemplate,
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
        width: 100,
        cellTemplate: this.actionsTemplate,
        sortable: false,
        frozen: 'right'
      }
    ];
  }

  loadSampleData() {
    this.loading = true;
    this.logEvent('Data Loading', 'Loading sample data...');
    
    setTimeout(() => {
      this.rows = this.generateMockData(50);
      this.paginationConfig.totalItems = this.rows.length;
      this.loading = false;
      this.logEvent('Data Loaded', `${this.rows.length} users loaded`);
      this.cdr.detectChanges();
    }, 1000);
  }

  addRandomUser() {
    const newUser = this.generateRandomUser();
    this.rows.unshift(newUser);
    this.paginationConfig.totalItems = this.rows.length;
    this.logEvent('User Added', `Added user: ${newUser['name']}`);
  }

  clearData() {
    this.rows = [];
    this.paginationConfig.totalItems = 0;
    this.selectedRows = [];
    this.logEvent('Data Cleared', 'All data cleared');
  }

  onSelect(event: SelectionEvent) {
    this.selectedRows = event.selected;
    this.logEvent('Selection Changed', `${event.selected.length} rows selected`);
  }

  onSort(event: SortEvent) {
    this.logEvent('Sort Changed', `Sorting by ${event.column.name} (${event.newValue})`);
  }

  onPage(event: PageEvent) {
    this.logEvent('Page Changed', `Page ${event.page} of ${Math.ceil(this.paginationConfig.totalItems / event.pageSize)}`);
  }

  onActivate(event: any) {
    this.logEvent('Row Activated', `Activated: ${event.row.name}`);
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

  getTableClass(): string {
    return this.themeService.getTableClass();
  }

  editUser(user: NgxsmkRow) {
    this.logEvent('User Edit', `Edit user: ${user['name']}`);
    alert(`Edit user: ${user['name']}`);
  }

  deleteUser(user: NgxsmkRow) {
    this.logEvent('User Delete', `Delete user: ${user['name']}`);
    if (confirm(`Delete user: ${user['name']}?`)) {
      const index = this.rows.findIndex(r => r['id'] === user['id']);
      if (index > -1) {
        this.rows.splice(index, 1);
        this.paginationConfig.totalItems = this.rows.length;
      }
    }
  }

  clearSelection() {
    this.selectedRows = [];
    this.logEvent('Selection Cleared', 'All selections cleared');
  }

  private generateMockData(count: number): NgxsmkRow[] {
    const roles = ['Admin', 'User', 'Manager', 'Guest'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const users = [];

    for (let i = 1; i <= count; i++) {
      users.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }

    return users;
  }

  private generateRandomUser(): NgxsmkRow {
    const roles = ['Admin', 'User', 'Manager', 'Guest'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const id = Math.max(...this.rows.map(r => r['id'] as number), 0) + 1;
    
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastLogin: new Date().toLocaleDateString()
    };
  }

  private logEvent(type: string, message: string) {
    this.events.push({
      time: new Date(),
      type,
      message
    });
  }
}
