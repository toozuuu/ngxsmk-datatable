import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef, ElementRef } from '@angular/core';
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
          <div class="table-wrapper" #tableWrapper [attr.data-custom-theme]="'custom'">
            @if (isReady) {
              <ngxsmk-datatable
                [columns]="columns"
                [rows]="rows"
                [pagination]="paginationConfig"
                [virtualScrolling]="false"
                [selectionType]="'checkbox'"
                [externalPaging]="false"
                [externalSorting]="false">
                
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

    /* Custom theme variables are set dynamically via JavaScript */
  `]
})
export class CustomizationDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('tableWrapper') tableWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild(NgxsmkDatatableComponent, { read: ElementRef }) datatableElement!: ElementRef<HTMLElement>;
  
  private styleElement?: HTMLStyleElement;

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
      this.createStyleElement();
      this.cdr.detectChanges(); // Ensure the table is rendered
      
      // Apply initial CSS variables after table is rendered
      setTimeout(() => {
        this.applyCSSVariables();
        this.injectDynamicStyles();
      }, 50);
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
    console.log('🎨 Applying theme:', theme.name, theme.variables);
    this.selectedTheme = theme.name;
    
    // Update all properties from theme
    this.primaryColor = theme.variables['primaryColor'];
    this.bgColor = theme.variables['bgColor'];
    this.hoverColor = theme.variables['hoverColor'];
    this.rowHeight = parseInt(theme.variables['rowHeight']);
    this.fontSize = parseInt(theme.variables['fontSize']);
    this.padding = parseInt(theme.variables['padding']);
    this.borderRadius = parseInt(theme.variables['borderRadius']);
    
    console.log('📊 Theme values set:', {
      primaryColor: this.primaryColor,
      bgColor: this.bgColor,
      hoverColor: this.hoverColor,
      rowHeight: this.rowHeight,
      fontSize: this.fontSize,
      padding: this.padding,
      borderRadius: this.borderRadius
    });
    
    // Update CSS and apply to DOM
    this.updateAll();
    this.cdr.detectChanges();
  }

  updateColors() {
    this.selectedTheme = 'custom'; // User customized, no longer a preset theme
    this.updateCSS();
    this.applyCSSVariables();
    this.injectDynamicStyles(); // IMPORTANT: Inject styles when manually changing colors
  }

  updateSizes() {
    this.selectedTheme = 'custom'; // User customized, no longer a preset theme
    this.updateCSS();
    this.applyCSSVariables();
    this.injectDynamicStyles(); // IMPORTANT: Inject styles when manually changing sizes
  }

  updateBorders() {
    this.selectedTheme = 'custom'; // User customized, no longer a preset theme
    this.updateCSS();
    this.applyCSSVariables();
    this.injectDynamicStyles(); // IMPORTANT: Inject styles when manually changing borders
  }

  updateAll() {
    this.updateCSS();
    this.applyCSSVariables();
    this.injectDynamicStyles();
  }
  
  private createStyleElement() {
    // Create a style element for dynamic styles
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.id = 'ngxsmk-customization-styles';
      document.head.appendChild(this.styleElement);
      console.log('📝 Created style element for dynamic CSS');
    }
  }
  
  private injectDynamicStyles() {
    if (this.styleElement) {
      const primaryLight = this.hexToRgba(this.primaryColor, 0.08);
      const primaryLighter = this.hexToRgba(this.primaryColor, 0.04);
      const bgLight = this.hexToRgba(this.primaryColor, 0.03); // Very light version for header
      
      // Inject CSS directly that will override the defaults with HIGH specificity
      this.styleElement.textContent = `
        /* Dynamically injected customization styles - High Specificity */
        :root {
          --ngxsmk-dt-primary-color: ${this.primaryColor} !important;
          --ngxsmk-dt-primary-hover: ${this.primaryColor} !important;
          --ngxsmk-dt-primary-light: ${primaryLight} !important;
          --ngxsmk-dt-primary-lighter: ${primaryLighter} !important;
          --ngxsmk-dt-bg-white: ${this.bgColor} !important;
          --ngxsmk-dt-bg-light: ${bgLight} !important;
          --ngxsmk-dt-bg-lighter: ${this.bgColor} !important;
          --ngxsmk-dt-bg-hover: ${this.hoverColor} !important;
          --ngxsmk-dt-bg-selected: ${primaryLight} !important;
          --ngxsmk-dt-row-height: ${this.rowHeight}px !important;
          --ngxsmk-dt-font-size: ${this.fontSize}px !important;
          --ngxsmk-dt-padding: ${this.padding}px !important;
          --ngxsmk-dt-radius-lg: ${this.borderRadius}px !important;
        }
        
        /* Apply to all datatables */
        .ngxsmk-datatable,
        ngxsmk-datatable {
          --ngxsmk-dt-primary-color: ${this.primaryColor} !important;
          --ngxsmk-dt-primary-hover: ${this.primaryColor} !important;
          --ngxsmk-dt-primary-light: ${primaryLight} !important;
          --ngxsmk-dt-primary-lighter: ${primaryLighter} !important;
          --ngxsmk-dt-bg-white: ${this.bgColor} !important;
          --ngxsmk-dt-bg-light: ${bgLight} !important;
          --ngxsmk-dt-bg-lighter: ${this.bgColor} !important;
          --ngxsmk-dt-bg-hover: ${this.hoverColor} !important;
          --ngxsmk-dt-bg-selected: ${primaryLight} !important;
        }
        
        /* DIRECT Header Background Override */
        .ngxsmk-datatable__header {
          background: ${bgLight} !important;
        }
        
        .ngxsmk-datatable__body {
          background: ${this.bgColor} !important;
        }
        
        /* Direct style overrides */
        .ngxsmk-datatable__header-cell--sorted {
          background: ${primaryLight} !important;
          color: ${this.primaryColor} !important;
        }
        
        .ngxsmk-datatable__header-cell:hover {
          background: ${primaryLight} !important;
        }
        
        .ngxsmk-datatable__header-cell--resizing {
          background: ${primaryLight} !important;
        }
        
        .ngxsmk-datatable__resize-handle:hover {
          background: ${this.primaryColor} !important;
        }
        
        .ngxsmk-datatable__resize-handle:hover::after {
          background: ${this.primaryColor} !important;
        }
        
        .ngxsmk-datatable__checkbox:checked,
        .ngxsmk-datatable__checkbox[checked] {
          background-color: ${this.primaryColor} !important;
          border-color: ${this.primaryColor} !important;
        }
        
        .ngxsmk-datatable__row:hover {
          background-color: ${this.hoverColor} !important;
        }
        
        .ngxsmk-datatable__row {
          height: ${this.rowHeight}px !important;
          font-size: ${this.fontSize}px !important;
        }
        
        .ngxsmk-datatable__cell {
          padding: ${this.padding}px !important;
          font-size: ${this.fontSize}px !important;
        }
        
        .ngxsmk-datatable__header-cell {
          padding: ${this.padding}px !important;
        }
        
        .ngxsmk-datatable__detail-toggle-button--expanded {
          background: ${this.primaryColor} !important;
          border-color: ${this.primaryColor} !important;
        }
      `;
      
      console.log('💉 Injected dynamic styles with high specificity');
      console.log('   Primary Color:', this.primaryColor);
      console.log('   Primary Light:', primaryLight);
      console.log('   BG Hover:', this.hoverColor);
    }
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
    if (this.tableWrapper?.nativeElement) {
      const wrapper = this.tableWrapper.nativeElement;
      
      // Convert hex to rgba for primary light (with alpha)
      const primaryLight = this.hexToRgba(this.primaryColor, 0.08);
      
      // Apply to wrapper
      wrapper.style.setProperty('--ngxsmk-dt-primary-color', this.primaryColor);
      wrapper.style.setProperty('--ngxsmk-dt-primary-hover', this.primaryColor);
      wrapper.style.setProperty('--ngxsmk-dt-primary-light', primaryLight);
      wrapper.style.setProperty('--ngxsmk-dt-bg-white', this.bgColor);
      wrapper.style.setProperty('--ngxsmk-dt-bg-hover', this.hoverColor);
      wrapper.style.setProperty('--ngxsmk-dt-row-height', `${this.rowHeight}px`);
      wrapper.style.setProperty('--ngxsmk-dt-font-size', `${this.fontSize}px`);
      wrapper.style.setProperty('--ngxsmk-dt-padding', `${this.padding}px`);
      wrapper.style.setProperty('--ngxsmk-dt-radius-lg', `${this.borderRadius}px`);
      
      // Also apply to document root for global access
      document.documentElement.style.setProperty('--ngxsmk-dt-primary-color', this.primaryColor);
      document.documentElement.style.setProperty('--ngxsmk-dt-primary-hover', this.primaryColor);
      document.documentElement.style.setProperty('--ngxsmk-dt-primary-light', primaryLight);
      document.documentElement.style.setProperty('--ngxsmk-dt-bg-white', this.bgColor);
      document.documentElement.style.setProperty('--ngxsmk-dt-bg-hover', this.hoverColor);
      document.documentElement.style.setProperty('--ngxsmk-dt-row-height', `${this.rowHeight}px`);
      document.documentElement.style.setProperty('--ngxsmk-dt-font-size', `${this.fontSize}px`);
      document.documentElement.style.setProperty('--ngxsmk-dt-padding', `${this.padding}px`);
      document.documentElement.style.setProperty('--ngxsmk-dt-radius-lg', `${this.borderRadius}px`);
      
      // Verify the variables are actually set
      const computedStyle = getComputedStyle(wrapper);
      const actualPrimaryColor = computedStyle.getPropertyValue('--ngxsmk-dt-primary-color');
      const datatableElement = wrapper.querySelector('ngxsmk-datatable');
      
      console.log('✅ CSS Variables applied:', {
        set: {
          primaryColor: this.primaryColor,
          primaryLight,
          bgColor: this.bgColor,
          hoverColor: this.hoverColor
        },
        computed: {
          primaryColor: actualPrimaryColor.trim()
        },
        elements: {
          wrapper: wrapper,
          datatableElement: datatableElement,
          datatableExists: !!datatableElement
        }
      });
      
      // Try to directly style the datatable element if it exists
      if (datatableElement) {
        const dtElement = datatableElement as HTMLElement;
        dtElement.style.setProperty('--ngxsmk-dt-primary-color', this.primaryColor);
        dtElement.style.setProperty('--ngxsmk-dt-primary-hover', this.primaryColor);
        dtElement.style.setProperty('--ngxsmk-dt-primary-light', primaryLight);
        console.log('🎯 Also applied directly to datatable element');
      }
    } else {
      console.warn('⚠️ Table wrapper not found, cannot apply CSS variables');
    }
  }
  
  private hexToRgba(hex: string, alpha: number): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

