import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-frozen-rows-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-snowflake"></i>
        <div class="header-content">
          <h1 class="header-title">❄️ Frozen Rows & Columns</h1>
          <p class="header-description">
            Pin headers, footers, and columns for better data navigation
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Frozen Rows Features:</strong>
            Freeze header rows, footer rows with totals, pin left/right columns, 
            and create Excel-like split panes for easy data navigation.
          </div>
        </div>

        <!-- Demo Preview -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-table"></i> Frozen Table Demo</h3>
            <div class="freeze-controls">
              <button class="btn btn-sm" [class.active]="freezeHeader" 
                      (click)="freezeHeader = !freezeHeader">
                <i class="fas fa-thumbtack"></i> Freeze Header
              </button>
              <button class="btn btn-sm" [class.active]="freezeFooter" 
                      (click)="freezeFooter = !freezeFooter">
                <i class="fas fa-thumbtack"></i> Freeze Footer
              </button>
              <button class="btn btn-sm" [class.active]="freezeFirstColumn" 
                      (click)="freezeFirstColumn = !freezeFirstColumn">
                <i class="fas fa-thumbtack"></i> Freeze First Column
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-container">
              <table class="frozen-table">
                <thead [class.frozen]="freezeHeader">
                  <tr>
                    <th [class.frozen-column]="freezeFirstColumn">Product</th>
                    <th>Q1</th>
                    <th>Q2</th>
                    <th>Q3</th>
                    <th>Q4</th>
                    <th>Total</th>
                    <th>Avg</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of tableData">
                    <td [class.frozen-column]="freezeFirstColumn"><strong>{{ row.product }}</strong></td>
                    <td>\${{ row.q1.toLocaleString() }}</td>
                    <td>\${{ row.q2.toLocaleString() }}</td>
                    <td>\${{ row.q3.toLocaleString() }}</td>
                    <td>\${{ row.q4.toLocaleString() }}</td>
                    <td class="total-cell">\${{ row.total.toLocaleString() }}</td>
                    <td>\${{ row.avg.toLocaleString() }}</td>
                    <td [class.positive]="row.growth > 0" [class.negative]="row.growth < 0">
                      {{ row.growth > 0 ? '+' : '' }}{{ row.growth }}%
                    </td>
                  </tr>
                </tbody>
                <tfoot [class.frozen]="freezeFooter">
                  <tr class="summary-row">
                    <td [class.frozen-column]="freezeFirstColumn"><strong>Total</strong></td>
                    <td><strong>\${{ getTotals().q1.toLocaleString() }}</strong></td>
                    <td><strong>\${{ getTotals().q2.toLocaleString() }}</strong></td>
                    <td><strong>\${{ getTotals().q3.toLocaleString() }}</strong></td>
                    <td><strong>\${{ getTotals().q4.toLocaleString() }}</strong></td>
                    <td class="total-cell"><strong>\${{ getTotals().total.toLocaleString() }}</strong></td>
                    <td><strong>\${{ getTotals().avg.toLocaleString() }}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-border-top-left feature-icon"></i>
            <h4>Freeze Header</h4>
            <p>Keep column headers visible while scrolling through data</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-border-bottom-left feature-icon"></i>
            <h4>Freeze Footer</h4>
            <p>Pin summary rows with totals and aggregations</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-columns feature-icon"></i>
            <h4>Freeze Columns</h4>
            <p>Lock left or right columns for horizontal scrolling</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-grip-lines feature-icon"></i>
            <h4>Split Panes</h4>
            <p>Create Excel-like split views for better navigation</p>
          </div>
        </div>

        <!-- Configuration Example -->
        <div class="card mt-4">
          <div class="card-header">
            <h3><i class="fas fa-code"></i> Implementation Example</h3>
          </div>
          <div class="card-body">
            <pre><code>import &#123; NgxsmkDatatableComponent &#125; from 'ngxsmk-datatable';

&lt;ngxsmk-datatable
  [data]="data"
  [columns]="columns"
  [frozenRows]="&#123;
    header: &#123;
      enabled: true,
      rows: 1
    &#125;,
    footer: &#123;
      enabled: true,
      rows: 1,
      showTotals: true,
      aggregations: &#123;
        revenue: 'sum',
        quantity: 'sum',
        price: 'avg'
      &#125;
    &#125;
  &#125;"
  [frozenColumns]="&#123;
    left: &#123;
      enabled: true,
      columns: ['id', 'name']
    &#125;,
    right: &#123;
      enabled: true,
      columns: ['total', 'actions']
    &#125;
  &#125;"
  [splitPane]="&#123;
    enabled: true,
    position: &#123; row: 10, column: 3 &#125;
  &#125;"&gt;
