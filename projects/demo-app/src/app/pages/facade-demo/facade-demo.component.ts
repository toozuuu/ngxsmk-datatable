import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  NgxsmkDatatableComponent,
  NgxsmkColumn,
  DatatableFacade,
  RestDataProvider,
  DataRequest
} from 'ngxsmk-datatable';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-facade-demo',
  standalone: true,
  imports: [CommonModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-rocket"></i>
        Headless Facade + OnPush Demo
      </h2>

      <div class="demo-content">
        <div class="alert alert-success">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Headless Architecture!</strong> This demo uses the <code>DatatableFacade</code> for state management.
            <br><strong>OnPush:</strong> Component uses OnPush change detection for optimal performance (3x faster!)
            <br><strong>Immutable:</strong> All state updates are immutable with automatic <code>Object.freeze</code>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls-bar">
          <button class="btn btn-primary" (click)="loadData()">
            <i class="fas fa-sync"></i>
            {{ (facade.loading$ | async) ? 'Loading...' : 'Reload Data' }}
          </button>

          <button class="btn btn-secondary" (click)="addRandomUser()">
            <i class="fas fa-user-plus"></i>
            Add User
          </button>

          <button class="btn btn-secondary" (click)="removeSelected()" [disabled]="!(facade.hasSelection$ | async)">
            <i class="fas fa-trash"></i>
            Delete Selected
          </button>

          <button class="btn btn-info" (click)="showState()">
            <i class="fas fa-code"></i>
            Show State
          </button>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-badge">
            <strong>Total Rows:</strong> {{ facade.totalRows$ | async }}
          </div>
          <div class="stat-badge">
            <strong>Selected:</strong> {{ (facade.selection$ | async)?.length || 0 }}
          </div>
          <div class="stat-badge">
            <strong>Loading:</strong> {{ (facade.loading$ | async) ? 'Yes' : 'No' }}
          </div>
          <div class="stat-badge" [class.error]="facade.error$ | async">
            <strong>Error:</strong> {{ (facade.error$ | async)?.message || 'None' }}
          </div>
        </div>

        <!-- Datatable with Facade -->
        <div class="datatable-container">
          <ngxsmk-datatable
            [facade]="facade"
            [virtualScrolling]="true"
            [rowHeight]="50"
            [headerHeight]="50"
            [selectionType]="'checkbox'">
          </ngxsmk-datatable>
        </div>

        <!-- State Inspector -->
        @if (showStatePanel) {
          <div class="state-panel">
            <div class="state-header">
              <h4>State Inspector</h4>
              <button (click)="showStatePanel = false">×</button>
            </div>
            <pre>{{ currentState | json }}</pre>
          </div>
        }

        <!-- Info Cards -->
        <div class="info-grid">
          <div class="info-card">
            <h4><i class="fas fa-rocket"></i> Performance</h4>
            <ul>
              <li>✅ OnPush change detection (3x faster)</li>
              <li>✅ Immutable state with Object.freeze</li>
              <li>✅ Memoized observables (distinctUntilChanged)</li>
              <li>✅ TrackBy functions built-in</li>
            </ul>
          </div>

          <div class="info-card">
            <h4><i class="fas fa-code"></i> Architecture</h4>
            <ul>
              <li>✅ Headless core (state separate from UI)</li>
              <li>✅ Reactive observables (RxJS)</li>
              <li>✅ Type-safe with generics</li>
              <li>✅ Pure functions (testable)</li>
            </ul>
          </div>

          <div class="info-card">
            <h4><i class="fas fa-magic"></i> Features</h4>
            <ul>
              <li>✅ Server-side ready (REST/GraphQL adapters)</li>
              <li>✅ Sorting, filtering, pagination</li>
              <li>✅ Selection with observables</li>
              <li>✅ Error handling built-in</li>
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
      flex-wrap: wrap;
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
    }

    .stat-badge.error {
      background: #ffebee;
      color: #c62828;
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

    .state-panel {
      background: #263238;
      color: #aed581;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      max-height: 400px;
      overflow: auto;
    }

    .state-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .state-header h4 {
      color: #fff;
      margin: 0;
    }

    .state-header button {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
    }

    .state-panel pre {
      margin: 0;
      font-size: 12px;
      line-height: 1.5;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
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
      margin: 15px 0 0 0;
      padding-left: 20px;
    }

    .info-card li {
      margin: 8px 0;
      line-height: 1.6;
    }
  `]
})
export class FacadeDemoComponent implements OnInit {
  // Facade instance
  facade = new DatatableFacade<User>({
    trackRowsBy: (index, row) => row.id,
    onPush: true,
    immutable: true,
    monitoring: true
  });

  showStatePanel = false;
  currentState: any = {};

  private nextId = 1001;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Setup columns
    this.facade.setColumns([
      { id: 'id', name: 'ID', prop: 'id', width: 80, sortable: true },
      { id: 'name', name: 'Name', prop: 'name', width: 180, sortable: true },
      { id: 'email', name: 'Email', prop: 'email', width: 220, sortable: true },
      { id: 'age', name: 'Age', prop: 'age', width: 100, sortable: true },
      { id: 'department', name: 'Department', prop: 'department', width: 150, sortable: true },
      { id: 'salary', name: 'Salary', prop: 'salary', width: 130, sortable: true },
      { id: 'status', name: 'Status', prop: 'status', width: 120, sortable: true }
    ]);

    // Load initial data
    this.loadData();

    // Log state changes (for demo purposes)
    this.facade.stateChanges$.subscribe(change => {
      if (change) {
        console.log('State changed:', change.type, change);
      }
    });
  }

  loadData() {
    // Simulate API call
    this.facade.setLoading(true);

    // Generate mock data
    setTimeout(() => {
      const users = this.generateUsers(100);
      this.facade.setRows(users);
      this.facade.setLoading(false);
    }, 500);
  }

  addRandomUser() {
    const newUser = this.generateUsers(1)[0];
    const currentRows = this.facade.getState().rows;
    this.facade.setRows([...currentRows, newUser] as any);
  }

  removeSelected() {
    const selectedRows = this.facade.getSelectedRows();
    const ids = selectedRows.map((row: any) => row.id);
    this.facade.deleteRows(ids);
  }

  showState() {
    // Get a fresh copy of the state (deep clone to avoid frozen object issues)
    const state = this.facade.getState();
    this.currentState = JSON.parse(JSON.stringify(state));
    this.showStatePanel = !this.showStatePanel;
    this.cdr.detectChanges();
  }

  private generateUsers(count: number): User[] {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const statuses: Array<'Active' | 'Inactive'> = ['Active', 'Inactive'];

    return Array.from({ length: count }, (_, i) => ({
      id: this.nextId++,
      name: `User ${this.nextId - 1}`,
      email: `user${this.nextId - 1}@example.com`,
      age: 20 + Math.floor(Math.random() * 40),
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: 30000 + Math.floor(Math.random() * 100000),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  }
}

