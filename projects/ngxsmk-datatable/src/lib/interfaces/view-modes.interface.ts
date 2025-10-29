/**
 * Alternative View Modes
 * Gantt, Calendar/Timeline, and Kanban views
 */

/**
 * View mode types
 */
export type ViewMode = 'table' | 'gantt' | 'calendar' | 'timeline' | 'kanban' | 'card';

/**
 * View mode configuration
 */
export interface ViewModeConfig {
  /** Current view mode */
  mode?: ViewMode;
  
  /** Available view modes */
  availableModes?: ViewMode[];
  
  /** Show view mode switcher */
  showSwitcher?: boolean;
  
  /** Allow switching between modes */
  allowSwitching?: boolean;
  
  /** Remember last view mode */
  rememberMode?: boolean;
  
  /** Default view mode */
  defaultMode?: ViewMode;
}

/**
 * Gantt chart configuration
 */
export interface GanttConfig {
  /** Enable Gantt view */
  enabled?: boolean;
  
  /** Task start date field */
  startDateField: string;
  
  /** Task end date field */
  endDateField: string;
  
  /** Task name field */
  nameField: string;
  
  /** Progress field (0-100) */
  progressField?: string;
  
  /** Dependencies field */
  dependenciesField?: string;
  
  /** Resource/assignee field */
  resourceField?: string;
  
  /** Task color field */
  colorField?: string;
  
  /** Task type field */
  typeField?: string;
  
  /** Parent task field (for subtasks) */
  parentField?: string;
  
  /** Time scale */
  timeScale?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  /** Show weekends */
  showWeekends?: boolean;
  
  /** Show today line */
  showToday?: boolean;
  
  /** Allow task drag */
  allowDrag?: boolean;
  
  /** Allow task resize */
  allowResize?: boolean;
  
  /** Allow dependency creation */
  allowDependencies?: boolean;
  
  /** Show critical path */
  showCriticalPath?: boolean;
  
  /** Show baselines */
  showBaselines?: boolean;
  
  /** Baseline start field */
  baselineStartField?: string;
  
  /** Baseline end field */
  baselineEndField?: string;
  
  /** Task tooltip template */
  tooltipTemplate?: (task: any) => string;
  
  /** Custom bar renderer */
  barRenderer?: (task: any) => string;
}

/**
 * Calendar/Timeline configuration
 */
export interface CalendarConfig {
  /** Enable calendar view */
  enabled?: boolean;
  
  /** Event start date field */
  startDateField: string;
  
  /** Event end date field */
  endDateField?: string;
  
  /** Event title field */
  titleField: string;
  
  /** Event description field */
  descriptionField?: string;
  
  /** Event color field */
  colorField?: string;
  
  /** Event category field */
  categoryField?: string;
  
  /** All-day event field */
  allDayField?: string;
  
  /** Calendar view type */
  viewType?: 'month' | 'week' | 'day' | 'agenda' | 'timeline';
  
  /** Default view */
  defaultView?: 'month' | 'week' | 'day' | 'agenda' | 'timeline';
  
  /** Show weekends */
  showWeekends?: boolean;
  
  /** Week starts on */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  
  /** Time format */
  timeFormat?: '12h' | '24h';
  
  /** Show time grid */
  showTimeGrid?: boolean;
  
  /** Time slot duration (minutes) */
  timeSlotDuration?: number;
  
  /** Allow event drag */
  allowDrag?: boolean;
  
  /** Allow event resize */
  allowResize?: boolean;
  
  /** Allow event creation */
  allowCreate?: boolean;
  
  /** Event tooltip template */
  tooltipTemplate?: (event: any) => string;
  
  /** Custom event renderer */
  eventRenderer?: (event: any) => string;
  
  /** Business hours */
  businessHours?: BusinessHours;
  
  /** Holidays */
  holidays?: Date[];
}

/**
 * Business hours configuration
 */
