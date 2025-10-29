import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn } from 'ngxsmk-datatable';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  supplier: string;
}

@Component({
  selector: 'app-column-reorder-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-arrows-alt-h"></i>
        Column Reordering via Drag & Drop
      </h2>

      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Drag & Drop Columns!</strong> Click and drag any column header to reorder.
            <br>• <strong>Grab cursor</strong> appears when hovering
            <br>• <strong>Visual feedback</strong> shows source and target positions
            <br>• Works with <strong>frozen columns</strong>
            <br>• Disabled while <strong>resizing</strong>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls-bar">
          <button class="btn btn-primary" (click)="resetColumns()">
            <i class="fas fa-undo"></i>
            Reset Column Order
          </button>

          <button class="btn btn-secondary" (click)="randomizeColumns()">
            <i class="fas fa-random"></i>
            Randomize
          </button>

          <div class="toggle-switch">
            <label>
              <input type="checkbox" [(ngModel)]="enableReorder" />
              <span>Enable Reordering</span>
            </label>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-badge">
            <strong>Total Reorders:</strong> {{ reorderCount }}
          </div>
          <div class="stat-badge">
            <strong>Last Reordered:</strong> {{ lastReorderedColumn || 'None' }}
          </div>
          <div class="stat-badge" [class.active]="enableReorder">
            <strong>Status:</strong> {{ enableReorder ? 'Enabled ✓' : 'Disabled' }}
          </div>
        </div>

        <!-- Datatable -->
        <div class="datatable-container">
          <ngxsmk-datatable
            [columns]="columns"
            [rows]="rows"
            [virtualScrolling]="true"
            [rowHeight]="50"
            [headerHeight]="50"
            [enableColumnReorder]="enableReorder"
            (columnReorder)="onColumnReorder($event)">
          </ngxsmk-datatable>
        </div>

        <!-- Event Log -->
        <div class="event-log">
          <h4><i class="fas fa-list"></i> Reorder History</h4>
          @if (reorderEvents.length === 0) {
            <p class="empty-message">No reorder events yet. Drag a column to see events here.</p>
          }
          @for (event of reorderEvents; track $index) {
            <div class="event-item">
              <span class="event-time">{{ event.time }}</span>
              <span class="event-icon"><i class="fas fa-arrows-alt-h"></i></span>
              <span class="event-message">
                Moved <strong>{{ event.column }}</strong> from position {{ event.oldIndex + 1 }} → {{ event.newIndex + 1 }}
              </span>
            </div>
          }
        </div>

        <!-- Info Cards -->
        <div class="info-grid">
          <div class="info-card">
            <h4><i class="fas fa-hand-pointer"></i> How to Use</h4>
            <ul>
              <li><strong>Click & Drag:</strong> Click on any column header and drag</li>
              <li><strong>Visual Feedback:</strong> Dragged column becomes semi-transparent</li>
              <li><strong>Drop Indicator:</strong> Blue line shows where column will land</li>
              <li><strong>Release:</strong> Drop to reorder the column</li>
            </ul>
          </div>

          <div class="info-card">
            <h4><i class="fas fa-code"></i> Implementation</h4>
            <p>Enable column reordering with one line:</p>
            <pre><code>&lt;ngxsmk-datatable
  [enableColumnReorder]="true"
  (columnReorder)="onReorder($event)"&gt;
&lt;/ngxsmk-datatable&gt;</code></pre>
          </div>

          <div class="info-card">
            <h4><i class="fas fa-cogs"></i> Features</h4>
            <ul>
              <li>✅ Smooth drag & drop animations</li>
              <li>✅ Visual feedback during drag</li>
              <li>✅ Compatible with frozen columns</li>
              <li>✅ Disabled during column resize</li>
              <li>✅ Emits reorder events</li>
              <li>✅ Works with virtual scrolling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-section {
      padding: 20px;
    }

    .controls-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .toggle-switch {
      margin-left: auto;
    }

    .toggle-switch label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-weight: 500;
    }

    .stats-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .stat-badge {
      padding: 10px 16px;
      background: #e3f2fd;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .stat-badge.active {
      background: #c8e6c9;
      color: #2e7d32;
    }

    .datatable-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 20px;
      min-height: 500px;
    }

    .datatable-container ::ng-deep ngxsmk-datatable {
      height: 500px;
    }

    .event-log {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      max-height: 300px;
      overflow-y: auto;
    }

    .event-log h4 {
      margin: 0 0 15px 0;
      color: #1976d2;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .empty-message {
      text-align: center;
      color: #9ca3af;
      padding: 30px;
      font-style: italic;
    }

    .event-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-left: 3px solid #3b82f6;
      background: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .event-time {
      color: #6b7280;
      font-size: 12px;
      min-width: 60px;
    }

    .event-icon {
      color: #3b82f6;
      font-size: 16px;
    }

    .event-message {
      flex: 1;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .info-card h4 {
      margin-top: 0;
      color: #1976d2;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-card li {
      margin: 8px 0;
      line-height: 1.6;
    }

    .info-card pre {
      background: #263238;
      color: #aed581;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 13px;
      margin: 10px 0 0 0;
    }

    .info-card code {
      font-family: 'Courier New', monospace;
    }
  `]
})
export class ColumnReorderDemoComponent {
  enableReorder = true;
  reorderCount = 0;
  lastReorderedColumn: string | null = null;

  reorderEvents: Array<{
    time: string;
    column: string;
    oldIndex: number;
    newIndex: number;
  }> = [];

  columns: NgxsmkColumn<Product>[] = [
    { id: 'id', name: 'ID', prop: 'id', width: 80, sortable: true },
    { id: 'name', name: 'Product Name', prop: 'name', width: 200, sortable: true },
    { id: 'category', name: 'Category', prop: 'category', width: 150, sortable: true },
    { id: 'price', name: 'Price', prop: 'price', width: 120, sortable: true },
    { id: 'stock', name: 'Stock', prop: 'stock', width: 100, sortable: true },
    { id: 'rating', name: 'Rating', prop: 'rating', width: 100, sortable: true },
    { id: 'supplier', name: 'Supplier', prop: 'supplier', width: 180, sortable: true }
  ];

  initialColumns = [...this.columns];

  rows: Product[] = this.generateProducts(50);

  onColumnReorder(event: { column: any; oldIndex: number; newIndex: number }): void {
    this.reorderCount++;
    this.lastReorderedColumn = event.column.name;

    const now = new Date();
    const time = now.toLocaleTimeString();

    this.reorderEvents.unshift({
      time,
      column: event.column.name,
      oldIndex: event.oldIndex,
      newIndex: event.newIndex
    });

    // Keep only last 20 events
    if (this.reorderEvents.length > 20) {
      this.reorderEvents = this.reorderEvents.slice(0, 20);
    }
  }

  resetColumns(): void {
    this.columns = [...this.initialColumns];
    this.lastReorderedColumn = null;
    this.reorderCount = 0;
    this.reorderEvents = [];
  }

  randomizeColumns(): void {
    const shuffled = [...this.columns];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.columns = shuffled;
  }

  private generateProducts(count: number): Product[] {
    const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'];
    const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 1000) + 10,
      stock: Math.floor(Math.random() * 500),
      rating: +(Math.random() * 5).toFixed(1),
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)]
    }));
  }
}

