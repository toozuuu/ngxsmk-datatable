# Installation Guide

## Prerequisites

Before installing ngxsmk-datatable, make sure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Angular** 17.x or higher

## Installation

### Using npm

```bash
npm install ngxsmk-datatable
```

### Using yarn

```bash
yarn add ngxsmk-datatable
```

### Using pnpm

```bash
pnpm add ngxsmk-datatable
```

---

## Setup

### 1. Import the Component (Standalone)

For Angular standalone components (recommended):

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableComponent } from 'ngxsmk-datatable';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [NgxsmkDatatableComponent],
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows">
    </ngxsmk-datatable>
  `
})
export class MyComponent {
  columns = [
    { id: 'name', name: 'Name', prop: 'name' }
  ];
  
  rows = [
    { id: 1, name: 'John Doe' }
  ];
}
```

### 2. Import the Module (NgModule)

For traditional NgModule-based applications:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsmkDatatableModule } from 'ngxsmk-datatable';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxsmkDatatableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## Importing Styles

### Option 1: Global Styles (Recommended)

Add to your `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "node_modules/ngxsmk-datatable/themes/material-theme.scss"
            ]
          }
        }
      }
    }
  }
}
```

### Option 2: Import in styles.scss

Add to your `src/styles.scss`:

```scss
@import 'ngxsmk-datatable/themes/material-theme.scss';
```

### Option 3: Component-Level Import

Import in your component's styles:

```typescript
@Component({
  selector: 'app-my-component',
  styleUrls: ['./my-component.scss'],
  template: '...'
})
```

```scss
// my-component.scss
@import 'ngxsmk-datatable/themes/material-theme.scss';
```

---

## Available Themes

Import any of the built-in themes:

```scss
// Material Design theme
@import 'ngxsmk-datatable/themes/material-theme.scss';

// Default theme (imported automatically)
// No need to import separately

// Dark theme
@import 'ngxsmk-datatable/themes/dark-theme.scss';

// Minimal theme
@import 'ngxsmk-datatable/themes/minimal-theme.scss';

// Colorful theme
@import 'ngxsmk-datatable/themes/colorful-theme.scss';
```

---

## Peer Dependencies

ngxsmk-datatable requires these peer dependencies:

```json
{
  "@angular/common": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "@angular/core": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "@angular/forms": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "rxjs": "^7.0.0"
}
```

These are typically already installed in Angular projects.

---

## Verify Installation

Create a simple test component:

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableComponent } from 'ngxsmk-datatable';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [NgxsmkDatatableComponent],
  template: `
    <div style="height: 400px; width: 100%;">
      <ngxsmk-datatable
        [columns]="columns"
        [rows]="rows"
        [pagination]="{ pageSize: 5 }">
      </ngxsmk-datatable>
    </div>
  `
})
export class TestComponent {
  columns = [
    { id: 'id', name: 'ID', prop: 'id', width: 80 },
    { id: 'name', name: 'Name', prop: 'name', width: 200 },
    { id: 'email', name: 'Email', prop: 'email', width: 250 }
  ];

  rows = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];
}
```

Run your app:

```bash
npm start
```

If you see a table with data, the installation was successful! ✅

---

## Troubleshooting

### Issue: Module not found

**Error:**
```
Cannot find module 'ngxsmk-datatable'
```

**Solution:**
1. Ensure the package is installed: `npm install ngxsmk-datatable`
2. Restart your dev server
3. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Issue: Styles not loading

**Error:** Table appears but without styling

**Solution:**
1. Import styles in `angular.json` or `styles.scss`
2. Make sure the path is correct: `node_modules/ngxsmk-datatable/themes/material-theme.scss`
3. Restart your dev server after modifying `angular.json`

### Issue: Type errors

**Error:** TypeScript errors about types

**Solution:**
1. Ensure TypeScript version is compatible (5.0+)
2. Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### Issue: Change detection not working

**Solution:**
Import `CommonModule` if using NgModule:
```typescript
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, NgxsmkDatatableModule]
})
```

---

## Next Steps

- 📖 [API Reference](./API.md) - Learn about all available inputs and outputs
- 🎨 [Customization Guide](./CUSTOMIZATION.md) - Customize the appearance
- ⚡ [Performance Tips](./PERFORMANCE.md) - Optimize for large datasets
- 🎯 [Examples](./EXAMPLES.md) - See practical examples

---

## Getting Help

- 🐛 [Report Issues](https://github.com/your-username/ngxsmk-datatable/issues)
- 💬 [Discussions](https://github.com/your-username/ngxsmk-datatable/discussions)
- 📧 Email: support@ngxsmk-datatable.com

