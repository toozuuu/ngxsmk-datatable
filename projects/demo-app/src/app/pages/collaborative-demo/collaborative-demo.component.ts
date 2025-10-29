import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborativeEditingService, CollaborativeUser, CollaborativeOperation } from 'ngxsmk-datatable';
import { Subject, takeUntil } from 'rxjs';

interface NgxsmkColumn {
  field: string;
  header: string;
  width?: number;
  sortable?: boolean;
}

@Component({
  selector: 'app-collaborative-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-users"></i>
        <div class="header-content">
          <h1 class="header-title">👥 Real-time Collaborative Editing</h1>
          <p class="header-description">
            Multi-user editing with WebSocket, live cursors, and conflict resolution
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Collaborative Editing Features:</strong>
            Real-time multi-user editing with WebSocket support, live cursor tracking, 
            user presence, conflict detection, and operational transformation.
          </div>
        </div>

        <!-- Demo Preview -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-desktop"></i> Live Collaboration Demo</h3>
            <div class="d-flex gap-2">
              <span class="badge" [class]="getStatusBadgeClass()">
                <i class="fas fa-circle"></i> {{ getStatusText() }}
              </span>
              <span class="badge badge-info">{{ activeUsers.length }} Users Active</span>
            </div>
          </div>
          <div class="card-body">
            <!-- Active Users -->
            <div class="active-users-panel">
              <h4>Active Users</h4>
              <div class="users-list">
                <div class="user-badge" *ngFor="let user of activeUsers" 
                     [style.border-color]="user.color">
                  <div class="user-avatar" [style.background]="user.color">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-status">
                      <i class="fas fa-circle"></i> {{ getUserStatus(user) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Collaborative Datatable -->
            <div class="demo-table">
              <table>
                <thead>
                  <tr>
                    <th *ngFor="let col of columns">{{ col.header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of data">
                    <td>{{ row.id }}</td>
                    <td>{{ row.task }}</td>
                    <td>{{ row.assignee }}</td>
                    <td>{{ row.status }}</td>
                    <td>{{ row.priority }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Recent Changes -->
            <div class="changes-log">
              <h4><i class="fas fa-history"></i> Recent Changes</h4>
              <div class="change-item" *ngFor="let change of recentChanges">
                <div class="change-avatar" [style.background]="change.userColor">
                  {{ change.userName.charAt(0) }}
                </div>
                <div class="change-details">
                  <strong>{{ change.userName }}</strong> {{ change.action }}
                  <span class="change-time">{{ change.time }}</span>
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
            <pre><code>import &#123; CollaborativeEditingService &#125; from 'ngxsmk-datatable';

// Initialize collaborative editing
constructor(private collaborative: CollaborativeEditingService) &#123;&#125;

ngOnInit() &#123;
  this.collaborative.initialize(&#123;
    enabled: true,
    websocketUrl: 'ws://localhost:3000',
    userId: 'user-123',
    userName: 'John Doe',
    userColor: '#3b82f6',
    roomId: 'datatable-room',
    showCursors: true,
    showSelections: true,
    conflictResolution: 'operational-transform',
    autoReconnect: true
  &#125;);

  // Listen to operations
  this.collaborative.operations$.subscribe(op => &#123;
    console.log('Remote operation:', op);
  &#125;);

  // Broadcast local changes
  this.collaborative.broadcastOperation(&#123;
    id: 'op-1',
    type: 'cell-edit',
    userId: 'user-123',
    timestamp: Date.now(),
    data: &#123; row: 0, field: 'name', value: 'New Value' &#125;
  &#125;);
&#125;</code></pre>
          </div>
        </div>

        <!-- Features List -->
        <div class="features-grid mt-4">
          <div class="feature-item">
            <i class="fas fa-wifi feature-icon"></i>
            <h4>WebSocket Support</h4>
            <p>Real-time bidirectional communication</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-mouse-pointer feature-icon"></i>
            <h4>Live Cursors</h4>
            <p>See where other users are editing</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-users-cog feature-icon"></i>
            <h4>User Presence</h4>
            <p>Track who's online and active</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-shield-alt feature-icon"></i>
            <h4>Conflict Resolution</h4>
            <p>Smart handling of concurrent edits</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-sync-alt feature-icon"></i>
            <h4>Auto Sync</h4>
            <p>Automatic state synchronization</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-plug feature-icon"></i>
            <h4>Auto Reconnect</h4>
            <p>Resilient connection handling</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .active-users-panel {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .active-users-panel h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .users-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 2px solid #e5e7eb;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 18px;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-name {
      font-weight: 600;
      color: #1f2937;
    }

    .user-status {
      font-size: 12px;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .user-status i {
      color: #10b981;
      font-size: 8px;
    }

    .changes-log {
      margin-top: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .changes-log h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .change-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .change-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .change-details {
      flex: 1;
      font-size: 14px;
      color: #4b5563;
    }

    .change-time {
      font-size: 12px;
      color: #9ca3af;
      margin-left: 8px;
    }

    .collaborative-table {
      margin: 24px 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .feature-item {
      padding: 24px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }

    .feature-icon {
      font-size: 32px;
      color: #3b82f6;
      margin-bottom: 12px;
    }

    .feature-item h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .feature-item p {
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
export class CollaborativeDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error' = 'disconnected';
  simulationMode = true; // Using simulated mode since no real WebSocket server

  columns: NgxsmkColumn[] = [
    { field: 'id', header: 'ID', width: 80 },
    { field: 'task', header: 'Task', sortable: true },
    { field: 'assignee', header: 'Assignee', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'priority', header: 'Priority', sortable: true }
  ];

  data = [
    { id: 1, task: 'Implement login feature', assignee: 'John Doe', status: 'In Progress', priority: 'High' },
    { id: 2, task: 'Fix bug in dashboard', assignee: 'Jane Smith', status: 'Completed', priority: 'Medium' },
    { id: 3, task: 'Update documentation', assignee: 'Bob Johnson', status: 'Pending', priority: 'Low' },
    { id: 4, task: 'Code review', assignee: 'Alice Brown', status: 'In Progress', priority: 'High' },
    { id: 5, task: 'Deploy to staging', assignee: 'John Doe', status: 'Pending', priority: 'High' }
  ];

  activeUsers: CollaborativeUser[] = [];
  
  recentChanges: Array<{userName: string, userColor: string, action: string, time: string}> = [];

  constructor(private collaborativeService: CollaborativeEditingService) {}

  ngOnInit() {
    // Initialize with simulated users for demo purposes
    // In production, this would connect to a real WebSocket server
    this.initializeSimulatedMode();

    // Subscribe to service observables
    this.collaborativeService.activeUsers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.activeUsers = users;
      });

    this.collaborativeService.operations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(operation => {
        this.handleRemoteOperation(operation);
      });

    this.collaborativeService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.connectionStatus = status;
      });

    // Simulate real-time updates for demo
    setInterval(() => {
      if (this.simulationMode) {
        this.simulateUpdate();
      }
    }, 5000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.collaborativeService.disconnect();
  }

  private initializeSimulatedMode() {
    // Create simulated users for demo
    const simulatedUsers: CollaborativeUser[] = [
      {
        id: 'user-1',
        name: 'John Doe',
        color: '#3b82f6',
        lastActivity: Date.now(),
        online: true,
        permissions: { canEdit: true }
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        color: '#10b981',
        lastActivity: Date.now(),
        online: true,
        permissions: { canEdit: true }
      },
      {
        id: 'user-3',
        name: 'Bob Johnson',
        color: '#f59e0b',
        lastActivity: Date.now(),
        online: true,
        permissions: { canEdit: true }
      },
      {
        id: 'user-4',
        name: 'Alice Brown',
        color: '#ef4444',
        lastActivity: Date.now(),
        online: true,
        permissions: { canEdit: true }
      }
    ];

    this.activeUsers = simulatedUsers;
    this.connectionStatus = 'connected';

    // Add initial changes
    this.recentChanges = [
      { userName: 'John Doe', userColor: '#3b82f6', action: 'updated Task #1', time: '2 seconds ago' },
      { userName: 'Jane Smith', userColor: '#10b981', action: 'completed Task #2', time: '5 seconds ago' },
      { userName: 'Bob Johnson', userColor: '#f59e0b', action: 'added comment to Task #3', time: '12 seconds ago' },
      { userName: 'Alice Brown', userColor: '#ef4444', action: 'started Task #4', time: '30 seconds ago' }
    ];
  }

  private handleRemoteOperation(operation: CollaborativeOperation) {
    console.log('Received remote operation:', operation);
    
    // Apply the operation to local data
    if (operation.type === 'cell-edit' && operation.data) {
      const { row, field, value } = operation.data;
      if (this.data[row]) {
        (this.data[row] as any)[field] = value;
      }
    }

    // Add to recent changes
    const user = this.activeUsers.find(u => u.id === operation.userId);
    if (user) {
      this.addChange(user.name, user.color, this.getOperationDescription(operation));
    }
  }

  private getOperationDescription(operation: CollaborativeOperation): string {
    switch (operation.type) {
      case 'cell-edit':
        return `edited ${operation.data?.field || 'a cell'}`;
      case 'row-add':
        return 'added a new row';
      case 'row-delete':
        return 'deleted a row';
      case 'row-move':
        return 'moved a row';
      default:
        return 'made a change';
    }
  }

  private addChange(userName: string, userColor: string, action: string) {
    this.recentChanges.unshift({
      userName,
      userColor,
      action,
      time: 'just now'
    });

    if (this.recentChanges.length > 6) {
      this.recentChanges.pop();
    }
  }

  simulateUpdate() {
    if (this.activeUsers.length === 0) return;

    const randomUser = this.activeUsers[Math.floor(Math.random() * this.activeUsers.length)];
    const actions = ['updated', 'completed', 'started', 'commented on'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomTask = Math.floor(Math.random() * 5) + 1;
    
    this.addChange(
      randomUser.name,
      randomUser.color,
      `${randomAction} Task #${randomTask}`
    );
  }

  getStatusBadgeClass(): string {
    switch (this.connectionStatus) {
      case 'connected':
        return 'badge-success';
      case 'connecting':
        return 'badge-warning';
      case 'disconnected':
        return 'badge-secondary';
      case 'error':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(): string {
    switch (this.connectionStatus) {
      case 'connected':
        return this.simulationMode ? 'Demo Mode' : 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  }

  getUserStatus(user: CollaborativeUser): string {
    if (user.cursor?.editing) {
      return `Editing row ${(user.cursor.rowIndex || 0) + 1}`;
    } else if (user.cursor) {
      return `Viewing row ${(user.cursor.rowIndex || 0) + 1}`;
    }
    return 'Online';
  }
}

