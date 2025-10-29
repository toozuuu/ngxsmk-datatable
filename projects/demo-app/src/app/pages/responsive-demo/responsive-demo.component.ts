import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgxsmkDatatableComponent,
  NgxsmkColumn,
  NgxsmkRow
} from 'ngxsmk-datatable';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image: string;
  description: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

@Component({
  selector: 'app-responsive-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
      <h2 class="demo-header">
        <i class="fas fa-mobile-alt"></i>
        Responsive Card View Demo
      </h2>

      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Resize your browser!</strong> The table automatically switches to card view on mobile devices (< 768px width).
            <br><strong>Card Roles:</strong> Columns are assigned roles (title, subtitle, description, badge, image) for optimal mobile display.
            <br><strong>Smooth Transition:</strong> Try resizing the browser window to see the responsive behavior in action!
          </div>
        </div>

        <!-- Device simulator controls -->
        <div class="controls-bar">
          <button class="btn btn-primary" (click)="simulateDevice('desktop')">
            <i class="fas fa-desktop"></i>
            Desktop (1200px)
          </button>
          <button class="btn btn-primary" (click)="simulateDevice('tablet')">
            <i class="fas fa-tablet-alt"></i>
            Tablet (768px)
          </button>
          <button class="btn btn-primary" (click)="simulateDevice('mobile')">
            <i class="fas fa-mobile-alt"></i>
            Mobile (375px)
          </button>
          <button class="btn btn-secondary" (click)="simulateDevice('reset')">
            <i class="fas fa-undo"></i>
            Reset
          </button>
        </div>

        <!-- Current viewport info -->
        <div class="viewport-info">
          <strong>Current View:</strong> {{ currentViewport }} 
          <span class="viewport-size">({{ containerWidth }}px)</span>
        </div>

        <!-- Datatable container with dynamic width -->
        <div class="datatable-container" [style.max-width.px]="containerWidth" [style.margin]="'0 auto'">
          <ngxsmk-datatable
            [columns]="columns"
            [rows]="rows"
            [virtualScrolling]="true"
            [rowHeight]="60"
            [headerHeight]="50"
            [selectionType]="'checkbox'"
            [responsiveConfig]="responsiveConfig">
          </ngxsmk-datatable>
        </div>

        <!-- Feature highlights -->
        <div class="info-grid">
          <div class="info-card">
            <h4><i class="fas fa-mobile-alt"></i> Auto-Switching</h4>
            <ul>
              <li>✅ Automatic table ↔ card switching</li>
              <li>✅ Configurable breakpoints</li>
              <li>✅ Smooth animations</li>
              <li>✅ No JavaScript resize listeners needed</li>
            </ul>
          </div>

          <div class="info-card">
            <h4><i class="fas fa-layer-group"></i> Card Roles</h4>
            <ul>
              <li><strong>Title:</strong> Main heading (product name)</li>
              <li><strong>Subtitle:</strong> Secondary text (category)</li>
              <li><strong>Description:</strong> Details (product description)</li>
              <li><strong>Badge:</strong> Status indicators</li>
              <li><strong>Image:</strong> Product image</li>
              <li><strong>Meta:</strong> Additional fields</li>
            </ul>
          </div>

          <div class="info-card">
            <h4><i class="fas fa-paint-brush"></i> Modern Design</h4>
            <ul>
              <li>✅ Clean card layout</li>
              <li>✅ Touch-friendly spacing</li>
              <li>✅ Hover effects</li>
              <li>✅ Selection highlighting</li>
              <li>✅ Responsive images</li>
            </ul>
          </div>
        </div>

        <!-- Configuration example -->
        <div class="code-example">
          <h4>Configuration Example</h4>
          <pre><code>{{ configExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-section {
      padding: 20px;
    }

    .controls-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .viewport-info {
      background: #e8f4f8;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }

    .viewport-size {
      color: #0c5460;
      font-weight: 600;
      margin-left: 8px;
    }

    .datatable-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 20px;
      min-height: 600px;
      transition: max-width 0.3s ease;
    }

    .datatable-container ::ng-deep ngxsmk-datatable {
      height: 600px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .info-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .info-card h4 {
      margin-top: 0;
      color: #1976d2;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-card ul {
      margin: 15px 0 0 0;
      padding-left: 20px;
    }

    .info-card li {
      margin: 8px 0;
      line-height: 1.6;
    }

    .code-example {
      background: #263238;
      color: #aed581;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .code-example h4 {
      color: white;
      margin-top: 0;
    }

    .code-example pre {
      margin: 10px 0 0 0;
      overflow-x: auto;
    }

    .code-example code {
      font-size: 13px;
      line-height: 1.6;
    }
  `]
})
export class ResponsiveDemoComponent implements OnInit {
  columns: NgxsmkColumn<Product>[] = [];
  rows: NgxsmkRow<Product>[] = [];

  containerWidth = 0; // Auto-width
  currentViewport = 'Desktop';

  responsiveConfig = {
    enabled: true,
    breakpoints: {
      xs: 480,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1920
    },
    displayModes: {
      mobile: 'card' as const,
      tablet: 'table' as const,
      desktop: 'table' as const
    }
  };

  configExample = `// Enable responsive mode
responsiveConfig = {
  enabled: true,
  breakpoints: {
    sm: 768,  // Mobile < 768px
    md: 1024  // Tablet < 1024px
  },
  displayModes: {
    mobile: 'card',   // Cards on mobile
    tablet: 'table',  // Table on tablet
    desktop: 'table'  // Table on desktop
  }
};

// Assign card roles to columns
columns = [
  { 
    id: 'name', 
    name: 'Product', 
    prop: 'name',
    cardRole: 'title'  // Main heading
  },
  { 
    id: 'category', 
    name: 'Category', 
    prop: 'category',
    cardRole: 'subtitle'  // Secondary text
  },
  { 
    id: 'description', 
    name: 'Description', 
    prop: 'description',
    cardRole: 'description'  // Details
  },
  { 
    id: 'status', 
    name: 'Status', 
    prop: 'status',
    cardRole: 'badge'  // Status badge
  },
  { 
    id: 'image', 
    name: 'Image', 
    prop: 'image',
    cardRole: 'image',  // Product image
    hideInCardView: false
  },
  { 
    id: 'price', 
    name: 'Price', 
    prop: 'price',
    cardRole: 'meta'  // Additional info
  }
];`;

  ngOnInit() {
    this.setupColumns();
    this.generateProducts();
  }

  setupColumns() {
    this.columns = [
      { 
        id: 'image', 
        name: 'Image', 
        prop: 'image',
        width: 80,
        cardRole: 'image',
        hideInCardView: false
      },
      { 
        id: 'name', 
        name: 'Product Name', 
        prop: 'name',
        width: 200,
        sortable: true,
        cardRole: 'title'
      },
      { 
        id: 'category', 
        name: 'Category', 
        prop: 'category',
        width: 150,
        sortable: true,
        cardRole: 'subtitle'
      },
      { 
        id: 'description', 
        name: 'Description', 
        prop: 'description',
        width: 300,
        cardRole: 'description'
      },
      { 
        id: 'status', 
        name: 'Status', 
        prop: 'status',
        width: 120,
        sortable: true,
        cardRole: 'badge'
      },
      { 
        id: 'price', 
        name: 'Price', 
        prop: 'price',
        width: 100,
        sortable: true,
        cardRole: 'meta'
      },
      { 
        id: 'stock', 
        name: 'Stock', 
        prop: 'stock',
        width: 100,
        sortable: true,
        cardRole: 'meta'
      },
      { 
        id: 'rating', 
        name: 'Rating', 
        prop: 'rating',
        width: 100,
        sortable: true,
        cardRole: 'meta'
      }
    ];
  }

  generateProducts() {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
    const statuses: Array<'In Stock' | 'Low Stock' | 'Out of Stock'> = ['In Stock', 'Low Stock', 'Out of Stock'];

    this.rows = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 500) + 10,
      stock: Math.floor(Math.random() * 100),
      rating: +(Math.random() * 5).toFixed(1),
      image: `https://picsum.photos/200/200?random=${i + 1}`,
      description: `High-quality product with excellent features. Perfect for everyday use and special occasions.`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  }

  simulateDevice(device: 'desktop' | 'tablet' | 'mobile' | 'reset') {
    switch (device) {
      case 'desktop':
        this.containerWidth = 1200;
        this.currentViewport = 'Desktop';
        break;
      case 'tablet':
        this.containerWidth = 768;
        this.currentViewport = 'Tablet';
        break;
      case 'mobile':
        this.containerWidth = 375;
        this.currentViewport = 'Mobile';
        break;
      case 'reset':
        this.containerWidth = 0;
        this.currentViewport = 'Desktop';
        break;
    }
  }
}

