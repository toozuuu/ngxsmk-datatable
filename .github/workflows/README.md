# NPM Publishing Automation

Automated npm publishing for ngxsmk-datatable using GitHub Actions.

## 🚀 Setup (2 Steps)

### 1. Add NPM Token
1. Go to [npmjs.com](https://www.npmjs.com/) → Access Tokens → Generate New Token
2. Select **Automation** type
3. Copy the token
4. Go to **Settings** → **Secrets and variables** → **Actions**
5. Click **New repository secret**
6. Name: `NPM_TOKEN`
7. Value: Paste your token
8. Save

### 2. Enable GitHub Actions
1. Go to **Settings** → **Actions** → **General**
2. Select: **Allow all actions and reusable workflows**
3. Under "Workflow permissions": **Read and write permissions**
4. Save

## 📦 Publishing a New Version

### Method 1: GitHub Release (Recommended)
1. Update version in `package.json` and `projects/ngxsmk-datatable/package.json`
2. Update `CHANGELOG.md`
3. Commit and push:
   ```bash
   git add .
   git commit -m "chore: bump version to 1.x.x"
   git push
   ```
4. Create a GitHub Release:
   - Go to **Releases** → **Draft a new release**
   - Tag: `v1.x.x` (create new tag)
   - Release title: `v1.x.x`
   - Description: Copy from CHANGELOG
   - Click **Publish release**
5. The workflow automatically publishes to npm ✨

### Method 2: Manual Workflow
1. Go to **Actions** → **Publish to NPM**
2. Click **Run workflow**
3. Enter version number (e.g., `1.6.1`)
4. Click **Run workflow**
5. The workflow will update version, publish, and create a tag

## 🔄 Workflow Details

**File:** `publish.yml`

**Triggers:**
- GitHub Release published
- Manual workflow dispatch

**What it does:**
1. Checks out code
2. Sets up Node.js 20.x
3. Installs dependencies
4. Builds library in production mode
5. Runs tests (optional, continues on error)
6. Updates version (if manual trigger)
7. Publishes to npm
8. Creates Git tag (if manual trigger)

**Required Secret:** `NPM_TOKEN`

## 🐛 Troubleshooting

### Publish Fails

**Problem:** NPM_TOKEN not configured
- Follow setup step 1 above

**Problem:** Version already exists on npm
- Update version number in package.json
- Use a version that hasn't been published

**Problem:** Permission denied
- Verify NPM_TOKEN has publish permissions
- Check you're a maintainer of the package on npmjs.com

## 📊 Workflow Status

View workflow runs: [Actions Tab](../../actions/workflows/publish.yml)

## 🔑 Secrets

| Secret | Required | Purpose |
|--------|----------|---------|
| `NPM_TOKEN` | ✅ Yes | Publish to npm |
| `GITHUB_TOKEN` | ✅ Auto-provided | Create tags |

## 📝 Version Guidelines

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (x.0.0) - Breaking changes
- **MINOR** (1.x.0) - New features (backward compatible)
- **PATCH** (1.0.x) - Bug fixes

## ✅ Success Indicators

- ✅ Workflow shows green checkmark
- ✅ Package appears on [npmjs.com](https://www.npmjs.com/package/ngxsmk-datatable)
- ✅ Version number updated
- ✅ Git tag created

---

**Need Help?** [Create an Issue](../../issues)
