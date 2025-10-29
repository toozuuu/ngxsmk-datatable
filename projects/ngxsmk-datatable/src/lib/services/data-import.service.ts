import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  DataImportConfig,
  ImportOptions,
  ImportResult,
  ImportFormat,
  ImportPreview,
  ColumnMapping,
  CsvImportOptions,
  ExcelImportOptions,
  JsonImportOptions
} from '../interfaces/data-import.interface';

/**
 * Data Import Service
 * Import wizard for CSV, Excel, and JSON
 */
@Injectable({
  providedIn: 'root'
})
export class DataImportService {
  private config: DataImportConfig = {
    enabled: true,
    supportedFormats: ['csv', 'json', 'excel'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    showWizard: true,
    autoDetectFormat: true,
    autoMapColumns: true,
    allowPreview: true,
    previewRows: 10,
    validateOnImport: true,
    importMode: 'replace',
    showProgress: true
  };

  private progressSubject = new Subject<number>();
  readonly progress$ = this.progressSubject.asObservable();

  constructor() {}

  /**
   * Configure import service
   */
  configure(config: Partial<DataImportConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Import from file
   */
  async importFromFile(
    file: File,
    options?: ImportOptions
  ): Promise<ImportResult> {
    const startTime = performance.now();

    // Check file size
    if (file.size > this.config.maxFileSize!) {
      return {
        success: false,
        totalRows: 0,
        importedRows: 0,
        skippedRows: 0,
        failedRows: 0,
        errors: [{
          row: 0,
          message: `File size exceeds maximum of ${this.config.maxFileSize! / 1024 / 1024}MB`
        }]
      };
    }

    // Detect format
    const format = options?.format || this.detectFormat(file);

    try {
      let data: any[];

      switch (format) {
        case 'csv':
          data = await this.importCSV(file, options as CsvImportOptions);
          break;
        
        case 'json':
          data = await this.importJSON(file, options as JsonImportOptions);
          break;
        
        case 'excel':
          data = await this.importExcel(file, options as ExcelImportOptions);
          break;
        
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Apply column mapping
      if (options?.columnMapping) {
        data = this.applyColumnMapping(data, options.columnMapping);
      }

      // Apply transforms
      if (options?.transforms) {
        data = this.applyTransforms(data, options.transforms);
      }

      const importTime = performance.now() - startTime;

      return {
        success: true,
        data,
        totalRows: data.length,
        importedRows: data.length,
        skippedRows: 0,
        failedRows: 0,
        importTime,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          detectedFormat: format
        }
      };
    } catch (error: any) {
      return {
        success: false,
        totalRows: 0,
        importedRows: 0,
        skippedRows: 0,
        failedRows: 0,
        errors: [{ row: 0, message: error.message }],
        importTime: performance.now() - startTime
      };
    }
  }

  /**
   * Preview file
   */
  async previewFile(file: File, options?: ImportOptions): Promise<ImportPreview> {
    const format = options?.format || this.detectFormat(file);

    try {
      const content = await this.readFile(file);
      let data: any[] = [];
      let columns: string[] = [];

      switch (format) {
        case 'csv':
          const csvData = this.parseCSV(content, options as CsvImportOptions);
          data = csvData.slice(0, this.config.previewRows);
          columns = csvData.length > 0 ? Object.keys(csvData[0]) : [];
          break;
        
        case 'json':
          const jsonData = JSON.parse(content);
          const jsonArray = this.extractJSONArray(jsonData, (options as JsonImportOptions)?.jsonPath);
          data = jsonArray.slice(0, this.config.previewRows);
          columns = data.length > 0 ? Object.keys(data[0]) : [];
          break;
      }

      return {
        data,
        columns,
        sampleRows: data.length,
        totalRows: data.length,
        hasHeaders: true
      };
    } catch (error) {
      return {
        data: [],
        columns: [],
        sampleRows: 0,
        totalRows: 0
      };
    }
  }

  /**
   * Import CSV
   */
  private async importCSV(file: File, options?: CsvImportOptions): Promise<any[]> {
    const content = await this.readFile(file);
    return this.parseCSV(content, options);
  }

  /**
   * Parse CSV content
   */
  private parseCSV(content: string, options?: CsvImportOptions): any[] {
    const delimiter = options?.delimiter || ',';
    const hasHeaders = options?.hasHeaders !== false;
    
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];

    const headers = hasHeaders 
      ? this.parseCSVLine(lines[0], delimiter)
      : lines[0].split(delimiter).map((_, i) => `Column${i + 1}`);

    const dataStart = hasHeaders ? 1 : 0;
    const data: any[] = [];

    for (let i = dataStart; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i], delimiter);
      const row: any = {};
      
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Trim whitespace
        if (options?.trimWhitespace !== false) {
          value = value.trim();
        }
        
        row[header] = value;
      });

      if (!options?.skipEmptyRows || Object.values(row).some(v => v !== '')) {
        data.push(row);
      }

      // Emit progress
      if (i % 100 === 0) {
        this.progressSubject.next((i / lines.length) * 100);
      }
    }

    return data;
  }

  /**
   * Parse CSV line
   */
  private parseCSVLine(line: string, delimiter: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current);
    return values;
  }

  /**
   * Import JSON
   */
  private async importJSON(file: File, options?: JsonImportOptions): Promise<any[]> {
    const content = await this.readFile(file);
    const data = JSON.parse(content);
    
    return this.extractJSONArray(data, options?.jsonPath);
  }

  /**
   * Extract array from JSON
   */
  private extractJSONArray(data: any, path?: string): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (path) {
      const parts = path.split('.');
      let current = data;
      
      for (const part of parts) {
        current = current[part];
        if (!current) return [];
      }
      
      return Array.isArray(current) ? current : [current];
    }

    // Try to find first array in object
    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }

    return [data];
  }

  /**
   * Import Excel
   */
  private async importExcel(file: File, options?: ExcelImportOptions): Promise<any[]> {
    // Would use a library like xlsx or exceljs in production
    throw new Error('Excel import requires xlsx library');
  }

  /**
   * Apply column mapping
   */
  private applyColumnMapping(data: any[], mappings: ColumnMapping[]): any[] {
    return data.map(row => {
      const mapped: any = {};
      
      for (const mapping of mappings) {
        if (mapping.skip) continue;

        const sourceValue = typeof mapping.source === 'number'
          ? Object.values(row)[mapping.source]
          : row[mapping.source];

        let value = sourceValue;

        // Apply transform
        if (mapping.transform) {
          value = mapping.transform(value, row);
        }

        // Use default if empty
        if ((value == null || value === '') && mapping.defaultValue != null) {
          value = mapping.defaultValue;
        }

        mapped[mapping.target] = value;
      }

      return mapped;
    });
  }

  /**
   * Apply transforms
   */
  private applyTransforms(data: any[], transforms: Record<string, any>): any[] {
    return data.map(row => {
      const transformed = { ...row };
      
      for (const [field, transform] of Object.entries(transforms)) {
        if (typeof transform === 'function') {
          transformed[field] = transform(row[field], row);
        }
      }

      return transformed;
    });
  }

  /**
   * Detect file format
   */
  private detectFormat(file: File): ImportFormat {
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'csv':
        return 'csv';
      case 'json':
        return 'json';
      case 'xlsx':
      case 'xls':
        return 'excel';
      case 'tsv':
      case 'txt':
        return 'tsv';
      default:
        return 'csv';
    }
  }

  /**
   * Read file as text
   */
  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}

