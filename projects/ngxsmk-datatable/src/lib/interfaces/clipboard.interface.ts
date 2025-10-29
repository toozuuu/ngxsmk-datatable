/**
 * Clipboard configuration for copy/paste functionality
 */
export interface ClipboardConfig {
  /** Enable copy functionality */
  copyEnabled?: boolean;
  /** Enable paste functionality */
  pasteEnabled?: boolean;
  /** Copy format */
  copyFormat?: 'tsv' | 'csv' | 'json';
  /** Include headers when copying */
  includeHeaders?: boolean;
  /** Custom copy handler */
  customCopyHandler?: (data: any[][]) => string;
  /** Custom paste handler */
  customPasteHandler?: (data: string) => any[][];
}

/**
 * Clipboard event
 */
export interface ClipboardEvent {
  /** Event type */
  type: 'copy' | 'paste';
  /** Data being copied or pasted */
  data: any[][];
  /** Original event */
  event: Event;
  /** Whether to prevent default behavior */
  preventDefault?: boolean;
}

