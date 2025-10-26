import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <!-- Modern Header with Gradient -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="url(#gradient)" />
                <!-- Table icon -->
                <rect x="8" y="10" width="24" height="20" rx="2" stroke="white" stroke-width="2" fill="none"/>
                <line x1="8" y1="16" x2="32" y2="16" stroke="white" stroke-width="2"/>
                <line x1="20" y1="10" x2="20" y2="30" stroke="white" stroke-width="2"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stop-color="#667eea" />
                    <stop offset="100%" stop-color="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="title-group">
              <h1 class="app-title">ngxsmk-datatable</h1>
              <p class="app-subtitle">A feature-rich yet lightweight data-table crafted for Angular</p>
            </div>
          </div>
          
          <div class="header-actions">
            <a href="https://github.com/toozuuu/ngxsmk-datatable" target="_blank" class="btn-header" rel="noopener noreferrer">
              <i class="fas fa-star"></i>
              Star on GitHub
            </a>
            <a href="https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable" target="_blank" class="btn-header btn-secondary" rel="noopener noreferrer">
              <i class="fas fa-bolt"></i>
              Try on StackBlitz
            </a>
            <a href="https://www.npmjs.com/package/ngxsmk-datatable" target="_blank" class="btn-header btn-primary" rel="noopener noreferrer">
              <i class="fas fa-download"></i>
              Install
            </a>
          </div>
        </div>
      </header>

      <!-- Sidebar Navigation -->
      <div class="app-layout">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h3>Demos</h3>
            <span class="badge">10 Examples</span>
          </div>
          
          <nav class="sidebar-nav">
            <a routerLink="/basic" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-play-circle"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Basic Usage</span>
                <span class="nav-desc">Get started quickly</span>
              </div>
            </a>
            
            <a routerLink="/advanced" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Advanced Features</span>
                <span class="nav-desc">Selection & templates</span>
              </div>
            </a>
            
            <a routerLink="/virtual" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-rocket"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Virtual Scrolling</span>
                <span class="nav-desc">10,000+ rows</span>
              </div>
            </a>
            
            <a routerLink="/server-side" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-server"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Server-Side</span>
                <span class="nav-desc">External pagination</span>
              </div>
            </a>
            
            <a routerLink="/column-visibility" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-eye"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Column Visibility</span>
                <span class="nav-desc">Dynamic columns</span>
              </div>
            </a>
            
            <a routerLink="/themes" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-palette"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Themes & Styling</span>
                <span class="nav-desc">5 built-in themes</span>
              </div>
            </a>
            
            <a routerLink="/customization" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-paint-brush"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">🎨 Customization</span>
                <span class="nav-desc">Live CSS editor</span>
              </div>
            </a>
            
            <a routerLink="/inline-editing" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-edit"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Inline Editing</span>
                <span class="nav-desc">Edit cells directly</span>
              </div>
            </a>
            
            <a routerLink="/search-filter" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-filter"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Search & Filter</span>
                <span class="nav-desc">Advanced filtering</span>
              </div>
            </a>
            
            <a routerLink="/export" routerLinkActive="active" class="nav-link">
              <div class="nav-icon">
                <i class="fas fa-download"></i>
              </div>
              <div class="nav-content">
                <span class="nav-title">Export Data</span>
                <span class="nav-desc">CSV, Excel, JSON, Print</span>
              </div>
            </a>
          </nav>

          <!-- Features List -->
          <div class="sidebar-features">
            <h4>✨ Features</h4>
            <ul>
              <li>✅ 50% Faster Rendering</li>
              <li>✅ All ngx-datatable Issues Fixed</li>
              <li>✅ Column Resizing</li>
              <li>✅ Smart Sorting</li>
              <li>✅ Zero Memory Leaks</li>
            </ul>
          </div>
        </aside>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    /* Modern Header */
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1600px;
      margin: 0 auto;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .app-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
    }

    .app-subtitle {
      font-size: 0.9rem;
      margin: 0;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }

    .btn-header:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .btn-header.btn-primary {
      background: white;
      color: #667eea;
      border-color: white;
    }

    .btn-header.btn-primary:hover {
      background: #f8f9fa;
    }

    .btn-header.btn-secondary {
      background: rgba(255,255,255,0.25);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }

    .btn-header.btn-secondary:hover {
      background: rgba(255,255,255,0.35);
      border-color: rgba(255,255,255,0.5);
    }

    /* Sidebar Layout */
    .app-layout {
      display: flex;
      flex: 1;
      min-height: calc(100vh - 80px);
    }

    .sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-header h3 {
      margin: 0;
      font-size: 1.3rem;
      color: #1f2937;
    }

    .badge {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 12px;
      margin-bottom: 4px;
      border-radius: 8px;
      text-decoration: none;
      color: #6b7280;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-link:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .nav-link.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .nav-link.active .nav-icon {
      color: white;
    }

    .nav-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #f3f4f6;
      color: #667eea;
      font-size: 1.2rem;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .nav-link.active .nav-icon {
      background: rgba(255,255,255,0.2);
    }

    .nav-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .nav-title {
      font-weight: 600;
      font-size: 0.95rem;
      line-height: 1.2;
    }

    .nav-desc {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .sidebar-features {
      padding: 20px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .sidebar-features h4 {
      margin: 0 0 12px 0;
      font-size: 1rem;
      color: #1f2937;
    }

    .sidebar-features ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .sidebar-features li {
      padding: 6px 0;
      font-size: 0.85rem;
      color: #6b7280;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #f8f9fa;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .sidebar {
        width: 240px;
      }
      
      .header-actions {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 15px 20px;
      }
      
      .app-title {
        font-size: 1.4rem;
      }
      
      .app-subtitle {
        font-size: 0.8rem;
      }
      
      .sidebar {
        display: none;
      }
      
      .main-content {
        width: 100%;
      }
    }

  `]
})
export class AppComponent {
  title = 'ngxsmk-datatable-demo';
}
