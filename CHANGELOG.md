# Changelog

All notable changes to the ngxsmk-datatable project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2025-10-26

### 🚀 StackBlitz Integration & Enhancements

This release makes ngxsmk-datatable fully compatible with StackBlitz and includes comprehensive documentation improvements.

#### ✨ New Features

- **StackBlitz Support** - Full compatibility with StackBlitz WebContainer
  - Added `.stackblitzrc` configuration file
  - Updated tsconfig paths to use source files directly
  - No build step required in StackBlitz environment

- **Interactive Documentation**
  - Created comprehensive `STACKBLITZ.md` guide
  - Added "Try on StackBlitz" buttons throughout documentation
  - Live demo accessible at: https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable

- **Enhanced Demo App**
  - Added StackBlitz button to demo app header
  - Improved header action buttons with better styling
  - Added `.btn-secondary` style for StackBlitz button

#### 📚 Documentation Improvements

- **New Files**
  - `STACKBLITZ.md` - Complete StackBlitz setup and troubleshooting guide
  - `CONTRIBUTING.md` - Comprehensive contribution guidelines
  - `.github/FUNDING.yml` - GitHub sponsors configuration
  - `.stackblitz/config.json` - StackBlitz-specific configuration

- **Updated Documentation**
  - All StackBlitz URLs updated to use `/~/github.com/` format
  - All npm URLs standardized to `https://www.npmjs.com/package/ngxsmk-datatable`
  - Added npm download badges to README
  - Updated CODE_OF_CONDUCT.md with contact email

#### 🔗 Package Metadata

- Added `stackblitz` field to package.json files
- Added `engines` specification (Node >=18.0.0, npm >=9.0.0)
- Enhanced keywords for better discoverability

#### 🎨 UI Improvements

- New StackBlitz button in demo app header with lightning bolt icon
- Improved button styling with semi-transparent backgrounds
- Better visual hierarchy in header actions

#### 🔧 Configuration Changes

- **TypeScript Configuration**
  - Updated path mapping from `dist/ngxsmk-datatable` to `projects/ngxsmk-datatable/src/public-api`
  - Enables direct source file imports for StackBlitz compatibility

- **Angular Configuration**
  - Verified compatibility with Angular 17, 18, and 19
  - Maintained backward compatibility with existing projects

#### 🌐 URLs Updated

All project URLs are now consistent:
- **GitHub**: https://github.com/toozuuu/ngxsmk-datatable
- **StackBlitz**: https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable
- **npm**: https://www.npmjs.com/package/ngxsmk-datatable

#### 📦 Package Information

```json
{
  "name": "ngxsmk-datatable",
  "version": "1.0.1",
  "author": "Sachin Dilshan <sachindilshan040@gmail.com>",
  "stackblitz": "https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable"
}
```

#### 🎯 Benefits

- ✅ **Zero Installation Testing** - Try the component instantly in StackBlitz
- ✅ **Interactive Documentation** - Live code examples in browser
- ✅ **Easier Bug Reports** - Share StackBlitz reproductions
- ✅ **Lower Barrier to Entry** - No local setup required
- ✅ **Better Discoverability** - Enhanced SEO and npm presence

#### 🐛 Bug Fixes

- Fixed row details not showing in advanced demo
- Improved theme customization live preview
- Enhanced sorting and pagination consistency across demos

---

## [1.0.0] - 2024-10-26

### 🎉 Initial Release

The first production-ready release of ngxsmk-datatable - a powerful, modern Angular datatable component built from the ground up for Angular 17+.

### ✨ Features

#### Core Features
- ⚡ **Virtual Scrolling** - Smooth rendering of 10,000+ rows with 60fps performance
- 🔄 **Client-Side Sorting** - Single and multi-column sorting with customizable comparators
- 📄 **Client-Side Pagination** - Flexible pagination with customizable page sizes
- ✅ **Multiple Selection Modes** - Single, multi, checkbox, and cell selection
- 📊 **Expandable Row Details** - Custom templates for detailed row information
- ❄️ **Frozen Columns** - Pin columns to left or right side
- 🎨 **Custom Templates** - Full template customization for cells and headers

