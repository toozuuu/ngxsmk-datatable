# ngxsmk-datatable

<div align="center">

![ngxsmk-datatable](https://img.shields.io/badge/ngxsmk--datatable-v1.6.0-blue.svg)
![Angular](https://img.shields.io/badge/angular-17%2B-red.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![npm version](https://img.shields.io/npm/v/ngxsmk-datatable)](https://www.npmjs.com/package/ngxsmk-datatable)
[![npm downloads](https://img.shields.io/npm/dm/ngxsmk-datatable)](https://www.npmjs.com/package/ngxsmk-datatable)

**The Ultimate Angular DataTable Component**

🚀 Performance-First • 🎨 Fully Customizable • 📦 Standalone Components • ✅ Production Ready

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable)

[Documentation](./docs/README.md) • [StackBlitz Guide](./STACKBLITZ.md) • [API Reference](./docs/API.md)

</div>

---

## ✨ What Makes It Special?

A modern, feature-rich Angular datatable component built from the ground up for Angular 17+. Designed with performance, customization, and developer experience as top priorities.

### 🎯 Key Advantages

✅ **🎯 Strongly-Typed Rows** - Full TypeScript type safety in templates (better than Angular Material!)  
✅ **Lightning Fast** - Optimized rendering for datasets with 10,000+ rows  
✅ **Fully Reactive** - CSS variables update in real-time  
✅ **100% Customizable** - Every aspect can be styled via CSS variables, classes, or templates  
✅ **Modern Architecture** - Standalone components with OnPush change detection  
✅ **Zero Memory Leaks** - Proper cleanup and resource management  
✅ **5 Built-in Themes** - Beautiful themes with dark mode support  
✅ **Interactive Features** - Column resizing, row details, inline editing, and more  
✅ **TypeScript First** - Full type safety with strict mode support  
✅ **Production Ready** - Battle-tested in enterprise applications  
✅ **Small Bundle Size** - Optimized for minimal footprint  
✅ **Developer Friendly** - Intuitive API and comprehensive documentation

---

## 📦 Installation

```bash
npm install ngxsmk-datatable
```

## 🚀 Quick Start

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow } from 'ngxsmk-datatable';

// Define your data model for full type safety
interface User {
  id: number;
  name: string;
  age: number;
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
      [virtualScrolling]="true"
      [selectionType]="'multi'"
    >
    </ngxsmk-datatable>
  `
})
export class AppComponent {
  // Strongly-typed columns with IntelliSense support
  columns: NgxsmkColumn<User>[] = [
    { id: 'name', name: 'Name', prop: 'name', sortable: true, resizable: true },
    { id: 'age', name: 'Age', prop: 'age', sortable: true, flexGrow: 1 },
    { id: 'email', name: 'Email', prop: 'email', sortable: true, width: 250 }
  ];

  // Strongly-typed rows with compile-time validation
  rows: NgxsmkRow<User>[] = [
    { id: 1, name: 'Alice', age: 28, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 32, email: 'bob@example.com' }
  ];
}
```

---

## 🎮 Try it Online

Want to try ngxsmk-datatable without installing anything? Click the button below to open a fully functional demo in StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable)

You can edit the code, experiment with features, and see changes in real-time!

📖 **[StackBlitz Setup Guide](./STACKBLITZ.md)** - Learn how to use the project on StackBlitz

---

## 🌟 Features

### Core Features
- 🎯 **Strongly-Typed Rows** - Full TypeScript type safety in templates (NEW in v1.1.0!)
- ⚡ **Virtual Scrolling** - Smooth handling of 10,000+ rows with 60fps
- 🔄 **Sorting** - Single & multi-column sorting (client & server-side)
- 📄 **Pagination** - Flexible pagination with customizable page sizes
- ✅ **Selection** - Single, multi, checkbox, and cell selection modes
- 📊 **Row Details** - Expandable row details with custom templates
- ❄️ **Frozen Columns** - Pin columns to left or right side
- 🎨 **Custom Templates** - Complete template customization for cells and headers

### Advanced Features
- 👁️ **Column Visibility** - Dynamic show/hide columns with persistence
- 🔄 **Refresh Button** - Built-in data refresh functionality
- 📏 **Interactive Resizing** - Drag-and-drop column width adjustment
- 🎨 **Theme System** - 5 beautiful built-in themes
- 💾 **State Persistence** - Save user preferences and theme settings
- ✏️ **Inline Editing** - Edit cells directly with validation & undo/redo
- 🔍 **Advanced Filtering** - Multi-criteria search and custom filters
- 📤 **Export Data** - Export to CSV, Excel, JSON, or print-friendly format
- 🎯 **Performance Optimized** - Smart change detection and virtual DOM
- 🌐 **Internationalization** - i18n ready with customizable labels
- 🚀 **Headless Facade** - Reactive state management with OnPush (3x faster!)
- ↔️ **Column Reordering** - Drag-and-drop column reordering
- 📱 **Responsive Card View** - Auto-switches to mobile-friendly cards (NEW!)

---

## 📚 Documentation

### Complete Documentation

- 🎯 **[Type Safety Guide](./docs/TYPED-ROWS.md)** - Strongly-typed rows and templates (NEW!)
- 📦 **[Installation Guide](./docs/INSTALLATION.md)** - Setup, dependencies, and troubleshooting
- 📖 **[API Reference](./docs/API.md)** - All inputs, outputs, and interfaces
- 🎨 **[Customization Guide](./docs/CUSTOMIZATION.md)** - CSS variables, themes, and templates
- ⚡ **[Performance Tips](./docs/PERFORMANCE.md)** - Optimization for large datasets
- 🎯 **[Examples](./docs/EXAMPLES.md)** - Practical code examples and use cases

### Basic Usage

#### Columns Configuration
```typescript
columns = [
  {
    id: 'name',
    name: 'Name',
    prop: 'name',
    sortable: true,
    resizable: true,
    width: 200,
    minWidth: 100,
    maxWidth: 400,
    flexGrow: 1, // Responsive width
    frozen: 'left' // Pin to left
  }
];
```

#### Pagination
```typescript
pagination = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
  showPageSizeOptions: true,
  showFirstLastButtons: true,
  showRangeLabels: true,
  showTotalItems: true,
  currentPage: 1,
  totalItems: 100
};
```

#### Selection
```typescript
<ngxsmk-datatable
  [selectionType]="'checkbox'"
  [selected]="selectedRows"
  (select)="onSelect($event)"
>
</ngxsmk-datatable>
```

#### Column Visibility
```typescript
<ngxsmk-datatable
  [columnVisibilityEnabled]="true"
  (columnVisibilityChange)="onColumnVisibilityChange($event)"
>
</ngxsmk-datatable>

// In component
onColumnVisibilityChange(event: { column: NgxsmkColumn; visible: boolean }) {
  console.log(`Column ${event.column.name} is now ${event.visible ? 'visible' : 'hidden'}`);
}
```

#### Virtual Scrolling
```typescript
<ngxsmk-datatable
  [virtualScrolling]="true"
  [rowHeight]="50"
  [rows]="largeDataset" // 10,000+ rows
>
</ngxsmk-datatable>
```

#### Row Details
```typescript
<ngxsmk-datatable
  [rowDetail]="{
    template: detailTemplate,
    toggleOnClick: true,
    rowHeight: 200
  }"
>
</ngxsmk-datatable>

<ng-template #detailTemplate let-row="row">
  <div class="detail-content">
    {{ row | json }}
  </div>
</ng-template>
```

#### Frozen Columns
```typescript
columns = [
  { id: 'actions', name: 'Actions', frozen: 'left' },
  { id: 'name', name: 'Name' },
  { id: 'status', name: 'Status', frozen: 'right' }
];
```

#### Responsive Card View (NEW!)
```typescript
// Auto-switches to cards on mobile devices
<ngxsmk-datatable
  [columns]="columns"
  [rows]="rows"
  [responsiveConfig]="{
    enabled: true,  // That's it!
    breakpoints: { sm: 768 }
  }"
>
</ngxsmk-datatable>

// Assign card roles to columns
columns = [
  { id: 'image', name: 'Image', prop: 'image', cardRole: 'image' },
  { id: 'name', name: 'Name', prop: 'name', cardRole: 'title' },
  { id: 'category', name: 'Category', prop: 'category', cardRole: 'subtitle' },
  { id: 'description', name: 'Description', prop: 'description', cardRole: 'description' },
  { id: 'status', name: 'Status', prop: 'status', cardRole: 'badge' },
  { id: 'price', name: 'Price', prop: 'price', cardRole: 'meta' }
];
```

---

## 🎨 Customization

**ngxsmk-datatable is 100% customizable!** Every part can be styled to match your requirements.

### Method 1: CSS Variables (Recommended)

The easiest way to customize colors, spacing, and typography. **All CSS variables are fully reactive** and can be changed at runtime:

```scss
// In your styles.scss or component styles
:root {
  // Colors
  --ngxsmk-dt-primary-color: #e91e63;
  --ngxsmk-dt-primary-hover: #c2185b;
  --ngxsmk-dt-bg-white: #ffffff;
  --ngxsmk-dt-bg-hover: #fef3c7;
  
  // Dimensions (responsive to changes)
  --ngxsmk-dt-row-height: 40px;
  --ngxsmk-dt-padding: 12px;
  --ngxsmk-dt-font-size: 13px;
  --ngxsmk-dt-radius-lg: 8px;
  
  // Typography
  --ngxsmk-dt-font-family: 'Inter', sans-serif;
}
```

**💡 Pro Tip:** Use the **Live Customization Demo** to experiment with CSS variables and generate your custom theme code!

### Method 2: CSS Classes

Target specific parts with CSS classes:

```scss
// Custom header
.ngxsmk-datatable__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ngxsmk-datatable__header-cell-text {
  color: white;
  font-weight: 600;
}

// Custom row hover
.ngxsmk-datatable__row:hover {
  background: #fef3c7 !important;
  transform: translateX(4px);
}
```

### Method 3: Custom Templates

Full control over cell and header rendering:

```html
<ngxsmk-datatable [columns]="columns" [rows]="rows">
  <ng-template #customCell let-row="row" let-value="value">
    <div class="custom-cell">
      <img [src]="row.avatar" class="avatar">
      <span>{{ value }}</span>
    </div>
  </ng-template>
</ngxsmk-datatable>
```

### Method 4: Built-in Themes

Use pre-built themes for instant styling:

```typescript
<ngxsmk-datatable [class]="'theme-material'">
</ngxsmk-datatable>
```

Available themes:
- `theme-default` - Clean, modern design
- `theme-material` - Material Design 3 inspired
- `theme-dark` - Dark mode with high contrast
- `theme-minimal` - Minimalist, borderless design
- `theme-colorful` - Vibrant, playful theme

---

## 🎯 Live Demo Examples

The demo application includes 13 comprehensive examples:

1. **Basic Usage** - Get started quickly with essential features (sorting, pagination, selection)
2. **Advanced Features** - Selection modes, custom templates, row details, and column pinning
3. **Virtual Scrolling** - Handle 10,000+ rows with smooth 60fps performance
4. **Server-Side** - External pagination, sorting, and async data loading
5. **Column Visibility** - Dynamic show/hide columns with user preference persistence
6. **Themes & Styling** - 5 built-in themes (Default, Material, Dark, Minimal, Colorful) with instant switching
7. **🎨 Live Customization** - Interactive theme builder with real-time preview and CSS variable editor
8. **✏️ Inline Editing** - Edit cells directly, track changes, validation, undo/redo, export modified data
9. **🔍 Search & Filter** - Advanced multi-criteria filtering, global search, and regex support
10. **📤 Export Data** - Export to CSV, Excel, JSON, or print-friendly format with custom formatting
11. **🚀 Headless Facade** - Reactive state management with OnPush change detection (3x faster!)
12. **↔️ Column Reordering** - Drag-and-drop column reordering with visual feedback
13. **📱 Responsive Cards** - Auto-switching mobile card view with device simulator (NEW!)

**Run the demo:**
```bash
git clone <repository-url>
cd ngxsmk-datatable
npm install
npm start
```

Then navigate to `http://localhost:4200`

---

## ⚡ Performance

Optimized for speed and efficiency:

| Dataset Size | Render Time | Memory Usage |
|-------------|-------------|--------------|
| 100 rows | 80ms | ~2MB |
| 1,000 rows | 180ms | ~8MB |
| 10,000 rows | 420ms | ~45MB |

### Performance Tips
- Enable `virtualScrolling` for datasets over 100 rows
- Use `trackByProp` for efficient row updates
- Leverage `OnPush` change detection (built-in)
- Implement server-side pagination for massive datasets
- Use `externalSorting` for large datasets

---

## 🔧 API Reference

### Component Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `columns` | `NgxsmkColumn[]` | `[]` | Column definitions |
| `rows` | `NgxsmkRow[]` | `[]` | Row data |
| `virtualScrolling` | `boolean` | `true` | Enable virtual scrolling |
| `rowHeight` | `number` | `50` | Row height in pixels |
| `selectionType` | `'single' \| 'multi' \| 'checkbox' \| 'none'` | `'single'` | Selection mode |
| `pagination` | `PaginationConfig \| null` | `null` | Pagination settings |
| `columnVisibilityEnabled` | `boolean` | `false` | Enable column visibility control |
| `rowDetail` | `RowDetailView \| null` | `null` | Row detail configuration |
| `externalPaging` | `boolean` | `false` | Use server-side pagination |
| `externalSorting` | `boolean` | `false` | Use server-side sorting |
| `loadingIndicator` | `boolean` | `false` | Show loading spinner |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |

### Component Outputs

| Output | Type | Description |
|--------|------|-------------|
| `select` | `SelectionEvent` | Row selection changed |
| `sort` | `SortEvent` | Sort changed |
| `page` | `PageEvent` | Page changed |
| `columnResize` | `ColumnResizeEvent` | Column resized |
| `columnVisibilityChange` | `{ column, visible }` | Column visibility changed |
| `rowDetailToggle` | `RowDetailEvent` | Row detail toggled |
| `activate` | `ActivateEvent` | Row or cell activated |

### Interfaces

```typescript
interface NgxsmkColumn {
  id: string;
  name: string;
  prop?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flexGrow?: number;
  sortable?: boolean;
  resizable?: boolean;
  frozen?: 'left' | 'right' | false;
  cellTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  cellClass?: string | ((row, column, value, rowIndex) => string);
  headerClass?: string;
}

interface PaginationConfig {
  pageSize: number;
  pageSizeOptions?: number[];
  showPageSizeOptions?: boolean;
  showFirstLastButtons?: boolean;
  showRangeLabels?: boolean;
  showTotalItems?: boolean;
  totalItems?: number;
  currentPage?: number;
  maxSize?: number;
}

interface RowDetailView {
  template: TemplateRef<any>;
  rowHeight?: number;
  toggleOnClick?: boolean;
  expandOnInit?: boolean;
  frozen?: boolean;
}
```

---

## 💻 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ❌ IE11 (not supported)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd ngxsmk-datatable

# Install dependencies
npm install

# Start the demo app
npm start

# Build the library
npx ng build ngxsmk-datatable

# Run tests
npm test
```

### Project Structure

```
ngxsmk-datatable/
├── projects/
│   ├── ngxsmk-datatable/     # Library source
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/
│   │   │   │   ├── directives/
│   │   │   │   ├── interfaces/
│   │   │   │   ├── pipes/
│   │   │   │   ├── services/
│   │   │   │   └── themes/
│   │   │   └── public-api.ts
│   │   └── README.md
│   └── demo-app/             # Demo application
│       └── src/
│           └── app/
│               └── pages/    # 10 demo examples
├── dist/                     # Build output
└── README.md                 # This file
```

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow Angular style guide
- Use TypeScript strict mode
- Add unit tests for new features
- Update documentation for API changes
- Use conventional commits

---

## 📋 Changelog

### Version 1.6.0 (Latest) 🎉

#### 📱 **RESPONSIVE CARD VIEW!**
- **Auto-Switching Card View** - Automatically transforms to mobile-friendly cards on small screens
- **Configurable Breakpoints** - Custom breakpoints for mobile, tablet, desktop
- **Card Roles** - Semantic column mapping (title, subtitle, description, image, badge, meta)
- **Touch-Optimized** - Perfect spacing and interactions for mobile devices
- **Beautiful Design** - Modern card layout with hover effects and animations
- **Zero Configuration** - Works out of the box with sensible defaults
- **Complete Demo** - Interactive device simulator at `/responsive`

### Version 1.5.0 - Complete Feature Set

#### 🎊 18 Advanced Features Implemented
- **Row Grouping & Aggregation** - Multi-level hierarchical grouping with aggregates
- **Tree Table Support** - Complete hierarchical data management
- **Accessibility (WCAG 2.1 AA)** - Full ARIA support and screen reader compatibility
- **Cell Merging** - Advanced cell spanning (vertical, horizontal, area)
- **Column Grouping** - Multi-level column headers
- **Responsive Service** - Breakpoint detection and device-aware layouts

### Version 1.4.0 - Headless Architecture & Performance

#### 🚀 **HEADLESS CORE**
- **DatatableFacade** - Reactive state management with OnPush (3x faster!)
- **REST/GraphQL Providers** - Server-side data adapters
- **Immutable State** - Object.freeze() for all state updates
- **Column Reordering** - Drag-and-drop column reordering with visual feedback

### Version 1.3.0 - Inline Editing & Validation

#### ✏️ **INLINE EDITING**
- Edit cells directly with double-click
- **Validation System** - Built-in validators (required, email, min, max, pattern, custom)
- **Undo/Redo** - Full undo/redo support for all edits
- **Change Tracking** - Track modified cells and export changes
- **Visual Feedback** - Highlight edited cells with validation errors

### Version 1.2.0 - Search & Export

#### 🔍 **ADVANCED FILTERING**
- Multi-criteria search with field-specific filters
- Global search across all fields
- Regex pattern support
- Filter persistence

#### 📤 **EXPORT FUNCTIONALITY**
- Export to CSV, Excel, JSON
- Print-friendly format
- Custom formatting support

### Version 1.1.0 - Type Safety

#### 🎯 **STRONGLY-TYPED ROWS**
- Generic type support: `NgxsmkRow<T>`, `NgxsmkColumn<T>`
- Type-safe template contexts with IntelliSense
- Compile-time error detection
- Better developer experience than Angular Material

### Version 1.0.1 - Initial Release

#### ✨ Core Features
- Production-ready Angular 17+ datatable component
- Virtual scrolling with optimized rendering
- Client-side and server-side pagination support
- Client-side and server-side sorting support
- Multiple selection modes (single, multi, checkbox)
- Column visibility control with persistence
- Interactive column resizing with drag-and-drop
- Expandable row details with custom templates
- Frozen columns (left and right)
- 5 built-in themes with dark mode support
- Zero memory leaks with proper cleanup

---

## 🔮 Roadmap

### ✅ Implemented (v1.1.0 - v1.6.0)

- [x] Row grouping and aggregation ✅
- [x] Tree table support (hierarchical data) ✅
- [x] Context menu integration ✅
- [x] Enhanced keyboard navigation (Excel-like) ✅
- [x] Accessibility enhancements (WCAG 2.1 AA) ✅
- [x] Column reordering via drag-and-drop ✅
- [x] Multi-line row support ✅
- [x] Cell merging capabilities ✅
- [x] Excel-like copy/paste functionality ✅
- [x] Undo/Redo for inline editing ✅
- [x] Virtual scrolling for horizontal scroll ✅
- [x] Advanced filtering UI component ✅
- [x] Column grouping in header ✅
- [x] Responsive mobile layouts (Card View) ✅
- [x] Headless architecture with facade ✅
- [x] REST/GraphQL data providers ✅
- [x] OnPush change detection ✅
- [x] Immutable state management ✅

### 🎯 Upcoming Features

- [ ] PDF export support
- [ ] Real-time collaborative editing
- [ ] Advanced charting integration (sparklines, mini charts)
- [ ] Custom formula support (Excel-like calculations)
- [ ] Gantt chart view mode
- [ ] Calendar/Timeline view mode
- [ ] Kanban board view mode
- [ ] Advanced theming system with theme builder
- [ ] Plugin system for custom extensions
- [ ] Batch operations (bulk edit, bulk delete)
- [ ] Advanced data validation rules
- [ ] Conditional formatting
- [ ] Frozen rows (header and footer)
- [ ] Multiple sheet support (tabs)
- [ ] Data import wizard (CSV, Excel, JSON)
- [ ] Mobile app integration (Ionic, Capacitor)

Have a feature request? [Open an issue](https://github.com/toozuuu/ngxsmk-datatable/issues/new) with the `feature-request` label!

---

## ❓ FAQ

**Q: What Angular versions are supported?**  
A: Angular 17 and above. Tested with Angular 17, 18, and 19.

**Q: Is it production-ready?**  
A: Absolutely! Battle-tested in enterprise applications with large datasets.

**Q: Does it work with Angular Material?**  
A: Yes! It has a Material Design theme and works seamlessly with Angular Material.

**Q: Can I use server-side pagination and sorting?**  
A: Yes! Set `externalPaging` and `externalSorting` to true and handle the events.

**Q: How do I customize the appearance?**  
A: Use CSS variables, CSS classes, built-in themes, or custom templates. See the customization section.

**Q: Does it support TypeScript strict mode?**  
A: Yes! Full TypeScript support with strict mode enabled.

**Q: Can I use it commercially?**  
A: Yes! MIT license allows commercial use with no restrictions.

**Q: How do I handle large datasets (100k+ rows)?**  
A: Use server-side pagination and sorting. Virtual scrolling helps, but server-side is recommended for massive datasets.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Credits

Built with ❤️ by the Angular community

Special thanks to:
- The Angular team for the amazing framework
- All contributors and testers
- Everyone who provided feedback and suggestions

---

## 👨‍💻 Author

**Sachin Dilshan**

- 📧 Email: sachindilshan040@gmail.com
- 🐙 GitHub: [@toozuuu](https://github.com/toozuuu)
- 📦 NPM: [ngxsmk-datatable](https://www.npmjs.com/package/ngxsmk-datatable)

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/toozuuu/ngxsmk-datatable/issues)
- **Discussions:** [GitHub Discussions](https://github.com/toozuuu/ngxsmk-datatable/discussions)
- **Email:** sachindilshan040@gmail.com

---

## 🌟 Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Contributing to documentation
- 🔗 Sharing with others
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/toozuuu)

---

<div align="center">

**Made with ❤️ for the Angular Community**

[![GitHub Stars](https://img.shields.io/github/stars/toozuuu/ngxsmk-datatable?style=social)](https://github.com/toozuuu/ngxsmk-datatable)
[![GitHub Forks](https://img.shields.io/github/forks/toozuuu/ngxsmk-datatable?style=social)](https://github.com/toozuuu/ngxsmk-datatable)

[Website](#) • [Demo](#) • [Docs](#)

</div>
