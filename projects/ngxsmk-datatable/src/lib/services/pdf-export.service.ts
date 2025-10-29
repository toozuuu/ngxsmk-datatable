import { Injectable } from '@angular/core';
import {
  PdfAdvancedExportOptions,
  PdfExportResult,
  PdfTemplate,
  PdfStyleConfig,
  PdfOrientation,
  PdfPageSize
} from '../interfaces/pdf-export.interface';

/**
 * PDF Export Service
 * Handles PDF generation with customizable templates and styling
 * Note: Requires jspdf library (peer dependency)
 */
@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  private readonly defaultOptions: Partial<PdfAdvancedExportOptions> = {
    orientation: 'portrait',
    pageSize: 'A4',
    includeHeader: true,
    includeFooter: true,
    includeBorders: true,
    includeAlternatingRows: true,
    fontSize: 10,
    fontFamily: 'helvetica',
    compress: true
  };

  private templates: Map<string, PdfTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Export data to PDF
   */
  async exportToPdf(
    data: any[],
    columns: any[],
    options?: PdfAdvancedExportOptions
  ): Promise<PdfExportResult> {
    const startTime = performance.now();
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      // Dynamic import to avoid bundling jsPDF if not used
      // @ts-ignore - Optional peer dependency
      const { default: jsPDF } = await import('jspdf');
      // @ts-ignore - Optional peer dependency
      await import('jspdf-autotable');

      const doc = new (jsPDF as any)({
        orientation: mergedOptions.orientation,
        unit: 'mm',
        format: mergedOptions.pageSize
      });

      // Add metadata
      if (mergedOptions.title) {
        doc.setProperties({
          title: mergedOptions.title,
          author: mergedOptions.author || '',
          subject: 'Data Export',
          keywords: 'datatable, export, pdf'
        });
      }

      // Add logo if provided
      if (mergedOptions.logo) {
        await this.addLogo(doc, mergedOptions.logo);
      }

      // Add watermark if provided
      if (mergedOptions.watermark) {
        this.addWatermark(doc, mergedOptions.watermark);
      }

      // Prepare table data
      const tableColumns = this.prepareColumns(columns, mergedOptions);
      const tableData = this.prepareData(data, columns, mergedOptions);

      // Add table using autoTable
      (doc as any).autoTable({
        head: [tableColumns],
        body: tableData,
        startY: mergedOptions.includeHeader ? 30 : 10,
        margin: mergedOptions.margins || { top: 10, right: 10, bottom: 10, left: 10 },
        styles: this.getTableStyles(mergedOptions),
        headStyles: this.getHeaderStyles(mergedOptions),
        alternateRowStyles: mergedOptions.includeAlternatingRows 
          ? { fillColor: [245, 245, 245] }
          : undefined,
        didDrawPage: (data: any) => {
          // Add header
          if (mergedOptions.includeHeader) {
            this.addHeader(doc, data, mergedOptions);
          }
          // Add footer
          if (mergedOptions.includeFooter) {
            this.addFooter(doc, data, mergedOptions);
          }
        }
      });

      // Generate blob
      const blob = doc.output('blob');
      const size = blob.size;
      const pages = doc.internal.getNumberOfPages();
      const generationTime = performance.now() - startTime;

      return {
        blob,
        size,
        pages,
        generationTime,
        success: true
      };
    } catch (error: any) {
      return {
        blob: new Blob(),
        size: 0,
        pages: 0,
        generationTime: performance.now() - startTime,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Export using template
   */
  async exportWithTemplate(
    data: any[],
    columns: any[],
    templateName: string,
    customOptions?: PdfAdvancedExportOptions
  ): Promise<PdfExportResult> {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    const options = {
      ...template.options,
      ...customOptions,
      styles: { ...template.styles, ...customOptions?.styles }
    };

    return this.exportToPdf(data, columns, options);
  }

  /**
   * Register custom template
   */
  registerTemplate(template: PdfTemplate): void {
    this.templates.set(template.name, template);
  }

  /**
   * Get all registered templates
   */
  getTemplates(): PdfTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Download PDF
   */
  async downloadPdf(
    data: any[],
    columns: any[],
    filename: string,
    options?: PdfAdvancedExportOptions
  ): Promise<PdfExportResult> {
    const result = await this.exportToPdf(data, columns, options);
    
    if (result.success) {
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }

    return result;
  }

  /**
   * Print PDF
   */
  async printPdf(
    data: any[],
    columns: any[],
    options?: PdfAdvancedExportOptions
  ): Promise<void> {
    const result = await this.exportToPdf(data, columns, options);
    
    if (result.success) {
      const url = URL.createObjectURL(result.blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      };
    }
  }

  private prepareColumns(columns: any[], options: PdfAdvancedExportOptions): string[] {
    const columnFields = options.columns || columns.map(c => c.field);
    return columns
      .filter(c => columnFields.includes(c.field))
      .map(c => c.header || c.field);
  }

  private prepareData(data: any[], columns: any[], options: PdfAdvancedExportOptions): any[][] {
    const columnFields = options.columns || columns.map(c => c.field);
    const visibleColumns = columns.filter(c => columnFields.includes(c.field));

    return data.map(row => 
      visibleColumns.map(col => {
        let value = row[col.field];
        
        // Apply column formatter if available
        if (col.format && typeof col.format === 'function') {
          value = col.format(value, row);
        }
        
        return value != null ? String(value) : '';
      })
    );
  }

  private getTableStyles(options: PdfAdvancedExportOptions): any {
    const styles = options.styles || {};
    return {
      fontSize: options.fontSize || 10,
      font: options.fontFamily || 'helvetica',
      cellPadding: styles.cellPadding || 5,
      lineColor: styles.borderColor || [0, 0, 0],
      lineWidth: options.includeBorders ? (styles.borderWidth || 0.1) : 0,
      textColor: styles.textColor || [0, 0, 0]
    };
  }

  private getHeaderStyles(options: PdfAdvancedExportOptions): any {
    const styles = options.styles || {};
    return {
      fillColor: styles.headerBackground || [66, 139, 202],
      textColor: styles.headerColor || [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left'
    };
  }

  private addHeader(doc: any, data: any, options: PdfAdvancedExportOptions): void {
    const pageWidth = doc.internal.pageSize.width;
    
    if (options.title) {
      doc.setFontSize(16);
      doc.setFont(options.fontFamily || 'helvetica', 'bold');
      doc.text(options.title, pageWidth / 2, 15, { align: 'center' });
    }

    if (typeof options.headerTemplate === 'function') {
      const headerText = options.headerTemplate(data.pageNumber, data.pageCount);
      doc.setFontSize(10);
      doc.text(headerText, 10, 10);
    }
  }

  private addFooter(doc: any, data: any, options: PdfAdvancedExportOptions): void {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(8);
    doc.setFont(options.fontFamily || 'helvetica', 'normal');

    if (typeof options.footerTemplate === 'function') {
      const footerText = options.footerTemplate(data.pageNumber, data.pageCount);
      doc.text(footerText, 10, pageHeight - 10);
    } else {
      // Default footer with page number
      const pageText = `Page ${data.pageNumber} of ${data.pageCount}`;
      doc.text(pageText, pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Add date
      const dateText = new Date().toLocaleDateString();
      doc.text(dateText, pageWidth - 10, pageHeight - 10, { align: 'right' });
    }
  }

  private async addLogo(doc: any, logo: string | Blob): Promise<void> {
    try {
      let imageData: string;
      
      if (logo instanceof Blob) {
        imageData = await this.blobToBase64(logo);
      } else {
        imageData = logo;
      }

      doc.addImage(imageData, 'PNG', 10, 5, 30, 15);
    } catch (error) {
      console.warn('Failed to add logo to PDF:', error);
    }
  }

  private addWatermark(doc: any, watermark: any): void {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(watermark.fontSize || 50);
    doc.setTextColor(watermark.color || '#CCCCCC');
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: watermark.opacity || 0.3 }));
    
    const text = watermark.text;
    const angle = watermark.angle || -45;
    
    doc.text(text, pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: angle
    });
    
    doc.restoreGraphicsState();
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private initializeDefaultTemplates(): void {
    // Minimal template
    this.registerTemplate({
      name: 'minimal',
      description: 'Clean minimal design',
      options: {
        includeHeader: false,
        includeFooter: true,
        includeBorders: false,
        includeAlternatingRows: true
      },
      styles: {
        headerBackground: '#FFFFFF',
        headerColor: '#000000',
        borderWidth: 0
      }
    });

    // Professional template
    this.registerTemplate({
      name: 'professional',
      description: 'Professional business template',
      options: {
        includeHeader: true,
        includeFooter: true,
        includeBorders: true,
        includeAlternatingRows: true
      },
      styles: {
        headerBackground: '#2C3E50',
        headerColor: '#FFFFFF',
        alternateRowBackground: '#ECF0F1'
      }
    });

    // Colorful template
    this.registerTemplate({
      name: 'colorful',
      description: 'Vibrant colorful template',
      options: {
        includeHeader: true,
        includeFooter: true,
        includeBorders: true,
        includeAlternatingRows: true
      },
      styles: {
        headerBackground: '#E74C3C',
        headerColor: '#FFFFFF',
        alternateRowBackground: '#FFE5E2'
      }
    });
  }
}