#### Advanced Features
- 👁️ **Column Visibility Control** - Dynamic show/hide columns with persistence
- 🔄 **Refresh Button** - Built-in data refresh functionality
- 📏 **Interactive Column Resizing** - Drag-and-drop column width adjustment
- 🎨 **Theme System** - 5 beautiful built-in themes (Default, Material, Dark, Minimal, Colorful)
- 💾 **State Persistence** - Save user preferences and theme settings
- ✏️ **Inline Editing Support** - Edit cells directly with validation
- 🔍 **Advanced Filtering** - Multi-criteria search and custom filters
- 📤 **Data Export** - Export to CSV, Excel, JSON, or print-friendly format

#### Performance Features
- 🚀 **OnPush Change Detection** - Optimized rendering strategy
- 🎯 **Smart TrackBy** - Efficient row updates and re-rendering
- 💪 **Tree-Shakable** - Minimal bundle size impact
- 🧹 **Zero Memory Leaks** - Proper cleanup and resource management
- ⚡ **Hardware Accelerated** - CSS optimizations for smooth animations

#### Developer Experience
- 📦 **Standalone Components** - No need for NgModule imports
- 🔧 **TypeScript Strict Mode** - Full type safety
- 📖 **Comprehensive Documentation** - Detailed guides and API reference
- 🎯 **100+ Examples** - Practical code snippets for common use cases
- 🎨 **Live Customization Demo** - Interactive theme builder

### 🎨 Themes

Built-in themes included:
- **Default** - Clean, modern design with blue primary color
- **Material** - Material Design 3 inspired with elevation
- **Dark** - Dark mode with high contrast
- **Minimal** - Borderless, minimalist design
- **Colorful** - Vibrant, playful theme

### 📚 Documentation

Complete documentation included:
- **Installation Guide** - Setup and configuration
- **API Reference** - All inputs, outputs, and interfaces
- **Customization Guide** - CSS variables, themes, and templates
- **Performance Tips** - Optimization strategies
- **Examples** - 12+ real-world examples

### 🔧 Technical Details

- **Angular Versions**: 17.x, 18.x, 19.x
- **TypeScript**: 5.2+
- **Bundle Size**: ~45KB (minified + gzipped)
- **Zero Dependencies**: No external runtime dependencies
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 📦 Package Structure

```
ngxsmk-datatable/
├── components/
│   ├── ngxsmk-datatable/     # Main datatable component
│   └── ngxsmk-pager/          # Pagination component
├── directives/                # Template directives
├── interfaces/                # TypeScript interfaces
├── pipes/                     # Custom pipes
├── services/                  # Core services
└── themes/                    # Built-in themes
```

### 🎯 Demo Application

Included demo application with 10 examples:
1. Basic Usage - Core features
2. Advanced Features - Selection, templates, row details
3. Virtual Scrolling - 10,000+ rows performance
4. Server-Side - External pagination and sorting
5. Column Visibility - Dynamic column control
6. Themes & Styling - Theme switching
7. Live Customization - Interactive theme builder
8. Inline Editing - Cell editing with validation
9. Search & Filter - Advanced filtering
10. Export Data - Multiple export formats

### 🐛 Known Issues

None at release time.

### 🔗 Links

- [GitHub Repository](https://github.com/toozuuu/ngxsmk-datatable)
- [NPM Package](https://www.npmjs.com/package/ngxsmk-datatable)
- [Documentation](https://github.com/toozuuu/ngxsmk-datatable/tree/main/docs)
- [Demo Application](https://github.com/toozuuu/ngxsmk-datatable/tree/main/projects/demo-app)

### 👨‍💻 Author

**Sachin Dilshan**
- GitHub: [@toozuuu](https://github.com/toozuuu)
- Email: sachindilshan040@gmail.com

---

## [Unreleased]

### Planned Features

- [ ] Row grouping and aggregation
- [ ] Tree table support for hierarchical data
- [ ] Context menu integration
- [ ] Enhanced keyboard navigation
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Column reordering via drag-and-drop
- [ ] Multi-line row support
- [ ] Cell merging capabilities
- [ ] Excel-like copy/paste
- [ ] Undo/Redo for inline editing
- [ ] PDF export support
- [ ] Advanced filtering UI component

---

## How to Update

To update to the latest version:

```bash
npm update ngxsmk-datatable
```

For major version updates, check the [Migration Guide](./docs/MIGRATION.md) for breaking changes.

---

## Support

- 🐛 [Report Issues](https://github.com/toozuuu/ngxsmk-datatable/issues)
- 💬 [Discussions](https://github.com/toozuuu/ngxsmk-datatable/discussions)
- 📧 Email: sachindilshan040@gmail.com

---

**Made with ❤️ by [Sachin Dilshan](https://github.com/toozuuu)**

