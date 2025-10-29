import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enterprise-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-new">🚀 NEW</span>
            <span class="badge-version">v1.7.0</span>
          </div>
          <h1 class="hero-title">Enterprise Edition</h1>
          <p class="hero-description">
            16 powerful enterprise-level features that transform ngxsmk-datatable 
            into a complete business application platform
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">16</div>
              <div class="stat-label">New Features</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">13</div>
              <div class="stat-label">New Services</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">27</div>
              <div class="stat-label">New Files</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">TypeScript</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="features-section">
        <h2 class="section-title">All Enterprise Features</h2>
        
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon" [style.background]="feature.color">
              <i [class]="feature.icon"></i>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              <div class="feature-tags">
                <span class="tag" *ngFor="let tag of feature.tags">{{ tag }}</span>
              </div>
              <button 
                class="feature-btn" 
                [class.coming-soon]="!feature.available"
                (click)="feature.available && navigateToDemo(feature.route)"
                [disabled]="!feature.available">
                <span>{{ feature.available ? 'View Demo' : 'Coming Soon' }}</span>
                <i [class]="feature.available ? 'fas fa-arrow-right' : 'fas fa-clock'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Installation Section -->
      <div class="installation-section">
        <h2 class="section-title">Quick Start</h2>
        <div class="install-card">
          <div class="install-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Install the Package</h4>
              <div class="code-block">
                <code>npm install ngxsmk-datatable&#64;latest</code>
                <button class="copy-btn" (click)="copyToClipboard('npm install ngxsmk-datatable@latest')">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="install-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Optional Dependencies (as needed)</h4>
              <div class="code-block">
                <code>npm install jspdf jspdf-autotable xlsx</code>
                <button class="copy-btn" (click)="copyToClipboard('npm install jspdf jspdf-autotable xlsx')">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="install-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Import and Use</h4>
              <div class="code-block">
                <pre><code>import &#123;
  PdfExportService,
  ThemingService,
  ValidationService
&#125; from 'ngxsmk-datatable';

