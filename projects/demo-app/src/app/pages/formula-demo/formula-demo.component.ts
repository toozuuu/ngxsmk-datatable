import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formula-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-calculator"></i>
        <div class="header-content">
          <h1 class="header-title">🧮 Custom Formula Support</h1>
          <p class="header-description">
            Excel-like formulas with 100+ functions and custom calculations
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Formula Features:</strong>
            Excel-compatible formulas, 100+ built-in functions, custom function support, 
            automatic recalculation, and formula auditing.
          </div>
        </div>

        <!-- Demo Preview -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-table"></i> Sales Calculator with Formulas</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="formula-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Discount %</th>
                    <th>Total</th>
                    <th>Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of items; let i = index">
                    <td>{{ item.name }}</td>
                    <td>
                      <input type="number" [(ngModel)]="item.quantity" 
                             (ngModelChange)="recalculate(i)" class="form-control">
                    </td>
                    <td>
                      <input type="number" [(ngModel)]="item.price" 
                             (ngModelChange)="recalculate(i)" class="form-control">
                    </td>
                    <td>
                      <input type="number" [(ngModel)]="item.discount" 
                             (ngModelChange)="recalculate(i)" class="form-control">
                    </td>
                    <td class="total-cell">\${{ item.total.toFixed(2) }}</td>
                    <td class="formula-cell">
                      <code>{{ item.formula }}</code>
                    </td>
                  </tr>
                  <tr class="summary-row">
                    <td colspan="4" class="text-right"><strong>Subtotal:</strong></td>
                    <td class="total-cell"><strong>\${{ getSubtotal().toFixed(2) }}</strong></td>
                    <td class="formula-cell"><code>=SUM(E2:E{{ items.length + 1 }})</code></td>
                  </tr>
                  <tr class="summary-row">
                    <td colspan="4" class="text-right"><strong>Tax (10%):</strong></td>
                    <td class="total-cell"><strong>\${{ getTax().toFixed(2) }}</strong></td>
                    <td class="formula-cell"><code>=E{{ items.length + 2 }}*0.1</code></td>
                  </tr>
                  <tr class="summary-row grand-total">
                    <td colspan="4" class="text-right"><strong>Grand Total:</strong></td>
                    <td class="total-cell"><strong>\${{ getGrandTotal().toFixed(2) }}</strong></td>
                    <td class="formula-cell"><code>=E{{ items.length + 2 }}+E{{ items.length + 3 }}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Formula Examples -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-book"></i> Built-in Functions Library</h3>
          </div>
          <div class="card-body">
            <div class="functions-grid">
              <div class="function-category" *ngFor="let category of functionCategories">
                <h4>{{ category.name }}</h4>
                <div class="function-list">
                  <div class="function-item" *ngFor="let func of category.functions">
                    <code>{{ func.name }}</code>
                    <p>{{ func.description }}</p>
                    <div class="example">
                      <strong>Example:</strong> <code>{{ func.example }}</code>
                    </div>
                  </div>
                </div>
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
            <pre><code>import &#123; FormulaService &#125; from 'ngxsmk-datatable';

// Configure formula support
columns: NgxsmkColumn[] = [
  &#123; field: 'quantity', header: 'Quantity', editable: true &#125;,
  &#123; field: 'price', header: 'Price', editable: true &#125;,
  &#123; 
    field: 'total', 
    header: 'Total',
    formula: '=A*B',  // Excel-like formula
    readonly: true
  &#125;,
  &#123;
    field: 'commission',
    header: 'Commission',
    formula: '=IF(C>1000, C*0.15, C*0.1)',
    readonly: true
  &#125;
];

// Use formula service
constructor(private formulaService: FormulaService) &#123;&#125;

// Evaluate custom formula
calculateValue() &#123;
  const result = this.formulaService.evaluate(
    '=SUM(A1:A10) * 0.1',
    &#123; A1: 100, A2: 200, /* ... */ A10: 500 &#125;
  );
  console.log(result); // Calculated value
&#125;

// Register custom function
this.formulaService.registerFunction(
  'PROFIT',
  (revenue: number, cost: number) => revenue - cost
);

