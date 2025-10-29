import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/enterprise',
    pathMatch: 'full'
  },
  {
    path: 'enterprise',
    loadComponent: () => import('./pages/enterprise-demo/enterprise-demo.component').then(m => m.EnterpriseDemoComponent)
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
  },
  {
    path: 'facade',
    loadComponent: () => import('./pages/facade-demo/facade-demo.component').then(m => m.FacadeDemoComponent)
  },
  {
    path: 'column-reorder',
    loadComponent: () => import('./pages/column-reorder-demo/column-reorder-demo.component').then(m => m.ColumnReorderDemoComponent)
  },
  {
    path: 'responsive',
    loadComponent: () => import('./pages/responsive-demo/responsive-demo.component').then(m => m.ResponsiveDemoComponent)
  },
  {
    path: 'collaborative',
    loadComponent: () => import('./pages/collaborative-demo/collaborative-demo.component').then(m => m.CollaborativeDemoComponent)
  },
  {
    path: 'charting',
    loadComponent: () => import('./pages/charting-demo/charting-demo.component').then(m => m.ChartingDemoComponent)
  },
  {
    path: 'formula',
    loadComponent: () => import('./pages/formula-demo/formula-demo.component').then(m => m.FormulaDemoComponent)
  },
  {
    path: 'view-modes',
    loadComponent: () => import('./pages/view-modes-demo/view-modes-demo.component').then(m => m.ViewModesDemoComponent)
  },
  {
    path: 'plugin',
    loadComponent: () => import('./pages/plugin-demo/plugin-demo.component').then(m => m.PluginDemoComponent)
  },
  {
    path: 'batch-operations',
    loadComponent: () => import('./pages/batch-operations-demo/batch-operations-demo.component').then(m => m.BatchOperationsDemoComponent)
  },
  {
    path: 'conditional-formatting',
    loadComponent: () => import('./pages/conditional-formatting-demo/conditional-formatting-demo.component').then(m => m.ConditionalFormattingDemoComponent)
  },
  {
    path: 'frozen-rows',
    loadComponent: () => import('./pages/frozen-rows-demo/frozen-rows-demo.component').then(m => m.FrozenRowsDemoComponent)
  },
  {
    path: 'sheets',
    loadComponent: () => import('./pages/sheets-demo/sheets-demo.component').then(m => m.SheetsDemoComponent)
  },
  {
    path: 'data-import',
    loadComponent: () => import('./pages/data-import-demo/data-import-demo.component').then(m => m.DataImportDemoComponent)
  }
];
