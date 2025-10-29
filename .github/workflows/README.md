# GitHub Actions CI/CD Workflows

This directory contains GitHub Actions workflows for automated building, testing, and deployment of the ngxsmk-datatable library.

## 🚀 Quick Setup (3 Steps)

### 1. Enable GitHub Pages
- Go to **Settings** → **Pages** → Source: **GitHub Actions**

### 2. Add NPM Token
- Get token from [npmjs.com](https://www.npmjs.com/) → Access Tokens
- **Settings** → **Secrets** → New secret: `NPM_TOKEN`

### 3. Enable Actions
- **Settings** → **Actions** → **General**
- Allow all actions + Read/write permissions

---

## 🔄 Workflows

### 1. CI (Continuous Integration)
**File:** `ci.yml`  
**Triggers:** Push to `main`/`develop` branches, Pull Requests

**What it does:**
- Tests the library on multiple Node.js versions (18.x, 20.x)
- Installs dependencies
- Runs linting
- Builds the library in production mode
- Builds the demo application
- Runs unit tests
- Uploads build artifacts
- Reports bundle size

### 2. Publish to NPM
**File:** `publish.yml`  
**Triggers:** GitHub Release published, Manual workflow dispatch

**What it does:**
- Builds the library in production mode
- Runs tests to ensure quality
- Publishes the package to NPM
- Creates Git tags for manual releases

**Requirements:**
- `NPM_TOKEN` secret must be configured in repository settings
- Go to Settings → Secrets and variables → Actions → New repository secret
- Name: `NPM_TOKEN`
- Value: Your NPM authentication token (get from npmjs.com → Access Tokens)

### 3. PR Validation
**File:** `pr-validation.yml`  
**Triggers:** Pull Request opened, synchronized, or reopened

**What it does:**
- Validates PR title follows semantic conventions
- Checks for breaking changes
- Compares bundle sizes
- Posts build information as PR comment

### 4. Deploy Demo to GitHub Pages
**File:** `demo-deploy.yml`  
**Triggers:** Push to `main` branch, Manual workflow dispatch

**What it does:**
- Builds the library
- Builds the demo application
- Deploys to GitHub Pages

**Setup Required:**
1. Go to repository Settings → Pages
2. Under "Build and deployment" → Source: select "GitHub Actions"
3. The demo will be available at: `https://toozuuu.github.io/ngxsmk-datatable/`

### 5. CodeQL Security Analysis
**File:** `codeql.yml`  
**Triggers:** Push to `main`/`develop`, Pull Requests, Weekly schedule (Mondays)

**What it does:**
- Performs automated security scanning
- Detects potential vulnerabilities
- Analyzes JavaScript/TypeScript code

### 6. Dependabot
**File:** `dependabot.yml`  
**What it does:**
- Automatically checks for dependency updates weekly
- Creates PRs for npm package updates
- Updates GitHub Actions to latest versions

## 📦 Publishing a New Version

### Method 1: Using GitHub Releases (Recommended)
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit and push changes
4. Create a new release on GitHub:
   - Go to repository → Releases → Draft a new release
   - Create a new tag (e.g., `v1.6.1`)
   - Fill in release notes
   - Publish release
5. The `publish.yml` workflow will automatically publish to NPM

### Method 2: Manual Workflow Dispatch
1. Go to Actions → Publish to NPM → Run workflow
2. Enter the version number (e.g., `1.6.1`)
3. Click "Run workflow"
4. The workflow will update the version, publish, and create a tag

## 🔒 Required Secrets

Configure these secrets in your repository settings (Settings → Secrets and variables → Actions):

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `NPM_TOKEN` | NPM authentication token | Publishing to NPM |
| `GITHUB_TOKEN` | Automatically provided by GitHub | All workflows (automatic) |

## 🎯 Status Badges

Add these badges to your `README.md`:

```markdown
[![CI](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/ci.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/ci.yml)
[![Publish to NPM](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml)
[![CodeQL](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/codeql.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/codeql.yml)
[![npm version](https://badge.fury.io/js/ngxsmk-datatable.svg)](https://www.npmjs.com/package/ngxsmk-datatable)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## 🛠️ Local Testing

Before pushing, you can test locally:

```bash
# Install dependencies
npm ci

# Lint code
npm run lint

# Build library
npm run build:lib:prod

# Build demo
npm run build:demo:prod

# Run tests
npm run test:lib -- --watch=false

# Create package
npm run pack
```

## 📝 Workflow Best Practices

1. **Always create PRs** - Don't push directly to `main`
2. **Wait for CI** - Ensure all checks pass before merging
3. **Semantic Commits** - Use conventional commit messages:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `chore:` - Maintenance tasks
   - `refactor:` - Code refactoring
   - `test:` - Test updates
   - `ci:` - CI/CD changes

4. **Version Bumping**:
   - PATCH (1.6.x) - Bug fixes
   - MINOR (1.x.0) - New features (backward compatible)
   - MAJOR (x.0.0) - Breaking changes

## 🐛 Troubleshooting

### CI Fails on Lint
- Run `npm run lint` locally to see errors
- Fix linting issues before pushing

### CI Fails on Tests
- Run `npm run test:lib` locally
- Ensure all tests pass

### Publish Fails
- Check that `NPM_TOKEN` is correctly configured
- Verify you're not publishing a version that already exists
- Ensure you're logged into npm with proper permissions

### Demo Deploy Fails
- Check that GitHub Pages is enabled in repository settings
- Verify the build completes successfully in the workflow

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Semantic Versioning](https://semver.org/)

