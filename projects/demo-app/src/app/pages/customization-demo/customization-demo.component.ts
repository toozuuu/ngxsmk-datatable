import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig } from 'ngxsmk-datatable';

interface CustomTheme {
  name: string;
  label: string;
  variables: { [key: string]: string };
}

@Component({
  selector: 'app-customization-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="customization-demo">
      <div class="demo-header">
        <h2>🎨 Live Customization Demo</h2>
        <p>Customize every aspect of the datatable in real-time using CSS variables</p>
      </div>

      <div class="demo-content">
        <div class="customization-panel">
          <h3>Quick Themes</h3>
          <div class="theme-buttons">
            @for (theme of themes; track theme.name) {
              <button 
                [class.active]="selectedTheme === theme.name"
                (click)="applyTheme(theme)">
                {{ theme.label }}
              </button>
            }
          </div>

          <h3>Color Customization</h3>
          <div class="color-controls">
            <div class="color-control">
              <label>Primary Color</label>
              <input 
                type="color" 
                [(ngModel)]="primaryColor"
                (change)="updateColors()">
              <span>{{ primaryColor }}</span>
            </div>
            
            <div class="color-control">
              <label>Background</label>
              <input 
                type="color" 
                [(ngModel)]="bgColor"
                (change)="updateColors()">
              <span>{{ bgColor }}</span>
            </div>
            
            <div class="color-control">
              <label>Hover Background</label>
              <input 
                type="color" 
                [(ngModel)]="hoverColor"
                (change)="updateColors()">
              <span>{{ hoverColor }}</span>
            </div>
          </div>

          <h3>Size Customization</h3>
          <div class="size-controls">
            <div class="size-control">
              <label>Row Height: {{ rowHeight }}px</label>
              <input 
                type="range" 
                min="32" 
                max="80" 
                [(ngModel)]="rowHeight"
                (input)="updateSizes()">
            </div>
            
            <div class="size-control">
              <label>Font Size: {{ fontSize }}px</label>
              <input 
                type="range" 
                min="11" 
                max="18" 
                [(ngModel)]="fontSize"
                (input)="updateSizes()">
            </div>
            
            <div class="size-control">
              <label>Padding: {{ padding }}px</label>
              <input 
                type="range" 
                min="8" 
                max="24" 
                [(ngModel)]="padding"
                (input)="updateSizes()">
            </div>
          </div>

          <h3>Border Customization</h3>
          <div class="border-controls">
            <div class="border-control">
              <label>Border Radius: {{ borderRadius }}px</label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                [(ngModel)]="borderRadius"
                (input)="updateBorders()">
            </div>
          </div>

          <button class="reset-btn" (click)="resetToDefaults()">
            🔄 Reset to Defaults
          </button>
        </div>

        <div class="preview-panel">
          <h3>Live Preview</h3>
          <div class="table-wrapper" [attr.data-custom-theme]="'custom'">
            @if (isReady) {
              <ngxsmk-datatable
                [columns]="columns"
                [rows]="rows"
                [pagination]="paginationConfig"
                [selectionType]="'checkbox'">
                
                <ng-template #statusTemplate let-row="row" let-value="value">
                  <span [class]="'status-badge status-' + value.toLowerCase()">
                    {{ value }}
                  </span>
                </ng-template>
              </ngxsmk-datatable>
            }
          </div>

          <div class="css-output">
            <h4>Generated CSS:</h4>
            <pre><code>{{ generatedCSS }}</code></pre>
            <button (click)="copyCSSToClipboard()">📋 Copy CSS</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates -->
    <ng-template #statusTemplate let-row="row" let-value="value">
      <span [class]="'status-badge status-' + value.toLowerCase()">
        {{ value }}
      </span>
    </ng-template>
  `,
  styles: [`
    .customization-demo {
      padding: 20px;
    }

    .demo-header {
      margin-bottom: 30px;
      
      h2 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 10px;
        color: #1f2937;
      }
      
      p {
        font-size: 16px;
        color: #6b7280;
        margin: 0;
      }
    }

    .demo-content {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 30px;
      
      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }

    .customization-panel {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      height: fit-content;
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 16px;
        color: #1f2937;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        
        &:first-child {
          padding-top: 0;
          border-top: none;
        }
      }
    }

    .theme-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      
      button {
        padding: 10px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        transition: all 0.2s ease;
        
        &:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #f0f4ff;
        }
        
        &.active {
          border-color: #3b82f6;
          background: #3b82f6;
          color: white;
        }
      }
    }

    .color-controls,
    .size-controls,
    .border-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .color-control,
    .size-control,
    .border-control {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      label {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
      }
      
      input[type="color"] {
        width: 100%;
        height: 40px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
      }
      
      input[type="range"] {
        width: 100%;
      }
      
      span {
        font-size: 12px;
        color: #6b7280;
        font-family: monospace;
      }
    }

    .reset-btn {
      width: 100%;
      margin-top: 24px;
      padding: 12px;
      background: #f3f4f6;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      transition: all 0.2s ease;
      
      &:hover {
        background: #e5e7eb;
        border-color: #9ca3af;
      }
    }

    .preview-panel {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 20px;
        color: #1f2937;
      }
    }

    .table-wrapper {
      height: 500px;
      margin-bottom: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .css-output {
      background: #1f2937;
      border-radius: 8px;
      padding: 16px;
      
      h4 {
        color: white;
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 12px;
      }
      
      pre {
        margin: 0 0 12px;
        max-height: 300px;
        overflow: auto;
        
        code {
          color: #e5e7eb;
          font-size: 12px;
          line-height: 1.5;
          font-family: 'Courier New', monospace;
        }
      }
      
      button {
        width: 100%;
        padding: 8px;
        background: #3b82f6;
        border: none;
        border-radius: 6px;
        color: white;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
        
        &:hover {
          background: #2563eb;
        }
      }
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      
      &.status-active {
        background: #d1fae5;
        color: #065f46;
      }
      
      &.status-inactive {
        background: #fee2e2;
        color: #991b1b;
      }
      
      &.status-pending {
        background: #fef3c7;
        color: #92400e;
      }
    }

    /* Custom theme variables */
    .table-wrapper[data-custom-theme="custom"] {
      ::ng-deep {
        .ngxsmk-datatable {
          --ngxsmk-dt-primary-color: var(--custom-primary);
          --ngxsmk-dt-bg-white: var(--custom-bg);
          --ngxsmk-dt-bg-hover: var(--custom-hover);
          --ngxsmk-dt-row-height: var(--custom-row-height);
          --ngxsmk-dt-font-size: var(--custom-font-size);
          --ngxsmk-dt-padding: var(--custom-padding);
          --ngxsmk-dt-radius-lg: var(--custom-radius);
        }
      }
    }
  `]
})
export class CustomizationDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  isReady = false;
  
  paginationConfig: PaginationConfig = {
    pageSize: 10,
    totalItems: 0,
    currentPage: 1,
    maxSize: 5,
    pageSizeOptions: [5, 10, 25, 50],
    showPageSizeOptions: true,
    showFirstLastButtons: true,
    showRangeLabels: true,
    showTotalItems: true
  };

  // Customization values
  primaryColor = '#3b82f6';
  bgColor = '#ffffff';
  hoverColor = '#f0f4ff';
  rowHeight = 54;
  fontSize = 14;
  padding = 16;
  borderRadius = 10;

  selectedTheme = 'default';
  generatedCSS = '';

  themes: CustomTheme[] = [
    {
      name: 'default',
      label: '🎯 Default',
      variables: {
        primaryColor: '#3b82f6',
        bgColor: '#ffffff',
        hoverColor: '#f0f4ff',
        rowHeight: '54',
        fontSize: '14',
        padding: '16',
        borderRadius: '10'
      }
    },
    {
      name: 'purple',
      label: '💜 Purple',
      variables: {
        primaryColor: '#9333ea',
        bgColor: '#ffffff',
        hoverColor: '#faf5ff',
        rowHeight: '54',
        fontSize: '14',
        padding: '16',
        borderRadius: '10'
      }
    },
    {
      name: 'green',
      label: '🟢 Green',
      variables: {
        primaryColor: '#10b981',
        bgColor: '#ffffff',
        hoverColor: '#f0fdf4',
        rowHeight: '54',
        fontSize: '14',
        padding: '16',
        borderRadius: '10'
      }
    },
    {
      name: 'compact',
      label: '📦 Compact',
      variables: {
        primaryColor: '#3b82f6',
        bgColor: '#ffffff',
        hoverColor: '#f0f4ff',
        rowHeight: '40',
        fontSize: '13',
        padding: '12',
        borderRadius: '6'
      }
    },
    {
      name: 'spacious',
      label: '🌊 Spacious',
      variables: {
        primaryColor: '#3b82f6',
        bgColor: '#ffffff',
        hoverColor: '#f0f4ff',
        rowHeight: '64',
        fontSize: '15',
        padding: '20',
        borderRadius: '12'
      }
    },
    {
      name: 'minimal',
      label: '⚪ Minimal',
      variables: {
        primaryColor: '#1f2937',
        bgColor: '#ffffff',
        hoverColor: '#f9fafb',
        rowHeight: '48',
        fontSize: '14',
        padding: '16',
        borderRadius: '0'
      }
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeColumns();
      this.loadData();
      this.isReady = true;
      this.updateCSS();
      this.applyCSSVariables();
    });
  }

  initializeColumns() {
    this.columns = [
      { id: 'id', name: 'ID', prop: 'id', width: 80, sortable: true },
      { id: 'name', name: 'Name', prop: 'name', width: 180, sortable: true },
      { id: 'email', name: 'Email', prop: 'email', width: 220, sortable: true },
      { 
        id: 'status', 
        name: 'Status', 
        prop: 'status', 
        width: 120, 
        sortable: true,
        cellTemplate: this.statusTemplate
      },
      { id: 'role', name: 'Role', prop: 'role', width: 150, sortable: true },
      { id: 'department', name: 'Department', prop: 'department', width: 150, sortable: true }
    ];
  }

  loadData() {
    this.rows = this.generateMockData(50);
    this.paginationConfig.totalItems = this.rows.length;
  }

  generateMockData(count: number): NgxsmkRow[] {
    const statuses = ['Active', 'Inactive', 'Pending'];
    const roles = ['Admin', 'User', 'Manager', 'Developer'];
    const departments = ['IT', 'HR', 'Sales', 'Marketing'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: statuses[i % statuses.length],
      role: roles[i % roles.length],
      department: departments[i % departments.length]
    }));
  }

  applyTheme(theme: CustomTheme) {
    this.selectedTheme = theme.name;
    this.primaryColor = theme.variables['primaryColor'];
    this.bgColor = theme.variables['bgColor'];
    this.hoverColor = theme.variables['hoverColor'];
    this.rowHeight = parseInt(theme.variables['rowHeight']);
    this.fontSize = parseInt(theme.variables['fontSize']);
    this.padding = parseInt(theme.variables['padding']);
    this.borderRadius = parseInt(theme.variables['borderRadius']);
    
    this.updateAll();
  }

  updateColors() {
    this.updateCSS();
    this.applyCSSVariables();
  }

  updateSizes() {
    this.updateCSS();
    this.applyCSSVariables();
  }

  updateBorders() {
    this.updateCSS();
    this.applyCSSVariables();
  }

  updateAll() {
    this.updateCSS();
    this.applyCSSVariables();
  }

  updateCSS() {
    this.generatedCSS = `:root {
  --ngxsmk-dt-primary-color: ${this.primaryColor};
  --ngxsmk-dt-bg-white: ${this.bgColor};
  --ngxsmk-dt-bg-hover: ${this.hoverColor};
  --ngxsmk-dt-row-height: ${this.rowHeight}px;
  --ngxsmk-dt-font-size: ${this.fontSize}px;
  --ngxsmk-dt-padding: ${this.padding}px;
  --ngxsmk-dt-radius-lg: ${this.borderRadius}px;
}`;
  }

  applyCSSVariables() {
    const root = document.documentElement;
    root.style.setProperty('--custom-primary', this.primaryColor);
    root.style.setProperty('--custom-bg', this.bgColor);
    root.style.setProperty('--custom-hover', this.hoverColor);
    root.style.setProperty('--custom-row-height', `${this.rowHeight}px`);
    root.style.setProperty('--custom-font-size', `${this.fontSize}px`);
    root.style.setProperty('--custom-padding', `${this.padding}px`);
    root.style.setProperty('--custom-radius', `${this.borderRadius}px`);
  }

  resetToDefaults() {
    this.applyTheme(this.themes[0]);
  }

  copyCSSToClipboard() {
    navigator.clipboard.writeText(this.generatedCSS).then(() => {
      alert('CSS copied to clipboard!');
    });
  }
}

