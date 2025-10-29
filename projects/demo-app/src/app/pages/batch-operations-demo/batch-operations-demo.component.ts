import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NgxsmkColumn {
  field: string;
  header: string;
  width?: number;
  sortable?: boolean;
}

@Component({
  selector: 'app-batch-operations-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-tasks"></i>
        <div class="header-content">
          <h1 class="header-title">⚡ Batch Operations</h1>
          <p class="header-description">
            Bulk edit, delete, and transform multiple rows efficiently
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Batch Operations Features:</strong>
            Perform bulk operations on selected rows including edit, delete, export, 
            status updates, and custom transformations.
          </div>
        </div>

        <!-- Batch Actions Toolbar -->
        <div class="batch-toolbar" *ngIf="selectedRows.length > 0">
          <div class="selection-info">
            <i class="fas fa-check-circle"></i>
            <span><strong>{{ selectedRows.length }}</strong> rows selected</span>
          </div>
          <div class="batch-actions">
            <button class="btn btn-primary" (click)="showBatchEdit = true">
              <i class="fas fa-edit"></i> Batch Edit
            </button>
            <button class="btn btn-warning" (click)="batchUpdateStatus()">
              <i class="fas fa-sync"></i> Update Status
            </button>
            <button class="btn btn-success" (click)="batchExport()">
              <i class="fas fa-download"></i> Export Selected
            </button>
            <button class="btn btn-danger" (click)="batchDelete()">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-table"></i> Product Inventory</h3>
            <div class="toolbar-actions">
              <button class="btn btn-sm" (click)="selectAll()">
                <i class="fas fa-check-double"></i> Select All
              </button>
              <button class="btn btn-sm" (click)="clearSelection()">
                <i class="fas fa-times"></i> Clear Selection
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="demo-table">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" (change)="selectAll()"></th>
                    <th *ngFor="let col of columns">{{ col.header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of data">
                    <td><input type="checkbox"></td>
                    <td>{{ row.id }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.category }}</td>
                    <td>{{ row.price }}</td>
                    <td>{{ row.stock }}</td>
                    <td>{{ row.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Batch Edit Modal -->
        <div class="modal" *ngIf="showBatchEdit" (click)="showBatchEdit = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3><i class="fas fa-edit"></i> Batch Edit {{ selectedRows.length }} Rows</h3>
              <button class="btn-close" (click)="showBatchEdit = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Field to Update</label>
                <select class="form-control">
                  <option>Price</option>
                  <option>Stock</option>
                  <option>Status</option>
                  <option>Category</option>
                </select>
              </div>
              <div class="form-group">
                <label>Update Type</label>
                <select class="form-control">
                  <option>Set Value</option>
                  <option>Increase by</option>
                  <option>Decrease by</option>
                  <option>Multiply by</option>
                </select>
              </div>
              <div class="form-group">
                <label>New Value</label>
                <input type="text" class="form-control" placeholder="Enter value">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="showBatchEdit = false">Cancel</button>
              <button class="btn btn-primary" (click)="applyBatchEdit()">Apply Changes</button>
            </div>
          </div>
        </div>

        <!-- Batch Operation History -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-history"></i> Operation History</h3>
          </div>
          <div class="card-body">
            <div class="history-timeline">
              <div class="history-item" *ngFor="let operation of operationHistory">
                <div class="history-icon" [class]="'icon-' + operation.type">
                  <i [class]="operation.icon"></i>
                </div>
                <div class="history-content">
                  <h4>{{ operation.title }}</h4>
                  <p>{{ operation.description }}</p>
                  <div class="history-meta">
                    <span><i class="fas fa-user"></i> {{ operation.user }}</span>
                    <span><i class="fas fa-clock"></i> {{ operation.time }}</span>
                    <span><i class="fas fa-database"></i> {{ operation.rowCount }} rows</span>
                  </div>
                </div>
                <button class="btn btn-sm btn-outline" *ngIf="operation.canUndo" 
                        (click)="undoOperation(operation)">
                  <i class="fas fa-undo"></i> Undo
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration Example -->
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-code"></i> Implementation Example</h3>
          </div>
          <div class="card-body">
            <pre><code>import {{ '{' }} BatchOperationsService {{ '}' }} from 'ngxsmk-datatable';

constructor(private batchOps: BatchOperationsService) {{ '{}' }}

// Batch edit selected rows
batchEdit() {{ '{' }}
  const selectedIds = this.getSelectedIds();
  
  this.batchOps.batchUpdate({{ '{' }}
    ids: selectedIds,
    updates: {{ '{' }}
      status: 'Active',
      lastModified: new Date()
    {{ '}' }},
    onProgress: (progress) => {{ '{' }}
      console.log(\`Progress: \${{ '{' }}progress{{ '}' }}%\`);
    {{ '}' }}
  {{ '}' }}).subscribe({{ '{' }}
    next: (result) => {{ '{' }}
      console.log(\`Updated \${{ '{' }}result.successCount{{ '}' }} rows\`);
    {{ '}' }},
    error: (err) => {{ '{' }}
      console.error('Batch update failed:', err);
    {{ '}' }}
  {{ '}' }});
{{ '}' }}

// Batch delete with confirmation
batchDelete() {{ '{' }}
  const selectedIds = this.getSelectedIds();
  
  if (confirm(\`Delete \${{ '{' }}selectedIds.length{{ '}' }} rows?\`)) {{ '{' }}
    this.batchOps.batchDelete({{ '{' }}
      ids: selectedIds,
      softDelete: true,
      createBackup: true
    {{ '}' }}).subscribe(() => {{ '{' }}
      this.refreshData();
    {{ '}' }});
  {{ '}' }}
{{ '}' }}

// Custom batch transformation
batchTransform() {{ '{' }}
  this.batchOps.batchTransform({{ '{' }}
    ids: this.getSelectedIds(),
    transform: (row) => ({{ '{' }}
      ...row,
      price: row.price * 1.1, // 10% increase
      updatedAt: new Date()
    {{ '}' }})
  {{ '}' }}).subscribe();
{{ '}' }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .batch-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      margin-bottom: 24px;
      animation: slideDown 0.3s;
    }

    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .selection-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
    }

    .batch-actions {
      display: flex;
      gap: 12px;
    }

    .toolbar-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: white;
      color: #3b82f6;
    }

    .btn-primary:hover {
      background: #f3f4f6;
    }

    .btn-warning {
      background: white;
      color: #f59e0b;
    }

    .btn-success {
      background: white;
      color: #10b981;
    }

    .btn-danger {
      background: white;
      color: #ef4444;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
      background: white;
      border: 1px solid #e5e7eb;
      color: #4b5563;
    }

    .btn-outline {
      background: white;
      border: 1px solid #e5e7eb;
      color: #4b5563;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      animation: slideUp 0.3s;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 20px;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
    }

    .modal-body {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #e5e7eb;
    }

    .history-timeline {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .history-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      align-items: flex-start;
    }

    .history-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .icon-edit { background: #3b82f6; }
    .icon-delete { background: #ef4444; }
    .icon-update { background: #10b981; }
    .icon-export { background: #f59e0b; }

    .history-content {
      flex: 1;
    }

    .history-content h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .history-content p {
      margin: 0 0 8px 0;
      color: #6b7280;
      font-size: 14px;
    }

    .history-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #9ca3af;
    }

    .history-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
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
export class BatchOperationsDemoComponent {
  showBatchEdit = false;
  selectedRows: any[] = [];

  columns: NgxsmkColumn[] = [
    { field: 'id', header: 'ID', width: 80 },
    { field: 'name', header: 'Product Name', sortable: true },
    { field: 'category', header: 'Category', sortable: true },
    { field: 'price', header: 'Price', sortable: true },
    { field: 'stock', header: 'Stock', sortable: true },
    { field: 'status', header: 'Status', sortable: true }
  ];

  data = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: '$1,299', stock: 45, status: 'Active' },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: '$29', stock: 120, status: 'Active' },
    { id: 3, name: 'Keyboard RGB', category: 'Accessories', price: '$79', stock: 85, status: 'Active' },
    { id: 4, name: 'Monitor 4K', category: 'Electronics', price: '$449', stock: 32, status: 'Low Stock' },
    { id: 5, name: 'USB-C Hub', category: 'Accessories', price: '$39', stock: 200, status: 'Active' },
    { id: 6, name: 'Webcam HD', category: 'Electronics', price: '$89', stock: 15, status: 'Low Stock' },
    { id: 7, name: 'Headphones', category: 'Audio', price: '$149', stock: 67, status: 'Active' },
    { id: 8, name: 'Desk Lamp', category: 'Furniture', price: '$45', stock: 0, status: 'Out of Stock' }
  ];

  operationHistory = [
    {
      type: 'edit',
      icon: 'fas fa-edit',
      title: 'Batch Price Update',
      description: 'Updated prices for electronics category',
      user: 'John Doe',
      time: '5 minutes ago',
      rowCount: 12,
      canUndo: true
    },
    {
      type: 'update',
      icon: 'fas fa-sync',
      title: 'Status Update',
      description: 'Changed status to "Active" for selected products',
      user: 'Jane Smith',
      time: '1 hour ago',
      rowCount: 25,
      canUndo: true
    },
    {
      type: 'delete',
      icon: 'fas fa-trash',
      title: 'Bulk Delete',
      description: 'Removed discontinued items',
      user: 'Bob Johnson',
      time: '2 hours ago',
      rowCount: 8,
      canUndo: false
    },
    {
      type: 'export',
      icon: 'fas fa-download',
      title: 'Data Export',
      description: 'Exported inventory report to CSV',
      user: 'Alice Brown',
      time: '3 hours ago',
      rowCount: 156,
      canUndo: false
    }
  ];

  onSelectionChange(rows: any[]) {
    this.selectedRows = rows;
  }

  selectAll() {
    this.selectedRows = [...this.data];
  }

  clearSelection() {
    this.selectedRows = [];
  }

  batchUpdateStatus() {
    console.log('Updating status for', this.selectedRows.length, 'rows');
  }

  batchExport() {
    console.log('Exporting', this.selectedRows.length, 'rows');
  }

  batchDelete() {
    if (confirm(`Delete ${this.selectedRows.length} rows?`)) {
      console.log('Deleting', this.selectedRows.length, 'rows');
    }
  }

  applyBatchEdit() {
    console.log('Applying batch edit');
    this.showBatchEdit = false;
  }

  undoOperation(operation: any) {
    console.log('Undoing operation:', operation.title);
  }
}

