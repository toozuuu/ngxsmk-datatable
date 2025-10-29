# ngxsmk-datatable

<div align="center">

![npm version](https://img.shields.io/npm/v/ngxsmk-datatable)
![npm downloads](https://img.shields.io/npm/dm/ngxsmk-datatable)
![bundle size](https://img.shields.io/bundlephobia/minzip/ngxsmk-datatable)
![license](https://img.shields.io/npm/l/ngxsmk-datatable)

A powerful, feature-rich Angular datatable component built for Angular 17+.

**[View Demo](#)** • **[Full Documentation](../../README.md)** • **[GitHub](https://github.com/your-username/ngxsmk-datatable)**

</div>

---

## 🚀 Quick Start

### Installation

```bash
npm install ngxsmk-datatable
```

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow } from 'ngxsmk-datatable';

// Define your data model for full type safety
interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  standalone: true,
  imports: [NgxsmkDatatableComponent],
  template: `
    <ngxsmk-datatable
      [columns]="columns"
      [rows]="rows"
      [pagination]="{ pageSize: 10 }"
    >
    </ngxsmk-datatable>
  `
})
export class AppComponent {
  // Strongly-typed columns with IntelliSense support
  columns: NgxsmkColumn<User>[] = [
    { id: 'name', name: 'Name', prop: 'name', sortable: true },
    { id: 'email', name: 'Email', prop: 'email', sortable: true }
  ];

  // Strongly-typed rows with compile-time validation
  rows: NgxsmkRow<User>[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
}
```

---

## ✨ Key Features

✅ **🎯 Strongly-typed rows** - Full type safety in templates  
✅ **Lightning fast** rendering with optimized virtual scrolling  
✅ **Small bundle size** using modern Angular patterns  
✅ **Zero memory leaks** with proper cleanup and OnDestroy  
✅ **Modern Angular** (standalone components, OnPush strategy)  
✅ **5 built-in themes** with instant switching  
✅ **100% customizable** via CSS variables, classes, and templates  
✅ **Real-time theme updates** - CSS variables work at runtime  
✅ **TypeScript strict mode** with full type safety  
✅ **Production ready** and battle-tested  
✅ **Comprehensive documentation** with live examples  
✅ **Active development** with regular updates

---

## 📦 What's Included

### Core Features
- 🎯 Strongly-typed rows with compile-time safety
- ⚡ Virtual scrolling (10,000+ rows at 60fps)
- 🔄 Client & server-side sorting
- 📄 Client & server-side pagination
- ✅ Multiple selection modes
- 📊 Expandable row details
- ❄️ Frozen columns & rows
- 🎨 Custom cell templates

### Advanced Features
- 👁️ Column visibility control
- 🔄 Refresh button
- 📏 Interactive column resizing
- 🎨 Theme system with dark mode
- ✏️ Inline editing with validation & undo/redo
- 🔍 Search and filtering
- 📤 Data export (CSV, Excel, JSON)
- 🚀 Headless facade with OnPush (3x faster!)
- ↔️ Column reordering (drag-and-drop)
- 📱 Responsive card view (auto-switches on mobile!) (NEW!)

---

## 📚 Documentation

For full documentation, see the [main README](../../README.md).

### Quick Links
- 🎯 [Type Safety Guide](../../docs/TYPED-ROWS.md) - Strongly-typed rows (NEW!)
- 📦 [Installation Guide](../../docs/INSTALLATION.md) - Setup and configuration
- 📖 [API Reference](../../docs/API.md) - Complete API documentation
- 🎨 [Customization Guide](../../docs/CUSTOMIZATION.md) - Styling and theming
- ⚡ [Performance Tips](../../docs/PERFORMANCE.md) - Optimization strategies
- 🎯 [Examples](../../docs/EXAMPLES.md) - Practical code examples

---

## 🔧 Development

This library is part of an Angular workspace.

### Build the Library

```bash
# Build once
npx ng build ngxsmk-datatable

# Build and watch for changes
npm run build:lib:watch
```

### Run the Demo

```bash
# Start the demo application
npm start

# Or specifically
npm run demo
```

### Test

```bash
# Run tests
npm test

# Run library tests only
npm run test:lib
```

### Build for Production

```bash
# Build library for production
npx ng build ngxsmk-datatable --configuration production

# Pack for npm
npm run pack

# Publish to npm (after building)
npm run publish:lib
```

---

## 📁 Project Structure

```
projects/ngxsmk-datatable/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ngxsmk-datatable/
│   │   │   │   ├── ngxsmk-datatable.component.ts
│   │   │   │   ├── ngxsmk-datatable.component.html
│   │   │   │   └── ngxsmk-datatable.component.scss
│   │   │   └── ngxsmk-pager/
│   │   │       ├── ngxsmk-pager.component.ts
│   │   │       ├── ngxsmk-pager.component.html
│   │   │       └── ngxsmk-pager.component.scss
│   │   ├── directives/
│   │   │   ├── column-template.directive.ts
│   │   │   ├── header-template.directive.ts
│   │   │   └── row-detail-template.directive.ts
│   │   ├── interfaces/
│   │   │   ├── column.interface.ts
│   │   │   ├── pagination.interface.ts
│   │   │   ├── row.interface.ts
│   │   │   ├── selection.interface.ts
│   │   │   └── sorting.interface.ts
│   │   ├── pipes/
│   │   │   └── safe-html.pipe.ts
│   │   ├── services/
│   │   │   ├── column-resize.service.ts
│   │   │   ├── selection.service.ts
│   │   │   └── virtual-scroll.service.ts
│   │   ├── themes/
│   │   │   └── material-theme.scss
│   │   └── ngxsmk-datatable.module.ts
│   └── public-api.ts
├── ng-package.json
├── package.json
├── tsconfig.lib.json
└── README.md (this file)
```

---

## 🔗 Exports

The library exports the following:

### Components
- `NgxsmkDatatableComponent` - Main datatable component
- `NgxsmkPagerComponent` - Pagination component
- `NgxsmkDatatableModule` - NgModule (for non-standalone usage)

### Directives
- `ColumnTemplateDirective` - Column template directive
- `HeaderTemplateDirective` - Header template directive
- `RowDetailTemplateDirective` - Row detail template directive

### Interfaces
- `NgxsmkColumn<T>` - Column configuration (now with generic types!)
- `NgxsmkRow<T>` - Row data (now with generic types!)
- `NgxsmkCellTemplateContext<T, V>` - Typed cell template context (NEW!)
- `NgxsmkHeaderTemplateContext<T>` - Typed header template context (NEW!)
- `NgxsmkRowDetailTemplateContext<T>` - Typed row detail template context (NEW!)
- `PaginationConfig` - Pagination configuration
- `SelectionEvent` - Selection event
- `SortEvent` - Sort event
- `PageEvent` - Page event
- `SelectionType` - Selection type enum
- `RowDetailView` - Row detail configuration

### Pipes
- `SafeHtmlPipe` - Safe HTML pipe

### Services
- `VirtualScrollService` - Virtual scrolling logic
- `ColumnResizeService` - Column resize logic
- `SelectionService` - Selection management

---

## 🎨 Styling

### Using Built-in Themes

```typescript
<ngxsmk-datatable [class]="'theme-material'">
</ngxsmk-datatable>
```

Available themes:
- `theme-default` - Clean, modern design
- `theme-material` - Material Design 3
- `theme-dark` - Dark mode
- `theme-minimal` - Minimalist design
- `theme-colorful` - Vibrant theme

### Custom Styling with CSS Variables

All CSS variables are **fully reactive** and can be changed at runtime:

```scss
:root {
  // Colors
  --ngxsmk-dt-primary-color: #e91e63;
  --ngxsmk-dt-bg-white: #ffffff;
  --ngxsmk-dt-bg-hover: #fef3c7;
  
  // Dimensions (responsive)
  --ngxsmk-dt-row-height: 40px;
  --ngxsmk-dt-padding: 12px;
  --ngxsmk-dt-font-size: 13px;
  --ngxsmk-dt-radius-lg: 8px;
}
```

**💡 Try the Live Customization Demo** in the demo app to see all available CSS variables and generate your theme!

See the [full customization guide](../../README.md#-customization) for all available variables and advanced styling techniques.

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request?

- **Issues:** [GitHub Issues](https://github.com/your-username/ngxsmk-datatable/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/ngxsmk-datatable/discussions)

Please include:
1. Angular version
2. ngxsmk-datatable version
3. Browser and version
4. Steps to reproduce
5. Expected vs actual behavior

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](../../README.md#-contributing).

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Build and test locally
6. Submit a pull request

---

## 📄 License

MIT License - Copyright (c) 2024

See [LICENSE](../../LICENSE) for full details.

---

## 🙏 Acknowledgments

- Built with ❤️ by the Angular community
- Thanks to all contributors and issue reporters
- Inspired by modern data table solutions

---

## 📞 Support

- **Documentation:** [Full Docs](../../README.md)
- **Examples:** [Demo App](../demo-app/)
- **Issues:** [GitHub Issues](https://github.com/toozuuu/ngxsmk-datatable/issues)
- **Email:** sachindilshan040@gmail.com

---

<div align="center">

**Made with ❤️ for Angular Developers**

[![npm version](https://img.shields.io/npm/v/ngxsmk-datatable)](https://www.npmjs.com/package/ngxsmk-datatable)
[![GitHub stars](https://img.shields.io/github/stars/toozuuu/ngxsmk-datatable?style=social)](https://github.com/toozuuu/ngxsmk-datatable)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable)

[View on GitHub](https://github.com/toozuuu/ngxsmk-datatable) • [View on npm](https://www.npmjs.com/package/ngxsmk-datatable) • [Try on StackBlitz](https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable)

</div>
