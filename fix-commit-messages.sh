#!/bin/bash
# Script to fix garbled commit messages using git rebase

# Set encoding
export GIT_COMMITTER_NAME="Xfinds"
export GIT_COMMITTER_EMAIL="xfinds@example.com"
export GIT_AUTHOR_NAME="Xfinds"
export GIT_AUTHOR_EMAIL="xfinds@example.com"

# Fix commit 43ecd58: 更新法律页面、导航栏、环境配置和添加logo
git rebase -i 43ecd58^
# In the editor, change 'pick' to 'reword' for 43ecd58
# Then change the message to: "Update: Legal pages, navbar, environment config and add logo"

# Fix commit 2b11b34: 优化移动端导航栏布局和货币选择器UI样式
git rebase -i 2b11b34^
# In the editor, change 'pick' to 'reword' for 2b11b34
# Then change the message to: "Improve: Mobile navbar layout and currency selector UI style"

# Fix commit 07d6cda: 修复导航栏布局和代码质量问题
git rebase -i 07d6cda^
# In the editor, change 'pick' to 'reword' for 07d6cda
# Then change the message to: "Fix: Navbar layout and code quality issues - Fix PC search frame center display - Fix mobile navbar icon layout - Unify currency selector style (PC and mobile consistent) - Fix code quality issues: remove unused imports, replace console with logger, fix type errors - Optimize API routes: remove unused request parameters"

echo "Done! Now run: git push --force-with-lease origin main"

