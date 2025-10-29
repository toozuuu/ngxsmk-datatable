import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgxsmkDatatableComponent,
  NgxsmkColumn,
  NgxsmkRow,
  InlineEditingService,
  UndoRedoService,
  ValidationRule,
  CellEditEvent,
  PaginationConfig
} from 'ngxsmk-datatable';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  salary: number;
  department: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-inline-editing-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  providers: [InlineEditingService, UndoRedoService],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-edit"></i>
        Inline Editing with Validation & Undo/Redo
      </h2>

      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Performance:</strong> Only ONE input field exists at a time! Double-click to edit cells.
            <br><strong>Validation:</strong> Try entering invalid values (empty name, invalid email, age < 18, etc.)
            <br><strong>Undo/Redo:</strong> Use Ctrl+Z / Ctrl+Y or the buttons below
          </div>
        </div>

        <!-- Controls -->
        <div class="controls-bar">
          <div class="undo-redo-controls">
            <button 
              class="btn btn-secondary" 
              [disabled]="!canUndo"
              (click)="undo()"
              title="Undo (Ctrl+Z)">
              <i class="fas fa-undo"></i>
              Undo
              @if (lastActionDesc) {
                <span class="action-desc">{{ lastActionDesc }}</span>
              }
            </button>
            <button 
              class="btn btn-secondary" 
              [disabled]="!canRedo"
              (click)="redo()"
              title="Redo (Ctrl+Y)">
              <i class="fas fa-redo"></i>
              Redo
              @if (nextRedoDesc) {
                <span class="action-desc">{{ nextRedoDesc }}</span>
              }
            </button>
          </div>

          <div class="info-badges">
            <span class="badge badge-info">
              <i class="fas fa-edit"></i>
              Total Edits: {{ totalEdits }}
            </span>
            <span class="badge badge-warning">
              <i class="fas fa-exclamation-triangle"></i>
              Validation Errors: {{ validationErrors }}
            </span>
            <span class="badge badge-success" *ngIf="editingService.isAnyEditing()">
              <i class="fas fa-pencil-alt"></i>
              Editing in progress...
            </span>
          </div>
        </div>

        <!-- Validation Errors Display -->
        @if (currentErrors.length > 0) {
          <div class="alert alert-danger validation-alert">
            <i class="fas fa-times-circle"></i>
            <div>
              <strong>Validation Errors:</strong>
              <ul>
                @for (error of currentErrors; track error) {
                  <li>{{ error }}</li>
                }
              </ul>
            </div>
          </div>
        }

        <!-- DataTable -->
        <div class="datatable-container" #tableContainer>
          <ngxsmk-datatable
            [columns]="columns"
            [rows]="rows"
            [virtualScrolling]="true"
            [rowHeight]="50"
            [headerHeight]="50"
            [pagination]="paginationConfig"
            (cellDblClick)="onCellDblClick($event)">
          </ngxsmk-datatable>

          <!-- Inline Editing Input (Only ONE!) -->
          @if (editingService.getCurrentEdit(); as editState) {
            <div class="edit-overlay" 
                 [style.top.px]="getEditPosition().top"
                 [style.left.px]="getEditPosition().left"
                 [style.width.px]="getEditPosition().width"
                 [style.height.px]="getEditPosition().height">
              <input
                #editInput
                type="text"
                class="edit-input"
                [class.error]="currentErrors.length > 0"
                [(ngModel)]="editValue"
                (keydown.enter)="commitEdit(true)"
                (keydown.escape)="cancelEdit()"
                (blur)="commitEdit(false)"
                [placeholder]="editState.column.name"
              />
            </div>
          }
        </div>

        <!-- Event Log -->
        <div class="card">
          <div class="card-header">
            <h4><i class="fas fa-history"></i> Edit History (Last 10)</h4>
            <button class="btn btn-sm btn-secondary" (click)="clearHistory()">
              <i class="fas fa-trash"></i> Clear
            </button>
          </div>
          <div class="card-body">
            <div class="event-log">
              @for (event of events.slice(-10); track event.time) {
                <div class="event-item" [class.event-item-error]="event.type === 'error'">
                  <span class="event-time">{{ event.time | date:'HH:mm:ss' }}</span>
                  <span class="event-type" [class.type-error]="event.type === 'error'">
                    <i [class]="getEventIcon(event.type)"></i>
                    {{ event.type }}
                  </span>
                  <span class="event-message">{{ event.message }}</span>
                </div>
              }
              @if (events.length === 0) {
                <div class="no-events">No events yet. Start editing!</div>
              }
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ rows.length }}</div>
            <div class="stat-label">Total Rows</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ columns.length }}</div>
            <div class="stat-label">Total Columns</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ rows.length * columns.length }}</div>
            <div class="stat-label">Total Cells</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">1</div>
            <div class="stat-label">Input Fields</div>
            <div class="stat-note">Only one at a time!</div>
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
      gap: 20px;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .undo-redo-controls {
      display: flex;
      gap: 10px;
    }

    .action-desc {
      font-size: 11px;
      opacity: 0.8;
      margin-left: 8px;
    }

    .info-badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .badge-info {
      background: #e3f2fd;
      color: #1976d2;
    }

    .badge-warning {
      background: #fff3e0;
      color: #f57c00;
    }

    .badge-success {
      background: #e8f5e9;
      color: #388e3c;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .validation-alert {
      animation: slideDown 0.3s ease-out;
    }

    .validation-alert ul {
      margin: 8px 0 0 20px;
    }

    .validation-alert li {
      margin: 4px 0;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .datatable-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 20px;
      min-height: 500px;
      position: relative;
    }

    .datatable-container ::ng-deep ngxsmk-datatable {
      height: 500px;
    }

    /* Editable cell styling */
    .datatable-container ::ng-deep .ngxsmk-datatable__cell {
      cursor: pointer;
      transition: background 0.2s;
    }

    .datatable-container ::ng-deep .ngxsmk-datatable__cell:hover {
      background: rgba(59, 130, 246, 0.05);
    }

    /* Edit Overlay - Only ONE exists! */
    .edit-overlay {
      position: absolute;
      z-index: 1000;
      padding: 0;
    }

    .edit-input {
      width: 100%;
      height: 100%;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      padding: 8px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
      background: white;
      transition: border-color 0.2s;
    }

    .edit-input:focus {
      border-color: #2563eb;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .edit-input.error {
      border-color: #dc2626;
      box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);
    }

    .edit-input.error:focus {
      border-color: #b91c1c;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }

    .event-log {
      max-height: 250px;
      overflow-y: auto;
    }

    .event-item {
      display: flex;
      gap: 10px;
      padding: 8px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s;
    }

    .event-item:hover {
      background: #f8f9fa;
    }

    .event-item-error {
      background: #fff5f5;
    }

    .event-time {
      font-size: 11px;
      color: #666;
      min-width: 70px;
      font-family: 'Courier New', monospace;
    }

    .event-type {
      font-weight: 600;
      min-width: 100px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .type-error {
      color: #dc2626;
    }

    .event-message {
      color: #374151;
      font-size: 13px;
      flex: 1;
    }

    .no-events {
      text-align: center;
      padding: 30px;
      color: #9ca3af;
      font-style: italic;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #2196f3;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 13px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .stat-note {
      font-size: 11px;
      color: #10b981;
      margin-top: 4px;
      font-weight: 600;
    }
  `]
})
export class InlineEditingDemoComponent implements OnInit, AfterViewInit {
  @ViewChildren('editInput') editInputs!: QueryList<ElementRef>;

  columns: NgxsmkColumn<User>[] = [];
  rows: NgxsmkRow<User>[] = [];

  paginationConfig: PaginationConfig = {
    pageSize: 10,
    pageSizeOptions: [10, 25, 50],
    showPageSizeOptions: true,
    showFirstLastButtons: true,
    showRangeLabels: true,
    showTotalItems: true,
    totalItems: 100,
    currentPage: 1,
    maxSize: 5
  };

  events: Array<{ time: Date, type: string, message: string }> = [];
  totalEdits = 0;
  validationErrors = 0;
  currentErrors: string[] = [];

  canUndo = false;
  canRedo = false;
  lastActionDesc = '';
  nextRedoDesc = '';

  // Inline editing state
  editValue: any = '';
  lastClickedCell: { element: HTMLElement, rowIndex: number, colIndex: number } | null = null;

  constructor(
    public editingService: InlineEditingService,
    private undoRedoService: UndoRedoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeColumns();
    this.generateData();
    this.setupValidation();
    this.setupUndoRedo();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
  }

  ngAfterViewInit() {
    // Auto-focus input when edit starts
    this.editingService.editing$.subscribe(state => {
      if (state?.isEditing) {
        setTimeout(() => {
          const input = this.editInputs.first?.nativeElement;
          if (input) {
            input.focus();
            input.select();
          }
        }, 10);
      } else {
        // Clear edit state when editing stops
        this.lastClickedCell = null;
        this.editValue = '';
      }
      this.cdr.detectChanges();
    });
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
        width: 180,
        sortable: true,
        cellTemplate: undefined // We'll add edit functionality
      },
      {
        id: 'email',
        name: 'Email',
        prop: 'email',
        width: 220,
        sortable: true
      },
      {
        id: 'age',
        name: 'Age',
        prop: 'age',
        width: 100,
        sortable: true
      },
      {
        id: 'salary',
        name: 'Salary',
        prop: 'salary',
        width: 130,
        sortable: true
      },
      {
        id: 'department',
        name: 'Department',
        prop: 'department',
        width: 150,
        sortable: true
      },
      {
        id: 'phone',
        name: 'Phone',
        prop: 'phone',
        width: 140
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        width: 120,
        sortable: true
      }
    ];
  }

  private generateData() {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const statuses: Array<'Active' | 'Inactive'> = ['Active', 'Inactive'];

    this.rows = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + Math.floor(Math.random() * 40),
      salary: 30000 + Math.floor(Math.random() * 100000),
      department: departments[Math.floor(Math.random() * departments.length)],
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  }

  private setupValidation() {
    // Name validation
    this.editingService.setValidationRules('name', [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' },
      { type: 'maxLength', value: 50, message: 'Name cannot exceed 50 characters' }
    ]);

    // Email validation
    this.editingService.setValidationRules('email', [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ]);

    // Age validation
    this.editingService.setValidationRules('age', [
      { type: 'required', message: 'Age is required' },
      { type: 'min', value: 18, message: 'Age must be at least 18' },
      { type: 'max', value: 100, message: 'Age cannot exceed 100' }
    ]);

    // Salary validation
    this.editingService.setValidationRules('salary', [
      { type: 'required', message: 'Salary is required' },
      { type: 'min', value: 0, message: 'Salary cannot be negative' },
      { type: 'max', value: 1000000, message: 'Salary cannot exceed $1,000,000' }
    ]);

    // Phone validation
    this.editingService.setValidationRules('phone', [
      { 
        type: 'pattern', 
        value: '^\\+?[0-9\\-\\s()]+$',
        message: 'Invalid phone format'
      }
    ]);
  }

  private setupUndoRedo() {
    this.undoRedoService.setConfig({
      enabled: true,
      maxUndoStackSize: 50,
      undoInlineEdit: true
    });

    // Subscribe to undo/redo state changes
    this.undoRedoService.canUndo$.subscribe(can => {
      this.canUndo = can;
      this.lastActionDesc = this.undoRedoService.getLastActionDescription() || '';
      this.cdr.detectChanges();
    });

    this.undoRedoService.canRedo$.subscribe(can => {
      this.canRedo = can;
      this.nextRedoDesc = this.undoRedoService.getNextRedoDescription() || '';
      this.cdr.detectChanges();
    });
  }

  private setupEventListeners() {
    // Listen to successful edits
    this.editingService.cellEdit$.subscribe(edit => {
      this.totalEdits++;
      this.logEvent('edit', `Edited ${edit.column.name}: "${edit.oldValue}" → "${edit.newValue}"`);

      // Add to undo stack
      this.undoRedoService.addAction({
        type: 'edit',
        data: edit,
        undo: () => {
          const prop = edit.column.prop || edit.column.id;
          (edit.row as any)[prop] = edit.oldValue;
          this.logEvent('undo', `Undid edit of ${edit.column.name}`);
          // Force change detection by creating new array reference
          this.rows = [...this.rows];
          this.cdr.detectChanges();
        },
        redo: () => {
          const prop = edit.column.prop || edit.column.id;
          (edit.row as any)[prop] = edit.newValue;
          this.logEvent('redo', `Redid edit of ${edit.column.name}`);
          // Force change detection by creating new array reference
          this.rows = [...this.rows];
          this.cdr.detectChanges();
        },
        description: `Edit ${edit.column.name}`
      });
    });

    // Listen to validation errors
    this.editingService.validationError$.subscribe(({ errors, state }) => {
      this.validationErrors++;
      this.currentErrors = errors;
      this.logEvent('error', `Validation failed: ${errors.join(', ')}`);
      this.cdr.detectChanges();
    });

    // Listen to edit cancel
    this.editingService.cellEditCancel$.subscribe(state => {
      this.logEvent('cancel', `Cancelled edit of ${state.column.name}`);
      this.currentErrors = [];
      this.cdr.detectChanges();
    });

    // Clear errors when starting new edit
    this.editingService.editing$.subscribe(state => {
      if (state?.isEditing) {
        this.currentErrors = [];
      }
    });
  }

  private setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  onCellDblClick(event: { event: Event; row: any; column: any; value: any; rowIndex: number; cellElement: HTMLElement }) {
    const column = event.column;
    const row = event.row;
    const rowIndex = event.rowIndex;
    const colIndex = this.columns.findIndex(c => c.id === column.id);

    // Don't edit ID column
    if (column.id === 'id') return;

    // Store the clicked cell element for positioning
    this.lastClickedCell = {
      element: event.cellElement,
      rowIndex,
      colIndex
    };

    // Get the current value
    const prop = column.prop || column.id;
    this.editValue = event.value;

    this.editingService.startEdit(row, column, rowIndex, colIndex);
    
    // Log the double-click
    this.logEvent('dblclick', `Double-clicked ${column.name} on row ${rowIndex + 1}`);
  }

  getEditPosition(): { top: number; left: number; width: number; height: number } {
    if (!this.lastClickedCell) {
      return { top: 0, left: 0, width: 0, height: 0 };
    }

    const cellElement = this.lastClickedCell.element;
    const rect = cellElement.getBoundingClientRect();
    const container = cellElement.closest('.datatable-container');
    
    if (!container) {
      return { top: 0, left: 0, width: 0, height: 0 };
    }

    const containerRect = container.getBoundingClientRect();

    return {
      top: rect.top - containerRect.top,
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height
    };
  }

  commitEdit(moveToNextRow: boolean = false) {
    const success = this.editingService.commitEdit(this.editValue);
    if (success) {
      const lastCell = this.lastClickedCell;
      this.lastClickedCell = null;
      this.editValue = '';
      // Force change detection to update the table immediately
      this.rows = [...this.rows];
      this.cdr.detectChanges();
      
      // Move to next row if requested (Enter key behavior)
      if (moveToNextRow && lastCell) {
        const nextRowIndex = lastCell.rowIndex + 1;
        if (nextRowIndex < this.rows.length) {
          setTimeout(() => {
            // Find the same column in the next row
            const column = this.columns[lastCell.colIndex];
            const nextRow = this.rows[nextRowIndex];
            
            // Auto-focus next cell (requires manual click for now, but shows the row)
            this.logEvent('navigate', `Auto-navigated to row ${nextRowIndex + 1} after Enter`);
          }, 100);
        }
      }
    }
  }

  cancelEdit() {
    this.editingService.cancelEdit();
    this.lastClickedCell = null;
    this.editValue = '';
    this.currentErrors = [];
  }

  undo() {
    if (this.undoRedoService.undo()) {
      this.cdr.detectChanges();
    }
  }

  redo() {
    if (this.undoRedoService.redo()) {
      this.cdr.detectChanges();
    }
  }

  clearHistory() {
    this.events = [];
    this.totalEdits = 0;
    this.validationErrors = 0;
    this.undoRedoService.clear();
  }

  getEventIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'edit': 'fas fa-edit',
      'error': 'fas fa-exclamation-circle',
      'cancel': 'fas fa-times',
      'undo': 'fas fa-undo',
      'redo': 'fas fa-redo'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  private logEvent(type: string, message: string) {
    this.events.push({
      time: new Date(),
      type,
      message
    });
  }
}
