import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-modes-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-th"></i>
        <div class="header-content">
          <h1 class="header-title">👁️ Alternative View Modes</h1>
          <p class="header-description">
            Gantt chart, Calendar, Kanban, and Timeline visualizations
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>View Mode Features:</strong>
            Transform your datatable into Gantt charts, Calendar views, Kanban boards, 
            Timeline views, and more with a single click.
          </div>
        </div>

        <!-- View Mode Selector -->
        <div class="view-mode-selector">
          <button 
            *ngFor="let mode of viewModes" 
            class="mode-btn"
            [class.active]="currentMode === mode.id"
            (click)="setMode(mode.id)">
            <i [class]="mode.icon"></i>
            <span>{{ mode.name }}</span>
          </button>
        </div>

        <!-- Gantt View -->
        <div class="card mb-4" *ngIf="currentMode === 'gantt'">
          <div class="card-header">
            <h3><i class="fas fa-chart-gantt"></i> Gantt Chart View</h3>
            <div class="zoom-controls">
              <button class="btn btn-sm" (click)="zoom = 'day'">Day</button>
              <button class="btn btn-sm" (click)="zoom = 'week'">Week</button>
              <button class="btn btn-sm" (click)="zoom = 'month'">Month</button>
            </div>
          </div>
          <div class="card-body">
            <div class="gantt-container">
              <div class="gantt-sidebar">
                <div class="gantt-row" *ngFor="let task of tasks">
                  <strong>{{ task.name }}</strong>
                  <p>{{ task.assignee }}</p>
                </div>
              </div>
              <div class="gantt-timeline">
                <div class="gantt-header">
                  <div class="gantt-month" *ngFor="let month of months">{{ month }}</div>
                </div>
                <div class="gantt-bars">
                  <div class="gantt-row" *ngFor="let task of tasks">
                    <div class="gantt-bar" 
                         [style.left.%]="task.startOffset"
                         [style.width.%]="task.duration"
                         [class.completed]="task.progress === 100">
                      <div class="bar-progress" [style.width.%]="task.progress"></div>
                      <span class="bar-label">{{ task.progress }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar View -->
        <div class="card mb-4" *ngIf="currentMode === 'calendar'">
          <div class="card-header">
            <h3><i class="fas fa-calendar"></i> Calendar View</h3>
            <div class="calendar-nav">
              <button class="btn btn-sm"><i class="fas fa-chevron-left"></i></button>
              <span>October 2025</span>
              <button class="btn btn-sm"><i class="fas fa-chevron-right"></i></button>
            </div>
          </div>
          <div class="card-body">
            <div class="calendar-grid">
              <div class="calendar-day-header" *ngFor="let day of weekDays">{{ day }}</div>
              <div class="calendar-day" *ngFor="let day of calendarDays" 
                   [class.other-month]="day.otherMonth"
                   [class.today]="day.isToday">
                <span class="day-number">{{ day.number }}</span>
                <div class="day-events">
                  <div class="event" *ngFor="let event of day.events" 
                       [style.background]="event.color">
                    {{ event.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kanban View -->
        <div class="card mb-4" *ngIf="currentMode === 'kanban'">
          <div class="card-header">
            <h3><i class="fas fa-columns"></i> Kanban Board View</h3>
          </div>
          <div class="card-body">
            <div class="kanban-board">
              <div class="kanban-column" 
                   *ngFor="let column of kanbanColumns; let colIndex = index"
                   (drop)="onDrop($event, colIndex)"
                   (dragover)="onDragOver($event)">
                <div class="column-header">
                  <h4>{{ column.title }}</h4>
                  <span class="count">{{ column.items.length }}</span>
                </div>
                <div class="column-body" 
                     [class.drag-over]="dragOverColumn === colIndex">
                  <div class="kanban-card" 
                       *ngFor="let item of column.items; let itemIndex = index"
                       draggable="true"
                       (dragstart)="onDragStart($event, colIndex, itemIndex)"
                       (dragend)="onDragEnd($event)">
                    <div class="drag-handle">
                      <i class="fas fa-grip-vertical"></i>
                    </div>
                    <h5>{{ item.title }}</h5>
                    <p>{{ item.description }}</p>
                    <div class="card-footer">
                      <span class="priority" [class]="'priority-' + item.priority">
                        {{ item.priority }}
                      </span>
                      <span class="assignee">{{ item.assignee }}</span>
                    </div>
                  </div>
                  <div class="empty-column" *ngIf="column.items.length === 0">
                    <i class="fas fa-inbox"></i>
                    <p>Drop cards here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline View -->
        <div class="card mb-4" *ngIf="currentMode === 'timeline'">
          <div class="card-header">
            <h3><i class="fas fa-stream"></i> Timeline View</h3>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div class="timeline-item" *ngFor="let event of timelineEvents; let i = index">
                <div class="timeline-marker" [class]="'marker-' + event.type"></div>
                <div class="timeline-content">
                  <div class="timeline-time">{{ event.time }}</div>
                  <h4>{{ event.title }}</h4>
                  <p>{{ event.description }}</p>
                  <div class="timeline-meta">
                    <span><i class="fas fa-user"></i> {{ event.user }}</span>
                    <span><i class="fas fa-tag"></i> {{ event.category }}</span>
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
            <pre><code>import &#123; ViewModesService &#125; from 'ngxsmk-datatable';

// Configure view modes
&lt;ngxsmk-datatable
  [data]="data"
  [columns]="columns"
  [viewModes]="&#123;
    enabled: true,
    defaultMode: 'table',
    availableModes: ['table', 'gantt', 'calendar', 'kanban', 'timeline'],
    gantt: &#123;
      startField: 'startDate',
      endField: 'endDate',
      progressField: 'progress',
      dependenciesField: 'dependencies'
    &#125;,
    calendar: &#123;
      dateField: 'date',
      titleField: 'title',
      colorField: 'category'
    &#125;,
    kanban: &#123;
      groupByField: 'status',
      cardTitleField: 'title',
      cardDescField: 'description'
    &#125;,
    timeline: &#123;
      dateField: 'timestamp',
      titleField: 'event',
      typeField: 'eventType'
    &#125;
  &#125;"&gt;
&lt;/ngxsmk-datatable&gt;</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .view-mode-selector {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
    }

    .mode-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mode-btn:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
    }

    .mode-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .mode-btn i {
      font-size: 24px;
    }

    /* Gantt Chart Styles */
    .gantt-container {
      display: flex;
      overflow-x: auto;
    }

    .gantt-sidebar {
      width: 200px;
      flex-shrink: 0;
      border-right: 2px solid #e5e7eb;
    }

    .gantt-timeline {
      flex: 1;
      min-width: 600px;
    }

    .gantt-row {
      height: 60px;
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .gantt-header {
      display: flex;
      border-bottom: 2px solid #e5e7eb;
      background: #f8f9fa;
    }

    .gantt-month {
      flex: 1;
      padding: 12px;
      text-align: center;
      font-weight: 600;
    }

    .gantt-bars {
      position: relative;
    }

    .gantt-bars .gantt-row {
      position: relative;
    }

    .gantt-bar {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 32px;
      background: #3b82f6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }

    .gantt-bar.completed {
      background: #10b981;
    }

    .bar-progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px 0 0 4px;
    }

    .bar-label {
      position: relative;
      z-index: 1;
    }

    /* Calendar Styles */
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: #e5e7eb;
      border: 1px solid #e5e7eb;
    }

    .calendar-day-header {
      background: #f8f9fa;
      padding: 12px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
    }

    .calendar-day {
      background: white;
      min-height: 100px;
      padding: 8px;
      position: relative;
    }

    .calendar-day.other-month {
      background: #f9fafb;
      opacity: 0.5;
    }

    .calendar-day.today {
      background: #eff6ff;
    }

    .day-number {
      font-weight: 600;
      color: #1f2937;
    }

    .day-events {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .event {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Kanban Styles */
    .kanban-board {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 16px;
    }

    .kanban-column {
      min-width: 300px;
      background: #f8f9fa;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 2px solid #e5e7eb;
    }

    .column-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .count {
      background: #3b82f6;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .column-body {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .kanban-card {
      background: white;
      padding: 16px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      cursor: move;
      transition: transform 0.2s;
      position: relative;
      user-select: none;
    }

    .kanban-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .kanban-card.dragging {
      opacity: 0.5;
      transform: rotate(2deg);
    }

    .drag-handle {
      position: absolute;
      top: 8px;
      right: 8px;
      color: #d1d5db;
      font-size: 12px;
      cursor: grab;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .column-body.drag-over {
      background: #eff6ff;
      border: 2px dashed #3b82f6;
      border-radius: 6px;
    }

    .empty-column {
      text-align: center;
      padding: 40px 20px;
      color: #d1d5db;
    }

    .empty-column i {
      font-size: 32px;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .empty-column p {
      margin: 0;
      font-size: 14px;
    }

    .kanban-card h5 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .kanban-card p {
      margin: 0 0 12px 0;
      font-size: 13px;
      color: #6b7280;
    }

    .kanban-card .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .priority {
      padding: 2px 8px;
      border-radius: 3px;
      font-weight: 600;
    }

    .priority-high { background: #fee2e2; color: #991b1b; }
    .priority-medium { background: #fef3c7; color: #92400e; }
    .priority-low { background: #d1fae5; color: #065f46; }

    /* Timeline Styles */
    .timeline {
      position: relative;
      padding: 20px 0 20px 40px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e5e7eb;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 32px;
      padding-left: 32px;
    }

    .timeline-marker {
      position: absolute;
      left: 8px;
      top: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      background: #3b82f6;
      z-index: 1;
    }

    .marker-success { background: #10b981; }
    .marker-warning { background: #f59e0b; }
    .marker-error { background: #ef4444; }

    .timeline-content {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
    }

    .timeline-time {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .timeline-content h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .timeline-content p {
      margin: 0 0 12px 0;
      color: #4b5563;
    }

    .timeline-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #6b7280;
    }

    .timeline-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .zoom-controls, .calendar-nav {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .btn {
      padding: 6px 12px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn:hover {
      background: #f3f4f6;
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
export class ViewModesDemoComponent {
  currentMode: 'gantt' | 'calendar' | 'kanban' | 'timeline' = 'gantt';
  zoom: 'day' | 'week' | 'month' = 'month';
  draggedItem: any = null;
  draggedFromColumn: number | null = null;
  draggedFromIndex: number | null = null;
  dragOverColumn: number | null = null;

  viewModes = [
    { id: 'gantt' as const, name: 'Gantt Chart', icon: 'fas fa-chart-gantt' },
    { id: 'calendar' as const, name: 'Calendar', icon: 'fas fa-calendar' },
    { id: 'kanban' as const, name: 'Kanban', icon: 'fas fa-columns' },
    { id: 'timeline' as const, name: 'Timeline', icon: 'fas fa-stream' }
  ];

  setMode(mode: string) {
    this.currentMode = mode as 'gantt' | 'calendar' | 'kanban' | 'timeline';
  }

  onDragStart(event: DragEvent, columnIndex: number, itemIndex: number) {
    this.draggedFromColumn = columnIndex;
    this.draggedFromIndex = itemIndex;
    this.draggedItem = this.kanbanColumns[columnIndex].items[itemIndex];
    
    // Add dragging class
    (event.target as HTMLElement).classList.add('dragging');
    
    // Set drag data
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/html', (event.target as HTMLElement).innerHTML);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    
    // Find which column we're over
    const target = (event.target as HTMLElement).closest('.kanban-column');
    if (target) {
      const columns = Array.from(target.parentElement!.children);
      this.dragOverColumn = columns.indexOf(target);
    }
  }

  onDrop(event: DragEvent, columnIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.draggedFromColumn !== null && this.draggedFromIndex !== null && this.draggedItem) {
      // Remove from original column
      this.kanbanColumns[this.draggedFromColumn].items.splice(this.draggedFromIndex, 1);
      
      // Add to new column
      this.kanbanColumns[columnIndex].items.push(this.draggedItem);
      
      console.log(`Moved "${this.draggedItem.title}" to "${this.kanbanColumns[columnIndex].title}"`);
    }
    
    this.dragOverColumn = null;
  }

  onDragEnd(event: DragEvent) {
    // Remove dragging class
    (event.target as HTMLElement).classList.remove('dragging');
    
    // Reset drag state
    this.draggedItem = null;
    this.draggedFromColumn = null;
    this.draggedFromIndex = null;
    this.dragOverColumn = null;
  }

  tasks = [
    { name: 'Project Planning', assignee: 'John Doe', startOffset: 0, duration: 20, progress: 100 },
    { name: 'Design Phase', assignee: 'Jane Smith', startOffset: 15, duration: 25, progress: 75 },
    { name: 'Development', assignee: 'Bob Johnson', startOffset: 30, duration: 40, progress: 45 },
    { name: 'Testing', assignee: 'Alice Brown', startOffset: 60, duration: 20, progress: 0 },
    { name: 'Deployment', assignee: 'John Doe', startOffset: 75, duration: 10, progress: 0 }
  ];

  months = ['Oct', 'Nov', 'Dec', 'Jan'];

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  calendarDays = Array.from({ length: 35 }, (_, i) => ({
    number: i + 1,
    otherMonth: i < 5 || i > 30,
    isToday: i === 15,
    events: i % 3 === 0 ? [
      { title: 'Team Meeting', color: '#3b82f6' },
      ...(i % 6 === 0 ? [{ title: 'Code Review', color: '#10b981' }] : [])
    ] : []
  }));

  kanbanColumns = [
    {
      title: 'To Do',
      items: [
        { title: 'Update documentation', description: 'Add API examples', priority: 'low', assignee: 'JD' },
        { title: 'Fix responsive issue', description: 'Mobile layout broken', priority: 'high', assignee: 'JS' }
      ]
    },
    {
      title: 'In Progress',
      items: [
        { title: 'Implement login', description: 'OAuth integration', priority: 'high', assignee: 'BJ' },
        { title: 'Design dashboard', description: 'New UI mockups', priority: 'medium', assignee: 'AB' }
      ]
    },
    {
      title: 'Review',
      items: [
        { title: 'Code refactoring', description: 'Clean up services', priority: 'medium', assignee: 'JD' }
      ]
    },
    {
      title: 'Done',
      items: [
        { title: 'Setup CI/CD', description: 'GitHub Actions', priority: 'high', assignee: 'JS' },
        { title: 'Database migration', description: 'v2.0 schema', priority: 'medium', assignee: 'BJ' }
      ]
    }
  ];

  timelineEvents = [
    { time: '2 hours ago', title: 'Deployment Successful', description: 'Production release v2.0', user: 'John Doe', category: 'Release', type: 'success' },
    { time: '5 hours ago', title: 'Code Review Completed', description: 'PR #234 approved', user: 'Jane Smith', category: 'Development', type: 'success' },
    { time: '1 day ago', title: 'Build Warning', description: 'Deprecated API usage detected', user: 'System', category: 'Build', type: 'warning' },
    { time: '2 days ago', title: 'Security Alert', description: 'Dependency vulnerability found', user: 'Security Bot', category: 'Security', type: 'error' },
    { time: '3 days ago', title: 'Feature Branch Created', description: 'feature/new-dashboard', user: 'Bob Johnson', category: 'Git', type: 'success' }
  ];
}

