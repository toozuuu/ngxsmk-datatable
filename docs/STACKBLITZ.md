# StackBlitz Setup Guide

Learn how to use ngxsmk-datatable on StackBlitz - the online IDE for web development.

## Table of Contents

- [What is StackBlitz?](#what-is-stackblitz)
- [Quick Start](#quick-start)
- [Creating a New Project](#creating-a-new-project)
- [Installing ngxsmk-datatable](#installing-ngxsmk-datatable)
- [Basic Setup](#basic-setup)
- [Complete Working Example](#complete-working-example)
- [Troubleshooting](#troubleshooting)
- [Tips and Best Practices](#tips-and-best-practices)

## What is StackBlitz?

StackBlitz is an online IDE that allows you to create, edit, and run Angular projects directly in your browser without any local setup. It's perfect for:

- 🚀 Quick prototyping and experimentation
- 📚 Testing library features before installation
- 🐛 Creating reproducible bug reports
- 📖 Sharing code examples and demos
- 🎓 Learning and tutorials

## Quick Start

The fastest way to get started is to use our pre-configured StackBlitz template:

👉 **[Open ngxsmk-datatable on StackBlitz](https://stackblitz.com/edit/ngxsmk-datatable-demo?file=src/app/app.component.ts)**

This template includes:
- ✅ Pre-installed ngxsmk-datatable package
- ✅ Basic configuration and sample data
- ✅ Working examples ready to customize

## Creating a New Project

If you want to start from scratch:

### 1. Create a New Angular Project

1. Go to [stackblitz.com](https://stackblitz.com)
2. Click **"New Project"**
3. Select **"Angular"** from the framework options
4. Wait for the project to initialize

### 2. Project Structure

StackBlitz will create a basic Angular project with this structure:

```
my-project/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.config.ts
│   └── main.ts
├── package.json
└── tsconfig.json
```

## Installing ngxsmk-datatable

### Option 1: Using the Dependencies Panel (Recommended)

1. Click on the **"Dependencies"** section in the left sidebar
2. Click **"+ Add Dependency"**
3. Type `ngxsmk-datatable`
4. Select the latest version from the list
5. StackBlitz will automatically install the package

### Option 2: Editing package.json

1. Open `package.json`
2. Add `ngxsmk-datatable` to the dependencies:

```json
{
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "ngxsmk-datatable": "^1.1.0"
  }
}
```

3. Save the file - StackBlitz will auto-install the dependency

## Basic Setup

### 1. Import the Module

**For Standalone Components (Angular 14+):**

Update your `app.config.ts` or component imports:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsmkDatatableModule } from 'ngxsmk-datatable';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations()
  ]
};
```

Then in your component:

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableModule } from 'ngxsmk-datatable';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkDatatableModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Component code
}
```

**For NgModule-based Apps:**

Update your `app.module.ts`:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsmkDatatableModule } from 'ngxsmk-datatable';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxsmkDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Add Sample Data

In your `app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableModule, DatatableColumn } from 'ngxsmk-datatable';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkDatatableModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  columns: DatatableColumn[] = [
    { prop: 'id', name: 'ID', width: 80 },
    { prop: 'name', name: 'Name', width: 200 },
    { prop: 'email', name: 'Email', width: 250 },
    { prop: 'role', name: 'Role', width: 150 }
  ];

  rows = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Analyst' }
  ];
}
```

### 3. Add the DataTable to Your Template

In your `app.component.html`:

```html
<div class="container">
  <h1>ngxsmk-datatable Demo</h1>
  
  <ngxsmk-datatable
    [columns]="columns"
    [rows]="rows"
    [config]="{
      pagination: { enabled: true, pageSize: 10 },
      sorting: { enabled: true },
      selection: { enabled: true, mode: 'multi' }
    }">
  </ngxsmk-datatable>
</div>
```

### 4. Add Basic Styling

In your `app.component.css`:

```css
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}
```

## Complete Working Example

Here's a complete, copy-paste ready example for StackBlitz:

**app.component.ts:**

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableModule, DatatableColumn } from 'ngxsmk-datatable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkDatatableModule],
  template: `
    <div class="app-container">
      <header>
        <h1>🚀 ngxsmk-datatable Demo</h1>
        <p>A powerful Angular DataTable component</p>
      </header>

      <ngxsmk-datatable
        [columns]="columns"
        [rows]="rows"
        [config]="config"
        (selectionChange)="onSelectionChange($event)"
        (sortChange)="onSortChange($event)">
      </ngxsmk-datatable>

      <div class="info" *ngIf="selectedRows.length > 0">
        <strong>Selected:</strong> {{ selectedRows.length }} row(s)
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 30px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    header {
      margin-bottom: 30px;
    }

    h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 2em;
    }

    p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1em;
    }

    .info {
      margin-top: 20px;
      padding: 15px;
      background-color: #e8f5e9;
      border-left: 4px solid #4caf50;
      border-radius: 4px;
    }
  `]
})
export class AppComponent {
  columns: DatatableColumn[] = [
    { prop: 'id', name: 'ID', width: 80, sortable: true },
    { prop: 'name', name: 'Name', width: 200, sortable: true },
    { prop: 'email', name: 'Email', width: 250, sortable: true },
    { prop: 'role', name: 'Role', width: 150, sortable: true },
    { prop: 'status', name: 'Status', width: 120, sortable: true },
    { prop: 'joinDate', name: 'Join Date', width: 150, sortable: true }
  ];

  rows: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active', joinDate: '2023-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Active', joinDate: '2023-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer', status: 'Away', joinDate: '2023-04-05' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Analyst', status: 'Active', joinDate: '2023-05-12' },
    { id: 6, name: 'Eva Wilson', email: 'eva@example.com', role: 'Developer', status: 'Active', joinDate: '2023-06-18' },
    { id: 7, name: 'Frank Miller', email: 'frank@example.com', role: 'Designer', status: 'Active', joinDate: '2023-07-22' },
    { id: 8, name: 'Grace Lee', email: 'grace@example.com', role: 'Manager', status: 'Away', joinDate: '2023-08-30' }
  ];

  config = {
    pagination: { 
      enabled: true, 
      pageSize: 5,
      pageSizeOptions: [5, 10, 20]
    },
    sorting: { 
      enabled: true,
      multiSort: true
    },
    selection: { 
      enabled: true, 
      mode: 'multi' as const
    },
    columnResize: { enabled: true },
    rowHeight: 50,
    headerHeight: 50
  };

  selectedRows: User[] = [];

  onSelectionChange(selection: User[]): void {
    this.selectedRows = selection;
    console.log('Selected rows:', selection);
  }

  onSortChange(event: any): void {
    console.log('Sort changed:', event);
  }
}
```

**main.ts:**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations()
  ]
}).catch(err => console.error(err));
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Module not found" Error

**Problem:** Cannot find module 'ngxsmk-datatable'

**Solution:**
- Ensure the package is properly installed in `package.json`
- Click the refresh button in the Dependencies panel
- Try reinstalling: Remove and re-add the dependency

#### 2. Animations Not Working

**Problem:** No animations or transitions

**Solution:**
- Make sure you've imported `BrowserAnimationsModule` (NgModule) or called `provideAnimations()` (Standalone)
- Add to `app.config.ts` for standalone apps:

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations()]
};
```

