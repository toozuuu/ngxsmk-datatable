# Customization Guide

Complete guide to customizing the appearance and behavior of ngxsmk-datatable.

---

## Table of Contents

- [Customization Methods](#customization-methods)
- [CSS Variables](#css-variables)
- [CSS Classes](#css-classes)
- [Custom Templates](#custom-templates)
- [Built-in Themes](#built-in-themes)
- [Dynamic Theming](#dynamic-theming)
- [Examples](#examples)

---

## Customization Methods

There are 4 ways to customize ngxsmk-datatable:

1. **CSS Variables** (Easiest, Recommended) - Change colors, sizes, spacing
2. **CSS Classes** (More control) - Target specific elements
3. **Custom Templates** (Maximum flexibility) - Complete control over rendering
4. **Built-in Themes** (Quick start) - Pre-designed themes

---

## CSS Variables

### Complete List of CSS Variables

```scss
:root {
  // ==================== Colors ====================
  
  // Primary Colors
  --ngxsmk-dt-primary-color: #3b82f6;
  --ngxsmk-dt-primary-hover: #2563eb;
  --ngxsmk-dt-primary-light: rgba(59, 130, 246, 0.08);
  --ngxsmk-dt-primary-lighter: rgba(59, 130, 246, 0.04);

  // Background Colors
  --ngxsmk-dt-bg-white: #ffffff;
  --ngxsmk-dt-bg-light: #f3f4f6;
  --ngxsmk-dt-bg-lighter: #f8f9fb;
  --ngxsmk-dt-bg-hover: #f0f4ff;
  --ngxsmk-dt-bg-selected: #e8f0ff;

  // Text Colors
  --ngxsmk-dt-text-primary: #1f2937;
  --ngxsmk-dt-text-secondary: #6b7280;
  --ngxsmk-dt-text-tertiary: #9ca3af;

  // Border Colors
  --ngxsmk-dt-border-light: #f0f1f3;
  --ngxsmk-dt-border-medium: #e5e7eb;
  --ngxsmk-dt-border-dark: #d1d5db;

  // ==================== Dimensions ====================
  
  // Heights
  --ngxsmk-dt-row-height: 54px;
  --ngxsmk-dt-header-height: auto;

  // Spacing
  --ngxsmk-dt-padding: 16px;
  --ngxsmk-dt-padding-sm: 12px;
  --ngxsmk-dt-padding-xs: 8px;

  // Border Radius
  --ngxsmk-dt-radius-sm: 4px;
  --ngxsmk-dt-radius-md: 8px;
  --ngxsmk-dt-radius-lg: 10px;

  // ==================== Typography ====================
  
  --ngxsmk-dt-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --ngxsmk-dt-font-size: 14px;
  --ngxsmk-dt-font-size-sm: 13px;
  --ngxsmk-dt-font-size-xs: 12px;
  --ngxsmk-dt-line-height: 1.6;

  // ==================== Effects ====================
  
  // Shadows
  --ngxsmk-dt-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --ngxsmk-dt-shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
  --ngxsmk-dt-shadow-hover: 0 0 0 1px var(--ngxsmk-dt-border-medium);

  // Transitions
  --ngxsmk-dt-transition-fast: 0.15s ease;
  --ngxsmk-dt-transition-normal: 0.2s ease;
}
```

### Quick Customization Examples

#### Make it Compact

```scss
:root {
  --ngxsmk-dt-row-height: 40px;
  --ngxsmk-dt-padding: 10px;
  --ngxsmk-dt-font-size: 13px;
}
```

#### Make it Spacious

```scss
:root {
  --ngxsmk-dt-row-height: 64px;
  --ngxsmk-dt-padding: 20px;
  --ngxsmk-dt-font-size: 15px;
}
```

#### Change Primary Color

```scss
:root {
  --ngxsmk-dt-primary-color: #e91e63;
  --ngxsmk-dt-primary-hover: #c2185b;
  --ngxsmk-dt-bg-hover: #fce4ec;
  --ngxsmk-dt-bg-selected: #f8bbd0;
}
```

#### Dark Background

```scss
:root {
  --ngxsmk-dt-bg-white: #1e1e1e;
  --ngxsmk-dt-bg-light: #2d2d2d;
  --ngxsmk-dt-text-primary: #ffffff;
  --ngxsmk-dt-text-secondary: #b0b0b0;
  --ngxsmk-dt-border-medium: #404040;
}
```

---

## CSS Classes

### Targeting Specific Elements

#### Header Styling

```scss
// Gradient header
.ngxsmk-datatable__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ngxsmk-datatable__header-cell-text {
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

// Sortable column hover
.ngxsmk-datatable__header-cell--sortable:hover {
  background: rgba(255, 255, 255, 0.1);
}

// Currently sorted column
.ngxsmk-datatable__header-cell--sorted {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
```

#### Row Styling

```scss
// Striped rows
.ngxsmk-datatable__row--odd {
  background: #ffffff;
}

.ngxsmk-datatable__row--even {
  background: #f9fafb;
}

// Row hover effect
.ngxsmk-datatable__row:hover {
  background: #fef3c7 !important;
  transform: translateX(4px);
  box-shadow: -4px 0 0 0 #f59e0b;
}

// Selected row
.ngxsmk-datatable__row--selected {
  background: #dbeafe !important;
  border-left: 4px solid #3b82f6;
}
```

#### Cell Styling

```scss
// All cells
.ngxsmk-datatable__cell {
  font-family: 'Inter', sans-serif;
}

// Frozen left columns
.ngxsmk-datatable__cell--frozen-left {
  background: linear-gradient(to right, #f9fafb 0%, #ffffff 100%);
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

// Frozen right columns
.ngxsmk-datatable__cell--frozen-right {
  background: linear-gradient(to left, #f9fafb 0%, #ffffff 100%);
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
}
```

#### Row Details

```scss
// Row detail container
.ngxsmk-datatable__row-detail {
  border-top: 2px solid #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.ngxsmk-datatable__row-detail-content {
  padding: 30px;
  background: linear-gradient(to bottom, #f0f9ff 0%, #ffffff 100%);
}

// Detail toggle button
.ngxsmk-datatable__detail-toggle-button {
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
}

.ngxsmk-datatable__detail-toggle-button--expanded {
  background: #10b981;
}
```

### Scoped Styling (Component-Level)

```typescript
@Component({
  selector: 'app-my-component',
  styles: [`
    // Use ::ng-deep to penetrate view encapsulation
    :host ::ng-deep {
      .ngxsmk-datatable {
        --ngxsmk-dt-primary-color: #10b981;
        --ngxsmk-dt-row-height: 48px;
      }
      
      .ngxsmk-datatable__row:hover {
        background: #d1fae5 !important;
      }
    }
  `]
})
```

---

## Custom Templates

### Cell Templates

```typescript
@Component({
  template: `
    <ngxsmk-datatable [columns]="columns" [rows]="rows">
      <!-- Avatar Cell -->
      <ng-template #avatarTemplate let-row="row" let-value="value">
        <div class="avatar-cell">
          <img [src]="value" class="avatar-image">
          <span class="avatar-name">{{ row.name }}</span>
        </div>
      </ng-template>
      
      <!-- Status Badge -->
      <ng-template #statusTemplate let-value="value">
        <span [class]="'status-badge status-' + value.toLowerCase()">
          {{ value }}
        </span>
      </ng-template>
      
      <!-- Progress Bar -->
      <ng-template #progressTemplate let-value="value">
        <div class="progress-bar-container">
          <div class="progress-bar" [style.width.%]="value"></div>
          <span class="progress-text">{{ value }}%</span>
        </div>
      </ng-template>
      
      <!-- Action Buttons -->
      <ng-template #actionsTemplate let-row="row">
        <div class="action-buttons">
          <button (click)="edit(row)" class="btn btn-edit">
            <i class="fas fa-edit"></i>
          </button>
          <button (click)="delete(row)" class="btn btn-delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </ng-template>
    </ngxsmk-datatable>
  `,
  styles: [`
    .avatar-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .avatar-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .status-active {
      background: #d1fae5;
      color: #065f46;
    }
    
    .progress-bar-container {
      position: relative;
      background: #e5e7eb;
      border-radius: 4px;
      height: 20px;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      border-radius: 4px;
    }
  `]
})
export class MyComponent {
  @ViewChild('avatarTemplate') avatarTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  
  ngAfterViewInit() {
    this.columns = [
      {
        id: 'avatar',
        name: 'User',
        prop: 'avatar',
        cellTemplate: this.avatarTemplate
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        cellTemplate: this.statusTemplate
      }
    ];
  }
}
```

### Header Templates

```typescript
<ng-template #customHeader let-column="column">
  <div class="custom-header">
    <i [class]="getIcon(column.id)"></i>
    <span>{{ column.name }}</span>
    @if (column.frozen) {
      <span class="pin-indicator">📌</span>
    }
  </div>
</ng-template>
```

### Row Detail Template

```typescript
<ng-template #detailTemplate let-row="row">
  <div class="row-detail">
    <h3>{{ row.name }} - Details</h3>
    <div class="detail-grid">
      <div class="detail-item">
        <label>Email:</label>
        <span>{{ row.email }}</span>
      </div>
      <div class="detail-item">
        <label>Phone:</label>
        <span>{{ row.phone }}</span>
      </div>
      <div class="detail-item">
        <label>Address:</label>
        <span>{{ row.address }}</span>
      </div>
    </div>
    <div class="detail-actions">
      <button (click)="editUser(row)">Edit</button>
      <button (click)="viewProfile(row)">View Profile</button>
    </div>
  </div>
</ng-template>
```

---

## Built-in Themes

### Using Themes

```typescript
// Apply theme via class binding
<ngxsmk-datatable [class]="currentTheme">
</ngxsmk-datatable>

// Component
currentTheme = 'theme-material';

changeTheme(theme: string) {
  this.currentTheme = theme;
}
```

### Available Themes

#### Default Theme
```typescript
<ngxsmk-datatable [class]="'theme-default'">
```
- Clean, modern design
- Blue primary color
- Subtle shadows and borders

#### Material Theme
```typescript
<ngxsmk-datatable [class]="'theme-material'">
```
- Material Design 3 inspired
- Elevation and depth
- Material color palette

#### Dark Theme
```typescript
<ngxsmk-datatable [class]="'theme-dark'">
```
- Dark background
- High contrast
- Reduced eye strain

#### Minimal Theme
```typescript
<ngxsmk-datatable [class]="'theme-minimal'">
```
- Borderless design
- Maximum whitespace
- Clean typography

#### Colorful Theme
```typescript
<ngxsmk-datatable [class]="'theme-colorful'">
```
- Vibrant colors
- Gradients
- Playful design

---

## Dynamic Theming

### Runtime Theme Changes

```typescript
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-themed-table',
  template: `
    <div class="theme-controls">
      <button (click)="applyTheme('purple')">Purple</button>
      <button (click)="applyTheme('green')">Green</button>
      <button (click)="applyTheme('orange')">Orange</button>
    </div>
    
    <div #tableWrapper>
      <ngxsmk-datatable
        [columns]="columns"
        [rows]="rows">
      </ngxsmk-datatable>
    </div>
  `
})
export class ThemedTableComponent {
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  
  themes = {
    purple: {
      primary: '#9333ea',
      hover: '#faf5ff',
      selected: '#f3e8ff'
    },
    green: {
      primary: '#10b981',
      hover: '#f0fdf4',
      selected: '#d1fae5'
    },
    orange: {
      primary: '#f97316',
      hover: '#fff7ed',
      selected: '#fed7aa'
    }
  };
  
  applyTheme(themeName: string) {
    const theme = this.themes[themeName];
    const wrapper = this.tableWrapper.nativeElement;
    
    wrapper.style.setProperty('--ngxsmk-dt-primary-color', theme.primary);
    wrapper.style.setProperty('--ngxsmk-dt-bg-hover', theme.hover);
    wrapper.style.setProperty('--ngxsmk-dt-bg-selected', theme.selected);
  }
}
```

### Theme Persistence

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <ngxsmk-datatable [class]="savedTheme">
    </ngxsmk-datatable>
  `
})
export class PersistentThemeComponent implements OnInit {
  savedTheme = 'theme-default';
  
  ngOnInit() {
    // Load saved theme from localStorage
    const saved = localStorage.getItem('table-theme');
    if (saved) {
      this.savedTheme = saved;
    }
  }
  
  changeTheme(theme: string) {
    this.savedTheme = theme;
    localStorage.setItem('table-theme', theme);
  }
}
```

---

## Examples

### Example 1: Corporate Theme

```scss
:root {
  --ngxsmk-dt-primary-color: #1e40af;
  --ngxsmk-dt-primary-hover: #1e3a8a;
  --ngxsmk-dt-bg-white: #ffffff;
  --ngxsmk-dt-bg-light: #f8fafc;
  --ngxsmk-dt-bg-hover: #e0e7ff;
  --ngxsmk-dt-text-primary: #1e293b;
  --ngxsmk-dt-font-family: 'Arial', sans-serif;
  --ngxsmk-dt-radius-lg: 4px;
}

.ngxsmk-datatable__header {
  background: #1e40af;
  color: white;
}

.ngxsmk-datatable__row:hover {
  background: #e0e7ff !important;
}
```

### Example 2: Modern & Playful

```scss
:root {
  --ngxsmk-dt-primary-color: #ec4899;
  --ngxsmk-dt-row-height: 60px;
  --ngxsmk-dt-padding: 20px;
  --ngxsmk-dt-radius-lg: 16px;
  --ngxsmk-dt-font-family: 'Poppins', sans-serif;
}

.ngxsmk-datatable {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.ngxsmk-datatable__row {
  border-radius: 12px;
  margin: 4px 8px;
}
```

### Example 3: Data-Dense

```scss
:root {
  --ngxsmk-dt-row-height: 36px;
  --ngxsmk-dt-padding: 8px;
  --ngxsmk-dt-font-size: 12px;
  --ngxsmk-dt-border-medium: #d1d5db;
}

.ngxsmk-datatable__row {
  border-bottom: 1px solid var(--ngxsmk-dt-border-medium);
}
```

---

## Tips & Best Practices

1. **Start with CSS Variables** - They're the easiest and most maintainable
2. **Use Scoped Styles** - Keep customizations isolated to components
3. **Test Themes** - Check all states (hover, selected, expanded)
4. **Maintain Contrast** - Ensure text is readable on all backgrounds
5. **Consider Accessibility** - Meet WCAG contrast ratios
6. **Document Custom Themes** - Make them reusable
7. **Use the Live Demo** - Experiment in the customization demo page

---

## Related Documentation

- [API Reference](./API.md)
- [Installation Guide](./INSTALLATION.md)
- [Performance Tips](./PERFORMANCE.md)
- [Examples](./EXAMPLES.md)

