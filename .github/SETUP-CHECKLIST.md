# CI/CD Setup Checklist

Use this checklist to ensure your GitHub Actions CI/CD is fully configured.

## ✅ Initial Setup

### 1. Repository Settings

- [ ] **Enable GitHub Actions**
  - Settings → Actions → General
  - Allow all actions and reusable workflows
  - Read and write permissions
  - Allow GitHub Actions to create and approve pull requests

- [ ] **Enable GitHub Pages**
  - Settings → Pages
  - Source: GitHub Actions
  - Save

- [ ] **Enable Code Security Features**
  - Settings → Code security and analysis
  - Enable Dependabot alerts
  - Enable Dependabot security updates
  - Code scanning will auto-enable with CodeQL workflow

### 2. Secrets Configuration

- [ ] **Add NPM_TOKEN**
  - Get token from [npmjs.com](https://www.npmjs.com/) → Access Tokens → Generate
  - Settings → Secrets and variables → Actions
  - New repository secret: `NPM_TOKEN`
  - Paste token value

### 3. Branch Protection (Optional but Recommended)

- [ ] **Protect main branch**
  - Settings → Branches → Add rule
  - Branch name pattern: `main`
  - ✅ Require a pull request before merging
  - ✅ Require status checks to pass before merging
    - Select: `build-and-test`, `code-quality`
  - ✅ Require branches to be up to date before merging
  - Save changes

## 🧪 Testing

### 4. Test CI Workflow

- [ ] Make a small change to any file
- [ ] Commit and push to main or create PR
- [ ] Go to Actions tab → CI workflow
- [ ] Verify workflow runs successfully
- [ ] Check all jobs pass (build-and-test, code-quality)

### 5. Test PR Validation

- [ ] Create a new branch
- [ ] Make changes and push
- [ ] Create a Pull Request
- [ ] Verify PR Validation workflow runs
- [ ] Check for PR comment with build info
- [ ] Merge or close PR

### 6. Test Demo Deployment

- [ ] Go to Actions → Deploy Demo to GitHub Pages
- [ ] Run workflow manually
- [ ] Wait for completion
- [ ] Visit: https://toozuuu.github.io/ngxsmk-datatable/
- [ ] Verify demo app loads correctly

### 7. Test CodeQL

- [ ] Go to Actions → CodeQL
- [ ] Verify workflow ran automatically
- [ ] Check for any security findings
- [ ] Go to Security → Code scanning
- [ ] Verify CodeQL is active

### 8. Test Dependabot

- [ ] Wait for Monday (or trigger manually if possible)
- [ ] Check Pull Requests for Dependabot PRs
- [ ] Review a Dependabot PR
- [ ] Merge if appropriate

## 📝 Documentation

### 9. Update README

- [x] Status badges added to README.md
- [ ] Commit and push README changes
- [ ] Verify badges display correctly on GitHub

### 10. Inform Team

- [ ] Notify contributors about new CI/CD
- [ ] Share link to [workflows/README.md](.github/workflows/README.md)
- [ ] Share [QUICK-REFERENCE.md](.github/QUICK-REFERENCE.md)
- [ ] Update team documentation with workflow info

## 🚀 Publishing

### 11. Test NPM Publishing (When Ready)

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Commit changes
- [ ] Create GitHub Release with tag (e.g., v1.6.1)
- [ ] Verify Publish to NPM workflow runs
- [ ] Check package on npmjs.com
- [ ] Verify version updated

OR

- [ ] Go to Actions → Publish to NPM
- [ ] Run workflow manually with version number
- [ ] Verify publish completes
- [ ] Check npmjs.com

## 🎯 Optional Enhancements

### 12. Additional Configuration

- [ ] **Add CODEOWNERS file**
  - Create `.github/CODEOWNERS`
  - Add team members who should review PRs

- [ ] **Configure notifications**
  - Personal Settings → Notifications
  - Configure Actions notifications preferences

- [ ] **Add release automation**
  - Consider using release-please or similar tool
  - Automate CHANGELOG generation

- [ ] **Add Slack/Discord notifications**
  - Configure workflow to post to Slack/Discord on releases
  - Add webhooks in workflow files

- [ ] **Add test coverage reporting**
  - Integrate Codecov or Coveralls
  - Add coverage badge to README

- [ ] **Add bundle size tracking**
  - Integrate bundlephobia or similar
  - Add size limit checks

## 📊 Monitoring

### 13. Regular Maintenance

- [ ] **Weekly**: Review Dependabot PRs
- [ ] **Weekly**: Check CodeQL findings
- [ ] **Monthly**: Review workflow performance
- [ ] **Monthly**: Update workflow actions to latest versions
- [ ] **Quarterly**: Review and update documentation

## ✅ Completion Check

Once all items above are checked:

- [ ] All workflows are green
- [ ] Demo site is accessible
- [ ] NPM publishing works
- [ ] Team is informed
- [ ] Documentation is complete

## 🎉 You're Done!

Your CI/CD is fully configured and operational!

### What Happens Now?

1. **Every push to main** → CI runs, demo deploys
2. **Every PR** → CI + validation runs, comment posted
3. **Every release** → NPM publish runs automatically
4. **Every Monday** → Dependabot checks for updates
5. **Continuous** → CodeQL scans for security issues

### Need Help?

- 📖 [workflows/README.md](workflows/README.md) - Full documentation
- 🚀 [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Quick commands
- 🔧 [CI-CD-SETUP.md](CI-CD-SETUP.md) - Detailed setup guide
- 🐛 [Create an issue](../../issues/new)

---

**Last Updated:** $(date)  
**Status:** ⏳ In Progress | ✅ Complete

