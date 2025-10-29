import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NgxsmkColumn {
  field: string;
  header: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-import-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-file-import"></i>
        <div class="header-content">
          <h1 class="header-title">📥 Data Import Wizard</h1>
          <p class="header-description">
            Import data from CSV, Excel, JSON, and other formats
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!-- Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Data Import Features:</strong>
            Import from multiple formats, column mapping, data validation, 
            preview before import, and automatic type detection.
          </div>
        </div>

        <!-- Import Wizard -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-upload"></i> Import Data</h3>
          </div>
          <div class="card-body">
            <div class="import-wizard">
              <!-- Step 1: Select Format -->
              <div class="wizard-step" [class.active]="currentStep === 1">
                <div class="step-header">
                  <div class="step-number">1</div>
                  <div class="step-info">
                    <h4>Select Format</h4>
                    <p>Choose your data source format</p>
                  </div>
                </div>
                <div class="step-content" *ngIf="currentStep === 1">
                  <div class="format-grid">
                    <div class="format-card" *ngFor="let format of supportedFormats" 
                         [class.selected]="selectedFormat === format.id"
                         (click)="selectedFormat = format.id">
                      <i [class]="format.icon"></i>
                      <h5>{{ format.name }}</h5>
                      <p>{{ format.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Upload File -->
              <div class="wizard-step" [class.active]="currentStep === 2">
                <div class="step-header">
                  <div class="step-number">2</div>
                  <div class="step-info">
                    <h4>Upload File</h4>
                    <p>Select file from your device</p>
                  </div>
                </div>
                <div class="step-content" *ngIf="currentStep === 2">
                  <div class="upload-zone" (click)="fileInput.click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h5>Drag & Drop or Click to Upload</h5>
                    <p>{{ selectedFormat === 'csv' ? 'CSV' : selectedFormat === 'excel' ? 'Excel' : 'JSON' }} files only</p>
                    <input #fileInput type="file" style="display: none" 
                           (change)="onFileSelected($event)">
                  </div>
                  <div class="file-info" *ngIf="uploadedFile">
                    <i class="fas fa-file"></i>
                    <span>{{ uploadedFile.name }}</span>
                    <span class="file-size">{{ uploadedFile.size }}</span>
                  </div>
                </div>
              </div>

              <!-- Step 3: Column Mapping -->
              <div class="wizard-step" [class.active]="currentStep === 3">
                <div class="step-header">
                  <div class="step-number">3</div>
                  <div class="step-info">
                    <h4>Map Columns</h4>
                    <p>Match imported columns to table fields</p>
                  </div>
                </div>
                <div class="step-content" *ngIf="currentStep === 3">
                  <div class="mapping-list">
                    <div class="mapping-row" *ngFor="let mapping of columnMappings">
                      <div class="source-column">
                        <label>Source Column</label>
                        <input type="text" [value]="mapping.source" readonly class="form-control">
                      </div>
                      <i class="fas fa-arrow-right"></i>
                      <div class="target-column">
                        <label>Target Field</label>
                        <select class="form-control" [(ngModel)]="mapping.target">
                          <option value="">-- Select Field --</option>
                          <option *ngFor="let field of availableFields" [value]="field">
                            {{ field }}
                          </option>
                        </select>
                      </div>
                      <div class="mapping-type">
                        <label>Data Type</label>
                        <select class="form-control" [(ngModel)]="mapping.type">
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="boolean">Boolean</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 4: Preview -->
              <div class="wizard-step" [class.active]="currentStep === 4">
                <div class="step-header">
                  <div class="step-number">4</div>
                  <div class="step-info">
                    <h4>Preview Data</h4>
                    <p>Review before importing</p>
                  </div>
                </div>
                <div class="step-content" *ngIf="currentStep === 4">
                  <div class="preview-stats">
                    <div class="stat">
                      <i class="fas fa-database"></i>
                      <span>{{ previewData.length }} rows</span>
                    </div>
                    <div class="stat">
                      <i class="fas fa-columns"></i>
                      <span>{{ columns.length }} columns</span>
                    </div>
                    <div class="stat">
                      <i class="fas fa-check-circle"></i>
                      <span>{{ validRows }} valid</span>
                    </div>
                    <div class="stat">
                      <i class="fas fa-exclamation-triangle"></i>
                      <span>{{ previewData.length - validRows }} warnings</span>
                    </div>
                  </div>
                  <div class="demo-table">
                    <table>
                      <thead>
                        <tr>
                          <th *ngFor="let col of columns">{{ col.header }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let row of previewData">
                          <td>{{ row.name }}</td>
                          <td>{{ row.price }}</td>
                          <td>{{ row.stock }}</td>
                          <td>{{ row.category }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Wizard Navigation -->
            <div class="wizard-navigation">
              <button class="btn btn-outline" 
                      [disabled]="currentStep === 1"
                      (click)="previousStep()">
                <i class="fas fa-arrow-left"></i> Previous
              </button>
              <div class="step-indicators">
                <div class="indicator" *ngFor="let step of [1, 2, 3, 4]" 
                     [class.active]="currentStep === step"
                     [class.completed]="currentStep > step">
                </div>
              </div>
              <button class="btn btn-primary" 
                      *ngIf="currentStep < 4"
                      (click)="nextStep()">
                Next <i class="fas fa-arrow-right"></i>
              </button>
              <button class="btn btn-success" 
                      *ngIf="currentStep === 4"
                      (click)="importData()">
                <i class="fas fa-check"></i> Import Data
              </button>
            </div>
          </div>
        </div>

        <!-- Supported Formats -->
        <div class="features-grid">
          <div class="feature-card" *ngFor="let format of importFeatures">
            <i [class]="format.icon + ' feature-icon'"></i>
            <h4>{{ format.name }}</h4>
            <p>{{ format.description }}</p>
          </div>
        </div>

        <!-- Configuration Example -->
        <div class="card mt-4">
          <div class="card-header">
            <h3><i class="fas fa-code"></i> Implementation Example</h3>
          </div>
          <div class="card-body">
            <pre><code>import &#123; DataImportService &#125; from 'ngxsmk-datatable';

constructor(private importService: DataImportService) &#123;&#125;

// Import from CSV
async importFromCSV(file: File) &#123;
  const result = await this.importService.importCSV(file, &#123;
    delimiter: ',',
    hasHeader: true,
    encoding: 'UTF-8',
    skipEmptyRows: true
  &#125;);
  
  this.data = result.data;
&#125;

// Import from Excel
async importFromExcel(file: File) &#123;
  const result = await this.importService.importExcel(file, &#123;
    sheetIndex: 0,
    hasHeader: true,
    dateFormat: 'MM/DD/YYYY'
  &#125;);
  
  this.data = result.data;
&#125;

// Import from JSON
async importFromJSON(file: File) &#123;
  const result = await this.importService.importJSON(file, &#123;
    rootPath: 'data',
    flatten: true
  &#125;);
  
  this.data = result.data;
&#125;

// Column mapping
this.importService.mapColumns(&#123;
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'Email Address': 'email'
&#125;);</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .import-wizard {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .wizard-step {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .wizard-step.active {
      border-color: #3b82f6;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f8f9fa;
      cursor: pointer;
    }

    .wizard-step.active .step-header {
      background: #eff6ff;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e5e7eb;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }

    .wizard-step.active .step-number {
      background: #3b82f6;
      color: white;
    }

    .step-info h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .step-info p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .step-content {
      padding: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .format-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .format-card {
      padding: 24px;
      background: #f8f9fa;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .format-card:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
    }

    .format-card.selected {
      background: #eff6ff;
      border-color: #3b82f6;
    }

    .format-card i {
      font-size: 48px;
      color: #3b82f6;
      margin-bottom: 12px;
    }

    .format-card h5 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .format-card p {
      margin: 0;
      font-size: 13px;
      color: #6b7280;
    }

    .upload-zone {
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      padding: 60px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-zone:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .upload-zone i {
      font-size: 64px;
      color: #3b82f6;
      margin-bottom: 16px;
    }

    .upload-zone h5 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .upload-zone p {
      margin: 0;
      color: #6b7280;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
      margin-top: 16px;
    }

    .file-info i {
      font-size: 24px;
      color: #3b82f6;
    }

    .file-size {
      margin-left: auto;
      color: #6b7280;
      font-size: 13px;
    }

    .mapping-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .mapping-row {
      display: grid;
      grid-template-columns: 2fr auto 2fr 1.5fr;
      gap: 16px;
      align-items: end;
    }

    .mapping-row > i {
      font-size: 20px;
      color: #3b82f6;
      margin-bottom: 8px;
    }

    .mapping-row label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      font-size: 13px;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
    }

    .preview-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .stat i {
      color: #3b82f6;
      font-size: 18px;
    }

    .wizard-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 2px solid #e5e7eb;
      margin-top: 24px;
    }

    .step-indicators {
      display: flex;
      gap: 8px;
    }

    .indicator {
      width: 40px;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      transition: all 0.3s;
    }

    .indicator.active,
    .indicator.completed {
      background: #3b82f6;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-outline {
      background: white;
      border: 1px solid #e5e7eb;
      color: #4b5563;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }

    .feature-card {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
      text-align: center;
    }

    .feature-icon {
      font-size: 36px;
      color: #3b82f6;
      margin-bottom: 12px;
    }

    .feature-card h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .feature-card p {
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
export class DataImportDemoComponent {
  currentStep = 1;
  selectedFormat = 'csv';
  uploadedFile: any = null;
  validRows = 0;

  supportedFormats = [
    { id: 'csv', name: 'CSV', icon: 'fas fa-file-csv', description: 'Comma-separated values' },
    { id: 'excel', name: 'Excel', icon: 'fas fa-file-excel', description: 'XLS and XLSX files' },
    { id: 'json', name: 'JSON', icon: 'fas fa-file-code', description: 'JSON data format' },
    { id: 'xml', name: 'XML', icon: 'fas fa-file-alt', description: 'XML documents' }
  ];

  columnMappings = [
    { source: 'ProductName', target: 'name', type: 'text' },
    { source: 'Price', target: 'price', type: 'number' },
    { source: 'Stock', target: 'stock', type: 'number' },
    { source: 'Category', target: 'category', type: 'text' }
  ];

  availableFields = ['id', 'name', 'price', 'stock', 'category', 'description', 'status'];

  columns: NgxsmkColumn[] = [
    { field: 'name', header: 'Product Name', sortable: true },
    { field: 'price', header: 'Price', sortable: true },
    { field: 'stock', header: 'Stock', sortable: true },
    { field: 'category', header: 'Category', sortable: true }
  ];

  previewData = [
    { name: 'Laptop Pro', price: '$1,299', stock: 45, category: 'Electronics' },
    { name: 'Wireless Mouse', price: '$29', stock: 120, category: 'Accessories' },
    { name: 'Monitor 4K', price: '$449', stock: 32, category: 'Electronics' },
    { name: 'Keyboard RGB', price: '$79', stock: 85, category: 'Accessories' }
  ];

  importFeatures = [
    { name: 'Auto-Detection', icon: 'fas fa-magic', description: 'Automatic column type detection' },
    { name: 'Validation', icon: 'fas fa-check-double', description: 'Data validation before import' },
    { name: 'Mapping', icon: 'fas fa-exchange-alt', description: 'Flexible column mapping' },
    { name: 'Preview', icon: 'fas fa-eye', description: 'Preview data before importing' },
    { name: 'Error Handling', icon: 'fas fa-exclamation-triangle', description: 'Graceful error handling' },
    { name: 'Batch Import', icon: 'fas fa-layer-group', description: 'Import multiple files at once' }
  ];

  constructor() {
    this.validRows = this.previewData.length;
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = {
        name: file.name,
        size: this.formatFileSize(file.size)
      };
      this.nextStep();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  importData() {
    console.log('Importing data...');
    alert('Data imported successfully!');
  }
}

