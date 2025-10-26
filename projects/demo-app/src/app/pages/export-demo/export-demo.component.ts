import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent } from 'ngxsmk-datatable';
import type { NgxsmkColumn, NgxsmkRow, PaginationConfig } from 'ngxsmk-datatable';

interface Employee extends NgxsmkRow {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: Date;
  status: 'active' | 'on-leave' | 'inactive';
  performance: number;
}

@Component({
  selector: 'app-export-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <div class="header-content">
          <h1>📊 Export Data Demo</h1>
          <p class="subtitle">Export your data to CSV, Excel, JSON, or print-friendly format</p>
        </div>
        
        <div class="export-actions">
          <button class="export-btn csv" (click)="exportToCSV()" title="Export to CSV">
            <i class="fas fa-file-csv"></i>
            <span>CSV</span>
          </button>
          <button class="export-btn excel" (click)="exportToExcel()" title="Export to Excel">
            <i class="fas fa-file-excel"></i>
            <span>Excel</span>
          </button>
          <button class="export-btn json" (click)="exportToJSON()" title="Export to JSON">
            <i class="fas fa-file-code"></i>
            <span>JSON</span>
          </button>
          <button class="export-btn print" (click)="printTable()" title="Print">
            <i class="fas fa-print"></i>
            <span>Print</span>
          </button>
          <button class="export-btn pdf" (click)="exportToPDF()" title="Export to PDF (simulated)">
            <i class="fas fa-file-pdf"></i>
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div class="export-options">
        <div class="option-group">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="exportOptions.includeHeaders" />
            <span>Include Headers</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="exportOptions.selectedOnly" />
            <span>Selected Rows Only ({{selectedRows.length}} selected)</span>
          </label>
        </div>
        
        <div class="option-group">
          <label>
            Date Format:
            <select [(ngModel)]="exportOptions.dateFormat" class="format-select">
              <option value="iso">ISO (2024-10-25)</option>
              <option value="us">US (10/25/2024)</option>
              <option value="eu">EU (25/10/2024)</option>
              <option value="full">Full (October 25, 2024)</option>
            </select>
          </label>
          
          <label>
            Number Format:
            <select [(ngModel)]="exportOptions.numberFormat" class="format-select">
              <option value="default">Default (123456.78)</option>
              <option value="comma">Comma (123,456.78)</option>
              <option value="currency">Currency ($123,456.78)</option>
            </select>
          </label>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <i class="fas fa-table"></i>
          <span>Total Rows: <strong>{{rows.length}}</strong></span>
        </div>
        <div class="stat-item">
          <i class="fas fa-check-square"></i>
          <span>Selected: <strong>{{selectedRows.length}}</strong></span>
        </div>
        <div class="stat-item">
          <i class="fas fa-columns"></i>
          <span>Columns: <strong>{{columns.length}}</strong></span>
        </div>
        <div class="stat-item" *ngIf="lastExport">
          <i class="fas fa-clock"></i>
          <span>Last Export: <strong>{{lastExport}}</strong></span>
        </div>
      </div>

      <!-- Templates (must be defined before datatable) -->
      <ng-template #statusTemplate let-row="row" let-value="value">
        <span class="status-badge" [class]="'status-' + value">
          {{value}}
        </span>
      </ng-template>

      <ng-template #salaryTemplate let-row="row" let-value="value">
        <span class="salary">
          {{ '$' + formatNumber(value) }}
        </span>
      </ng-template>

      <ng-template #performanceTemplate let-row="row" let-value="value">
        <div class="performance-bar">
          <div class="bar-fill" [style.width.%]="value"></div>
          <span class="bar-text">{{value}}%</span>
        </div>
      </ng-template>

      @if (!isReady) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading data...</p>
        </div>
      } @else {
        <div class="datatable-container">
          <ngxsmk-datatable
            [columns]="columns"
            [rows]="rows"
            [pagination]="paginationConfig"
            [selectionType]="'checkbox'"
            [virtualScrolling]="false"
            (select)="onSelect($event)"
            (sort)="onSort($event)"
            (page)="onPage($event)">
          </ngxsmk-datatable>
        </div>
      }

      @if (exportPreview) {
        <div class="export-preview-modal" (click)="closePreview()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Export Preview</h3>
              <button class="close-btn" (click)="closePreview()">×</button>
            </div>
            <div class="modal-body">
              <pre>{{exportPreview}}</pre>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closePreview()">Close</button>
              <button class="btn-primary" (click)="copyToClipboard()">
                <i class="fas fa-copy"></i> Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 30px;
      max-width: 1600px;
      margin: 0 auto;
    }

    .demo-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      gap: 30px;
    }

    .header-content h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .subtitle {
      font-size: 16px;
      margin: 0;
    }

    .export-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: white;
    }

    .export-btn i {
      font-size: 18px;
    }

    .export-btn.csv {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .export-btn.csv:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }

    .export-btn.excel {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }

    .export-btn.excel:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
    }

    .export-btn.json {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .export-btn.json:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .export-btn.print {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    }

    .export-btn.print:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }

    .export-btn.pdf {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .export-btn.pdf:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .export-options {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .option-group {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .option-group:last-child {
      margin-bottom: 0;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #374151;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .format-select {
      margin-left: 8px;
      padding: 6px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      cursor: pointer;
    }

    .stats-bar {
      display: flex;
      gap: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      margin-bottom: 20px;
      color: white;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .stat-item i {
      font-size: 18px;
      opacity: 0.9;
    }

    .stat-item strong {
      font-weight: 700;
    }

    .datatable-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      height: 600px;
    }

    .datatable-container ::ng-deep ngxsmk-datatable {
      height: 100%;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-state p {
      margin-top: 20px;
      font-size: 16px;
      color: #6b7280;
    }

    /* Status badges */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-on-leave {
      background: #fef3c7;
      color: #92400e;
    }

    .status-inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Salary */
    .salary {
      font-weight: 600;
      color: #059669;
    }

    /* Performance bar */
    .performance-bar {
      position: relative;
      width: 100%;
      height: 24px;
      background: #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .bar-fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      transition: width 0.3s;
    }

    .bar-text {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
      z-index: 1;
    }

    /* Export preview modal */
    .export-preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #f3f4f6;
      border-radius: 8px;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .modal-body {
      padding: 30px;
      overflow: auto;
      flex: 1;
    }

    .modal-body pre {
      margin: 0;
      padding: 20px;
      background: #1f2937;
      border: 1px solid #374151;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.6;
      overflow: auto;
      max-height: 400px;
      color: #f3f4f6;
      font-family: 'Courier New', 'Consolas', monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 30px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary, .btn-primary {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
  `]
})
export class ExportDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('statusTemplate', { static: false }) statusTemplate!: TemplateRef<any>;
  @ViewChild('salaryTemplate', { static: false }) salaryTemplate!: TemplateRef<any>;
  @ViewChild('performanceTemplate', { static: false }) performanceTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: Employee[] = [];
  selectedRows: Employee[] = [];
  isReady = false;
  exportPreview: string | null = null;
  lastExport: string | null = null;

  exportOptions = {
    includeHeaders: true,
    selectedOnly: false,
    dateFormat: 'iso' as 'iso' | 'us' | 'eu' | 'full',
    numberFormat: 'comma' as 'default' | 'comma' | 'currency'
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeColumns();
      this.loadData();
      this.isReady = true;
      this.cdr.detectChanges();
    });
  }

  initializeColumns(): void {
    this.columns = [
      {
        id: 'id',
        name: 'ID',
        prop: 'id',
        width: 80,
        sortable: true,
        resizable: true
      },
      {
        id: 'name',
        name: 'Name',
        prop: 'name',
        width: 200,
        sortable: true,
        resizable: true,
        flexGrow: 1
      },
      {
        id: 'email',
        name: 'Email',
        prop: 'email',
        width: 250,
        sortable: true,
        resizable: true,
        flexGrow: 1
      },
      {
        id: 'department',
        name: 'Department',
        prop: 'department',
        width: 150,
        sortable: true,
        resizable: true
      },
      {
        id: 'position',
        name: 'Position',
        prop: 'position',
        width: 180,
        sortable: true,
        resizable: true
      },
      {
        id: 'salary',
        name: 'Salary',
        prop: 'salary',
        width: 140,
        sortable: true,
        resizable: true,
        cellTemplate: this.salaryTemplate
      },
      {
        id: 'joinDate',
        name: 'Join Date',
        prop: 'joinDate',
        width: 140,
        sortable: true,
        resizable: true
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        width: 120,
        sortable: true,
        resizable: true,
        cellTemplate: this.statusTemplate
      },
      {
        id: 'performance',
        name: 'Performance',
        prop: 'performance',
        width: 150,
        sortable: true,
        resizable: true,
        cellTemplate: this.performanceTemplate
      }
    ];
  }

  loadData(): void {
    this.rows = this.generateMockData(100);
    this.paginationConfig = {
      ...this.paginationConfig,
      totalItems: this.rows.length
    };
    this.cdr.detectChanges();
  }

  generateMockData(count: number): Employee[] {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
    const positions = ['Manager', 'Senior', 'Junior', 'Lead', 'Director', 'Specialist'];
    const statuses: ('active' | 'on-leave' | 'inactive')[] = ['active', 'on-leave', 'inactive'];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      email: `user${i + 1}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      salary: Math.floor(Math.random() * 100000) + 40000,
      joinDate: new Date(2018 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      performance: Math.floor(Math.random() * 40) + 60
    }));
  }

  onSelect(event: any): void {
    this.selectedRows = event.selected || [];
  }

  onSort(event: any): void {
    console.log('Sort event:', event);
  }

  onPage(event: any): void {
    console.log('Page event:', event);
  }

  formatNumber(value: number): string {
    return value.toLocaleString('en-US');
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    switch (this.exportOptions.dateFormat) {
      case 'iso':
        return d.toISOString().split('T')[0];
      case 'us':
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      case 'eu':
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      case 'full':
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      default:
        return d.toISOString().split('T')[0];
    }
  }

  formatNumberForExport(value: number): string {
    switch (this.exportOptions.numberFormat) {
      case 'comma':
        return value.toLocaleString('en-US');
      case 'currency':
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return value.toString();
    }
  }

  getDataForExport(): any[] {
    return this.exportOptions.selectedOnly && this.selectedRows.length > 0
      ? this.selectedRows
      : this.rows;
  }

  exportToCSV(): void {
    const data = this.getDataForExport();
    const columns = this.columns;

    let csv = '';

    // Add headers
    if (this.exportOptions.includeHeaders) {
      csv += columns.map(col => `"${col.name}"`).join(',') + '\n';
    }

    // Add data rows
    data.forEach(row => {
      const rowData = columns.map(col => {
        let value = row[col.prop as keyof Employee];
        
        if (value instanceof Date) {
          value = this.formatDate(value) as any;
        } else if (typeof value === 'number' && col.id === 'salary') {
          value = this.formatNumberForExport(value) as any;
        }
        
        return `"${value}"`;
      });
      csv += rowData.join(',') + '\n';
    });

    this.downloadFile(csv, 'export.csv', 'text/csv');
    this.lastExport = 'CSV - ' + new Date().toLocaleTimeString();
  }

  exportToExcel(): void {
    // Simulated Excel export (in real app, use a library like xlsx)
    const data = this.getDataForExport();
    const columns = this.columns;

    let content = '<?xml version="1.0"?>\n';
    content += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">\n';
    content += '<Worksheet ss:Name="Sheet1">\n';
    content += '<Table>\n';

    // Headers
    if (this.exportOptions.includeHeaders) {
      content += '<Row>\n';
      columns.forEach(col => {
        content += `<Cell><Data ss:Type="String">${col.name}</Data></Cell>\n`;
      });
      content += '</Row>\n';
    }

    // Data
    data.forEach(row => {
      content += '<Row>\n';
      columns.forEach(col => {
        let value = row[col.prop as keyof Employee];
        let type = 'String';
        
        if (value instanceof Date) {
          value = this.formatDate(value) as any;
        } else if (typeof value === 'number') {
          type = 'Number';
          if (col.id === 'salary') {
            value = this.formatNumberForExport(value) as any;
            type = 'String';
          }
        }
        
        content += `<Cell><Data ss:Type="${type}">${value}</Data></Cell>\n`;
      });
      content += '</Row>\n';
    });

    content += '</Table>\n</Worksheet>\n</Workbook>';

    this.downloadFile(content, 'export.xls', 'application/vnd.ms-excel');
    this.lastExport = 'Excel - ' + new Date().toLocaleTimeString();
  }

  exportToJSON(): void {
    const data = this.getDataForExport();
    const columns = this.columns;

    const exportData = data.map(row => {
      const obj: any = {};
      columns.forEach(col => {
        if (!col.prop) return;
        
        let value = row[col.prop as keyof Employee];
        
        if (value instanceof Date) {
          value = this.formatDate(value) as any;
        } else if (typeof value === 'number' && col.id === 'salary') {
          value = this.formatNumberForExport(value) as any;
        }
        
        obj[col.prop] = value;
      });
      return obj;
    });

    const json = JSON.stringify(exportData, null, 2);
    this.exportPreview = json;
    this.lastExport = 'JSON - ' + new Date().toLocaleTimeString();
  }

  printTable(): void {
    const data = this.getDataForExport();
    const columns = this.columns;

    let html = `
      <html>
        <head>
          <title>Print - Employee Data</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: 600; }
            tr:nth-child(even) { background-color: #f9fafb; }
            @media print {
              body { padding: 0; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <h1>Employee Data Export</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
    `;

    if (this.exportOptions.includeHeaders) {
      html += '<thead><tr>';
      columns.forEach(col => {
        html += `<th>${col.name}</th>`;
      });
      html += '</tr></thead>';
    }

    html += '<tbody>';
    data.forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        let value = row[col.prop as keyof Employee];
        
        if (value instanceof Date) {
          value = this.formatDate(value) as any;
        } else if (typeof value === 'number' && col.id === 'salary') {
          value = this.formatNumberForExport(value) as any;
        }
        
        html += `<td>${value}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></body></html>';

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }

    this.lastExport = 'Print - ' + new Date().toLocaleTimeString();
  }

  exportToPDF(): void {
    alert('PDF export would require a library like jsPDF or pdfmake.\n\nThis is a simulated demo showing how the feature would work.');
    this.lastExport = 'PDF (simulated) - ' + new Date().toLocaleTimeString();
  }

  closePreview(): void {
    this.exportPreview = null;
  }

  copyToClipboard(): void {
    if (this.exportPreview) {
      navigator.clipboard.writeText(this.exportPreview).then(() => {
        alert('Copied to clipboard!');
        this.closePreview();
      });
    }
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

