import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conditional-formatting-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-paint-brush"></i>
        <div class="header-content">
          <h1 class="header-title">🎨 Conditional Formatting</h1>
          <p class="header-description">
            Dynamic cell styling based on rules and conditions
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Conditional Formatting Features:</strong>
            Apply dynamic styles based on cell values, formulas, data bars, color scales, 
            icon sets, and custom conditions.
          </div>
        </div>

        <!-- Data Bars Example -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-chart-bar"></i> Data Bars</h3>
          </div>
          <div class="card-body">
            <table class="demo-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales Progress</th>
                  <th>Target Achievement</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of salesData">
                  <td><strong>{{ item.product }}</strong></td>
                  <td>
                    <div class="data-bar-cell">
                      <div class="data-bar" [style.width.%]="item.progress" 
                           [style.background]="getProgressColor(item.progress)">
                      </div>
                      <span class="data-bar-value">\${{ item.sales.toLocaleString() }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="data-bar-cell">
                      <div class="data-bar gradient" [style.width.%]="item.achievement">
                      </div>
                      <span class="data-bar-value">{{ item.achievement }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Color Scales Example -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-palette"></i> Color Scales</h3>
          </div>
          <div class="card-body">
            <table class="demo-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Jan</th>
                  <th>Feb</th>
                  <th>Mar</th>
                  <th>Apr</th>
                  <th>May</th>
                  <th>Jun</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of heatmapData">
                  <td><strong>{{ row.category }}</strong></td>
                  <td *ngFor="let value of row.values" 
                      [style.background]="getHeatmapColor(value)"
                      [style.color]="value > 75 ? 'white' : '#1f2937'"
                      class="heatmap-cell">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Icon Sets Example -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-icons"></i> Icon Sets</h3>
          </div>
          <div class="card-body">
            <table class="demo-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Trend</th>
                  <th>Status</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let metric of metricsData">
                  <td><strong>{{ metric.name }}</strong></td>
                  <td>{{ metric.value }}</td>
                  <td class="icon-cell">
                    <i [class]="getTrendIcon(metric.trend)" 
                       [style.color]="getTrendColor(metric.trend)"></i>
                    {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
                  </td>
                  <td class="icon-cell">
                    <i [class]="getStatusIcon(metric.status)" 
                       [style.color]="getStatusColor(metric.status)"></i>
                    {{ metric.status }}
                  </td>
                  <td class="rating-cell">
                    <i *ngFor="let star of getStars(metric.rating)" 
                       [class]="star ? 'fas fa-star' : 'far fa-star'"
                       style="color: #f59e0b"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Custom Rules Example -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-list-check"></i> Custom Formatting Rules</h3>
          </div>
          <div class="card-body">
            <div class="rules-list">
              <div class="rule-item" *ngFor="let rule of formattingRules">
                <div class="rule-header">
                  <i [class]="rule.icon" [style.color]="rule.color"></i>
                  <h4>{{ rule.name }}</h4>
                  <span class="rule-badge">{{ rule.type }}</span>
                </div>
                <p>{{ rule.description }}</p>
                <div class="rule-condition">
                  <code>{{ rule.condition }}</code>
                </div>
                <div class="rule-preview">
                  <span>Preview:</span>
                  <div class="preview-cell" [style]="rule.style">
                    Sample Value
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
            <pre><code>import &#123; ConditionalFormattingService &#125; from 'ngxsmk-datatable';

// Configure conditional formatting
columns: NgxsmkColumn[] = [
  &#123;
    field: 'sales',
    header: 'Sales',
    conditionalFormat: &#123;
      type: 'dataBar',
      options: &#123;
        color: '#3b82f6',
        gradient: true,
        showValue: true
      &#125;
    &#125;
  &#125;,
  &#123;
    field: 'performance',
    header: 'Performance',
    conditionalFormat: &#123;
      type: 'colorScale',
      options: &#123;
        minColor: '#ef4444',
        midColor: '#f59e0b',
        maxColor: '#10b981'
      &#125;
    &#125;
  &#125;,
  &#123;
    field: 'status',
    header: 'Status',
    conditionalFormat: &#123;
      type: 'iconSet',
      options: &#123;
        icons: &#123;
          high: 'fas fa-check-circle',
          medium: 'fas fa-exclamation-circle',
          low: 'fas fa-times-circle'
        &#125;
      &#125;
    &#125;
  &#125;,
  &#123;
    field: 'revenue',
    header: 'Revenue',
    conditionalFormat: &#123;
      type: 'custom',
      rules: [
        &#123;
          condition: (value) => value > 100000,
          style: &#123;
            background: '#d1fae5',
            color: '#065f46',
            fontWeight: 'bold'
          &#125;
        &#125;,
        &#123;
          condition: (value) => value < 50000,
          style: &#123;
            background: '#fee2e2',
            color: '#991b1b'
          &#125;
        &#125;
      ]
    &#125;
  &#125;
];</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-table {
      width: 100%;
      border-collapse: collapse;
    }

    .demo-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }

    .demo-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-bar-cell {
      position: relative;
      min-width: 200px;
    }

    .data-bar {
      height: 24px;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .data-bar.gradient {
      background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
    }

    .data-bar-value {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: 600;
      font-size: 13px;
      color: #1f2937;
    }

    .heatmap-cell {
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }

    .heatmap-cell:hover {
      transform: scale(1.05);
      box-shadow: 0 0 0 2px #3b82f6;
    }

    .icon-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .icon-cell i {
      font-size: 18px;
    }

    .rating-cell {
      display: flex;
      gap: 4px;
    }

    .rules-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .rule-item {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }

    .rule-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .rule-header i {
      font-size: 24px;
    }

    .rule-header h4 {
      flex: 1;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .rule-badge {
      padding: 4px 12px;
      background: white;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      color: #3b82f6;
      text-transform: uppercase;
    }

    .rule-item p {
      margin: 0 0 12px 0;
      color: #6b7280;
      font-size: 14px;
    }

    .rule-condition {
      background: white;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 12px;
    }

    .rule-condition code {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #3b82f6;
    }

    .rule-preview {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .rule-preview > span {
      font-weight: 600;
      color: #6b7280;
      font-size: 13px;
    }

    .preview-cell {
      flex: 1;
      padding: 8px 12px;
      border-radius: 4px;
      font-weight: 600;
      text-align: center;
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
export class ConditionalFormattingDemoComponent {
  salesData = [
    { product: 'Laptop Pro', sales: 125000, progress: 85, achievement: 95 },
    { product: 'Tablet Plus', sales: 89000, progress: 65, achievement: 78 },
    { product: 'Smart Watch', sales: 52000, progress: 45, achievement: 52 },
    { product: 'Headphones', sales: 38000, progress: 30, achievement: 38 },
    { product: 'Camera Kit', sales: 15000, progress: 15, achievement: 20 }
  ];

  heatmapData = [
    { category: 'Product A', values: [45, 67, 89, 92, 78, 65] },
    { category: 'Product B', values: [78, 82, 75, 68, 72, 80] },
    { category: 'Product C', values: [32, 45, 56, 68, 79, 85] },
    { category: 'Product D', values: [90, 85, 88, 92, 95, 98] }
  ];

  metricsData = [
    { name: 'Revenue', value: '$125K', trend: 15.2, status: 'Excellent', rating: 5 },
    { name: 'Users', value: '15.2K', trend: 8.5, status: 'Good', rating: 4 },
    { name: 'Conversion', value: '3.2%', trend: -2.1, status: 'Warning', rating: 3 },
    { name: 'Churn', value: '1.8%', trend: -5.3, status: 'Critical', rating: 2 }
  ];

  formattingRules = [
    {
      name: 'High Value Highlight',
      type: 'Value',
      icon: 'fas fa-arrow-up',
      color: '#10b981',
      description: 'Highlight cells with values greater than 100',
      condition: 'value > 100',
      style: 'background: #d1fae5; color: #065f46; font-weight: bold;'
    },
    {
      name: 'Low Value Warning',
      type: 'Value',
      icon: 'fas fa-arrow-down',
      color: '#ef4444',
      description: 'Warn when values fall below 50',
      condition: 'value < 50',
      style: 'background: #fee2e2; color: #991b1b;'
    },
    {
      name: 'Duplicate Detection',
      type: 'Duplicate',
      icon: 'fas fa-copy',
      color: '#f59e0b',
      description: 'Highlight duplicate values in column',
      condition: 'isDuplicate(value)',
      style: 'background: #fef3c7; color: #92400e;'
    },
    {
      name: 'Date Expiry',
      type: 'Date',
      icon: 'fas fa-calendar-times',
      color: '#ef4444',
      description: 'Highlight dates that have passed',
      condition: 'date < today()',
      style: 'background: #fee2e2; color: #991b1b; font-style: italic;'
    }
  ];

  getProgressColor(progress: number): string {
    if (progress >= 70) return '#10b981';
    if (progress >= 40) return '#f59e0b';
    return '#ef4444';
  }

  getHeatmapColor(value: number): string {
    if (value >= 90) return '#10b981';
    if (value >= 80) return '#34d399';
    if (value >= 70) return '#fbbf24';
    if (value >= 60) return '#fb923c';
    if (value >= 50) return '#f87171';
    return '#ef4444';
  }

  getTrendIcon(trend: number): string {
    if (trend > 5) return 'fas fa-arrow-up';
    if (trend < -5) return 'fas fa-arrow-down';
    return 'fas fa-minus';
  }

  getTrendColor(trend: number): string {
    if (trend > 0) return '#10b981';
    if (trend < 0) return '#ef4444';
    return '#6b7280';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Excellent': return 'fas fa-check-circle';
      case 'Good': return 'fas fa-thumbs-up';
      case 'Warning': return 'fas fa-exclamation-triangle';
      case 'Critical': return 'fas fa-times-circle';
      default: return 'fas fa-circle';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Excellent': return '#10b981';
      case 'Good': return '#3b82f6';
      case 'Warning': return '#f59e0b';
      case 'Critical': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}

