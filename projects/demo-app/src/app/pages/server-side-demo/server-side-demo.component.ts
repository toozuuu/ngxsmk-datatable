import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig, SortEvent, PageEvent } from 'ngxsmk-datatable';

@Component({
  selector: 'app-server-side-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-server"></i>
        Server-Side Processing Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          This demo simulates server-side pagination and sorting. Data is fetched from a mock API with realistic delays.
        </div>

        <div class="demo-controls">
          <div class="form-group">
            <label class="form-label">API Delay (ms):</label>
            <input type="number" [(ngModel)]="apiDelay" class="form-control" min="100" max="3000" step="100">
          </div>

          <div class="form-group">
            <label class="form-label">Total Records:</label>
            <select [(ngModel)]="totalRecords" (change)="resetData()" class="form-control">
              <option value="100">100 records</option>
              <option value="1000">1,000 records</option>
              <option value="10000">10,000 records</option>
              <option value="100000">100,000 records</option>
            </select>
          </div>

          <button class="btn btn-primary" (click)="refreshData()">
            <i class="fas fa-sync-alt" [class.fa-spin]="loading"></i>
            Refresh Data
          </button>

          <button class="btn btn-secondary" (click)="clearCache()">
            <i class="fas fa-trash"></i>
            Clear Cache
          </button>
        </div>

        <div class="server-info">
          <div class="info-card">
            <h4>Server Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Total Records:</label>
                <span>{{ totalRecords.toLocaleString() }}</span>
              </div>
              <div class="info-item">
                <label>Current Page:</label>
                <span>{{ currentPage }} of {{ totalPages }}</span>
              </div>
              <div class="info-item">
                <label>Page Size:</label>
                <span>{{ pageSize }}</span>
              </div>
              <div class="info-item">
                <label>Sort By:</label>
                <span>{{ currentSort.prop || 'None' }} ({{ currentSort.dir || 'None' }})</span>
              </div>
              <div class="info-item">
                <label>API Calls:</label>
                <span>{{ apiCalls }}</span>
              </div>
              <div class="info-item">
                <label>Cache Hits:</label>
                <span>{{ cacheHits }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Template definitions (must be outside datatable for @ViewChild to work) -->
        <!-- Custom status cell template -->
        <ng-template #statusTemplate let-row="row" let-value="value">
          <span [class]="getStatusClass(value)">
            <i [class]="getStatusIcon(value)"></i>
            {{ value }}
          </span>
        </ng-template>

        <!-- Custom priority cell template -->
        <ng-template #priorityTemplate let-row="row" let-value="value">
          <span [class]="getPriorityClass(value)">
            <i [class]="getPriorityIcon(value)"></i>
            {{ value }}
          </span>
        </ng-template>

        <!-- Custom date cell template -->
        <ng-template #dateTemplate let-row="row" let-value="value">
          <div class="date-cell">
            <div class="date-value">{{ value | date:'short' }}</div>
            <div class="date-relative">{{ getRelativeDate(value) }}</div>
          </div>
        </ng-template>

        <div class="datatable-container">
          @if (templatesReady && columns.length > 0) {
          <ngxsmk-datatable
            [columns]="columns"
            [rows]="rows"
            [virtualScrolling]="false"
            [selectionType]="'multi'"
            [pagination]="paginationConfig"
            [externalPaging]="true"
            [externalSorting]="true"
            [loadingIndicator]="loading"
            [emptyMessage]="'No data available'"
            (select)="onSelect($event)"
            (sort)="onSort($event)"
            (page)="onPage($event)"
          >
          </ngxsmk-datatable>
          }
          @else {
            <div style="padding: 20px; text-align: center;">
              <i class="fas fa-spinner fa-spin"></i> Initializing...
            </div>
          }
        </div>

        <!-- API Request Log -->
        <div class="card">
          <div class="card-header">
            <h4>API Request Log</h4>
            <button class="btn btn-sm btn-secondary" (click)="clearLog()">Clear Log</button>
          </div>
          <div class="card-body">
            <div class="request-log">
              @for (request of requestLog.slice(-10); track request.time) {
                <div class="request-item">
                <div class="request-header">
                  <span class="request-time">{{ request.time | date:'HH:mm:ss.SSS' }}</span>
                  <span class="request-method">{{ request.method }}</span>
                  <span class="request-status" [class]="'status-' + request.status">{{ request.status }}</span>
                  <span class="request-duration">{{ request.duration }}ms</span>
                </div>
                <div class="request-details">
                  <strong>URL:</strong> {{ request.url }}<br>
                  <strong>Params:</strong> {{ request.params | json }}
                </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .server-info {
      margin-bottom: 20px;
    }

    .info-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #e9ecef;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .info-item label {
      font-weight: 500;
      color: #666;
    }

    .info-item span {
      font-weight: 700;
      color: #2196f3;
    }

    .datatable-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .status-high {
      color: #dc3545;
    }

    .status-medium {
      color: #ffc107;
    }

    .status-low {
      color: #28a745;
    }

    .priority-critical {
      color: #dc3545;
    }

    .priority-high {
      color: #fd7e14;
    }

    .priority-medium {
      color: #ffc107;
    }

    .priority-low {
      color: #28a745;
    }

    .date-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date-value {
      font-weight: 500;
      font-size: 14px;
    }

    .date-relative {
      font-size: 11px;
      color: #666;
    }

    .request-log {
      max-height: 300px;
      overflow-y: auto;
    }

    .request-item {
      padding: 10px;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 10px;
    }

    .request-header {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 5px;
    }

    .request-time {
      font-size: 12px;
      color: #666;
      min-width: 80px;
    }

    .request-method {
      font-weight: 500;
      color: #2196f3;
      min-width: 60px;
    }

    .request-status {
      font-weight: 500;
      min-width: 60px;
    }

    .request-status-200 {
      color: #28a745;
    }

    .request-status-400 {
      color: #dc3545;
    }

    .request-status-500 {
      color: #dc3545;
    }

    .request-duration {
      font-size: 12px;
      color: #666;
      min-width: 60px;
    }

    .request-details {
      font-size: 12px;
      color: #666;
      background: #f8f9fa;
      padding: 8px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .request-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
    }
  `]
})
export class ServerSideDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  selectedRows: NgxsmkRow[] = [];
  loading = false;
  templatesReady = false;
  
  apiDelay = 500;
  totalRecords = 1000;
  currentPage = 1;
  pageSize = 10;
  totalPages = 100; // Initialize with calculated value
  currentSort = { prop: '', dir: '' };
  
  apiCalls = 0;
  cacheHits = 0;
  constructor(private cdr: ChangeDetectorRef) {}

  requestLog: Array<{
    time: Date;
    method: string;
    url: string;
    params: any;
    status: number;
    duration: number;
  }> = [];

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

  ngOnInit() {
    // Initialize pagination config with proper values
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.paginationConfig = {
      ...this.paginationConfig,
      totalItems: this.totalRecords,
      currentPage: this.currentPage
    };
  }

  ngAfterViewInit() {
    // Wrap initialization in setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.initializeColumns();
      this.templatesReady = true;
      this.loadData();
      this.cdr.detectChanges();
    }, 0);
  }

  private initializeColumns() {
    this.columns = [
      {
        id: 'id',
        name: 'ID',
        prop: 'id',
        width: 80,
        sortable: true
      },
      {
        id: 'name',
        name: 'Name',
        prop: 'name',
        width: 200,
        sortable: true
      },
      {
        id: 'email',
        name: 'Email',
        prop: 'email',
        width: 250,
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
        id: 'priority',
        name: 'Priority',
        prop: 'priority',
        width: 120,
        cellTemplate: this.priorityTemplate,
        sortable: true
      },
      {
        id: 'createdAt',
        name: 'Created',
        prop: 'createdAt',
        width: 150,
        cellTemplate: this.dateTemplate,
        sortable: true
      },
      {
        id: 'updatedAt',
        name: 'Updated',
        prop: 'updatedAt',
        width: 150,
        cellTemplate: this.dateTemplate,
        sortable: true
      }
    ];
  }

  loadData() {
    this.loading = true;
    this.logRequest('GET', '/api/data', {
      page: this.currentPage,
      pageSize: this.pageSize,
      sort: this.currentSort.prop,
      order: this.currentSort.dir
    });

    setTimeout(() => {
      this.rows = this.generateMockData();
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      this.paginationConfig = {
        ...this.paginationConfig,
        totalItems: this.totalRecords,
        currentPage: this.currentPage
      };
      this.loading = false;
      this.apiCalls++;
      this.cdr.detectChanges();
    }, this.apiDelay);
  }

  refreshData() {
    this.loadData();
  }

  resetData() {
    this.currentPage = 1;
    this.currentSort = { prop: '', dir: '' };
    this.apiCalls = 0;
    this.cacheHits = 0;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.paginationConfig = {
      ...this.paginationConfig,
      totalItems: this.totalRecords,
      currentPage: this.currentPage
    };
    this.loadData();
  }

  clearCache() {
    this.cacheHits = 0;
    this.logEvent('Cache Cleared', 'All cached data cleared');
  }

  onSelect(event: any) {
    this.selectedRows = event.selected;
  }

  onSort(event: SortEvent) {
    this.currentSort = {
      prop: event.column.prop || event.column.id,
      dir: event.newValue
    };
    this.currentPage = 1;
    this.loadData();
  }

  onPage(event: PageEvent) {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusIcon(status: string): string {
    const icons = {
      'Active': 'fas fa-check-circle',
      'Inactive': 'fas fa-times-circle',
      'Pending': 'fas fa-clock',
      'Suspended': 'fas fa-pause-circle'
    };
    return icons[status as keyof typeof icons] || 'fas fa-question';
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getPriorityIcon(priority: string): string {
    const icons = {
      'Critical': 'fas fa-exclamation-triangle',
      'High': 'fas fa-arrow-up',
      'Medium': 'fas fa-minus',
      'Low': 'fas fa-arrow-down'
    };
    return icons[priority as keyof typeof icons] || 'fas fa-question';
  }

  getRelativeDate(date: string): string {
    const now = new Date();
    const itemDate = new Date(date);
    const diffMs = now.getTime() - itemDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  private generateMockData(): NgxsmkRow[] {
    const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    const data: NgxsmkRow[] = [];

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    for (let i = startIndex; i < endIndex; i++) {
      const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const updatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      data.push({
        id: i + 1,
        name: `Item ${i + 1}`,
        email: `item${i + 1}@example.com`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString()
      });
    }

    return data;
  }

  private logRequest(method: string, url: string, params: any) {
    const startTime = performance.now();
    
    setTimeout(() => {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      this.requestLog.push({
        time: new Date(),
        method,
        url,
        params,
        status: 200,
        duration
      });
    }, this.apiDelay);
  }

  private logEvent(type: string, message: string) {
    console.log(`[${type}] ${message}`);
  }

  clearLog() {
    this.requestLog = [];
  }
}
