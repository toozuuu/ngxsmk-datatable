# NPM Publishing Setup

Automated npm publishing for ngxsmk-datatable using GitHub Actions.

## 🚀 Quick Setup (2 Steps)

### 1. Add NPM Token (3 minutes)
1. Go to [npmjs.com](https://www.npmjs.com/) → Access Tokens → Generate (Automation type)
2. Copy the token
3. Go to repository **Settings** → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `NPM_TOKEN`
6. Value: Paste your token
7. Save

### 2. Enable GitHub Actions (1 minute)
1. Go to **Settings** → **Actions** → **General**
2. Select: **Allow all actions and reusable workflows**
3. Under "Workflow permissions": **Read and write permissions**
4. Save

## 📦 How to Publish

### Option 1: Create a GitHub Release (Recommended)
```bash
# 1. Update versions
# Edit package.json and projects/ngxsmk-datatable/package.json

# 2. Update changelog
# Edit CHANGELOG.md

# 3. Commit and push
git add .
git commit -m "chore: bump version to 1.7.0"
git push

# 4. Create GitHub Release
# Go to GitHub → Releases → Draft new release
# Tag: v1.7.0 (create new)
# Click "Publish release"
```

The workflow automatically publishes to npm! ✨

### Option 2: Manual Workflow Trigger
1. Go to **Actions** → **Publish to NPM**
2. Click **Run workflow**
3. Enter version (e.g., `1.7.0`)
4. Click **Run workflow**

## ✅ Verify Publication

1. Check [Actions tab](https://github.com/toozuuu/ngxsmk-datatable/actions) - workflow should be green
2. Visit [npmjs.com/package/ngxsmk-datatable](https://www.npmjs.com/package/ngxsmk-datatable)
3. Verify new version is live

## 🐛 Troubleshooting

**Workflow fails:**
```bash
# Test build locally first
npm run build:lib:prod
```

**"Version already exists" error:**
- Update to a new, unused version number

**Permission denied:**
- Verify NPM_TOKEN is correct
- Check you're a package maintainer on npmjs.com

## 📚 More Info

See [workflows/README.md](workflows/README.md) for detailed documentation.

---

**Status Badge:**
[![Publish to NPM](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml)
