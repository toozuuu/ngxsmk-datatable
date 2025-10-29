# Contributing to ngxsmk-datatable

First off, thank you for considering contributing to ngxsmk-datatable! It's people like you that make this library a great tool for the Angular community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to sachindilshan040@gmail.com.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, StackBlitz links)
- **Describe the behavior you observed** and what you expected
- **Include screenshots or GIFs** if applicable
- **Specify your environment** (Angular version, browser, OS)

**Bug Report Template:**

```markdown
## Description
[Clear description of the bug]

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Angular version: 
- ngxsmk-datatable version: 
- Browser: 
- OS: 

## Additional Context
[Any other relevant information]
```

### Suggesting Features

Feature requests are welcome! Before creating a feature request:

- **Check existing feature requests** to avoid duplicates
- **Provide a clear use case** - explain why this feature would be useful
- **Consider the scope** - does it fit the project's goals?

**Feature Request Template:**

```markdown
## Feature Description
[Clear description of the feature]

## Use Case
[Why is this feature needed? What problem does it solve?]

## Proposed Solution
[How do you envision this working?]

## Alternatives Considered
[What other solutions have you considered?]

## Additional Context
[Screenshots, mockups, code examples]
```

### Contributing Code

We love code contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our coding standards
4. **Test thoroughly** - add tests for new features
5. **Update documentation** if needed
6. **Commit your changes** following our commit guidelines
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

## 🛠️ Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- **Angular CLI** (installed automatically)

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ngxsmk-datatable.git
cd ngxsmk-datatable

# Add upstream remote
git remote add upstream https://github.com/toozuuu/ngxsmk-datatable.git

# Install dependencies
npm install

# Build the library
npm run build:lib

# Start the demo app
npm start
```

The demo app will be available at `http://localhost:4200`

### Development Workflow

```bash
# Watch mode for library development
npm run dev

# In another terminal, run the demo app
npm start

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build:lib:prod
```

## 📁 Project Structure

```
ngxsmk-datatable/
├── projects/
│   ├── ngxsmk-datatable/          # Library source
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/    # Datatable and pager components
│   │   │   │   ├── directives/    # Template directives
│   │   │   │   ├── interfaces/    # TypeScript interfaces
│   │   │   │   ├── pipes/         # Custom pipes
│   │   │   │   ├── services/      # Core services
│   │   │   │   └── themes/        # Theme files
│   │   │   └── public-api.ts      # Public API exports
│   │   └── package.json
│   └── demo-app/                  # Demo application
│       └── src/
│           └── app/
│               └── pages/         # Demo pages
├── docs/                          # Documentation
├── dist/                          # Build output
└── scripts/                       # Build scripts
```

### Key Files

- **Component Logic**: `projects/ngxsmk-datatable/src/lib/components/ngxsmk-datatable/ngxsmk-datatable.component.ts`
- **Component Styles**: `projects/ngxsmk-datatable/src/lib/components/ngxsmk-datatable/ngxsmk-datatable.component.scss`
- **Public API**: `projects/ngxsmk-datatable/src/public-api.ts`
- **Themes**: `projects/ngxsmk-datatable/src/lib/themes/`

## 💻 Coding Standards

### TypeScript

- **Use strict TypeScript** - the project uses strict mode
- **Strong typing** - avoid `any`, use proper types
- **Interfaces over classes** for data models
- **Use readonly** where appropriate
- **Descriptive names** - variables, functions, and classes should be self-documenting

```typescript
// ✅ Good
interface User {
  readonly id: number;
  name: string;
  email: string;
}

function getUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
}

// ❌ Bad
function getData(x: any): any {
  return data[x];
}
```

### Angular

- **Standalone components** - use standalone: true
- **OnPush change detection** - for performance
- **RxJS best practices** - unsubscribe, use async pipe
- **Template syntax** - use new control flow (@if, @for)
- **Signals** - consider using signals for reactive state (Angular 16+)

```typescript
// ✅ Good
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Template
@if (isLoading) {
  <div>Loading...</div>
} @else {
  <div>Content</div>
}
```

### CSS/SCSS

- **Use CSS variables** for customizable values
- **BEM naming** convention: `block__element--modifier`
- **Mobile-first** responsive design
- **Avoid !important** unless absolutely necessary
- **Comment complex styles**

```scss
// ✅ Good
.ngxsmk-datatable {
  --ngxsmk-dt-primary: #2196f3;
  
  &__header {
    background: var(--ngxsmk-dt-header-bg, #f5f5f5);
    
    &--sticky {
      position: sticky;
      top: 0;
    }
  }
}
```

### Code Organization

- **One component per file**
- **Keep components focused** - single responsibility
- **Extract reusable logic** into services
- **Use pure functions** where possible
- **Avoid deep nesting** - max 3-4 levels

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic changes)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or tooling changes

### Examples

