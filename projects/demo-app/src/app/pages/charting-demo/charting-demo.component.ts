import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charting-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-chart-line"></i>
        <div class="header-content">
          <h1 class="header-title">📊 Advanced Charting Integration</h1>
          <p class="header-description">
            Inline sparklines, mini charts, and interactive data visualizations
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Charting Features:</strong>
            Inline sparklines, mini bar/line/area charts, pie charts, heatmaps, 
            and interactive data visualizations directly in table cells.
          </div>
        </div>

        <!-- Demo Preview -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-table"></i> Sales Performance Dashboard</h3>
            <div class="chart-controls">
              <button class="btn btn-sm" [class.active]="chartType === 'line'" 
                      (click)="chartType = 'line'">
                <i class="fas fa-chart-line"></i> Line
              </button>
              <button class="btn btn-sm" [class.active]="chartType === 'bar'" 
                      (click)="chartType = 'bar'">
                <i class="fas fa-chart-bar"></i> Bar
              </button>
              <button class="btn btn-sm" [class.active]="chartType === 'area'" 
                      (click)="chartType = 'area'">
                <i class="fas fa-chart-area"></i> Area
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="chart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Revenue</th>
                    <th>Trend (6M)</th>
                    <th>Distribution</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of salesData">
                    <td><strong>{{ item.product }}</strong></td>
                    <td>
                      <div class="revenue-cell">
                        <span class="amount">\${{ item.revenue.toLocaleString() }}</span>
                        <span class="change" [class.positive]="item.change > 0" 
                              [class.negative]="item.change < 0">
                          <i [class]="item.change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                          {{ Math.abs(item.change) }}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="sparkline">
                        <svg width="120" height="40" *ngIf="chartType === 'line'">
                          <polyline
                            [attr.points]="getSparklinePoints(item.trend)"
                            fill="none"
                            [attr.stroke]="item.change > 0 ? '#10b981' : '#ef4444'"
                            stroke-width="2"
                          />
                        </svg>
                        <svg width="120" height="40" *ngIf="chartType === 'area'">
                          <defs>
                            <linearGradient [id]="'gradient-' + item.product" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" [attr.stop-color]="item.change > 0 ? '#10b981' : '#ef4444'" stop-opacity="0.3"/>
                              <stop offset="100%" [attr.stop-color]="item.change > 0 ? '#10b981' : '#ef4444'" stop-opacity="0"/>
                            </linearGradient>
                          </defs>
                          <polygon
                            [attr.points]="getAreaPoints(item.trend)"
                            [attr.fill]="'url(#gradient-' + item.product + ')'"
                          />
                          <polyline
                            [attr.points]="getSparklinePoints(item.trend)"
                            fill="none"
                            [attr.stroke]="item.change > 0 ? '#10b981' : '#ef4444'"
                            stroke-width="2"
                          />
                        </svg>
                        <svg width="120" height="40" *ngIf="chartType === 'bar'">
                          <g *ngFor="let val of item.trend; let i = index">
                            <rect
                              [attr.x]="i * 20 + 2"
                              [attr.y]="40 - (val / getMax(item.trend) * 35) - 5"
                              width="16"
                              [attr.height]="(val / getMax(item.trend) * 35)"
                              [attr.fill]="item.change > 0 ? '#10b981' : '#ef4444'"
                              rx="2"
                            />
                          </g>
                        </svg>
                      </div>
                    </td>
                    <td>
                      <div class="mini-bars">
                        <div class="bar-group" *ngFor="let val of item.distribution; let i = index">
                          <div class="bar" 
                               [style.height.%]="val" 
                               [style.background]="getBarColor(i)">
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="performance-chart">
                        <div class="progress-ring">
                          <svg width="60" height="60">
                            <circle cx="30" cy="30" r="25" fill="none" stroke="#e5e7eb" stroke-width="5"/>
                            <circle 
                              cx="30" 
                              cy="30" 
                              r="25" 
                              fill="none" 
                              [attr.stroke]="getPerformanceColor(item.performance)"
                              stroke-width="5"
                              [attr.stroke-dasharray]="157"
                              [attr.stroke-dashoffset]="157 - (157 * item.performance / 100)"
                              transform="rotate(-90 30 30)"
                            />
                          </svg>
                          <span class="percentage">{{ item.performance }}%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Chart Types -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-chart-pie"></i> Available Chart Types</h3>
          </div>
          <div class="card-body">
            <div class="chart-types-grid">
              <div class="chart-type-card" *ngFor="let type of chartTypes">
                <div class="chart-icon" [innerHTML]="type.icon"></div>
                <h4>{{ type.name }}</h4>
                <p>{{ type.description }}</p>
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
            <pre><code>import &#123; ChartingService &#125; from 'ngxsmk-datatable';