export interface BusinessHours {
  /** Days of week (0=Sunday, 6=Saturday) */
  daysOfWeek?: number[];
  
  /** Start time */
  startTime?: string;
  
  /** End time */
  endTime?: string;
}

/**
 * Kanban board configuration
 */
export interface KanbanConfig {
  /** Enable Kanban view */
  enabled?: boolean;
  
  /** Status/column field */
  statusField: string;
  
  /** Card title field */
  titleField: string;
  
  /** Card description field */
  descriptionField?: string;
  
  /** Card assignee field */
  assigneeField?: string;
  
  /** Card priority field */
  priorityField?: string;
  
  /** Card tags field */
  tagsField?: string;
  
  /** Card color field */
  colorField?: string;
  
  /** Card due date field */
  dueDateField?: string;
  
  /** Available columns */
  columns: KanbanColumn[];
  
  /** Allow card drag between columns */
  allowDrag?: boolean;
  
  /** Allow card reorder within column */
  allowReorder?: boolean;
  
  /** Column width */
  columnWidth?: number;
  
  /** Card height */
  cardHeight?: 'auto' | number;
  
  /** Show card count in column header */
  showCardCount?: boolean;
  
  /** Show column limits */
  showLimits?: boolean;
  
  /** Card template */
  cardTemplate?: (card: any) => string;
  
  /** Group by swimlanes */
  swimlanes?: KanbanSwimlane[];
  
  /** Show empty columns */
  showEmptyColumns?: boolean;
  
  /** Collapsed columns */
  collapsedColumns?: string[];
}

/**
 * Kanban column configuration
 */
export interface KanbanColumn {
  /** Column ID/value */
  id: string;
  
  /** Column title */
  title: string;
  
  /** Column color */
  color?: string;
  
  /** Card limit (WIP limit) */
  limit?: number;
  
  /** Column order */
  order?: number;
  
  /** Collapsible */
  collapsible?: boolean;
  
  /** Collapsed by default */
  collapsed?: boolean;
  
  /** Column icon */
  icon?: string;
}

/**
 * Kanban swimlane configuration
 */
export interface KanbanSwimlane {
  /** Swimlane field */
  field: string;
  
  /** Swimlane values */
  values?: string[];
  
  /** Swimlane title formatter */
  titleFormatter?: (value: any) => string;
  
  /** Collapsible */
  collapsible?: boolean;
}

/**
 * Timeline event
 */
export interface TimelineEvent {
  /** Event ID */
  id: string | number;
  
  /** Event title */
  title: string;
  
  /** Start date */
  start: Date;
  
  /** End date */
  end?: Date;
  
  /** Description */
  description?: string;
  
  /** Color */
  color?: string;
  
  /** Category */
  category?: string;
  
  /** All-day event */
  allDay?: boolean;
  
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Gantt task
 */
export interface GanttTask {
  /** Task ID */
  id: string | number;
  
  /** Task name */
  name: string;
  
  /** Start date */
  start: Date;
  
  /** End date */
  end: Date;
  
  /** Progress (0-100) */
  progress?: number;
  
  /** Dependencies */
  dependencies?: string[];
  
  /** Resource */
  resource?: string;
  
  /** Color */
  color?: string;
  
  /** Type */
  type?: 'task' | 'milestone' | 'project';
  
  /** Parent task */
  parent?: string | number;
  
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Kanban card
 */
export interface KanbanCard {
  /** Card ID */
  id: string | number;
  
  /** Card title */
  title: string;
  
  /** Status/column */
  status: string;
  
  /** Description */
  description?: string;
  
  /** Assignee */
  assignee?: string;
  
  /** Priority */
  priority?: string | number;
  
  /** Tags */
  tags?: string[];
  
  /** Color */
  color?: string;
  
  /** Due date */
  dueDate?: Date;
  
  /** Order in column */
  order?: number;
  
  /** Metadata */
  metadata?: Record<string, any>;
}

