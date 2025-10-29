# GitHub Actions Quick Reference

## 🚀 Common Commands

### Local Development
```bash
# Install dependencies
npm ci

# Build library
npm run build:lib:prod

# Build demo
npm run build:demo:prod

# Run all checks (like CI does)
npm run lint && npm run build:lib:prod && npm run test:lib -- --watch=false
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feat/your-feature

# Commit with conventional format
git commit -m "feat(component): add new feature"

# Push and create PR
git push -u origin feat/your-feature
```

## 🔄 Workflow Triggers

| Workflow | Automatic Triggers | Manual Trigger |
|----------|-------------------|----------------|
| CI | ✅ Push to main/develop<br>✅ Pull requests | ❌ |
| PR Validation | ✅ Pull requests | ❌ |
| Publish to NPM | ✅ GitHub Release | ✅ Actions → Publish → Run workflow |
| Demo Deploy | ✅ Push to main | ✅ Actions → Demo Deploy → Run workflow |
| CodeQL | ✅ Push to main/develop<br>✅ Pull requests<br>✅ Weekly (Monday) | ❌ |

## 📝 Commit Message Format

```bash
type(scope): subject

# Types:
feat      # New feature
fix       # Bug fix
docs      # Documentation
style     # Formatting
refactor  # Code refactoring
perf      # Performance
test      # Tests
chore     # Maintenance

# Examples:
feat(datatable): add virtual scrolling
fix(pagination): correct page count
docs(readme): update installation steps
```

## 🏷️ Publishing Versions

### Semantic Versioning
- **MAJOR** (x.0.0) - Breaking changes
- **MINOR** (1.x.0) - New features (backward compatible)
- **PATCH** (1.0.x) - Bug fixes

### Quick Publish via Release
1. Update versions in package.json files
2. Update CHANGELOG.md
3. Commit: `git commit -m "chore: bump version to 1.7.0"`
4. Push: `git push`
5. Create release on GitHub with tag `v1.7.0`
6. Workflow auto-publishes to NPM

## 🔍 Check Workflow Status

### From Command Line (requires GitHub CLI)
```bash
# Install GitHub CLI (if not installed)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: See https://cli.github.com/

# Login
gh auth login

# View workflow runs
gh run list

# View specific workflow
gh run list --workflow=ci.yml

# Watch workflow run
gh run watch
```

### From GitHub Website
1. Go to repository
2. Click **Actions** tab
3. Select workflow from left sidebar
4. Click on a run to see details

## 🛑 Fixing Failed Workflows

### CI Failed on Lint
```bash
npm run lint
# Fix errors
git add .
git commit -m "fix: resolve linting errors"
git push
```

### CI Failed on Build
```bash
npm run build:lib:prod
# Fix build errors
git add .
git commit -m "fix: resolve build errors"
git push
```

### CI Failed on Tests
```bash
npm run test:lib
# Fix failing tests
git add .
git commit -m "test: fix failing tests"
git push
```

## 📦 Required Secrets

| Secret | Location | Purpose |
|--------|----------|---------|
| `NPM_TOKEN` | Settings → Secrets → Actions | Publish to NPM |
| `GITHUB_TOKEN` | Auto-provided | GitHub API access |

## ✅ Pre-Push Checklist

Before pushing to a PR:
- [ ] `npm run lint` passes
- [ ] `npm run build:lib:prod` succeeds
- [ ] `npm run test:lib -- --watch=false` passes
- [ ] Commit message follows format
- [ ] Changes are documented

## 🔗 Useful Links

- [Actions Tab](../../actions) - View workflow runs
- [Releases](../../releases) - Create new releases
- [Pull Requests](../../pulls) - View PRs
- [Settings](../../settings) - Repository settings
- [NPM Package](https://www.npmjs.com/package/ngxsmk-datatable)

## 🎯 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow not running | Check if Actions are enabled in Settings |
| NPM publish fails | Verify NPM_TOKEN secret is set |
| Demo deploy fails | Enable GitHub Pages in Settings |
| CodeQL fails | Re-run workflow, usually resolves itself |
| Dependabot PRs not appearing | Check Dependabot is enabled in Settings |

## 🆘 Getting Help

1. Check [workflow logs](../../actions)
2. Read [CI-CD-SETUP.md](CI-CD-SETUP.md)
3. Read [workflows/README.md](workflows/README.md)
4. [Create an issue](../../issues/new)
5. Email: sachindilshan040@gmail.com