// Configure inline charts
columns: NgxsmkColumn[] = [
  &#123; field: 'product', header: 'Product' &#125;,
  &#123; 
    field: 'trend', 
    header: 'Trend',
    chart: &#123;
      type: 'sparkline',
      options: &#123;
        width: 120,
        height: 40,
        lineColor: '#3b82f6',
        fillColor: 'rgba(59, 130, 246, 0.1)',
        showDots: true
      &#125;
    &#125;
  &#125;,
  &#123;
    field: 'distribution',
    header: 'Distribution',
    chart: &#123;
      type: 'miniBar',
      options: &#123;
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        maxHeight: 50
      &#125;
    &#125;
  &#125;,
  &#123;
    field: 'performance',
    header: 'Performance',
    chart: &#123;
      type: 'progress',
      options: &#123;
        size: 60,
        strokeWidth: 5,
        colors: &#123;
          low: '#ef4444',
          medium: '#f59e0b',
          high: '#10b981'
        &#125;
      &#125;
    &#125;
  &#125;
];</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-controls {
      display: flex;
      gap: 8px;
    }

    .chart-controls .btn {
      padding: 6px 12px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .chart-controls .btn:hover {
      background: #f3f4f6;
    }

    .chart-controls .btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .chart-table {
      width: 100%;
      border-collapse: collapse;
    }

    .chart-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }

    .chart-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    .revenue-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .amount {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }

    .change {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .change.positive {
      background: #d1fae5;
      color: #065f46;
    }

    .change.negative {
      background: #fee2e2;
      color: #991b1b;
    }

    .sparkline {
      display: flex;
      align-items: center;
    }

    .mini-bars {
      display: flex;
      gap: 4px;
      align-items: flex-end;
      height: 50px;
    }

    .bar-group {
      flex: 1;
      display: flex;
      align-items: flex-end;
      height: 100%;
    }

    .bar {
      width: 100%;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
    }

    .bar:hover {
      opacity: 0.8;
    }

    .performance-chart {
      display: flex;
      justify-content: center;
    }

    .progress-ring {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .progress-ring svg {
      transform: rotate(-90deg);
    }

    .percentage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
    }

    .chart-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .chart-type-card {
      padding: 24px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
      transition: transform 0.2s;
    }

    .chart-type-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .chart-icon {
      font-size: 36px;
      margin-bottom: 12px;
    }

    .chart-type-card h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .chart-type-card p {
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
export class ChartingDemoComponent {
  Math = Math;
  chartType: 'line' | 'bar' | 'area' = 'line';

  salesData = [
    { product: 'Enterprise Suite', revenue: 125000, change: 12.5, trend: [65, 70, 68, 75, 82, 88], distribution: [30, 25, 25, 20], performance: 88 },
    { product: 'Professional Plan', revenue: 89000, change: 8.3, trend: [45, 50, 48, 52, 55, 58], distribution: [35, 30, 20, 15], performance: 75 },
    { product: 'Starter Package', revenue: 42000, change: -3.2, trend: [35, 38, 32, 30, 28, 27], distribution: [20, 30, 30, 20], performance: 52 },
    { product: 'Premium Add-ons', revenue: 28000, change: 15.7, trend: [15, 18, 22, 25, 28, 32], distribution: [25, 25, 25, 25], performance: 82 },
    { product: 'Basic Services', revenue: 18000, change: -5.1, trend: [25, 23, 20, 19, 17, 15], distribution: [40, 30, 20, 10], performance: 45 }
  ];

  chartTypes = [
    { name: 'Sparkline', icon: '📈', description: 'Compact trend visualization' },
    { name: 'Mini Bar', icon: '📊', description: 'Small bar charts in cells' },
    { name: 'Progress Ring', icon: '🎯', description: 'Circular progress indicators' },
    { name: 'Heatmap', icon: '🌡️', description: 'Color-coded data density' },
    { name: 'Bullet Chart', icon: '🎪', description: 'Performance vs. target' },
    { name: 'Pie Chart', icon: '🥧', description: 'Proportional data display' }
  ];

  getSparklinePoints(values: number[]): string {
    const width = 120;
    const height = 40;
    const padding = 5;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;

    return values.map((value, index) => {
      const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');
  }

  getAreaPoints(values: number[]): string {
    const width = 120;
    const height = 40;
    const padding = 5;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;

    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    // Add bottom corners to close the polygon
    const lastX = (width - 2 * padding) + padding;
    const firstX = padding;
    const bottomY = height - padding;

    return `${firstX},${bottomY} ${points.join(' ')} ${lastX},${bottomY}`;
  }

  getMax(values: number[]): number {
    return Math.max(...values);
  }

  getBarColor(index: number): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    return colors[index % colors.length];
  }

  getPerformanceColor(value: number): string {
    if (value >= 80) return '#10b981';
    if (value >= 60) return '#f59e0b';
    return '#ef4444';
  }
}

