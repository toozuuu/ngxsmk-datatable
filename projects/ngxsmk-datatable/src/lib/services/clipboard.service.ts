import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClipboardConfig, ClipboardEvent } from '../interfaces/clipboard.interface';
import { NgxsmkRow } from '../interfaces/row.interface';
import { NgxsmkColumn } from '../interfaces/column.interface';

@Injectable()
export class ClipboardService {
  private config: ClipboardConfig = {
    copyEnabled: true,
    pasteEnabled: true,
    copyFormat: 'tsv',
    includeHeaders: false
  };

  public clipboardEvent$ = new Subject<ClipboardEvent>();

  constructor() {}

  /**
   * Set clipboard configuration
   */
  setConfig(config: Partial<ClipboardConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ClipboardConfig {
    return this.config;
  }

  /**
   * Copy data to clipboard
   */
  copy(rows: NgxsmkRow[], columns: NgxsmkColumn[], includeHeaders?: boolean): string {
    const data: any[][] = [];

    // Add headers if requested
    if (includeHeaders !== undefined ? includeHeaders : this.config.includeHeaders) {
      const headers = columns.map(col => col.name);
      data.push(headers);
    }

    // Add row data
    rows.forEach(row => {
      const rowData = columns.map(col => {
        const prop = col.prop || col.id;
        return this.getNestedValue(row, prop) ?? '';
      });
      data.push(rowData);
    });

    // Format data based on copy format
    const formatted = this.config.customCopyHandler 
      ? this.config.customCopyHandler(data)
      : this.formatData(data, this.config.copyFormat || 'tsv');

    // Emit clipboard event
    this.clipboardEvent$.next({
      type: 'copy',
      data,
      event: new Event('copy')
    });

    return formatted;
  }

  /**
   * Parse pasted data
   */
  paste(clipboardData: string): any[][] {
    const parsed = this.config.customPasteHandler
      ? this.config.customPasteHandler(clipboardData)
      : this.parseData(clipboardData);

    // Emit clipboard event
    this.clipboardEvent$.next({
      type: 'paste',
      data: parsed,
      event: new Event('paste')
    });

    return parsed;
  }

  /**
   * Copy data to system clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Format data for copying
   */
  private formatData(data: any[][], format: 'tsv' | 'csv' | 'json'): string {
    switch (format) {
      case 'csv':
        return this.formatAsCSV(data);
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'tsv':
      default:
        return this.formatAsTSV(data);
    }
  }

  /**
   * Format data as TSV (Tab-separated values)
   */
  private formatAsTSV(data: any[][]): string {
    return data.map(row => row.join('\t')).join('\n');
  }

  /**
   * Format data as CSV (Comma-separated values)
   */
  private formatAsCSV(data: any[][]): string {
    return data.map(row => 
      row.map(cell => this.escapeCSVValue(cell)).join(',')
    ).join('\n');
  }

  /**
   * Escape CSV value
   */
  private escapeCSVValue(value: any): string {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Parse clipboard data
   */
  private parseData(clipboardData: string): any[][] {
    // Try to detect format (TSV is most common from Excel/Sheets)
    const lines = clipboardData.split(/\r?\n/).filter(line => line.trim());
    
    // Check if it's TSV or CSV
    const isTSV = lines.some(line => line.includes('\t'));
    const separator = isTSV ? '\t' : ',';

    return lines.map(line => {
      if (separator === ',') {
        return this.parseCSVLine(line);
      } else {
        return line.split(separator);
      }
    });
  }

  /**
   * Parse CSV line (handles quoted values)
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of value
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    // Add last value
    result.push(current);

    return result;
  }

  /**
   * Get nested property value
   */
  private getNestedValue(obj: any, path: string): any {
    if (!path || !obj) return obj;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value == null) return value;
      value = value[key];
    }
    
    return value;
  }
}