&lt;/ngxsmk-datatable&gt;

// Programmatic control
import &#123; FrozenRowsService &#125; from 'ngxsmk-datatable';

constructor(private frozenService: FrozenRowsService) &#123;&#125;

freezeHeader() &#123;
  this.frozenService.freezeHeader(true);
&#125;

freezeColumn(columnId: string) &#123;
  this.frozenService.freezeColumn(columnId, 'left');
&#125;

createSplitPane(row: number, col: number) &#123;
  this.frozenService.createSplit(row, col);
&#125;</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .freeze-controls {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 6px 12px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }

    .btn:hover {
      background: #f3f4f6;
    }

    .btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .table-container {
      overflow: auto;
      max-height: 500px;
      max-width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      position: relative;
    }

    .frozen-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .frozen-table thead.frozen {
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .frozen-table tfoot.frozen {
      position: sticky;
      bottom: 0;
      z-index: 10;
    }

    .frozen-table th,
    .frozen-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      border-right: 1px solid #e5e7eb;
      background: white;
    }

    .frozen-table th {
      background: #f8f9fa;
      font-weight: 600;
      text-align: left;
    }

    .frozen-column {
      position: sticky;
      left: 0;
      z-index: 5;
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    }

    .frozen-table thead.frozen th.frozen-column {
      z-index: 15;
    }

    .total-cell {
      font-weight: 700;
      background: #f8f9fa;
    }

    .summary-row {
      background: #f3f4f6;
      font-weight: 600;
    }

    .summary-row td {
      background: #f3f4f6;
    }

    .positive {
      color: #10b981;
      font-weight: 600;
    }

    .negative {
      color: #ef4444;
      font-weight: 600;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 24px 0;
    }

    .feature-card {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
      text-align: center;
      transition: transform 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
export class FrozenRowsDemoComponent {
  freezeHeader = true;
  freezeFooter = true;
  freezeFirstColumn = true;

  tableData = [
    { product: 'Product A', q1: 125000, q2: 135000, q3: 142000, q4: 158000, total: 560000, avg: 140000, growth: 12.5 },
    { product: 'Product B', q1: 98000, q2: 102000, q3: 95000, q4: 88000, total: 383000, avg: 95750, growth: -5.2 },
    { product: 'Product C', q1: 75000, q2: 82000, q3: 89000, q4: 95000, total: 341000, avg: 85250, growth: 15.3 },
    { product: 'Product D', q1: 52000, q2: 58000, q3: 61000, q4: 65000, total: 236000, avg: 59000, growth: 11.8 },
    { product: 'Product E', q1: 42000, q2: 45000, q3: 48000, q4: 52000, total: 187000, avg: 46750, growth: 10.5 },
    { product: 'Product F', q1: 38000, q2: 35000, q3: 32000, q4: 28000, total: 133000, avg: 33250, growth: -14.2 },
    { product: 'Product G', q1: 68000, q2: 72000, q3: 75000, q4: 78000, total: 293000, avg: 73250, growth: 7.1 },
    { product: 'Product H', q1: 85000, q2: 88000, q3: 92000, q4: 96000, total: 361000, avg: 90250, growth: 6.3 },
    { product: 'Product I', q1: 112000, q2: 118000, q3: 125000, q4: 132000, total: 487000, avg: 121750, growth: 8.9 },
    { product: 'Product J', q1: 95000, q2: 92000, q3: 88000, q4: 85000, total: 360000, avg: 90000, growth: -5.5 }
  ];

  getTotals() {
    const totals = this.tableData.reduce((acc, row) => ({
      q1: acc.q1 + row.q1,
      q2: acc.q2 + row.q2,
      q3: acc.q3 + row.q3,
      q4: acc.q4 + row.q4,
      total: acc.total + row.total,
      avg: 0
    }), { q1: 0, q2: 0, q3: 0, q4: 0, total: 0, avg: 0 });

    totals.avg = Math.round(totals.total / (this.tableData.length * 4));
    return totals;
  }
}

