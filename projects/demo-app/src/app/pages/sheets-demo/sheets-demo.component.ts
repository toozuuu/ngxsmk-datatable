import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheetsService, Sheet, SheetsConfig } from 'ngxsmk-datatable';
import { Subject, takeUntil } from 'rxjs';

interface NgxsmkColumn {
  field: string;
  header: string;
  width?: number;
  sortable?: boolean;
}

@Component({
  selector: 'app-sheets-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-layer-group"></i>
        <div class="header-content">
          <h1 class="header-title">📑 Multiple Sheets</h1>
          <p class="header-description">
            Excel-like tabs for organizing data across multiple sheets
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Multiple Sheets Features:</strong>
            Organize data in multiple tabs, switch between sheets, cross-sheet formulas, 
            sheet protection, and Excel-like sheet management.
          </div>
        </div>

        <!-- Sheet Tabs -->
        <div class="card">
          <div class="card-header" style="padding: 0;">
            <div class="sheet-tabs-container">
              <div class="sheet-tabs">
                <div class="sheet-tab" 
                     *ngFor="let sheet of sheets" 
                     [class.active]="activeSheet === sheet.id"
                     [class.protected]="sheet.protected"
                     [style.border-bottom-color]="sheet.color"
                     (click)="switchSheet(sheet.id)">
                  <i [class]="sheet.icon"></i>
                  <span>{{ sheet.name }}</span>
                  <i *ngIf="sheet.protected" class="fas fa-lock protection-icon" title="Protected Sheet"></i>
                  <span class="row-count">{{ getSheetRowCount(sheet.id) }}</span>
                  <button class="tab-close" *ngIf="sheets.length > 1 && !sheet.protected" 
                          (click)="removeSheet(sheet.id, $event)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button class="add-sheet-btn" (click)="addNewSheet()">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="sheet-actions">
                <button class="btn btn-sm" 
                        title="Duplicate Current Sheet" 
                        [disabled]="!activeSheet"
                        (click)="duplicateCurrentSheet()">
                  <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-sm" 
                        title="Rename Current Sheet" 
                        [disabled]="!activeSheet"
                        (click)="renameCurrentSheet()">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm" 
                        title="Toggle Sheet Protection" 
                        [disabled]="!activeSheet"
                        (click)="toggleSheetProtection()">
                  <i [class]="currentSheet?.protected ? 'fas fa-unlock' : 'fas fa-lock'"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <!-- Sales Sheet -->
            <div *ngIf="activeSheet === 'sales'">
              <div class="sheet-info">
                <h3><i class="fas fa-dollar-sign"></i> Sales Data</h3>
                <p>Q4 2024 Sales Performance Report</p>
              </div>
              <div class="demo-table">
                <table>
                  <thead>
                    <tr>
                      <th *ngFor="let col of salesColumns">{{ col.header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of salesData">
                      <td>{{ row.id }}</td>
                      <td>{{ row.product }}</td>
                      <td>{{ row.quantity }}</td>
                      <td>{{ row.price }}</td>
                      <td>{{ row.total }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Inventory Sheet -->
            <div *ngIf="activeSheet === 'inventory'">
              <div class="sheet-info">
                <h3><i class="fas fa-boxes"></i> Inventory Status</h3>
                <p>Current stock levels and reorder alerts</p>
              </div>
              <div class="demo-table">
                <table>
                  <thead>
                    <tr>
                      <th *ngFor="let col of inventoryColumns">{{ col.header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of inventoryData">
                      <td>{{ row.sku }}</td>
                      <td>{{ row.name }}</td>
                      <td>{{ row.stock }}</td>
                      <td>{{ row.reorder }}</td>
                      <td>{{ row.status }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Customers Sheet -->
            <div *ngIf="activeSheet === 'customers'">
              <div class="sheet-info">
                <h3><i class="fas fa-users"></i> Customer Directory</h3>
                <p>Active customers and contact information</p>
              </div>
              <div class="demo-table">
                <table>
                  <thead>
                    <tr>
                      <th *ngFor="let col of customersColumns">{{ col.header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of customersData">
                      <td>{{ row.id }}</td>
                      <td>{{ row.name }}</td>
                      <td>{{ row.email }}</td>
                      <td>{{ row.company }}</td>
                      <td>{{ row.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Analytics Sheet -->
            <div *ngIf="activeSheet === 'analytics'">
              <div class="sheet-info">
                <h3><i class="fas fa-chart-pie"></i> Analytics Dashboard</h3>
                <p>Key metrics and performance indicators</p>
              </div>
              <div class="analytics-grid">
                <div class="metric-card" *ngFor="let metric of analyticsMetrics">
                  <div class="metric-icon" [style.background]="metric.color">
                    <i [class]="metric.icon"></i>
                  </div>
                  <div class="metric-content">
                    <span class="metric-label">{{ metric.label }}</span>
                    <span class="metric-value">{{ metric.value }}</span>
                    <span class="metric-change" [class.positive]="metric.change > 0" 
                          [class.negative]="metric.change < 0">
                      <i [class]="metric.change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ Math.abs(metric.change) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sheet Features -->
        <div class="features-grid mt-4">
          <div class="feature-card">
            <i class="fas fa-plus-circle feature-icon"></i>
            <h4>Add/Remove Sheets</h4>
            <p>Dynamically create and delete sheets</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-exchange-alt feature-icon"></i>
            <h4>Cross-Sheet Formulas</h4>
            <p>Reference data across different sheets</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-lock feature-icon"></i>
            <h4>Sheet Protection</h4>
            <p>Lock sheets to prevent modifications</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-copy feature-icon"></i>
            <h4>Duplicate Sheets</h4>
            <p>Clone sheets with data and formatting</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-eye-slash feature-icon"></i>
            <h4>Hide/Show Sheets</h4>
            <p>Toggle sheet visibility</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-palette feature-icon"></i>
            <h4>Sheet Colors</h4>
            <p>Color-code tabs for organization</p>
          </div>
        </div>

        <!-- Configuration Example -->
        <div class="card mt-4">
          <div class="card-header">
            <h3><i class="fas fa-code"></i> Implementation Example</h3>
          </div>
          <div class="card-body">
            <pre><code>import &#123; SheetsService &#125; from 'ngxsmk-datatable';

// Configure multiple sheets
&lt;ngxsmk-datatable
  [multiSheet]="&#123;
    enabled: true,
    sheets: [
      &#123;
        id: 'sales',
        name: 'Sales Data',
        data: salesData,
        columns: salesColumns,
        icon: 'fas fa-dollar-sign'
      &#125;,
      &#123;
        id: 'inventory',
        name: 'Inventory',
        data: inventoryData,
        columns: inventoryColumns,
        icon: 'fas fa-boxes',
        protected: true
      &#125;
    ],
    allowAdd: true,
    allowRemove: true,
    allowRename: true
  &#125;"&gt;
&lt;/ngxsmk-datatable&gt;

// Programmatic sheet management
constructor(private sheetsService: SheetsService) &#123;&#125;

// Add new sheet
addSheet() &#123;
  this.sheetsService.addSheet(&#123;
    id: 'new-sheet',
    name: 'New Sheet',
    data: [],
    columns: []
  &#125;);
&#125;

// Switch to sheet
switchSheet(sheetId: string) &#123;
  this.sheetsService.setActiveSheet(sheetId);
&#125;

// Get sheet
getSheet(sheetId: string) &#123;
  return this.sheetsService.getSheet(sheetId);
&#125;

// Duplicate sheet
duplicateSheet(sheetId: string) &#123;
  this.sheetsService.duplicateSheet(sheetId);
&#125;

// Rename sheet
renameSheet(sheetId: string, newName: string) &#123;
  this.sheetsService.renameSheet(sheetId, newName);
&#125;</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sheet-tabs-container {
      display: flex;
      align-items: center;
      border-bottom: 2px solid #e5e7eb;
      background: #f8f9fa;
      min-height: 52px;
    }

    .sheet-tabs {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px;
      overflow-x: auto;
    }

    .sheet-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-bottom: none;
      border-radius: 6px 6px 0 0;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      height: 36px;
    }

    .sheet-tab:hover {
      background: #f9fafb;
    }

    .sheet-tab.active {
      background: white;
      border-bottom: 3px solid #3b82f6;
      font-weight: 600;
      color: #3b82f6;
    }

    .sheet-tab.protected {
      background: #fef3c7;
      border-left: 3px solid #f59e0b;
    }

    .sheet-tab.protected.active {
      background: #fef3c7;
      border-bottom: 3px solid #f59e0b;
    }

    .protection-icon {
      font-size: 11px;
      color: #f59e0b;
      line-height: 1;
    }

    .sheet-tab i {
      line-height: 1;
    }

    .row-count {
      font-size: 11px;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 10px;
      color: #6b7280;
    }

    .tab-close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      width: 20px;
      height: 20px;
    }

    .tab-close:hover {
      background: #fee2e2;
      color: #ef4444;
    }

    .add-sheet-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      color: #6b7280;
      padding: 0;
    }

    .add-sheet-btn i {
      font-size: 14px;
    }

    .add-sheet-btn:hover {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .sheet-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      color: #6b7280;
      width: 36px;
      height: 36px;
    }

    .btn i {
      font-size: 14px;
    }

    .btn:hover:not(:disabled) {
      background: #f3f4f6;
      color: #3b82f6;
      border-color: #3b82f6;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn.btn-sm {
      padding: 6px 10px;
      font-size: 14px;
    }

    .btn.btn-sm i {
      font-size: 14px;
    }

    .sheet-info {
      margin-bottom: 24px;
    }

    .sheet-info h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sheet-info p {
      margin: 0;
      color: #6b7280;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .metric-card {
      display: flex;
      gap: 16px;
      padding: 24px;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.2s;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .metric-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      flex-shrink: 0;
    }

    .metric-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label {
      font-size: 13px;
      color: #6b7280;
      font-weight: 500;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
    }

    .metric-change {
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .metric-change.positive {
      color: #10b981;
    }

    .metric-change.negative {
      color: #ef4444;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .feature-card {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
      text-align: center;
    }

    .feature-icon {
      font-size: 36px;
      color: #3b82f6;
      margin-bottom: 12px;
    }

    .feature-card h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .feature-card p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }

    pre {
      background: #1f2937;
      color: #10b981;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 0;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
    }
  `]
})
export class SheetsDemoComponent implements OnInit, OnDestroy {
  Math = Math;
  activeSheet = 'sales';
  private destroy$ = new Subject<void>();

  sheets: Sheet[] = [];
  currentSheet: Sheet | null = null;

  salesColumns: NgxsmkColumn[] = [
    { field: 'id', header: 'Order ID', width: 100 },
    { field: 'product', header: 'Product', sortable: true },
    { field: 'quantity', header: 'Quantity', sortable: true },
    { field: 'price', header: 'Price', sortable: true },
    { field: 'total', header: 'Total', sortable: true }
  ];

  salesData = [
    { id: 'ORD-001', product: 'Laptop Pro', quantity: 2, price: '$1,299', total: '$2,598' },
    { id: 'ORD-002', product: 'Wireless Mouse', quantity: 5, price: '$29', total: '$145' },
    { id: 'ORD-003', product: 'Monitor 4K', quantity: 1, price: '$449', total: '$449' },
    { id: 'ORD-004', product: 'Keyboard RGB', quantity: 3, price: '$79', total: '$237' }
  ];

  inventoryColumns: NgxsmkColumn[] = [
    { field: 'sku', header: 'SKU', width: 120 },
    { field: 'name', header: 'Product Name', sortable: true },
    { field: 'stock', header: 'In Stock', sortable: true },
    { field: 'reorder', header: 'Reorder Point', sortable: true },
    { field: 'status', header: 'Status', sortable: true }
  ];

  inventoryData = [
    { sku: 'LAP-001', name: 'Laptop Pro', stock: 45, reorder: 20, status: 'In Stock' },
    { sku: 'MOU-002', name: 'Wireless Mouse', stock: 120, reorder: 50, status: 'In Stock' },
    { sku: 'MON-003', name: 'Monitor 4K', stock: 15, reorder: 25, status: 'Low Stock' },
    { sku: 'KEY-004', name: 'Keyboard RGB', stock: 85, reorder: 30, status: 'In Stock' }
  ];

  customersColumns: NgxsmkColumn[] = [
    { field: 'id', header: 'ID', width: 80 },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'company', header: 'Company', sortable: true },
    { field: 'value', header: 'Lifetime Value', sortable: true }
  ];

  customersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Acme Corp', value: '$12,500' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'Tech Inc', value: '$8,900' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', company: 'StartupXYZ', value: '$15,200' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', company: 'Global Ltd', value: '$22,100' }
  ];

  analyticsMetrics = [
    { label: 'Total Revenue', value: '$245K', change: 12.5, icon: 'fas fa-dollar-sign', color: '#10b981' },
    { label: 'Orders', value: '1,234', change: 8.3, icon: 'fas fa-shopping-cart', color: '#3b82f6' },
    { label: 'Customers', value: '892', change: 15.7, icon: 'fas fa-users', color: '#f59e0b' },
    { label: 'Avg Order Value', value: '$198', change: -2.1, icon: 'fas fa-receipt', color: '#ef4444' },
    { label: 'Conversion Rate', value: '3.2%', change: 5.4, icon: 'fas fa-percentage', color: '#8b5cf6' },
    { label: 'Customer Satisfaction', value: '4.8/5', change: 3.1, icon: 'fas fa-star', color: '#ec4899' }
  ];

  constructor(private sheetsService: SheetsService) {}

  ngOnInit() {
    // Initialize sheets configuration
    const sheetsConfig: SheetsConfig = {
      enabled: true,
      sheets: [
        {
          id: 'sales',
          name: 'Sales',
          data: this.salesData,
          columns: this.salesColumns,
          color: '#3b82f6',
          icon: 'fas fa-dollar-sign',
          visible: true,
          protected: false
        },
        {
          id: 'inventory',
          name: 'Inventory',
          data: this.inventoryData,
          columns: this.inventoryColumns,
          color: '#10b981',
          icon: 'fas fa-boxes',
          visible: true,
          protected: false
        },
        {
          id: 'customers',
          name: 'Customers',
          data: this.customersData,
          columns: this.customersColumns,
          color: '#f59e0b',
          icon: 'fas fa-users',
          visible: true,
          protected: false
        },
        {
          id: 'analytics',
          name: 'Analytics',
          data: [],
          columns: [],
          color: '#8b5cf6',
          icon: 'fas fa-chart-pie',
          visible: true,
          protected: false
        }
      ],
      activeSheetId: 'sales',
      showTabs: true,
      tabPosition: 'bottom',
      allowAdd: true,
      allowDelete: true,
      allowRename: true,
      allowReorder: true,
      allowDuplicate: true,
      maxSheets: 10,
      showSheetCount: true
    };

    // Initialize the service
    this.sheetsService.initialize(sheetsConfig);

    // Subscribe to sheets changes
    this.sheetsService.sheets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sheets => {
        this.sheets = sheets;
      });

    // Subscribe to active sheet changes
    this.sheetsService.activeSheet$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sheet => {
        this.currentSheet = sheet;
        if (sheet) {
          this.activeSheet = sheet.id;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNewSheet() {
    try {
      const newSheet = this.sheetsService.addSheet({
        name: `Sheet ${this.sheets.length + 1}`,
        data: [],
        columns: [],
        icon: 'fas fa-table',
        color: '#6366f1'
      });
      this.activeSheet = newSheet.id;
      this.sheetsService.setActiveSheet(newSheet.id);
    } catch (error) {
      console.error('Error adding sheet:', error);
      alert(error instanceof Error ? error.message : 'Failed to add sheet');
    }
  }

  removeSheet(id: string, event: Event) {
    event.stopPropagation();
    try {
      if (this.sheets.length > 1) {
        this.sheetsService.deleteSheet(id);
      } else {
        alert('Cannot delete the last sheet');
      }
    } catch (error) {
      console.error('Error deleting sheet:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete sheet');
    }
  }

  switchSheet(sheetId: string) {
    try {
      this.sheetsService.setActiveSheet(sheetId);
    } catch (error) {
      console.error('Error switching sheet:', error);
    }
  }

  getSheetRowCount(sheetId: string): number {
    const sheet = this.sheets.find(s => s.id === sheetId);
    return sheet ? sheet.data.length : 0;
  }

  duplicateCurrentSheet() {
    if (!this.activeSheet) return;
    
    try {
      const duplicatedSheet = this.sheetsService.duplicateSheet(this.activeSheet);
      this.sheetsService.setActiveSheet(duplicatedSheet.id);
    } catch (error) {
      console.error('Error duplicating sheet:', error);
      alert(error instanceof Error ? error.message : 'Failed to duplicate sheet');
    }
  }

  renameCurrentSheet() {
    if (!this.activeSheet) return;
    
    const currentSheet = this.sheetsService.getSheet(this.activeSheet);
    if (!currentSheet) return;

    const newName = prompt('Enter new sheet name:', currentSheet.name);
    if (newName && newName.trim() && newName !== currentSheet.name) {
      try {
        this.sheetsService.renameSheet(this.activeSheet, newName.trim());
      } catch (error) {
        console.error('Error renaming sheet:', error);
        alert(error instanceof Error ? error.message : 'Failed to rename sheet');
      }
    }
  }

  toggleSheetProtection() {
    if (!this.activeSheet) return;
    
    const currentSheet = this.sheetsService.getSheet(this.activeSheet);
    if (!currentSheet) return;

    try {
      if (currentSheet.protected) {
        this.sheetsService.unprotectSheet(this.activeSheet);
      } else {
        this.sheetsService.protectSheet(this.activeSheet);
      }
    } catch (error) {
      console.error('Error toggling sheet protection:', error);
      alert(error instanceof Error ? error.message : 'Failed to toggle protection');
    }
  }
}

