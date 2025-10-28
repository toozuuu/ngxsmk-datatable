import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig } from 'ngxsmk-datatable';
import { ThemeService, ThemeSettings } from '../../shared/theme.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-themes-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-palette"></i>
        Themes & Styling Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          This demo showcases different themes and styling options available with ngxsmk-datatable.
        </div>

        <div class="demo-controls">
          <div class="form-group">
            <label class="form-label">Theme:</label>
            <select [(ngModel)]="selectedTheme" (change)="applyTheme()" class="form-control">
              <option value="default">Default</option>
              <option value="material">Material Design</option>
              <option value="dark">Dark Theme</option>
              <option value="minimal">Minimal</option>
              <option value="colorful">Colorful</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Row Height:</label>
            <select [ngModel]="rowHeight" (ngModelChange)="onRowHeightChange($event)" class="form-control">
              <option [value]="40">40px</option>
              <option [value]="50">50px</option>
              <option [value]="60">60px</option>
              <option [value]="80">80px</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Font Size:</label>
            <select [ngModel]="fontSize" (ngModelChange)="onFontSizeChange($event)" class="form-control">
              <option [value]="12">12px</option>
              <option [value]="14">14px</option>
              <option [value]="16">16px</option>
              <option [value]="18">18px</option>
            </select>
          </div>

          <div class="form-check">
            <input type="checkbox" id="stripedRows" [(ngModel)]="stripedRows" (ngModelChange)="onStripedRowsChange($event)" class="form-check-input">
            <label for="stripedRows" class="form-check-label">Striped Rows</label>
          </div>

          <div class="form-check">
            <input type="checkbox" id="hoverEffects" [(ngModel)]="hoverEffects" (ngModelChange)="onHoverEffectsChange($event)" class="form-check-input">
            <label for="hoverEffects" class="form-check-label">Hover Effects</label>
          </div>

          <button class="btn btn-primary" (click)="resetTheme()">
            <i class="fas fa-undo"></i>
            Reset Theme
          </button>
        </div>

        <!-- Templates defined outside datatable so @ViewChild can find them -->
        <ng-template #themeTemplate let-row="row" let-value="value">
          <div class="theme-cell" [class]="getCellThemeClass(value)">
            <span class="theme-value">{{ value }}</span>
            <div class="theme-indicator" [style.background-color]="getThemeColor(value)"></div>
          </div>
        </ng-template>

        <ng-template #statusTemplate let-row="row" let-value="value">
          <span [class]="getStatusClass(value)">
            <i [class]="getStatusIcon(value)"></i>
            {{ value }}
          </span>
        </ng-template>

        <div class="theme-preview">
          <h4>Theme Preview</h4>
          <p>Templates Ready: {{ templatesReady }}, Rows: {{ rows.length }}, Columns: {{ columns.length }}</p>
          <div class="preview-container" [class]="getThemeClass()">
            @if (templatesReady) {
              <div class="datatable-wrapper" [class.striped-rows]="stripedRows" [class.hover-effects]="hoverEffects">
                <ngxsmk-datatable
                  [columns]="columns"
                  [rows]="rows"
                  [virtualScrolling]="false"
                  [rowHeight]="rowHeight"
                  [selectionType]="'multi'"
                  [externalPaging]="false"
                  [externalSorting]="false"
                  [pagination]="paginationConfig"
                  [style.font-size.px]="fontSize"
                  (select)="onSelect($event)"
                >
                </ngxsmk-datatable>
              </div>
            } @else {
              <div class="loading-message">
                <p>Loading table... templatesReady: {{ templatesReady }}</p>
              </div>
            }
          </div>
        </div>

        <div class="theme-info">
          <div class="info-grid">
            <div class="info-card">
              <h5>Current Theme</h5>
              <p>{{ getThemeDescription() }}</p>
            </div>
            <div class="info-card">
              <h5>Customization</h5>
              <ul>
                <li>Row Height: {{ rowHeight }}px</li>
                <li>Font Size: {{ fontSize }}px</li>
                <li>Striped Rows: {{ stripedRows ? 'Yes' : 'No' }}</li>
                <li>Hover Effects: {{ hoverEffects ? 'Yes' : 'No' }}</li>
              </ul>
            </div>
            <div class="info-card">
              <h5>CSS Variables</h5>
              <div class="css-variables">
                <div class="variable">
                  <code>--primary-color</code>
                  <span [style.color]="getPrimaryColor()">{{ getPrimaryColor() }}</span>
                </div>
                <div class="variable">
                  <code>--secondary-color</code>
                  <span [style.color]="getSecondaryColor()">{{ getSecondaryColor() }}</span>
                </div>
                <div class="variable">
                  <code>--background-color</code>
                  <span [style.color]="getBackgroundColor()">{{ getBackgroundColor() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="code-example">
          <h4>CSS Customization Example</h4>
          <pre class="code-block"><code>{{ getCssExample() }}</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .theme-preview {
      margin-bottom: 30px;
    }

    .theme-preview h4 {
      margin-bottom: 15px;
      color: #2196f3;
      font-size: 18px;
      font-weight: 600;
    }

    .preview-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      background: #ffffff;
      height: 600px;
      display: block;
    }

    .datatable-wrapper {
      height: 100%;
      display: block;
    }

    .preview-container ::ng-deep ngxsmk-datatable {
      height: 100%;
      display: block;
    }
    
    .preview-container ::ng-deep .ngxsmk-datatable {
      height: 100%;
    }
    
    .preview-container ::ng-deep .ngxsmk-datatable__body {
      height: calc(100% - 100px) !important;
      overflow-y: auto !important;
    }
    
    .preview-container ::ng-deep .ngxsmk-datatable__row {
      display: flex !important;
    }
    
    .loading-message {
      padding: 40px;
      text-align: center;
      color: #666;
      font-size: 16px;
    }

    .theme-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .theme-value {
      font-weight: 500;
    }

    .theme-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .preview-container.theme-default .theme-cell,
    .preview-container.theme-default .theme-value {
      color: #333 !important;
    }

    .preview-container.theme-material .theme-cell,
    .preview-container.theme-material .theme-value {
      color: white !important;
    }

    .preview-container.theme-dark .theme-cell,
    .preview-container.theme-dark .theme-value {
      color: #e0e0e0 !important;
    }

    .preview-container.theme-minimal .theme-cell,
    .preview-container.theme-minimal .theme-value {
      color: #666 !important;
    }

    .preview-container.theme-colorful .theme-cell,
    .preview-container.theme-colorful .theme-value {
      color: white !important;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .info-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #e9ecef;
    }

    .info-card h5 {
      margin-top: 0;
      color: #2196f3;
    }

    .info-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-card li {
      margin-bottom: 5px;
    }

    .css-variables {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .variable {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .variable code {
      background: #f1f3f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
    }

    .theme-info {
      margin-bottom: 30px;
    }

    .code-example {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #e9ecef;
    }

    .code-example h4 {
      margin-top: 0;
      margin-bottom: 15px;
      color: #2196f3;
      font-size: 18px;
      font-weight: 600;
    }

    .code-block {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }

    .code-block code {
      color: #f8f8f2;
      background: transparent;
    }

    .status-active {
      color: #28a745 !important;
    }

    .status-inactive {
      color: #dc3545 !important;
    }

    .status-pending {
      color: #ffc107 !important;
    }

    /* Ensure status badges are visible in dark theme */
    .preview-container.theme-dark .status-active {
      color: #4ade80 !important;
    }

    .preview-container.theme-dark .status-inactive {
      color: #f87171 !important;
    }

    .preview-container.theme-dark .status-pending {
      color: #fbbf24 !important;
    }

    /* Theme-specific styles */
    .theme-default {
      --primary-color: #2196f3;
      --secondary-color: #f5f5f5;
      --background-color: #ffffff;
    }

    .theme-material {
      --primary-color: #1976d2;
      --secondary-color: #f5f5f5;
      --background-color: #ffffff;
    }

    /* Material theme styling - HIGHEST SPECIFICITY */
    .preview-container.theme-material ::ng-deep .ngxsmk-datatable {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header {
      background: #1976d2 !important;
      color: white !important;
    }

    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-row {
      background: #1976d2 !important;
    }

    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell {
      color: white !important;
      background: transparent !important;
    }

    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell * {
      color: white !important;
    }

    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell-text {
      color: white !important;
    }
    
    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell-content {
      color: white !important;
    }
    
    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell-sort-icon {
      color: white !important;
    }
    
    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell span {
      color: white !important;
    }
    
    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
    }

    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell--sorted {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
    }
    
    .preview-container.theme-material ::ng-deep .ngxsmk-datatable__header-cell--sorted * {
      color: white !important;
    }

    .preview-container.theme-material ::ng-deep .ngxsmk-pager {
      background: #e3f2fd !important;
      border-top-color: #1976d2 !important;
    }

    .theme-dark {
      --primary-color: #64b5f6;
      --secondary-color: #2d2d2d;
      --background-color: #1e1e1e;
    }

    /* Dark theme styling - HIGHEST SPECIFICITY */
    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable {
      background: #1e1e1e !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header {
      background: #2d2d2d !important;
      border-bottom-color: #404040 !important;
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-row {
      background: #2d2d2d !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell {
      color: #64b5f6 !important;
      background: transparent !important;
      border-bottom-color: #404040 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell * {
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell-text {
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell-content {
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell-sort-icon {
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell span {
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell:hover {
      background: rgba(100, 181, 246, 0.1) !important;
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__header-cell--sorted {
      background: rgba(100, 181, 246, 0.15) !important;
      color: #64b5f6 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__body {
      background: #1e1e1e !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__row {
      background: #1e1e1e !important;
      border-bottom-color: #333 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__row:nth-child(even) {
      background: #252525 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__row:hover {
      background: #2d2d2d !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__cell {
      color: #e0e0e0 !important;
      border-bottom-color: #333 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__cell * {
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__cell span {
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__cell div {
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__cell .status-badge {
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__cell .category-badge {
      color: white !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-datatable__row * {
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-pager {
      background: #2d2d2d !important;
      border-top-color: #404040 !important;
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-pager * {
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-pager__button {
      background: #1e1e1e !important;
      border-color: #555 !important;
      color: #e0e0e0 !important;
    }

    .preview-container.theme-dark ::ng-deep .ngxsmk-pager__button--active {
      background: #64b5f6 !important;
      border-color: #64b5f6 !important;
      color: #1e1e1e !important;
    }

    .theme-minimal {
      --primary-color: #666666;
      --secondary-color: #f9f9f9;
      --background-color: #ffffff;
    }

    /* Minimal theme styling - HIGHEST SPECIFICITY */
    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable {
      border: none;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__header {
      background: transparent !important;
      border-bottom: 2px solid #e0e0e0 !important;
      color: #666 !important;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__header-cell {
      border-right: none !important;
      color: #666 !important;
      background: transparent !important;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__header-cell * {
      color: #666 !important;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__header-cell-text {
      color: #666 !important;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__header-cell span {
      color: #666 !important;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__header-cell-sort-icon {
      color: #666 !important;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__row {
      border-bottom: 1px solid #f0f0f0 !important;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-datatable__cell {
      border-right: none !important;
      border-bottom-color: #f0f0f0 !important;
      color: #333 !important;
    }

    .preview-container.theme-minimal ::ng-deep .ngxsmk-pager {
      background: transparent !important;
      border-top: 1px solid #e0e0e0 !important;
    }

    .theme-colorful {
      --primary-color: #e91e63;
      --secondary-color: #fce4ec;
      --background-color: #ffffff;
    }

    /* Colorful theme styling - HIGHEST SPECIFICITY */
    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__header {
      background: linear-gradient(135deg, #e91e63 0%, #f48fb1 100%) !important;
      color: white !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__header-cell {
      color: white !important;
      background: transparent !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__header-cell * {
      color: white !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__header-cell-text {
      color: white !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__header-cell span {
      color: white !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__header-cell-sort-icon {
      color: white !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__row:nth-child(odd) {
      background: #fff !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__row:nth-child(even) {
      background: #fce4ec !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__row:hover {
      background: #f8bbd0 !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-datatable__cell {
      color: #333 !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-pager {
      background: #fce4ec !important;
      border-top-color: #e91e63 !important;
    }

    .preview-container.theme-colorful ::ng-deep .ngxsmk-pager__button--active {
      background: #e91e63 !important;
      border-color: #e91e63 !important;
      color: white !important;
    }

    /* Dynamic styling for striped rows and hover effects */
    .preview-container ::ng-deep .ngxsmk-datatable.striped-rows .ngxsmk-datatable__row--even {
      background: #f9fafb !important;
    }

    .preview-container ::ng-deep .ngxsmk-datatable.striped-rows .ngxsmk-datatable__row--odd {
      background: #ffffff !important;
    }

    .preview-container ::ng-deep .ngxsmk-datatable:not(.hover-effects) .ngxsmk-datatable__row:hover {
      background: inherit !important;
      box-shadow: none !important;
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }

  `]
})
export class ThemesDemoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('themeTemplate') themeTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  selectedRows: NgxsmkRow[] = [];
  templatesReady = false;
  
  selectedTheme = 'default';
  rowHeight: number = 50;
  fontSize: number = 14;
  stripedRows = true;
  hoverEffects = true;

  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {}

  paginationConfig: PaginationConfig = {
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    showPageSizeOptions: true,
    showFirstLastButtons: true,
    showRangeLabels: true,
    showTotalItems: true,
    totalItems: 0,
    currentPage: 1,
    maxSize: 5
  };

  ngOnInit() {
    // Load current theme settings
    const settings = this.themeService.getSettings();
    this.selectedTheme = settings.selectedTheme;
    this.rowHeight = settings.rowHeight;
    this.fontSize = settings.fontSize;
    this.stripedRows = settings.stripedRows;
    this.hoverEffects = settings.hoverEffects;

    // Subscribe to theme changes
    this.themeService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.selectedTheme = settings.selectedTheme;
        this.rowHeight = settings.rowHeight;
        this.fontSize = settings.fontSize;
        this.stripedRows = settings.stripedRows;
        this.hoverEffects = settings.hoverEffects;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up injected theme styles
    if (this.themeStyleElement) {
      this.themeStyleElement.remove();
    }
  }

  ngAfterViewInit() {
    console.log('🔵 ThemesDemo - ngAfterViewInit started');
    console.log('   themeTemplate:', this.themeTemplate);
    console.log('   statusTemplate:', this.statusTemplate);
    
    setTimeout(() => {
      console.log('🟡 ThemesDemo - Initializing...');
      this.initializeColumns();
      this.loadData();
      this.templatesReady = true;
      this.injectThemeStyles(); // Inject initial theme styles
      console.log('✅ ThemesDemo - Data loaded:', {
        columns: this.columns.length,
        rows: this.rows.length,
        templatesReady: this.templatesReady,
        themeTemplate: !!this.themeTemplate,
        statusTemplate: !!this.statusTemplate
      });
      this.cdr.detectChanges();
    }, 100);
  }

  private initializeColumns() {
    this.columns = [
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
        id: 'category',
        name: 'Category',
        prop: 'category',
        width: 150,
        cellTemplate: this.themeTemplate,
        sortable: true
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        width: 120,
        cellTemplate: this.statusTemplate,
        sortable: true
      },
      {
        id: 'value',
        name: 'Value',
        prop: 'value',
        width: 100,
        sortable: true
      },
      {
        id: 'date',
        name: 'Date',
        prop: 'date',
        width: 150,
        sortable: true
      }
    ];
  }

  loadData() {
    console.log('📊 ThemesDemo - loadData called');
    this.rows = this.generateMockData(50);
    this.paginationConfig.totalItems = this.rows.length;
    console.log('✅ ThemesDemo - Data generated:', {
      rowsCount: this.rows.length,
      columnsCount: this.columns.length,
      selectedTheme: this.selectedTheme,
      firstRow: this.rows[0],
      paginationTotal: this.paginationConfig.totalItems
    });
  }

  private themeStyleElement?: HTMLStyleElement;

  applyTheme() {
    console.log('🔄 Applying theme:', this.selectedTheme);
    this.themeService.setTheme(this.selectedTheme);
    
    // Force change detection first to update the class
    this.cdr.detectChanges();
    
    // Then inject the styles
    setTimeout(() => {
      this.injectThemeStyles();
      this.cdr.detectChanges();
    }, 0);
  }

  private injectThemeStyles() {
    // Remove existing theme style element if it exists
    if (this.themeStyleElement) {
      this.themeStyleElement.remove();
    }

    // Create new style element
    this.themeStyleElement = document.createElement('style');
    this.themeStyleElement.id = 'dynamic-theme-styles';

    let themeStyles = '';

    switch (this.selectedTheme) {
      case 'dark':
        themeStyles = `
          .preview-container.theme-dark .ngxsmk-datatable {
            background: #1e1e1e !important;
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__cell,
          .preview-container.theme-dark .ngxsmk-datatable__header-cell {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__header {
            background: #2d2d2d !important;
            border-bottom-color: #404040 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__header-row {
            background: #2d2d2d !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__header-cell {
            color: #64b5f6 !important;
            background: transparent !important;
            border-bottom-color: #404040 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__header-cell,
          .preview-container.theme-dark .ngxsmk-datatable__header-cell *,
          .preview-container.theme-dark .ngxsmk-datatable__header-cell span {
            color: #64b5f6 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__body {
            background: #1e1e1e !important;
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__row {
            background: #1e1e1e !important;
            border-bottom-color: #333 !important;
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__row:nth-child(even) {
            background: #252525 !important;
          }

          /* Hover effects for dark theme */
          .preview-container.theme-dark .datatable-wrapper.hover-effects .ngxsmk-datatable__row:hover {
            background: #2d2d2d !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
          }

          .preview-container.theme-dark .datatable-wrapper:not(.hover-effects) .ngxsmk-datatable__row:hover {
            background: inherit !important;
            box-shadow: none !important;
          }

          /* Striped rows for dark theme */
          .preview-container.theme-dark .datatable-wrapper.striped-rows .ngxsmk-datatable__row--odd {
            background: #1e1e1e !important;
          }

          .preview-container.theme-dark .datatable-wrapper.striped-rows .ngxsmk-datatable__row--even {
            background: #252525 !important;
          }

          .preview-container.theme-dark .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(odd) {
            background: #1e1e1e !important;
          }

          .preview-container.theme-dark .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(even) {
            background: #252525 !important;
          }

          .preview-container.theme-dark .datatable-wrapper.striped-rows.hover-effects .ngxsmk-datatable__row:hover {
            background: #2d2d2d !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__cell {
            color: #e0e0e0 !important;
            background: transparent !important;
            border-bottom-color: #333 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__cell *:not(.status-active):not(.status-inactive):not(.status-pending) {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__cell span:not([class*="status-"]) {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-datatable__cell div:not([class*="status-"]) {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .theme-cell {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .theme-value {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .category-badge {
            filter: brightness(1.3) !important;
          }

          .preview-container.theme-dark .ngxsmk-pager {
            background: #2d2d2d !important;
            border-top-color: #404040 !important;
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager * {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__button {
            background: #1e1e1e !important;
            border-color: #555 !important;
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__button:hover {
            background: #333 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__button--active {
            background: #64b5f6 !important;
            border-color: #64b5f6 !important;
            color: #1e1e1e !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__range {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__range-text {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__total {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__total-text {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__page-size {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__page-size-label {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__page-size-select {
            background: #1e1e1e !important;
            color: #e0e0e0 !important;
            border: 1px solid #555 !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__page-size-select option {
            background: #1e1e1e !important;
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager__ellipsis {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager label {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager span {
            color: #e0e0e0 !important;
          }

          .preview-container.theme-dark .ngxsmk-pager select {
            background: #1e1e1e !important;
            color: #e0e0e0 !important;
            border-color: #555 !important;
          }
        `;
        break;

      case 'material':
        themeStyles = `
          .preview-container.theme-material .ngxsmk-datatable {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-material .ngxsmk-datatable__cell,
          .preview-container.theme-material .ngxsmk-datatable__header-cell {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-material .ngxsmk-datatable__header {
            background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }

          .preview-container.theme-material .ngxsmk-datatable__header-cell {
            color: white !important;
            background: transparent !important;
          }

          .preview-container.theme-material .ngxsmk-datatable__header-cell,
          .preview-container.theme-material .ngxsmk-datatable__header-cell *,
          .preview-container.theme-material .ngxsmk-datatable__header-cell span,
          .preview-container.theme-material .theme-cell,
          .preview-container.theme-material .theme-value {
            color: white !important;
          }

          .preview-container.theme-material .ngxsmk-datatable__row {
            background: white !important;
          }

          /* Hover effects for material theme */
          .preview-container.theme-material .datatable-wrapper.hover-effects .ngxsmk-datatable__row:hover {
            background: #e3f2fd !important;
            box-shadow: 0 2px 4px rgba(25, 118, 210, 0.1) !important;
          }

          .preview-container.theme-material .datatable-wrapper:not(.hover-effects) .ngxsmk-datatable__row:hover {
            background: inherit !important;
            box-shadow: none !important;
          }

          .preview-container.theme-material .ngxsmk-datatable__cell,
          .preview-container.theme-material .ngxsmk-datatable__cell * {
            color: #333 !important;
          }

          /* Striped rows for material theme */
          .preview-container.theme-material .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(odd) {
            background: white !important;
          }

          .preview-container.theme-material .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(even) {
            background: #f5f5f5 !important;
          }

          .preview-container.theme-material .datatable-wrapper.striped-rows.hover-effects .ngxsmk-datatable__row:hover {
            background: #e3f2fd !important;
            box-shadow: 0 2px 4px rgba(25, 118, 210, 0.1) !important;
          }
        `;
        break;

      case 'minimal':
        themeStyles = `
          .preview-container.theme-minimal .ngxsmk-datatable {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-minimal .ngxsmk-datatable__cell,
          .preview-container.theme-minimal .ngxsmk-datatable__header-cell {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-minimal .ngxsmk-datatable__header {
            background: transparent !important;
            border-bottom: 2px solid #e0e0e0 !important;
          }

          .preview-container.theme-minimal .ngxsmk-datatable__header-cell {
            color: #666 !important;
            background: transparent !important;
            border-right: none !important;
          }

          .preview-container.theme-minimal .ngxsmk-datatable__header-cell,
          .preview-container.theme-minimal .ngxsmk-datatable__header-cell *,
          .preview-container.theme-minimal .theme-cell,
          .preview-container.theme-minimal .theme-value {
            color: #666 !important;
          }

          .preview-container.theme-minimal .ngxsmk-datatable__row {
            background: white !important;
            border-bottom: 1px solid #f0f0f0 !important;
          }

          /* Hover effects for minimal theme */
          .preview-container.theme-minimal .datatable-wrapper.hover-effects .ngxsmk-datatable__row:hover {
            background: #f9f9f9 !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
          }

          .preview-container.theme-minimal .datatable-wrapper:not(.hover-effects) .ngxsmk-datatable__row:hover {
            background: inherit !important;
            box-shadow: none !important;
          }

          .preview-container.theme-minimal .ngxsmk-datatable__cell {
            border-right: none !important;
            border-bottom-color: #f0f0f0 !important;
          }

          .preview-container.theme-minimal .ngxsmk-datatable__cell,
          .preview-container.theme-minimal .ngxsmk-datatable__cell * {
            color: #333 !important;
          }

          /* Striped rows for minimal theme */
          .preview-container.theme-minimal .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(odd) {
            background: white !important;
          }

          .preview-container.theme-minimal .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(even) {
            background: #fafafa !important;
          }

          .preview-container.theme-minimal .datatable-wrapper.striped-rows.hover-effects .ngxsmk-datatable__row:hover {
            background: #f0f0f0 !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
          }
        `;
        break;

      case 'colorful':
        themeStyles = `
          .preview-container.theme-colorful .ngxsmk-datatable {
            background: white !important;
            border: 1px solid #f48fb1 !important;
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__cell,
          .preview-container.theme-colorful .ngxsmk-datatable__header-cell {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__header {
            background: linear-gradient(135deg, #e91e63 0%, #f48fb1 100%) !important;
            border-bottom: 2px solid #e91e63 !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__header-row {
            background: transparent !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__header-cell {
            color: white !important;
            background: transparent !important;
            border-bottom-color: rgba(255, 255, 255, 0.3) !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__header-cell,
          .preview-container.theme-colorful .ngxsmk-datatable__header-cell *,
          .preview-container.theme-colorful .ngxsmk-datatable__header-cell span {
            color: white !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__header-cell:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__header-cell--sorted {
            background: rgba(255, 255, 255, 0.15) !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__body {
            background: white !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__row {
            background: white !important;
            border-bottom-color: #f8bbd0 !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__row:nth-child(odd) {
            background: #fff !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__row:nth-child(even) {
            background: #fce4ec !important;
          }

          /* Striped rows for colorful theme */
          .preview-container.theme-colorful .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(odd) {
            background: #fff !important;
          }

          .preview-container.theme-colorful .datatable-wrapper.striped-rows .ngxsmk-datatable__row:nth-child(even) {
            background: #fce4ec !important;
          }

          /* Hover effects for colorful theme */
          .preview-container.theme-colorful .datatable-wrapper.hover-effects .ngxsmk-datatable__row:hover {
            background: #f8bbd0 !important;
            box-shadow: 0 2px 4px rgba(233, 30, 99, 0.2) !important;
          }

          .preview-container.theme-colorful .datatable-wrapper:not(.hover-effects) .ngxsmk-datatable__row:hover {
            background: inherit !important;
            box-shadow: none !important;
          }

          .preview-container.theme-colorful .datatable-wrapper.striped-rows.hover-effects .ngxsmk-datatable__row:hover {
            background: #f8bbd0 !important;
            box-shadow: 0 2px 4px rgba(233, 30, 99, 0.2) !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__cell {
            color: #333 !important;
            border-bottom-color: #f8bbd0 !important;
          }

          .preview-container.theme-colorful .ngxsmk-datatable__cell,
          .preview-container.theme-colorful .ngxsmk-datatable__cell *:not(.status-active):not(.status-inactive):not(.status-pending) {
            color: #333 !important;
          }

          .preview-container.theme-colorful .theme-cell,
          .preview-container.theme-colorful .theme-value {
            color: #333 !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager {
            background: #fce4ec !important;
            border-top: 2px solid #e91e63 !important;
            color: #333 !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager * {
            color: #333 !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager__page-size-label,
          .preview-container.theme-colorful .ngxsmk-pager__range-text,
          .preview-container.theme-colorful .ngxsmk-pager__total-text {
            color: #333 !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager__page-size-select {
            background: white !important;
            color: #333 !important;
            border: 1px solid #e91e63 !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager__button {
            background: white !important;
            border-color: #e91e63 !important;
            color: #e91e63 !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager__button:hover {
            background: #f8bbd0 !important;
            color: #c2185b !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager__button--active {
            background: #e91e63 !important;
            border-color: #e91e63 !important;
            color: white !important;
          }

          .preview-container.theme-colorful .ngxsmk-pager__button:disabled {
            opacity: 0.4 !important;
          }
        `;
        break;

      default:
        themeStyles = `
          .preview-container.theme-default .ngxsmk-datatable {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-default .ngxsmk-datatable__cell,
          .preview-container.theme-default .ngxsmk-datatable__header-cell {
            font-size: ${this.fontSize}px !important;
          }

          .preview-container.theme-default .ngxsmk-datatable__header {
            background: #f5f5f5 !important;
          }

          .preview-container.theme-default .ngxsmk-datatable__header-cell {
            color: #333 !important;
          }

          .preview-container.theme-default .ngxsmk-datatable__row {
            background: white !important;
          }

          /* Hover effects for default theme */
          .preview-container.theme-default .datatable-wrapper.hover-effects .ngxsmk-datatable__row:hover {
            background: #f0f7ff !important;
            box-shadow: 0 1px 3px rgba(33, 150, 243, 0.1) !important;
          }

          .preview-container.theme-default .datatable-wrapper:not(.hover-effects) .ngxsmk-datatable__row:hover {
            background: inherit !important;
            box-shadow: none !important;
          }

          .preview-container.theme-default .ngxsmk-datatable__cell,
          .preview-container.theme-default .ngxsmk-datatable__cell *,
          .preview-container.theme-default .theme-cell,
          .preview-container.theme-default .theme-value {
            color: #333 !important;
          }
        `;
    }

    this.themeStyleElement.textContent = themeStyles;
    document.head.appendChild(this.themeStyleElement);
    
    console.log('🎨 Injected theme styles for:', this.selectedTheme);
  }

  onRowHeightChange(value: number) {
    this.rowHeight = Number(value);
    this.themeService.setRowHeight(this.rowHeight);
  }

  onFontSizeChange(value: number) {
    this.fontSize = Number(value);
    this.themeService.setFontSize(this.fontSize);
    // Re-inject theme styles with updated font size
    this.injectThemeStyles();
    this.cdr.detectChanges();
  }

  onStripedRowsChange(value: boolean) {
    console.log('🎨 Striped Rows changed to:', value);
    this.stripedRows = value;
    this.themeService.setStripedRows(value);
    // Re-inject theme styles to ensure striped rows work with current theme
    this.injectThemeStyles();
    this.cdr.detectChanges();
  }

  onHoverEffectsChange(value: boolean) {
    console.log('✨ Hover Effects changed to:', value);
    this.hoverEffects = value;
    this.themeService.setHoverEffects(value);
    // Re-inject theme styles to ensure hover effects work with current theme
    this.injectThemeStyles();
    this.cdr.detectChanges();
  }

  resetTheme() {
    this.themeService.resetToDefaults();
  }

  onSelect(event: any) {
    this.selectedRows = event.selected;
  }

  getThemeClass(): string {
    const classes = `preview-container theme-${this.selectedTheme}`;
    console.log('🎯 Theme class:', classes);
    return classes;
  }

  getTableClass(): string {
    let classes = `theme-${this.selectedTheme}`;
    if (this.stripedRows) classes += ' striped-rows';
    if (this.hoverEffects) classes += ' hover-effects';
    return classes;
  }

  getCellThemeClass(value: string): string {
    return `theme-${this.selectedTheme}-cell`;
  }

  getThemeColor(value: string): string {
    const colors = {
      'Technology': '#2196f3',
      'Business': '#4caf50',
      'Science': '#ff9800',
      'Arts': '#e91e63',
      'Sports': '#9c27b0'
    };
    return colors[value as keyof typeof colors] || '#666';
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusIcon(status: string): string {
    const icons = {
      'Active': 'fas fa-check-circle',
      'Inactive': 'fas fa-times-circle',
      'Pending': 'fas fa-clock'
    };
    return icons[status as keyof typeof icons] || 'fas fa-question';
  }

  getThemeDescription(): string {
    const descriptions = {
      'default': 'Clean and simple design with standard colors',
      'material': 'Google Material Design 3 with modern styling',
      'dark': 'Dark theme optimized for low-light environments',
      'minimal': 'Minimalist design with subtle colors and clean lines',
      'colorful': 'Vibrant colors and playful design elements'
    };
    return descriptions[this.selectedTheme as keyof typeof descriptions] || '';
  }

  getPrimaryColor(): string {
    const colors = {
      'default': '#2196f3',
      'material': '#1976d2',
      'dark': '#64b5f6',
      'minimal': '#666666',
      'colorful': '#e91e63'
    };
    return colors[this.selectedTheme as keyof typeof colors] || '#2196f3';
  }

  getSecondaryColor(): string {
    const colors = {
      'default': '#f5f5f5',
      'material': '#f5f5f5',
      'dark': '#2d2d2d',
      'minimal': '#f9f9f9',
      'colorful': '#fce4ec'
    };
    return colors[this.selectedTheme as keyof typeof colors] || '#f5f5f5';
  }

  getBackgroundColor(): string {
    const colors = {
      'default': '#ffffff',
      'material': '#ffffff',
      'dark': '#1e1e1e',
      'minimal': '#ffffff',
      'colorful': '#ffffff'
    };
    return colors[this.selectedTheme as keyof typeof colors] || '#ffffff';
  }

  getCssExample(): string {
    return `.ngxsmk-datatable {
  --ngxsmk-primary-color: ${this.getPrimaryColor()};
  --ngxsmk-secondary-color: ${this.getSecondaryColor()};
  --ngxsmk-background-color: ${this.getBackgroundColor()};
  --ngxsmk-font-size: ${this.fontSize}px;
  --ngxsmk-row-height: ${this.rowHeight}px;
}

.ngxsmk-datatable.striped-rows .ngxsmk-datatable__row:nth-child(even) {
  background-color: var(--ngxsmk-secondary-color);
}

.ngxsmk-datatable.hover-effects .ngxsmk-datatable__row:hover {
  background-color: var(--ngxsmk-primary-color);
  color: white;
}`;
  }

  private generateMockData(count: number): NgxsmkRow[] {
    const categories = ['Technology', 'Business', 'Science', 'Arts', 'Sports'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const data = [];

    for (let i = 1; i <= count; i++) {
      data.push({
        id: i,
        name: `Item ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        value: Math.floor(Math.random() * 1000),
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }

    return data;
  }
}