// Use: =PROFIT(1000, 700) => 300</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .formula-table {
      width: 100%;
      border-collapse: collapse;
    }

    .formula-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }

    .formula-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    .form-control {
      width: 100%;
      padding: 6px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
    }

    .total-cell {
      font-weight: 600;
      color: #1f2937;
      font-size: 16px;
    }

    .formula-cell {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #6b7280;
    }

    .formula-cell code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
    }

    .summary-row {
      background: #f9fafb;
    }

    .grand-total {
      background: #f3f4f6;
      font-size: 18px;
    }

    .text-right {
      text-align: right;
    }

    .functions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .function-category h4 {
      margin: 0 0 16px 0;
      padding: 12px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 6px;
      font-size: 16px;
    }

    .function-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .function-item {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }

    .function-item > code {
      font-size: 14px;
      font-weight: 700;
      color: #667eea;
      background: white;
      padding: 4px 8px;
      border-radius: 3px;
    }

    .function-item p {
      margin: 8px 0;
      font-size: 14px;
      color: #4b5563;
    }

    .example {
      margin-top: 8px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      font-size: 13px;
    }

    .example strong {
      color: #6b7280;
    }

    .example code {
      color: #10b981;
      background: #f3f4f6;
      padding: 2px 4px;
      border-radius: 2px;
    }

    pre {
      background: #1f2937;
      color: #10b981;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 0;
    }

    pre code {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
    }
  `]
})
export class FormulaDemoComponent {
  items = [
    { name: 'Laptop', quantity: 2, price: 1200, discount: 10, total: 2160, formula: '=B2*C2*(1-D2/100)' },
    { name: 'Mouse', quantity: 5, price: 25, discount: 5, total: 118.75, formula: '=B3*C3*(1-D3/100)' },
    { name: 'Keyboard', quantity: 3, price: 75, discount: 0, total: 225, formula: '=B4*C4*(1-D4/100)' },
    { name: 'Monitor', quantity: 2, price: 350, discount: 15, total: 595, formula: '=B5*C5*(1-D5/100)' }
  ];

  functionCategories = [
    {
      name: '📊 Math & Statistics',
      functions: [
        { name: 'SUM', description: 'Add all numbers in a range', example: '=SUM(A1:A10)' },
        { name: 'AVERAGE', description: 'Calculate mean of numbers', example: '=AVERAGE(B1:B5)' },
        { name: 'MAX', description: 'Find maximum value', example: '=MAX(C1:C20)' },
        { name: 'MIN', description: 'Find minimum value', example: '=MIN(D1:D10)' },
        { name: 'COUNT', description: 'Count numeric values', example: '=COUNT(E1:E50)' }
      ]
    },
    {
      name: '📝 Text Functions',
      functions: [
        { name: 'CONCAT', description: 'Join text strings', example: '=CONCAT(A1, " ", B1)' },
        { name: 'UPPER', description: 'Convert to uppercase', example: '=UPPER(A1)' },
        { name: 'LOWER', description: 'Convert to lowercase', example: '=LOWER(B1)' },
        { name: 'LEFT', description: 'Extract leftmost characters', example: '=LEFT(C1, 5)' },
        { name: 'LEN', description: 'Get text length', example: '=LEN(D1)' }
      ]
    },
    {
      name: '🔍 Logical Functions',
      functions: [
        { name: 'IF', description: 'Conditional logic', example: '=IF(A1>100, "High", "Low")' },
        { name: 'AND', description: 'All conditions true', example: '=AND(A1>0, B1<100)' },
        { name: 'OR', description: 'Any condition true', example: '=OR(C1="A", C1="B")' },
        { name: 'NOT', description: 'Reverse boolean value', example: '=NOT(D1=TRUE)' },
        { name: 'IFERROR', description: 'Handle errors gracefully', example: '=IFERROR(A1/B1, 0)' }
      ]
    },
    {
      name: '📅 Date & Time',
      functions: [
        { name: 'TODAY', description: 'Current date', example: '=TODAY()' },
        { name: 'NOW', description: 'Current date and time', example: '=NOW()' },
        { name: 'YEAR', description: 'Extract year from date', example: '=YEAR(A1)' },
        { name: 'MONTH', description: 'Extract month from date', example: '=MONTH(B1)' },
        { name: 'DATEDIF', description: 'Calculate date difference', example: '=DATEDIF(A1, B1, "days")' }
      ]
    }
  ];

  recalculate(index: number) {
    const item = this.items[index];
    item.total = item.quantity * item.price * (1 - item.discount / 100);
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.1;
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.getTax();
  }
}