```bash
feat(datatable): add column grouping support

- Add groupBy input property
- Implement group row rendering
- Add collapse/expand functionality

Closes #123

fix(pagination): correct page count calculation

The page count was off by one when total rows was exactly
divisible by page size.

Fixes #456

docs(readme): update installation instructions

- Add Angular 19 compatibility note
- Update StackBlitz link
- Fix typos in examples

perf(virtual-scroll): optimize row height calculation

Reduced layout thrashing by batching DOM reads.

Benchmark results:
- Before: 45ms
- After: 12ms (73% improvement)
```

### Rules

- **Use present tense** - "add feature" not "added feature"
- **Use imperative mood** - "move cursor" not "moves cursor"
- **First line max 72 characters**
- **Body wraps at 100 characters**
- **Reference issues** - use "Closes #123" or "Fixes #456"

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`npm test`)
- [ ] No linter errors (`npm run lint`)
- [ ] Documentation is updated if needed
- [ ] Commit messages follow the guidelines
- [ ] Branch is up to date with main

### PR Title

Use the same format as commit messages:

```
feat(datatable): add virtual scrolling support
fix(pagination): handle edge case with empty data
docs(api): update column interface documentation
```

### PR Description Template

```markdown
## Description
[Clear description of what this PR does]

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Closes #[issue number]

## Changes Made
- 
- 
- 

## Screenshots (if applicable)
[Add screenshots or GIFs]

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested in multiple browsers

## Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by at least one maintainer
3. **Discussions** - address feedback and questions
4. **Approval** - once approved, a maintainer will merge

### After Merge

- Your contribution will be included in the next release
- You'll be added to the contributors list
- Thank you! 🎉

## 🤖 Automated NPM Publishing

This project uses GitHub Actions to automate npm publishing.

### How It Works

When a GitHub Release is created, the package is automatically built and published to npm.

### For Maintainers

To publish a new version:
1. Update version in package.json files
2. Update CHANGELOG.md
3. Create a GitHub Release with matching tag
4. Workflow automatically publishes to npm

See [Publishing Setup Guide](.github/NPM-PUBLISHING-SETUP.md) for details.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:lib -- --watch

# Run tests with coverage
npm run test:lib -- --code-coverage
```

### Writing Tests

- **Test behavior, not implementation**
- **Use descriptive test names**
- **Follow AAA pattern**: Arrange, Act, Assert
- **Mock external dependencies**
- **Test edge cases**

```typescript
describe('NgxsmkDatatableComponent', () => {
  it('should emit sortChange event when column header is clicked', () => {
    // Arrange
    const fixture = TestBed.createComponent(NgxsmkDatatableComponent);
    const component = fixture.componentInstance;
    let emittedSort: SortEvent | undefined;
    
    component.sortChange.subscribe((sort: SortEvent) => {
      emittedSort = sort;
    });
    
    // Act
    component.onSort('name', 'asc');
    
    // Assert
    expect(emittedSort).toEqual({
      column: 'name',
      direction: 'asc'
    });
  });
});
```

## 📖 Documentation

### What Needs Documentation

- **New features** - add to README and API docs
- **Breaking changes** - add migration guide
- **Complex code** - add code comments
- **Examples** - add to EXAMPLES.md

### Documentation Files

- **README.md** - Overview, installation, quick start
- **docs/API.md** - Complete API reference
- **docs/EXAMPLES.md** - Code examples
- **docs/CUSTOMIZATION.md** - Styling and theming
- **CHANGELOG.md** - Version history

### JSDoc Comments

```typescript
/**
 * Emits when a row is selected.
 * 
 * @param row The selected row data
 * @param index The index of the selected row
 * 
 * @example
 * <ngxsmk-datatable
 *   (selectRow)="onRowSelected($event)">
 * </ngxsmk-datatable>
 */
@Output() selectRow = new EventEmitter<RowSelectEvent>();
```

## 🎯 Areas We Need Help

- 🐛 **Bug fixes** - check open issues
- ✨ **New features** - from the roadmap or your ideas
- 📖 **Documentation** - improvements and examples
- 🧪 **Tests** - increase coverage
- 🎨 **Themes** - new theme designs
- ♿ **Accessibility** - WCAG compliance improvements
- 🌍 **Internationalization** - translations and i18n

## ❓ Questions?

- **Issues**: [GitHub Issues](https://github.com/toozuuu/ngxsmk-datatable/issues)
- **Discussions**: [GitHub Discussions](https://github.com/toozuuu/ngxsmk-datatable/discussions)
- **Email**: sachindilshan040@gmail.com

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

### Recognition

All contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Celebrated in the community

---

**Happy Contributing! 🚀**

Made with ❤️ by [Sachin Dilshan](https://github.com/toozuuu) and [contributors](https://github.com/toozuuu/ngxsmk-datatable/graphs/contributors)

