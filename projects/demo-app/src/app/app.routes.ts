import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/basic',
    pathMatch: 'full'
  },
  {
    path: 'basic',
    loadComponent: () => import('./pages/basic-demo/basic-demo.component').then(m => m.BasicDemoComponent)
  },
  {
    path: 'advanced',
    loadComponent: () => import('./pages/advanced-demo/advanced-demo.component').then(m => m.AdvancedDemoComponent)
  },
  {
    path: 'virtual',
    loadComponent: () => import('./pages/virtual-demo/virtual-demo.component').then(m => m.VirtualDemoComponent)
  },
  {
    path: 'server-side',
    loadComponent: () => import('./pages/server-side-demo/server-side-demo.component').then(m => m.ServerSideDemoComponent)
  },
  {
    path: 'themes',
    loadComponent: () => import('./pages/themes-demo/themes-demo.component').then(m => m.ThemesDemoComponent)
  },
  {
    path: 'column-visibility',
    loadComponent: () => import('./pages/column-visibility-demo/column-visibility-demo.component').then(m => m.ColumnVisibilityDemoComponent)
  },
  {
    path: 'customization',
    loadComponent: () => import('./pages/customization-demo/customization-demo.component').then(m => m.CustomizationDemoComponent)
  },
  {
    path: 'inline-editing',
    loadComponent: () => import('./pages/inline-editing-demo/inline-editing-demo.component').then(m => m.InlineEditingDemoComponent)
  },
  {
    path: 'search-filter',
    loadComponent: () => import('./pages/search-filter-demo/search-filter-demo.component').then(m => m.SearchFilterDemoComponent)
  },
  {
    path: 'export',
    loadComponent: () => import('./pages/export-demo/export-demo.component').then(m => m.ExportDemoComponent)
  }
];