constructor(
  private pdfExport: PdfExportService,
  private theming: ThemingService
) &#123;&#125;</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Section -->
      <div class="comparison-section">
        <h2 class="section-title">Enterprise-Grade Features</h2>
        <div class="comparison-table">
          <div class="comparison-row header">
            <div class="cell">Feature</div>
            <div class="cell">ngxsmk-datatable</div>
            <div class="cell">AG Grid</div>
            <div class="cell">DevExtreme</div>
          </div>
          <div class="comparison-row" *ngFor="let item of comparisonData">
            <div class="cell">{{ item.feature }}</div>
            <div class="cell success"><i class="fas fa-check"></i></div>
            <div class="cell">
              <i [class]="item.agGrid ? 'fas fa-check' : 'fas fa-times'"></i>
            </div>
            <div class="cell">
              <i [class]="item.devextreme ? 'fas fa-check' : 'fas fa-times'"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-page {
      padding: 40px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 24px;
      padding: 60px 40px;
      margin-bottom: 60px;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="none"/><circle cx="30" cy="30" r="1" fill="white" opacity="0.2"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .badge-new, .badge-version {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0 0 20px 0;
      background: linear-gradient(to right, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.25rem;
      margin: 0 auto 40px;
      max-width: 800px;
      opacity: 0.95;
      line-height: 1.6;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      max-width: 900px;
      margin: 0 auto;
    }

    .stat-item {
      background: rgba(255, 255, 255, 0.15);
      padding: 24px;
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
      font-weight: 500;
    }

    /* Features Grid */
    .features-section {
      margin-bottom: 60px;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 32px 0;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      margin-bottom: 20px;
    }

    .feature-content {
      flex: 1;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .feature-description {
      color: #6b7280;
      margin: 0 0 16px 0;
      line-height: 1.6;
      font-size: 0.9375rem;
    }

    .feature-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .tag {
      background: #f3f4f6;
      color: #4b5563;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .feature-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .feature-btn:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .feature-btn.coming-soon {
      background: linear-gradient(135deg, #9ca3af, #6b7280);
      cursor: not-allowed;
      opacity: 0.7;
    }

    .feature-btn:disabled {
      cursor: not-allowed;
    }

    /* Installation Section */
    .installation-section {
      margin-bottom: 60px;
    }

    .install-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }

    .install-step {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
    }

    .install-step:last-child {
      margin-bottom: 0;
    }

    .step-number {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-content {
      flex: 1;
    }

    .step-content h4 {
      margin: 0 0 12px 0;
      font-size: 1.125rem;
      color: #1f2937;
    }

    .code-block {
      background: #1f2937;
      color: #10b981;
      padding: 16px 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      position: relative;
      overflow-x: auto;
    }

    .code-block code {
      color: #10b981;
    }

    .code-block pre {
      margin: 0;
      white-space: pre-wrap;
    }

    .copy-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Comparison Table */
    .comparison-section {
      margin-bottom: 60px;
    }

    .comparison-table {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }

    .comparison-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      border-bottom: 1px solid #e5e7eb;
    }

    .comparison-row:last-child {
      border-bottom: none;
    }

    .comparison-row.header {
      background: #f9fafb;
      font-weight: 700;
    }

    .cell {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 0.9375rem;
    }

    .cell:first-child {
      justify-content: flex-start;
      text-align: left;
      font-weight: 600;
    }

    .cell.success i.fa-check {
      color: #10b981;
      font-size: 1.25rem;
    }

    .cell i.fa-times {
      color: #ef4444;
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .demo-page {
        padding: 20px;
      }

      .hero-section {
        padding: 40px 20px;
      }

      .hero-title {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .comparison-row {
        font-size: 0.8125rem;
      }
    }
  `]
})
export class EnterpriseDemoComponent {
  constructor(private router: Router) {}

  features = [
    {
      title: '📄 PDF Export',
      description: 'Advanced PDF generation with templates, watermarks, and custom styling using jsPDF',
      icon: 'fas fa-file-pdf',
      color: 'linear-gradient(135deg, #f87171, #ef4444)',
      tags: ['Export', 'Templates', 'Print'],
      route: '/export',
      available: true
    },
    {
      title: '👥 Collaborative Editing',
      description: 'Real-time multi-user editing with WebSocket, cursor tracking, and conflict resolution',
      icon: 'fas fa-users',
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      tags: ['Real-time', 'WebSocket', 'Multi-user'],
      route: '/collaborative',
      available: true
    },
    {
      title: '📊 Advanced Charting',
      description: 'Sparklines, bar charts, gauges, and progress bars embedded in cells',
      icon: 'fas fa-chart-line',
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      tags: ['Visualization', 'Sparklines', 'Charts'],
      route: '/charting',
      available: true
    },
    {
      title: '🧮 Custom Formulas',
      description: 'Excel-like calculations with 30+ built-in functions and computed columns',
      icon: 'fas fa-calculator',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      tags: ['Calculations', 'Excel-like', 'Functions'],
      route: '/formula',
      available: true
    },
    {
      title: '📅 View Modes',
      description: 'Gantt chart, Calendar, Timeline, and Kanban board alternative views',
      icon: 'fas fa-calendar-alt',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      tags: ['Gantt', 'Kanban', 'Calendar'],
      route: '/view-modes',
      available: true
    },
    {
      title: '🎨 Advanced Theming',
      description: 'Theme builder with 11 presets, custom colors, and CSS variable generation',
      icon: 'fas fa-palette',
      color: 'linear-gradient(135deg, #ec4899, #db2777)',
      tags: ['Themes', 'Styling', 'Builder'],
      route: '/themes',
      available: true
    },
    {
      title: '🔌 Plugin System',
      description: 'Extensible architecture with hooks, API, and lifecycle management',
      icon: 'fas fa-plug',
      color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      tags: ['Extensions', 'Hooks', 'API'],
      route: '/plugin',
      available: true
    },
    {
      title: '📦 Batch Operations',
      description: 'Bulk edit, delete, and custom mass operations with undo/redo',
      icon: 'fas fa-boxes',
      color: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      tags: ['Bulk', 'Operations', 'Undo'],
      route: '/batch-operations',
      available: true
    },
    {
      title: '✅ Data Validation',
      description: '15+ validators, custom rules, async validation, and inline errors',
      icon: 'fas fa-check-circle',
      color: 'linear-gradient(135deg, #22c55e, #16a34a)',
      tags: ['Validation', 'Rules', 'Async'],
      route: '/inline-editing',
      available: true
    },
    {
      title: '🎯 Conditional Formatting',
      description: 'Dynamic styling, data bars, color scales, and icon sets based on values',
      icon: 'fas fa-magic',
      color: 'linear-gradient(135deg, #a855f7, #9333ea)',
      tags: ['Formatting', 'Styles', 'Rules'],
      route: '/conditional-formatting',
      available: true
    },
    {
      title: '📌 Frozen Rows',
      description: 'Sticky headers, footers, and columns with smooth scrolling',
      icon: 'fas fa-thumbtack',
      color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      tags: ['Frozen', 'Sticky', 'Scroll'],
      route: '/frozen-rows',
      available: true
    },
    {
      title: '📑 Multiple Sheets',
      description: 'Excel-like tabs with sheet management and cross-references',
      icon: 'fas fa-layer-group',
      color: 'linear-gradient(135deg, #f97316, #ea580c)',
      tags: ['Tabs', 'Sheets', 'Excel'],
      route: '/sheets',
      available: true
    },
    {
      title: '📥 Data Import',
      description: 'Import wizard for CSV, Excel, and JSON with mapping and preview',
      icon: 'fas fa-file-import',
      color: 'linear-gradient(135deg, #84cc16, #65a30d)',
      tags: ['Import', 'CSV', 'Excel'],
      route: '/data-import',
      available: true
    },
    {
      title: '📱 Mobile Integration',
      description: 'Ionic and Capacitor support with native features and gestures',
      icon: 'fas fa-mobile-alt',
      color: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      tags: ['Mobile', 'Ionic', 'Capacitor'],
      route: '/responsive',
      available: true
    }
  ];

  comparisonData = [
    { feature: 'PDF Export', agGrid: true, devextreme: true },
    { feature: 'Real-time Collaboration', agGrid: false, devextreme: false },
    { feature: 'Embedded Charts', agGrid: true, devextreme: true },
    { feature: 'Formula Support', agGrid: false, devextreme: false },
    { feature: 'Multiple View Modes', agGrid: false, devextreme: false },
    { feature: 'Plugin System', agGrid: false, devextreme: false },
    { feature: 'Batch Operations', agGrid: true, devextreme: true },
    { feature: 'Mobile Integration', agGrid: false, devextreme: true },
    { feature: 'Free & Open Source', agGrid: false, devextreme: false }
  ];

  navigateToDemo(route: string) {
    // Navigate to the demo page
    this.router.navigate([route]);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      console.log('Copied to clipboard:', text);
    });
  }
}

