# Fix Garbled Commit Messages

This document explains how to fix garbled Chinese commit messages in the git history.

## Affected Commits

The following commits have garbled messages:

1. **43ecd58** - Should be: "Update: Legal pages, navbar, environment config and add logo"
2. **2b11b34** - Should be: "Improve: Mobile navbar layout and currency selector UI style"
3. **07d6cda** - Should be: "Fix: Navbar layout and code quality issues - Fix PC search frame center display - Fix mobile navbar icon layout - Unify currency selector style - Fix code quality issues - Optimize API routes"

## Manual Fix Method

Since these commits are already pushed to remote, you need to use interactive rebase:

### Step 1: Fix commit 43ecd58

```bash
git rebase -i 43ecd58^
```

In the editor that opens:
- Change `pick` to `reword` for the line with `43ecd58`
- Save and close
- When prompted, enter the new message: `Update: Legal pages, navbar, environment config and add logo`
- Save and close

### Step 2: Fix commit 2b11b34

```bash
git rebase -i 2b11b34^
```

In the editor:
- Change `pick` to `reword` for the line with `2b11b34`
- Save and close
- Enter new message: `Improve: Mobile navbar layout and currency selector UI style`
- Save and close

### Step 3: Fix commit 07d6cda

```bash
git rebase -i 07d6cda^
```

In the editor:
- Change `pick` to `reword` for the line with `07d6cda`
- Save and close
- Enter new message: `Fix: Navbar layout and code quality issues - Fix PC search frame center display - Fix mobile navbar icon layout - Unify currency selector style - Fix code quality issues - Optimize API routes`
- Save and close

### Step 4: Force push (with lease for safety)

```bash
git push --force-with-lease origin main
```

## Alternative: Use Git Notes

If you don't want to rewrite history, you can add notes to these commits:

```bash
git notes add -m "Update: Legal pages, navbar, environment config and add logo" 43ecd58
git notes add -m "Improve: Mobile navbar layout and currency selector UI style" 2b11b34
git notes add -m "Fix: Navbar layout and code quality issues" 07d6cda
git push origin refs/notes/*
```

## Prevention

To prevent future garbled messages:

1. Always use English for commit messages
2. Git encoding is configured: `git config --global i18n.commitencoding utf-8`
3. `.gitattributes` file ensures proper file encoding
4. Use `git config --global core.quotepath false` to avoid path encoding issues

## Warning

⚠️ **Important**: Rewriting git history with `git rebase` and force push will change commit hashes. If others are working on this repository, coordinate with them before force pushing.

