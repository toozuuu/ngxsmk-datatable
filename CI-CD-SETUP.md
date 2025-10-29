# CI/CD Setup Guide

## ✅ What Was Added

Your repository now has automated CI/CD with GitHub Actions:

- ✅ **Build & Test** - Automatic testing on every push/PR
- 📦 **NPM Publishing** - One-click releases to npm
- 🌐 **Demo Deployment** - Auto-deploy to GitHub Pages
- 🔒 **Security Scanning** - Weekly CodeQL analysis
- 🤖 **Dependency Updates** - Automated Dependabot PRs

## 🚀 Required Setup (3 Steps)

### 1. Enable GitHub Pages (2 minutes)
1. Go to repository **Settings** → **Pages**
2. Under "Build and deployment" → Source: Select **GitHub Actions**
3. Save

Demo will be at: `https://toozuuu.github.io/ngxsmk-datatable/`

### 2. Add NPM Token (3 minutes)
1. Go to [npmjs.com](https://www.npmjs.com/) → Access Tokens → Generate (Automation type)
2. Copy the token
3. Go to **Settings** → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `NPM_TOKEN`, Value: paste your token
6. Save

### 3. Enable GitHub Actions (1 minute)
1. Go to **Settings** → **Actions** → **General**
2. Select: **Allow all actions and reusable workflows**
3. Under "Workflow permissions": **Read and write permissions**
4. Check: **Allow GitHub Actions to create and approve pull requests**
5. Save

## 🧪 Test Your Setup

Push this commit to trigger workflows:
```bash
git add .
git commit -m "ci: add GitHub Actions workflows"
git push
```

Then go to the **Actions** tab to see workflows running.

## 📦 Publishing a New Version

### Method 1: GitHub Release (Recommended)
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit and push
4. Create a GitHub Release with tag `v1.x.x`
5. Workflow automatically publishes to npm ✨

### Method 2: Manual Trigger
1. Go to **Actions** → **Publish to NPM**
2. Click **Run workflow**
3. Enter version number
4. Run

## 📚 Documentation

- **[Workflows Documentation](.github/workflows/README.md)** - Complete workflow details
- **[Contributing Guide](CONTRIBUTING.md)** - Development workflow

## 🐛 Troubleshooting

**CI fails on lint:**
```bash
npm run lint
```

**CI fails on build:**
```bash
npm run build:lib:prod
```

**CI fails on tests:**
```bash
npm run test:lib -- --watch=false
```

## 📊 Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| CI | Push, PR | Build, test, lint |
| PR Validation | PR | Validate & comment |
| Publish | Release | Publish to npm |
| Demo Deploy | Push to main | Deploy demo |
| CodeQL | Weekly | Security scan |

## ❓ Need Help?

- 📖 [Detailed Workflow Docs](.github/workflows/README.md)
- 🐛 [Create an Issue](https://github.com/toozuuu/ngxsmk-datatable/issues)
- 📧 Email: sachindilshan040@gmail.com

---

**Status Badges** (in README.md):
- [![CI](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/ci.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/ci.yml)
- [![Publish](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml)
- [![CodeQL](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/codeql.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/codeql.yml)