#### 3. Styles Not Applied

**Problem:** DataTable looks unstyled or broken

**Solution:**
- The library's styles are automatically included
- Make sure your component has proper container styling
- Check browser console for CSS loading errors
- Try clearing StackBlitz cache (refresh the page)

#### 4. TypeScript Errors

**Problem:** Type errors with columns or config

**Solution:**
- Import types explicitly:

```typescript
import { DatatableColumn, DatatableConfig } from 'ngxsmk-datatable';
```

- Use type annotations:

```typescript
columns: DatatableColumn[] = [...];
config: DatatableConfig = {...};
```

#### 5. Performance Issues

**Problem:** Slow rendering with large datasets

**Solution:**
- Enable virtual scrolling for large datasets:

```typescript
config = {
  virtualScroll: { enabled: true, itemHeight: 50 }
};
```

- Use pagination for better performance
- Limit initial page size to 10-20 rows

## Tips and Best Practices

### 1. Use TypeScript Interfaces

Define your data model for better type safety:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

rows: User[] = [...];
```

### 2. Start Simple, Then Enhance

Begin with a basic table and gradually add features:

```typescript
// Start simple
config = {
  pagination: { enabled: true }
};

// Then add more features
config = {
  pagination: { enabled: true, pageSize: 10 },
  sorting: { enabled: true },
  selection: { enabled: true }
};
```

### 3. Test Different Configurations

StackBlitz makes it easy to experiment. Try different:
- Page sizes
- Column widths
- Selection modes
- Theme options

### 4. Use Console Logs for Debugging

Monitor events in the console:

```typescript
onSelectionChange(selection: any): void {
  console.log('Selection changed:', selection);
}

onSortChange(event: any): void {
  console.log('Sort changed:', event);
}
```

### 5. Share Your Examples

- Click **"Share"** to get a shareable link
- Use **"Fork"** to create your own copy
- Perfect for bug reports and feature requests

### 6. Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save (auto-save is enabled by default)
- `Ctrl/Cmd + K` - Open command palette
- `Ctrl/Cmd + P` - Quick file search
- `Ctrl/Cmd + /` - Toggle comment

## Additional Resources

- 📖 [Full Documentation](../README.md)
- 🔧 [API Reference](./API.md)
- 🎨 [Customization Guide](./CUSTOMIZATION.md)
- 💡 [Examples](./EXAMPLES.md)
- 🚀 [Performance Tips](./PERFORMANCE.md)

## Need Help?

- 🐛 [Report Issues](https://github.com/yourusername/ngxsmk-datatable/issues)
- 💬 [Discussions](https://github.com/yourusername/ngxsmk-datatable/discussions)
- 📧 Contact: your-email@example.com

---

**Pro Tip:** When reporting bugs, always include a StackBlitz reproduction. It helps maintainers understand and fix issues much faster! 🚀

