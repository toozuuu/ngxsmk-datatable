import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plugin-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-section">
      <div class="demo-header">
        <i class="fas fa-plug"></i>
        <div class="header-content">
          <h1 class="header-title">🔌 Plugin System</h1>
          <p class="header-description">
            Extensible architecture for custom features and integrations
          </p>
        </div>
        <span class="header-badge">Enterprise</span>
      </div>

      <div class="demo-content">
        <!--Feature Overview -->
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Plugin System Features:</strong>
            Create custom plugins with lifecycle hooks, event system, plugin marketplace, 
            version management, and hot-reloading support.
          </div>
        </div>

        <!-- Installed Plugins -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-puzzle-piece"></i> Installed Plugins</h3>
            <button class="btn btn-primary" (click)="showMarketplace()">
              <i class="fas fa-plus"></i> Install Plugin
            </button>
          </div>
          <div class="card-body">
            <div class="plugins-grid">
              <div class="plugin-card" *ngFor="let plugin of installedPlugins">
                <div class="plugin-header">
                  <div class="plugin-icon" [style.background]="plugin.color">
                    <i [class]="plugin.icon"></i>
                  </div>
                  <div class="plugin-info">
                    <h4>{{ plugin.name }}</h4>
                    <p>v{{ plugin.version }}</p>
                  </div>
                  <span class="plugin-status" [class]="plugin.enabled ? 'active' : 'inactive'">
                    {{ plugin.enabled ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <p class="plugin-description">{{ plugin.description }}</p>
                <div class="plugin-stats">
                  <span><i class="fas fa-download"></i> {{ plugin.downloads }}</span>
                  <span><i class="fas fa-star"></i> {{ plugin.rating }}</span>
                </div>
                <div class="plugin-actions">
                  <button class="btn btn-sm btn-outline" (click)="configurePlugin(plugin)">
                    Configure
                  </button>
                  <button class="btn btn-sm" 
                          [class.btn-success]="!plugin.enabled" 
                          [class.btn-danger]="plugin.enabled"
                          (click)="togglePlugin(plugin)">
                    {{ plugin.enabled ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Plugins -->
        <div class="card mb-4" id="marketplace">
          <div class="card-header">
            <h3><i class="fas fa-store"></i> Plugin Marketplace</h3>
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" 
                     placeholder="Search plugins..." 
                     [(ngModel)]="searchQuery"
                     (ngModelChange)="filterPlugins()">
            </div>
          </div>
          <div class="card-body">
            <div class="plugins-grid" *ngIf="filteredPlugins.length > 0">
              <div class="plugin-card available" *ngFor="let plugin of filteredPlugins">
                <div class="plugin-header">
                  <div class="plugin-icon" [style.background]="plugin.color">
                    <i [class]="plugin.icon"></i>
                  </div>
                  <div class="plugin-info">
                    <h4>{{ plugin.name }}</h4>
                    <p>v{{ plugin.version }}</p>
                  </div>
                  <span class="plugin-badge">{{ plugin.category }}</span>
                </div>
                <p class="plugin-description">{{ plugin.description }}</p>
                <div class="plugin-stats">
                  <span><i class="fas fa-download"></i> {{ plugin.downloads }}</span>
                  <span><i class="fas fa-star"></i> {{ plugin.rating }}</span>
                </div>
                <button class="btn btn-primary w-100" (click)="installPlugin(plugin)">
                  <i class="fas fa-download"></i> Install
                </button>
              </div>
            </div>
            <div class="no-results" *ngIf="filteredPlugins.length === 0">
              <i class="fas fa-search"></i>
              <p>No plugins found matching "{{ searchQuery }}"</p>
            </div>
          </div>
        </div>

        <!-- Create Custom Plugin -->
        <div class="card mb-4">
          <div class="card-header">
            <h3><i class="fas fa-hammer"></i> Create Custom Plugin</h3>
          </div>
          <div class="card-body">
            <div class="plugin-lifecycle">
              <h4>Plugin Lifecycle Hooks</h4>
              <div class="lifecycle-grid">
                <div class="lifecycle-step" *ngFor="let hook of lifecycleHooks">
                  <div class="step-number">{{ hook.order }}</div>
                  <div class="step-content">
                    <h5>{{ hook.name }}</h5>
                    <p>{{ hook.description }}</p>
                    <code>{{ hook.method }}</code>
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
            <pre><code>import {{ '{' }} DatatablePlugin, PluginContext {{ '}' }} from 'ngxsmk-datatable';

// Create custom plugin
export class MyCustomPlugin implements DatatablePlugin {{ '{' }}
  name = 'my-custom-plugin';
  version = '1.0.0';
  
  // Lifecycle hooks
  onInit(context: PluginContext): void {{ '{' }}
    console.log('Plugin initialized', context);
  {{ '}' }}
  
  onDataLoad(data: any[]): void {{ '{' }}
    console.log('Data loaded', data);
  {{ '}' }}
  
  onCellEdit(row: any, field: string, value: any): void {{ '{' }}
    // Custom validation or transformation
    if (field === 'email' && !this.validateEmail(value)) {{ '{' }}
      throw new Error('Invalid email');
    {{ '}' }}
  {{ '}' }}
  
  onDestroy(): void {{ '{' }}
    console.log('Plugin destroyed');
  {{ '}' }}
  
  // Custom methods
  private validateEmail(email: string): boolean {{ '{' }}
    return /^[^\\s{{ '@' }}]+{{ '@' }}[^\\s{{ '@' }}]+\\.[^\\s{{ '@' }}]+$/.test(email);
  {{ '}' }}
{{ '}' }}

// Register plugin
import {{ '{' }} PluginService {{ '}' }} from 'ngxsmk-datatable';

constructor(private pluginService: PluginService) {{ '{}' }}

ngOnInit() {{ '{' }}
  this.pluginService.register(new MyCustomPlugin());
{{ '}' }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plugins-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .plugin-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s;
    }

    .plugin-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    .plugin-card.available {
      border-style: dashed;
    }

    .plugin-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .plugin-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      flex-shrink: 0;
    }

    .plugin-info {
      flex: 1;
    }

    .plugin-info h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 700;
    }

    .plugin-info p {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .plugin-status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .plugin-status.active {
      background: #d1fae5;
      color: #065f46;
    }

    .plugin-status.inactive {
      background: #f3f4f6;
      color: #6b7280;
    }

    .plugin-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      background: #eff6ff;
      color: #1e40af;
    }

    .plugin-description {
      color: #4b5563;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .plugin-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #6b7280;
    }

    .plugin-stats span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .plugin-actions {
      display: flex;
      gap: 8px;
    }

    .plugin-actions .btn {
      flex: 1;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-outline {
      background: white;
      border: 1px solid #e5e7eb;
      color: #4b5563;
    }

    .btn-outline:hover {
      background: #f3f4f6;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }

    .w-100 {
      width: 100%;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #9ca3af;
    }

    .no-results i {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-results p {
      font-size: 16px;
      margin: 0;
    }

    .search-box {
      position: relative;
      width: 300px;
    }

    .search-box input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
    }

    .search-box i {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }

    .plugin-lifecycle {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
    }

    .plugin-lifecycle h4 {
      margin: 0 0 20px 0;
      font-size: 18px;
    }

    .lifecycle-grid {
      display: grid;
      gap: 16px;
    }

    .lifecycle-step {
      display: flex;
      gap: 16px;
      background: white;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-content {
      flex: 1;
    }

    .step-content h5 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .step-content p {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #6b7280;
    }

    .step-content code {
      background: #f3f4f6;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 12px;
      color: #3b82f6;
    }

    pre {
      background: #1f2937;
      color: #10b981;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 0;
    }

    pre code {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
    }
  `]
})
export class PluginDemoComponent {
  searchQuery = '';
  filteredPlugins: any[] = [];

  installedPlugins = [
    {
      name: 'Advanced Export',
      version: '2.1.0',
      description: 'Export data to multiple formats with custom templates',
      icon: 'fas fa-file-export',
      color: '#3b82f6',
      enabled: true,
      downloads: '12.5k',
      rating: '4.8'
    },
    {
      name: 'Data Validator',
      version: '1.5.2',
      description: 'Real-time data validation with custom rules',
      icon: 'fas fa-check-circle',
      color: '#10b981',
      enabled: true,
      downloads: '8.2k',
      rating: '4.6'
    },
    {
      name: 'Custom Themes',
      version: '3.0.1',
      description: 'Beautiful pre-made themes and theme builder',
      icon: 'fas fa-palette',
      color: '#f59e0b',
      enabled: false,
      downloads: '15.1k',
      rating: '4.9'
    }
  ];

  availablePlugins = [
    {
      name: 'AI Assistant',
      version: '1.0.0',
      description: 'AI-powered data insights and suggestions',
      icon: 'fas fa-brain',
      color: '#8b5cf6',
      category: 'AI',
      downloads: '3.2k',
      rating: '4.7'
    },
    {
      name: 'Chart Integration',
      version: '2.3.0',
      description: 'Interactive charts and visualizations',
      icon: 'fas fa-chart-line',
      color: '#ec4899',
      category: 'Analytics',
      downloads: '9.8k',
      rating: '4.5'
    },
    {
      name: 'Email Reports',
      version: '1.2.0',
      description: 'Schedule and send automated reports',
      icon: 'fas fa-envelope',
      color: '#06b6d4',
      category: 'Automation',
      downloads: '5.4k',
      rating: '4.4'
    }
  ];

  lifecycleHooks = [
    {
      order: 1,
      name: 'onInit',
      description: 'Called when plugin is first initialized',
      method: 'onInit(context: PluginContext): void'
    },
    {
      order: 2,
      name: 'onDataLoad',
      description: 'Called when data is loaded into the table',
      method: 'onDataLoad(data: any[]): void'
    },
    {
      order: 3,
      name: 'onCellEdit',
      description: 'Called when a cell value is edited',
      method: 'onCellEdit(row: any, field: string, value: any): void'
    },
    {
      order: 4,
      name: 'onRowSelect',
      description: 'Called when row selection changes',
      method: 'onRowSelect(rows: any[]): void'
    },
    {
      order: 5,
      name: 'onDestroy',
      description: 'Called when plugin is destroyed',
      method: 'onDestroy(): void'
    }
  ];

  constructor() {
    this.filteredPlugins = [...this.availablePlugins];
  }

  togglePlugin(plugin: any) {
    plugin.enabled = !plugin.enabled;
    const action = plugin.enabled ? 'enabled' : 'disabled';
    console.log(`Plugin "${plugin.name}" ${action}`);
  }

  configurePlugin(plugin: any) {
    alert(`Opening configuration for ${plugin.name}...`);
  }

  installPlugin(plugin: any) {
    // Add to installed plugins
    this.installedPlugins.push({
      ...plugin,
      enabled: true
    });

    // Remove from available plugins
    const index = this.availablePlugins.indexOf(plugin);
    if (index > -1) {
      this.availablePlugins.splice(index, 1);
      this.filterPlugins();
    }

    console.log(`Installed plugin: ${plugin.name}`);
    
    // Scroll to top to show installed plugins
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showMarketplace() {
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
  }

  filterPlugins() {
    if (!this.searchQuery.trim()) {
      this.filteredPlugins = [...this.availablePlugins];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredPlugins = this.availablePlugins.filter(plugin =>
        plugin.name.toLowerCase().includes(query) ||
        plugin.description.toLowerCase().includes(query) ||
        plugin.category.toLowerCase().includes(query)
      );
    }
  }
}

