# StackBlitz Setup Guide

This guide will help you run the ngxsmk-datatable project on StackBlitz.

## 🚀 Quick Start on StackBlitz

### Option 1: Direct Link (Recommended)

Click the button below to open the project directly in StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datatable)

### Option 2: Manual Setup

1. Go to [StackBlitz](https://stackblitz.com/)
2. Click "Import from GitHub"
3. Enter: `toozuuu/ngxsmk-datatable`
4. Wait for dependencies to install
5. The demo app will start automatically

## 📋 What You'll See

The StackBlitz environment will launch the demo application with:

- **Basic Demo** - Core datatable features
- **Advanced Demo** - Selection, templates, row details
- **Virtual Scrolling** - 10,000+ rows performance
- **Server-Side Demo** - External pagination and sorting
- **Column Visibility** - Dynamic column control
- **Themes Demo** - Built-in theme switching
- **Customization Demo** - Live theme builder with CSS variables
- **Inline Editing** - Cell editing with validation
- **Search & Filter** - Advanced filtering
- **Export Demo** - Multiple export formats

## 🔧 Configuration

The project is configured to work seamlessly on StackBlitz with:

- **Auto-install dependencies** - All packages install automatically
- **Hot reload** - Changes reflect instantly
- **Source maps** - Easy debugging
- **TypeScript paths** - Library imports work out of the box

## 📁 Project Structure

```
ngxsmk-datatable/
├── projects/
│   ├── ngxsmk-datatable/     # Library source code
│   │   └── src/
│   │       ├── lib/          # Components, services, directives
│   │       └── public-api.ts # Main export file
│   └── demo-app/             # Demo application
│       └── src/
│           └── app/
│               └── pages/    # Demo pages
├── .stackblitzrc             # StackBlitz configuration
└── tsconfig.json             # TypeScript configuration
```

## ⚙️ TypeScript Configuration

The project uses path mapping to resolve the library:

```json
{
  "paths": {
    "ngxsmk-datatable": [
      "projects/ngxsmk-datatable/src/public-api"
    ]
  }
}
```

This allows the demo app to import the library directly from source:

```typescript
import { NgxsmkDatatableComponent } from 'ngxsmk-datatable';
```

## 🎯 Development Tips

### Running the Demo

The demo app starts automatically. If you need to restart:

```bash
npm start
```

### Building the Library

Note: On StackBlitz, you don't need to build the library separately. The demo app uses the source files directly.

### Viewing Different Demos

Navigate through the demo pages using the menu:
- `/` or `/basic` - Basic usage
- `/advanced` - Advanced features
- `/virtual` - Virtual scrolling
- `/server-side` - Server-side operations
- `/column-visibility` - Column visibility
- `/themes` - Theme switching
- `/customization` - Live customization
- `/inline-editing` - Inline editing
- `/search-filter` - Search and filter
- `/export` - Export data

## 🐛 Troubleshooting

### Dependencies Not Installing

If dependencies fail to install:
1. Click the "Install Dependencies" button in StackBlitz
2. Or run: `npm install` in the terminal

### Module Not Found Errors

If you see module not found errors:
1. Ensure `tsconfig.json` has the correct path mappings
2. Restart the dev server
3. Clear StackBlitz cache and reload

### Styles Not Loading

If styles don't appear:
1. Check that `styles.scss` is included in `angular.json`
2. Verify theme files exist in `projects/ngxsmk-datatable/src/lib/themes/`
3. Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R)

### Performance Issues

StackBlitz runs in a WebContainer, which may be slower than local development:
- Use smaller datasets for testing
- Disable source maps in `angular.json` if needed
- Close other browser tabs to free up resources

## 📚 Features Available in StackBlitz

All features of ngxsmk-datatable work in StackBlitz:

✅ Virtual scrolling  
✅ Client-side sorting  
✅ Client-side pagination  
✅ Multiple selection modes  
✅ Row details  
✅ Frozen columns  
✅ Custom templates  
✅ Column visibility  
✅ Column resizing  
✅ Theme system  
✅ Inline editing  
✅ Search & filter  
✅ Data export  

## 🔗 Useful Links

- **GitHub Repository**: https://github.com/toozuuu/ngxsmk-datatable
- **NPM Package**: https://www.npmjs.com/package/ngxsmk-datatable
- **Full Documentation**: [README.md](./README.md)
- **API Reference**: [API.md](./docs/API.md)

## 💡 Example Edits to Try

### 1. Change Theme Colors

Edit `projects/demo-app/src/app/pages/customization-demo/customization-demo.component.ts`:

```typescript
primaryColor = '#9c27b0'; // Change to purple
```

### 2. Add Custom Column

Edit `projects/demo-app/src/app/pages/basic-demo/basic-demo.component.ts`:

```typescript
columns: Column<User>[] = [
  // ... existing columns
  {
    prop: 'age',
    name: 'Age',
    sortable: true,
    width: 80
  }
];
```

### 3. Modify Virtual Scroll Height

Edit `projects/demo-app/src/app/pages/virtual-demo/virtual-demo.component.ts`:

```typescript
config: DatatableConfig = {
  virtualScroll: true,
  virtualScrollHeight: 600, // Change from 500 to 600
  rowHeight: 48
};
```

## 🎨 Customization Examples

### Custom Cell Template

```typescript
// In your component
@ViewChild('customCell') customCell!: TemplateRef<any>;

// In your template
<ng-template #customCell let-value="value" let-row="row">
  <span class="custom-badge">{{ value }}</span>
</ng-template>

<ngxsmk-datatable
  [columns]="columns"
  [rows]="data">
</ngxsmk-datatable>
```

### Custom Row Detail

```typescript
@ViewChild('rowDetail') rowDetailTemplate!: TemplateRef<any>;

// In your template
<ng-template #rowDetail let-row="row">
  <div class="detail-panel">
    <h4>{{ row.name }}</h4>
    <p>Additional details for {{ row.email }}</p>
  </div>
</ng-template>
```

## 📝 Notes

- **Performance**: StackBlitz may be slower than local development
- **File Size**: Large datasets may cause performance issues
- **Browser**: Works best in Chrome, Firefox, and Edge
- **Sharing**: You can share your StackBlitz workspace URL with others

## 🆘 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Review the [Full Documentation](./README.md)
3. Open an issue on [GitHub](https://github.com/toozuuu/ngxsmk-datatable/issues)
4. Email: sachindilshan040@gmail.com

## 🌟 Show Your Support

If you find this project useful on StackBlitz:

- ⭐ Star the repository on GitHub
- 🐛 Report any StackBlitz-specific issues
- 💡 Share your StackBlitz customizations
- 📖 Contribute to the documentation

---

**Made with ❤️ by [Sachin Dilshan](https://github.com/toozuuu)**

Enjoy experimenting with ngxsmk-datatable on StackBlitz! 🚀

