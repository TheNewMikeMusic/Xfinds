#!/bin/bash
# 快速更新脚本 - 仅拉取代码并重启，不重新克隆
# 使用方法: chmod +x scripts/deploy/quick-update.sh && ./scripts/deploy/quick-update.sh
# 或者在服务器上: cd /var/www/xfinds && chmod +x scripts/deploy/quick-update.sh && ./scripts/deploy/quick-update.sh

set -e

PROJECT_DIR="/var/www/xfinds"

echo "=========================================="
echo "快速更新 Xfinds 应用"
echo "=========================================="

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 项目目录不存在，请使用完整部署脚本"
    echo "运行: /root/deploy-xfinds.sh"
    exit 1
fi

cd "$PROJECT_DIR"

echo ""
echo "=== 先更新脚本本身（如果脚本有更新） ==="
# 先尝试获取最新代码（不合并），这样脚本可以更新自己
GITHUB_TOKEN="${GITHUB_TOKEN:-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}"
GITHUB_REPO_AUTH="https://${GITHUB_TOKEN}@github.com/TheNewMikeMusic/Xfinds.git"

# 尝试 fetch 最新代码
git fetch origin main 2>/dev/null || git fetch "$GITHUB_REPO_AUTH" main 2>/dev/null || echo "⚠️  无法获取远程更新，继续使用当前脚本..."

# 检查脚本是否有更新（比较本地和远程版本）
if git rev-parse --verify origin/main >/dev/null 2>&1; then
    SCRIPT_LOCAL_HASH=$(git hash-object scripts/deploy/quick-update.sh 2>/dev/null || echo "")
    SCRIPT_REMOTE_HASH=$(git ls-tree origin/main scripts/deploy/quick-update.sh 2>/dev/null | awk '{print $3}' || echo "")
    
    if [ -n "$SCRIPT_REMOTE_HASH" ] && [ "$SCRIPT_LOCAL_HASH" != "$SCRIPT_REMOTE_HASH" ]; then
        echo "检测到脚本有更新，正在更新..."
        git checkout origin/main -- scripts/deploy/quick-update.sh 2>/dev/null || echo "⚠️  无法更新脚本，继续使用当前版本..."
        chmod +x scripts/deploy/quick-update.sh
        echo "✅ 脚本已更新，重新执行..."
        # 重新执行更新后的脚本
        exec ./scripts/deploy/quick-update.sh
    else
        echo "脚本已是最新版本"
    fi
else
    echo "无法检查脚本版本，继续执行..."
fi

echo ""
echo "=== 停止 PM2 进程 ==="
pm2 stop xfinds 2>/dev/null || true

echo ""
echo "=== 配置 Git 远程仓库（使用 Token 认证） ==="
# GitHub Token（如果需要认证）
GITHUB_TOKEN="${GITHUB_TOKEN:-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}"
GITHUB_REPO_AUTH="https://${GITHUB_TOKEN}@github.com/TheNewMikeMusic/Xfinds.git"

# 检查当前远程 URL，如果不是使用 token 的 URL，则更新它
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$CURRENT_REMOTE" != *"${GITHUB_TOKEN}"* ]] && [[ "$CURRENT_REMOTE" != *"@github.com"* ]]; then
    echo "更新远程仓库 URL 以使用 Token 认证..."
    git remote set-url origin "$GITHUB_REPO_AUTH" || echo "⚠️  无法更新远程 URL，继续尝试拉取..."
fi

echo ""
echo "=== 检查并处理本地更改 ==="
# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  检测到本地未提交的更改，正在保存..."
    # 保存本地更改到 stash
    git stash save "自动保存于 $(date +%Y%m%d-%H%M%S)" || echo "⚠️  Stash 失败，继续..."
fi

# 检查是否有未跟踪的文件（通常是构建产物，可以忽略）
UNTRACKED=$(git ls-files --others --exclude-standard | wc -l)
if [ "$UNTRACKED" -gt 0 ]; then
    echo "ℹ️  发现 $UNTRACKED 个未跟踪的文件（通常是构建产物，将被保留）"
fi

echo ""
echo "=== 拉取最新代码 ==="
# 先尝试重置到远程状态（丢弃本地更改，使用远程版本）
git fetch origin main || {
    echo "⚠️  Git fetch 失败，尝试使用 token 认证..."
    git fetch "$GITHUB_REPO_AUTH" main || {
        echo "❌ 错误: 无法获取远程代码，请检查："
        echo "  1. 网络连接"
        echo "  2. GitHub Token 是否有效"
        echo "  3. 仓库权限"
        exit 1
    }
}

# 重置到远程 main 分支（丢弃本地更改）
echo "重置到远程 main 分支..."
git reset --hard origin/main || {
    echo "⚠️  重置失败，尝试合并..."
    git pull origin main --no-edit || {
        echo "⚠️  合并失败，尝试强制重置..."
        git reset --hard origin/main || {
            echo "❌ 错误: 无法更新代码"
            exit 1
        }
    }
}

echo ""
echo "=== 清理构建缓存 ==="
rm -rf .next
rm -rf node_modules/.cache

echo ""
echo "=== 安装依赖（如有更新） ==="
npm install

echo ""
echo "=== 确保 Sharp 正确安装（用于图片上传处理） ==="
npm install sharp@latest --force || echo "Sharp 安装警告，继续..."

echo ""
echo "=== 构建项目 ==="
npm run build

# 验证构建是否成功
if [ ! -d ".next" ]; then
    echo "❌ 错误: 构建失败，.next 目录不存在"
    exit 1
fi

echo ""
echo "=== 重启应用 ==="
pm2 restart xfinds

echo ""
echo "=== 等待应用启动并验证 ==="
sleep 5

# 检查应用状态
if pm2 list | grep -q "xfinds.*online"; then
    echo "✅ 应用已启动"
else
    echo "⚠️  应用可能未正常启动，检查日志..."
    pm2 logs xfinds --lines 20 --nostream
    exit 1
fi

# 检查端口监听
if netstat -tulpn 2>/dev/null | grep -q ":8000" || ss -tulpn 2>/dev/null | grep -q ":8000"; then
    echo "✅ 端口 8000 正在监听"
else
    echo "⚠️  端口 8000 未监听"
fi

# 测试本地连接
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200\|301\|302\|307"; then
    echo "✅ 本地连接测试成功"
else
    echo "⚠️  本地连接测试失败，但继续..."
fi

echo ""
echo "=========================================="
echo "✅ 更新完成！"
echo "=========================================="
echo "访问地址: https://xfinds.cc"
echo ""
pm2 status
echo ""
echo "查看日志: pm2 logs xfinds --lines 20"

