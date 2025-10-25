import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig } from 'ngxsmk-datatable';

@Component({
  selector: 'app-virtual-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-rocket"></i>
        Virtual Scrolling Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          This demo showcases virtual scrolling with large datasets. Notice how smooth scrolling is maintained even with 10,000+ rows.
        </div>

        <div class="demo-controls">
          <div class="form-group">
            <label class="form-label">Dataset Size:</label>
            <select [(ngModel)]="datasetSize" (change)="generateData()" class="form-control">
              <option value="100">100 rows</option>
              <option value="1000">1,000 rows</option>
              <option value="5000">5,000 rows</option>
              <option value="10000">10,000 rows</option>
              <option value="50000">50,000 rows</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Row Height:</label>
            <select [(ngModel)]="rowHeight" class="form-control">
              <option value="40">40px</option>
              <option value="50">50px</option>
              <option value="60">60px</option>
              <option value="80">80px</option>
            </select>
          </div>

          <div class="form-check">
            <input type="checkbox" id="virtualScrolling" [(ngModel)]="virtualScrolling" class="form-check-input">
            <label for="virtualScrolling" class="form-check-label">Enable Virtual Scrolling</label>
          </div>

          <div class="form-check">
            <input type="checkbox" id="showPerformance" [(ngModel)]="showPerformance" class="form-check-input">
            <label for="showPerformance" class="form-check-label">Show Performance Metrics</label>
          </div>
        </div>

        @if (showPerformance) {
          <div class="performance-metrics">
          <div class="metric-card">
            <h4>Performance Metrics</h4>
            <div class="metrics-grid">
              <div class="metric">
                <span class="metric-label">Total Rows:</span>
                <span class="metric-value">{{ rows.length.toLocaleString() }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Visible Rows:</span>
                <span class="metric-value">{{ visibleRows }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Render Time:</span>
                <span class="metric-value">{{ renderTime }}ms</span>
              </div>
              <div class="metric">
                <span class="metric-label">Memory Usage:</span>
                <span class="metric-value">{{ memoryUsage }}MB</span>
              </div>
            </div>
          </div>
          </div>
        }

        <div class="datatable-container" [style.height.px]="tableHeight">
          @if (templatesReady) {
          <ngxsmk-datatable
            [columns]="columns"
            [rows]="rows"
            [virtualScrolling]="virtualScrolling"
            [rowHeight]="rowHeight"
            [headerHeight]="50"
            [selectionType]="'multi'"
            [pagination]="null"
            [loadingIndicator]="loading"
            [emptyMessage]="'No data available'"
            (activate)="onActivate($event)"
          >
            <!-- Custom index cell template -->
            <ng-template #indexTemplate let-row="row" let-rowIndex="rowIndex">
              <span class="row-index">{{ rowIndex + 1 }}</span>
            </ng-template>

            <!-- Custom data cell template -->
            <ng-template #dataTemplate let-row="row" let-value="value">
              <div class="data-cell">
                <span class="data-value">{{ value }}</span>
                <small class="data-meta">Row {{ row.id }}</small>
              </div>
            </ng-template>

            <!-- Custom progress cell template -->
            <ng-template #progressTemplate let-row="row" let-value="value">
              <div class="progress-container">
                <div class="progress-bar" [style.width.%]="value"></div>
                <span class="progress-text">{{ value }}%</span>
              </div>
            </ng-template>
          </ngxsmk-datatable>
          }
        </div>

        <div class="demo-info">
          <h4>Virtual Scrolling Benefits:</h4>
          <ul>
            <li><strong>Performance:</strong> Only renders visible rows, dramatically improving performance with large datasets</li>
            <li><strong>Memory Efficiency:</strong> Reduces memory usage by not rendering all rows at once</li>
            <li><strong>Smooth Scrolling:</strong> Maintains 60fps scrolling even with millions of rows</li>
            <li><strong>Responsive:</strong> Automatically adjusts to container height</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .performance-metrics {
      margin-bottom: 20px;
    }

    .metric-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #e9ecef;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .metric-label {
      font-weight: 500;
      color: #666;
    }

    .metric-value {
      font-weight: 700;
      color: #2196f3;
    }

    .datatable-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .row-index {
      font-weight: 500;
      color: #666;
      font-size: 12px;
    }

    .data-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .data-value {
      font-weight: 500;
    }

    .data-meta {
      color: #666;
      font-size: 11px;
    }

    .progress-container {
      position: relative;
      background: #f0f0f0;
      border-radius: 4px;
      height: 20px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      transition: width 0.3s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 11px;
      font-weight: 500;
      color: #333;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class VirtualDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('indexTemplate') indexTemplate!: TemplateRef<any>;
  @ViewChild('dataTemplate') dataTemplate!: TemplateRef<any>;
  @ViewChild('progressTemplate') progressTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  loading = false;
  virtualScrolling = true;
  datasetSize = 1000;
  templatesReady = false;
  rowHeight = 50;
  tableHeight = 400;
  showPerformance = true;
  
  visibleRows = 0;
  renderTime = 0;
  memoryUsage = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Data will be generated after templates are ready
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeColumns();
      this.generateData();
      this.updatePerformanceMetrics();
      this.templatesReady = true;
      this.cdr.detectChanges();
    });
  }

  private initializeColumns() {
    this.columns = [
      {
        id: 'index',
        name: '#',
        prop: 'index',
        width: 60,
        cellTemplate: this.indexTemplate,
        sortable: false,
        frozen: 'left'
      },
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
        id: 'category',
        name: 'Category',
        prop: 'category',
        width: 120,
        sortable: true
      },
      {
        id: 'value',
        name: 'Value',
        prop: 'value',
        width: 100,
        cellTemplate: this.dataTemplate,
        sortable: true
      },
      {
        id: 'progress',
        name: 'Progress',
        prop: 'progress',
        width: 150,
        cellTemplate: this.progressTemplate,
        sortable: true
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        width: 100,
        sortable: true
      }
    ];
  }

  generateData() {
    this.loading = true;
    const startTime = performance.now();
    
    setTimeout(() => {
      this.rows = this.generateMockData(this.datasetSize);
      this.loading = false;
      
      const endTime = performance.now();
      this.renderTime = Math.round(endTime - startTime);
      this.updatePerformanceMetrics();
    }, 100);
  }

  onActivate(event: any) {
    console.log('Activated row:', event.row);
  }

  private generateMockData(count: number): NgxsmkRow[] {
    const categories = ['Technology', 'Business', 'Science', 'Arts', 'Sports'];
    const statuses = ['Active', 'Inactive', 'Pending', 'Completed'];
    const data = [];

    for (let i = 1; i <= count; i++) {
      data.push({
        id: i,
        name: `Item ${i}`,
        email: `item${i}@example.com`,
        category: categories[Math.floor(Math.random() * categories.length)],
        value: Math.floor(Math.random() * 1000),
        progress: Math.floor(Math.random() * 100),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }

    return data;
  }

  private updatePerformanceMetrics() {
    this.visibleRows = Math.ceil(this.tableHeight / this.rowHeight);
    this.memoryUsage = Math.round((this.rows.length * 0.001) * 100) / 100;
  }
}
