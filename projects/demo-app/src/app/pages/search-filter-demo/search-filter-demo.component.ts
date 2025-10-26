import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig } from 'ngxsmk-datatable';

@Component({
  selector: 'app-search-filter-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-search"></i>
        Search & Filter Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          Use the search box and filters below to narrow down results in real-time.
        </div>

        <div class="filter-panel">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange()"
              placeholder="Search by name, email, or department..."
              class="search-input">
            @if (searchTerm) {
              <button class="clear-btn" (click)="clearSearch()">
                <i class="fas fa-times"></i>
              </button>
            }
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label>Department</label>
              <select [(ngModel)]="filters.department" (change)="applyFilters()" class="filter-select">
                <option value="">All Departments</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Role</label>
              <select [(ngModel)]="filters.role" (change)="applyFilters()" class="filter-select">
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Status</label>
              <select [(ngModel)]="filters.status" (change)="applyFilters()" class="filter-select">
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Salary Range</label>
              <select [(ngModel)]="filters.salaryRange" (change)="applyFilters()" class="filter-select">
                <option value="">Any Salary</option>
                <option value="0-50000">Under $50k</option>
                <option value="50000-100000">$50k - $100k</option>
                <option value="100000+">Over $100k</option>
              </select>
            </div>

            <button class="reset-filters-btn" (click)="resetFilters()">
              <i class="fas fa-undo"></i> Reset Filters
            </button>
          </div>
        </div>

        <div class="results-info">
          <span class="results-count">
            Showing <strong>{{ filteredRows.length }}</strong> of <strong>{{ allRows.length }}</strong> records
          </span>
          @if (hasActiveFilters()) {
            <span class="active-filters">
              <i class="fas fa-filter"></i> {{ getActiveFilterCount() }} filters active
            </span>
          }
        </div>

        <div class="datatable-container">
          @if (isReady) {
            <ngxsmk-datatable
              [columns]="columns"
              [rows]="filteredRows"
              [pagination]="paginationConfig">
              
              <ng-template #departmentTemplate let-row="row" let-value="value">
                <span [class]="'dept-badge dept-' + value.toLowerCase()">
                  {{ value }}
                </span>
              </ng-template>

              <ng-template #statusTemplate let-row="row" let-value="value">
                <span [class]="'status-badge status-' + value.toLowerCase()">
                  {{ value }}
                </span>
              </ng-template>

              <ng-template #salaryTemplate let-row="row" let-value="value">
                <span class="salary-value">
                  {{ value | currency:'USD':'symbol':'1.0-0' }}
                </span>
              </ng-template>
            </ngxsmk-datatable>
          }
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

    .filter-panel {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .search-box {
      position: relative;
      margin-bottom: 20px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-size: 16px;
    }

    .search-input {
      width: 100%;
      padding: 14px 48px 14px 48px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .clear-btn:hover {
      background: #dc2626;
      transform: translateY(-50%) scale(1.1);
    }

    .filter-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .filter-select {
      padding: 10px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
      color: #1f2937;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-select:hover {
      border-color: #3b82f6;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .reset-filters-btn {
      padding: 10px 16px;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .reset-filters-btn:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }

    .results-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .results-count {
      color: #374151;
    }

    .results-count strong {
      color: #3b82f6;
      font-weight: 700;
    }

    .active-filters {
      color: #059669;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .datatable-container {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      height: 600px;
    }

    .dept-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .dept-it {
      background: #dbeafe;
      color: #1e40af;
    }

    .dept-hr {
      background: #fce7f3;
      color: #9f1239;
    }

    .dept-sales {
      background: #d1fae5;
      color: #065f46;
    }

    .dept-marketing {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
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

    .salary-value {
      font-weight: 600;
      color: #059669;
    }
  `]
})
export class SearchFilterDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('departmentTemplate') departmentTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('salaryTemplate') salaryTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  allRows: NgxsmkRow[] = [];
  filteredRows: NgxsmkRow[] = [];
  isReady = false;

  searchTerm = '';
  filters = {
    department: '',
    role: '',
    status: '',
    salaryRange: ''
  };

  paginationConfig: PaginationConfig = {
    pageSize: 10,
    totalItems: 0,
    currentPage: 1,
    maxSize: 5,
    pageSizeOptions: [10, 25, 50, 100],
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
      { id: 'name', name: 'Name', prop: 'name', width: 180, sortable: true },
      { id: 'email', name: 'Email', prop: 'email', width: 220, sortable: true },
      { 
        id: 'department', 
        name: 'Department', 
        prop: 'department', 
        width: 150, 
        sortable: true,
        cellTemplate: this.departmentTemplate
      },
      { id: 'role', name: 'Role', prop: 'role', width: 120, sortable: true },
      { 
        id: 'status', 
        name: 'Status', 
        prop: 'status', 
        width: 120, 
        sortable: true,
        cellTemplate: this.statusTemplate
      },
      { 
        id: 'salary', 
        name: 'Salary', 
        prop: 'salary', 
        width: 120, 
        sortable: true,
        cellTemplate: this.salaryTemplate
      }
    ];
  }

  loadData() {
    this.allRows = this.generateMockData(200);
    this.filteredRows = [...this.allRows];
    this.paginationConfig.totalItems = this.filteredRows.length;
  }

  generateMockData(count: number): NgxsmkRow[] {
    const departments = ['IT', 'HR', 'Sales', 'Marketing'];
    const roles = ['Admin', 'User', 'Manager'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      salary: Math.floor(Math.random() * 120000) + 30000
    }));
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    const filtered = this.allRows.filter(row => {
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const matchesSearch = 
          row['name'].toString().toLowerCase().includes(searchLower) ||
          row['email'].toString().toLowerCase().includes(searchLower) ||
          row['department'].toString().toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Department filter
      if (this.filters.department && row['department'] !== this.filters.department) {
        return false;
      }

      // Role filter
      if (this.filters.role && row['role'] !== this.filters.role) {
        return false;
      }

      // Status filter
      if (this.filters.status && row['status'] !== this.filters.status) {
        return false;
      }

      // Salary range filter
      if (this.filters.salaryRange) {
        const salary = row['salary'] as number;
        if (this.filters.salaryRange === '0-50000' && salary >= 50000) return false;
        if (this.filters.salaryRange === '50000-100000' && (salary < 50000 || salary >= 100000)) return false;
        if (this.filters.salaryRange === '100000+' && salary < 100000) return false;
      }

      return true;
    });

    // Create a new array reference to trigger change detection
    this.filteredRows = [...filtered];
    
    // Update pagination config
    this.paginationConfig = {
      ...this.paginationConfig,
      totalItems: this.filteredRows.length,
      currentPage: 1
    };
    
    this.cdr.detectChanges();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filters = {
      department: '',
      role: '',
      status: '',
      salaryRange: ''
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || 
             this.filters.department || 
             this.filters.role || 
             this.filters.status || 
             this.filters.salaryRange);
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.filters.department) count++;
    if (this.filters.role) count++;
    if (this.filters.status) count++;
    if (this.filters.salaryRange) count++;
    return count;
  }
}

