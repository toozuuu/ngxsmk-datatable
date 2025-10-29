# GitHub CI/CD Setup Guide

This guide will help you complete the setup of GitHub Actions CI/CD for ngxsmk-datatable.

## ✅ What Has Been Created

The following files have been added to your repository:

### Workflow Files (`.github/workflows/`)
1. **ci.yml** - Main CI pipeline (build, test, lint)
2. **publish.yml** - NPM publishing automation
3. **pr-validation.yml** - Pull request validation
4. **demo-deploy.yml** - Deploy demo app to GitHub Pages
5. **codeql.yml** - Security scanning

### Configuration Files
6. **dependabot.yml** - Automated dependency updates
7. **pull_request_template.md** - PR template for contributors

### Documentation
8. **workflows/README.md** - Comprehensive workflow documentation
9. **BADGES.md** - Status badges for your README
10. **CI-CD-SETUP.md** - This setup guide

## 🔧 Required Setup Steps

### 1. Enable GitHub Pages (for Demo Deployment)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment" → **Source**: Select **GitHub Actions**
4. Save the settings

Your demo will be available at: `https://toozuuu.github.io/ngxsmk-datatable/`

### 2. Configure NPM Token (for Publishing)

To enable automated NPM publishing:

1. **Get your NPM token:**
   - Go to [npmjs.com](https://www.npmjs.com/) and log in
   - Click your profile → **Access Tokens**
   - Click **Generate New Token** → **Classic Token**
   - Select **Automation** type
   - Copy the token

2. **Add to GitHub Secrets:**
   - Go to your repository → **Settings**
   - Click **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: Paste your NPM token
   - Click **Add secret**

### 3. Enable Actions (if not already enabled)

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Actions permissions", select **Allow all actions and reusable workflows**
3. Under "Workflow permissions", select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 4. Enable CodeQL (Optional but Recommended)

CodeQL is already configured. First run may take a few minutes to complete.

1. Go to **Settings** → **Code security and analysis**
2. Click **Set up** next to "Code scanning" if not already enabled
3. The workflow will run automatically

### 5. Enable Dependabot Alerts (Optional but Recommended)

1. Go to **Settings** → **Code security and analysis**
2. Enable **Dependabot alerts**
3. Enable **Dependabot security updates**
4. Dependabot will now create PRs for dependency updates weekly

## 🎯 Add Status Badges to README

Add these badges to the top of your `README.md` file:

```markdown
[![CI](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/ci.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/ci.yml)
[![Publish to NPM](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/publish.yml)
[![CodeQL](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/codeql.yml/badge.svg)](https://github.com/toozuuu/ngxsmk-datatable/actions/workflows/codeql.yml)
[![npm version](https://badge.fury.io/js/ngxsmk-datatable.svg)](https://www.npmjs.com/package/ngxsmk-datatable)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## 🚀 Test the Workflows

### Test CI Workflow

1. Make a small change to any file (e.g., add a comment to README.md)
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: trigger CI workflow"
   git push
   ```
3. Go to **Actions** tab on GitHub
4. You should see the CI workflow running

### Test PR Validation

1. Create a new branch:
   ```bash
   git checkout -b test/ci-workflow
   ```
2. Make a small change
3. Commit and push:
   ```bash
   git add .
   git commit -m "test: validate PR workflow"
   git push -u origin test/ci-workflow
   ```
4. Create a Pull Request on GitHub
5. Check the **Checks** tab on the PR to see workflows running

### Test Demo Deployment

Demo deployment will trigger automatically on the next push to `main` branch. You can also trigger it manually:

1. Go to **Actions** tab
2. Click **Deploy Demo to GitHub Pages**
3. Click **Run workflow** → **Run workflow**
4. Wait for completion
5. Visit `https://toozuuu.github.io/ngxsmk-datatable/`

## 📦 Publishing a New Version

### Method 1: Automated via GitHub Release (Recommended)

1. Update version in `package.json` and `projects/ngxsmk-datatable/package.json`
2. Update `CHANGELOG.md`
3. Commit and push:
   ```bash
   git add .
   git commit -m "chore: bump version to 1.6.1"
   git push
   ```
4. Create a GitHub Release:
   - Go to **Code** → **Releases** → **Draft a new release**
   - Click **Choose a tag** → Type `v1.6.1` → **Create new tag**
   - Release title: `v1.6.1`
   - Describe the release (copy from CHANGELOG)
   - Click **Publish release**
5. The **Publish to NPM** workflow will run automatically

### Method 2: Manual Workflow Dispatch

1. Go to **Actions** → **Publish to NPM**
2. Click **Run workflow**
3. Enter version number (e.g., `1.6.1`)
4. Click **Run workflow**

## 🔍 Monitoring Workflows

### View Workflow Runs

1. Go to the **Actions** tab
2. Click on any workflow to see its runs
3. Click on a specific run to see details
4. Click on a job to see logs

### Workflow Notifications

By default, GitHub will email you when a workflow you triggered fails. You can customize this:

1. Go to **Settings** (your account settings, not repo)
2. Click **Notifications**
3. Scroll to **Actions**
4. Configure your preferences

## 🐛 Troubleshooting

### CI Workflow Fails

**Problem:** Linting errors
```bash
# Fix locally
npm run lint
```

**Problem:** Build errors
```bash
# Test build locally
npm run build:lib:prod
npm run build:demo:prod
```

**Problem:** Test failures
```bash
# Run tests locally
npm run test:lib -- --watch=false --browsers=ChromeHeadless
```

### Publish Workflow Fails

**Problem:** NPM_TOKEN not configured
- Follow step 2 in "Required Setup Steps" above

**Problem:** Version already published
- Update the version number in package.json
- Ensure you're using a new version that hasn't been published

### Demo Deploy Fails

**Problem:** GitHub Pages not enabled
- Follow step 1 in "Required Setup Steps" above

**Problem:** Build fails
- Check the workflow logs
- Test build locally: `npm run build:demo:prod`

### CodeQL Workflow Fails

CodeQL may fail on the first run. This is usually fine:
- Check the workflow logs
- Re-run the workflow
- Most issues resolve on the second run

## 📊 Workflow Overview

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| CI | Push, PR | Build, test, lint | ~3-5 min |
| PR Validation | PR opened/updated | Validate PRs, comment size | ~2-3 min |
| Publish | Release, Manual | Publish to NPM | ~3-4 min |
| Demo Deploy | Push to main, Manual | Deploy demo app | ~4-6 min |
| CodeQL | Push, PR, Weekly | Security scanning | ~5-10 min |

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ Green checkmarks appear on commits
- ✅ Badges show "passing" status
- ✅ Demo app is accessible at GitHub Pages URL
- ✅ Pull requests show workflow results
- ✅ Dependabot creates update PRs

## 📚 Next Steps

1. ✅ Complete the required setup steps above
2. ✅ Test each workflow
3. ✅ Add status badges to README
4. ✅ Update team about the new CI/CD process
5. ✅ Review and merge Dependabot PRs when they arrive

## 💡 Tips

- **Branch Protection**: Consider adding branch protection rules to require CI checks to pass before merging
- **Code Owners**: Create a CODEOWNERS file to auto-assign reviewers
- **Release Notes**: Use GitHub's auto-generate release notes feature
- **Environments**: Set up GitHub Environments for additional deployment controls

## ❓ Need Help?

- 📖 See [workflows/README.md](.github/workflows/README.md) for detailed documentation
- 🐛 Check workflow logs in the Actions tab
- 💬 Create an issue if you encounter problems
- 📧 Contact: sachindilshan040@gmail.com

---

**Happy Automating! 🤖**

