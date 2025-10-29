import { Injectable } from '@angular/core';
import { ExportConfig, ExportFormat } from '../interfaces/export.interface';
import { NgxsmkRow } from '../interfaces/row.interface';
import { NgxsmkColumn } from '../interfaces/column.interface';

@Injectable()
export class ExportService {
  constructor() {}

  /**
   * Export data in the specified format
   */
  export(rows: NgxsmkRow[], columns: NgxsmkColumn[], config: ExportConfig): void {
    const exportColumns = config.columns || columns.filter(col => !col.checkboxable);
    
    switch (config.format) {
      case 'csv':
        this.exportAsCSV(rows, exportColumns, config);
        break;
      case 'excel':
        this.exportAsExcel(rows, exportColumns, config);
        break;
      case 'json':
        this.exportAsJSON(rows, exportColumns, config);
        break;
      case 'pdf':
        this.exportAsPDF(rows, exportColumns, config);
        break;
    }
  }

  /**
   * Export as CSV
   */
  private exportAsCSV(rows: NgxsmkRow[], columns: NgxsmkColumn[], config: ExportConfig): void {
    const lines: string[] = [];

    // Add headers if requested
    if (config.includeHeaders !== false) {
      const headers = columns.map(col => this.escapeCSVValue(col.name));
      lines.push(headers.join(','));
    }

    // Add rows
    rows.forEach(row => {
      const rowData = columns.map(col => {
        const prop = col.prop || col.id;
        const value = this.getNestedValue(row, prop);
        const formattedValue = config.dataFormatter 
          ? config.dataFormatter(value, col)
          : value;
        return this.escapeCSVValue(formattedValue);
      });
      lines.push(rowData.join(','));
    });

    const csv = lines.join('\n');
    const fileName = config.fileName || 'export.csv';
    this.downloadFile(csv, fileName, 'text/csv');
  }

  /**
   * Export as Excel (CSV with Excel-specific formatting)
   */
  private exportAsExcel(rows: NgxsmkRow[], columns: NgxsmkColumn[], config: ExportConfig): void {
    // For a simple implementation, we'll export as CSV with BOM for Excel
    // For full Excel support, consider using a library like SheetJS/xlsx
    const lines: string[] = [];

    // Add BOM for UTF-8 Excel compatibility
    let content = '\uFEFF';

    // Add headers if requested
    if (config.includeHeaders !== false) {
      const headers = columns.map(col => this.escapeCSVValue(col.name));
      lines.push(headers.join(','));
    }

    // Add rows
    rows.forEach(row => {
      const rowData = columns.map(col => {
        const prop = col.prop || col.id;
        const value = this.getNestedValue(row, prop);
        const formattedValue = config.dataFormatter 
          ? config.dataFormatter(value, col)
          : value;
        return this.escapeCSVValue(formattedValue);
      });
      lines.push(rowData.join(','));
    });

    content += lines.join('\n');
    const fileName = config.fileName || 'export.xlsx';
    this.downloadFile(content, fileName, 'application/vnd.ms-excel');
  }

  /**
   * Export as JSON
   */
  private exportAsJSON(rows: NgxsmkRow[], columns: NgxsmkColumn[], config: ExportConfig): void {
    const data = rows.map(row => {
      const obj: any = {};
      columns.forEach(col => {
        const prop = col.prop || col.id;
        const value = this.getNestedValue(row, prop);
        const formattedValue = config.dataFormatter 
          ? config.dataFormatter(value, col)
          : value;
        obj[col.name] = formattedValue;
      });
      return obj;
    });

    const json = JSON.stringify(data, null, 2);
    const fileName = config.fileName || 'export.json';
    this.downloadFile(json, fileName, 'application/json');
  }

  /**
   * Export as PDF (basic implementation)
   * For full PDF support, consider using a library like jsPDF
   */
  private exportAsPDF(rows: NgxsmkRow[], columns: NgxsmkColumn[], config: ExportConfig): void {
    console.warn('PDF export requires jsPDF library. Please install: npm install jspdf jspdf-autotable');
    
    // Fallback to CSV export
    console.log('Falling back to CSV export...');
    this.exportAsCSV(rows, columns, { ...config, format: 'csv', fileName: (config.fileName || 'export').replace('.pdf', '.csv') });
  }

  /**
   * Escape CSV value
   */
  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) return '';
    
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Download file
   */
  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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

