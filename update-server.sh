#!/bin/bash
# 服务器快速更新脚本
# 使用方法: 在服务器上执行: bash update-server.sh
# 或者: chmod +x update-server.sh && ./update-server.sh

set -e

PROJECT_DIR="/var/www/xfinds"

echo "=========================================="
echo "开始更新 Xfinds 服务器"
echo "=========================================="

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 项目目录不存在: $PROJECT_DIR"
    echo "请先运行完整部署脚本"
    exit 1
fi

# 进入项目目录
cd "$PROJECT_DIR"

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
echo "=== 拉取最新代码 ==="
git pull origin main || {
    echo "⚠️  Git pull 失败，尝试使用 token 认证..."
    git pull "$GITHUB_REPO_AUTH" main || {
        echo "❌ 错误: 无法拉取代码，请检查："
        echo "  1. 网络连接"
        echo "  2. GitHub Token 是否有效"
        echo "  3. 仓库权限"
        exit 1
    }
}

echo ""
echo "=== 设置脚本执行权限 ==="
chmod +x scripts/deploy/quick-update.sh

echo ""
echo "=== 执行快速更新脚本 ==="
./scripts/deploy/quick-update.sh

echo ""
echo "=========================================="
echo "✅ 更新完成！"
echo "=========================================="

