# ngxsmk-datatable Demo Application

A comprehensive demo showcasing all features of ngxsmk-datatable v1.7.0 Enterprise Edition.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:demo:prod
```

The app will be available at `http://localhost:4200`

## ✨ Features Demonstrated

### Core Features
- ✅ Basic Usage - Getting started with datatable
- ✅ Advanced Features - Selection, templates, row details
- ✅ Virtual Scrolling - Handle 10,000+ rows efficiently
- ✅ Server-Side Pagination - External data source
- ✅ Column Visibility - Dynamic column management
- ✅ Themes & Styling - 5 built-in themes
- ✅ Customization - Live CSS editor
- ✅ Inline Editing - With validation and undo/redo
- ✅ Search & Filter - Advanced filtering
- ✅ Export Data - CSV, Excel, JSON, Print
- ✅ Facade Pattern - Headless + OnPush
- ✅ Column Reorder - Drag & drop
- ✅ Responsive Cards - Auto mobile view

### 🎊 NEW v1.7.0 Enterprise Features
- 📄 **PDF Export** - Advanced PDF generation with templates
- 👥 **Collaborative Editing** - Real-time multi-user editing
- 📊 **Advanced Charting** - Sparklines and mini charts
- 🧮 **Custom Formulas** - Excel-like calculations
- 📅 **View Modes** - Gantt, Calendar, Kanban views
- 🎨 **Advanced Theming** - Theme builder with 11 presets
- 🔌 **Plugin System** - Extensible architecture
- 📦 **Batch Operations** - Bulk edit and delete
- ✅ **Data Validation** - 15+ validators
- 🎯 **Conditional Formatting** - Dynamic cell styling
- 📌 **Frozen Rows** - Sticky headers and footers
- 📑 **Multiple Sheets** - Excel-like tabs
- 📥 **Data Import** - CSV, Excel, JSON wizard
- 📱 **Mobile Integration** - Ionic & Capacitor support

## 📁 Project Structure

```
projects/demo-app/
├── src/
│   ├── app/
│   │   ├── pages/           # Demo pages
│   │   │   ├── basic-demo/
│   │   │   ├── enterprise-demo/  # NEW!
│   │   │   └── ...
│   │   ├── shared/          # Shared utilities
│   │   ├── app.component.ts # Main app shell
│   │   └── app.routes.ts    # Routing config
│   ├── styles.scss          # Global styles
│   └── index.html
└── README.md
```

## 🎨 Styling

The demo uses a modern, gradient-based design with:
- Purple/violet gradient theme (#667eea to #764ba2)
- Clean card-based layouts
- Smooth animations and transitions
- Fully responsive design
- Dark mode support (coming soon)

## 🔧 Technologies

- **Angular 17+** - Latest Angular features
- **Standalone Components** - No NgModules
- **Route-based Code Splitting** - Lazy loading
- **SCSS** - Enhanced styling
- **Font Awesome 6** - Icon library
- **Google Fonts (Roboto)** - Typography

## 📱 Responsive Design

The demo is fully responsive and works great on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🚢 Deployment

Build for production:

```bash
npm run build:demo:prod
```

The output will be in `dist/demo-app/browser/`

## 📄 License

MIT License - See the main ngxsmk-datatable LICENSE file

## 🤝 Contributing

Contributions welcome! Please check the main CONTRIBUTING.md guide.

## 📧 Support

- GitHub Issues: https://github.com/toozuuu/ngxsmk-datatable/issues
- NPM: https://www.npmjs.com/package/ngxsmk-datatable
- StackBlitz: https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable

