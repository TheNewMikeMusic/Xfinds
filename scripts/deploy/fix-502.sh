#!/bin/bash
# 修复 502 Bad Gateway 错误的一键脚本

set -e

echo "=========================================="
echo "开始修复 502 Bad Gateway 错误"
echo "=========================================="

cd /var/www/xfinds || {
    echo "错误: 无法进入 /var/www/xfinds 目录"
    exit 1
}

echo ""
echo "=== 步骤 1: 检查当前状态 ==="
echo "PM2 状态:"
pm2 status || true

echo ""
echo "端口 8000 监听状态:"
netstat -tulpn | grep 8000 || ss -tulpn | grep 8000 || echo "端口 8000 未监听"

echo ""
echo "=== 步骤 2: 停止现有进程 ==="
pm2 stop xfinds 2>/dev/null || echo "应用未运行"
pm2 delete xfinds 2>/dev/null || echo "应用未在 PM2 中"

echo ""
echo "=== 步骤 3: 清理构建缓存 ==="
rm -rf .next
rm -rf node_modules/.cache
echo "缓存已清理"

echo ""
echo "=== 步骤 4: 检查构建文件 ==="
if [ ! -f "package.json" ]; then
    echo "错误: 未找到 package.json"
    exit 1
fi

echo ""
echo "=== 步骤 5: 重新构建应用 ==="
npm run build

if [ ! -d ".next" ]; then
    echo "错误: 构建失败，.next 目录不存在"
    exit 1
fi

echo ""
echo "=== 步骤 6: 启动应用 ==="
pm2 start npm --name "xfinds" -- start
pm2 save

echo ""
echo "等待应用启动..."
sleep 5

echo ""
echo "=== 步骤 7: 检查应用状态 ==="
pm2 status

echo ""
echo "=== 步骤 8: 检查应用日志 ==="
pm2 logs xfinds --lines 20 --nostream

echo ""
echo "=== 步骤 9: 测试本地连接 ==="
if curl -f -s http://localhost:8000 > /dev/null; then
    echo "✅ 本地连接成功"
else
    echo "⚠️  本地连接失败，但继续检查..."
fi

echo ""
echo "=== 步骤 10: 检查 Nginx 配置 ==="
if nginx -t; then
    echo "✅ Nginx 配置正确"
    systemctl reload nginx
    echo "✅ Nginx 已重新加载"
else
    echo "❌ Nginx 配置错误，请手动检查"
fi

echo ""
echo "=========================================="
echo "修复完成！"
echo "=========================================="
echo ""
echo "请执行以下命令验证："
echo "  1. pm2 status          - 检查应用状态"
echo "  2. pm2 logs xfinds     - 查看应用日志"
echo "  3. curl http://localhost:8000 - 测试本地连接"
echo "  4. curl -I https://xfinds.cc - 测试 HTTPS 访问"
echo ""
echo "如果问题仍然存在，请检查："
echo "  - pm2 logs xfinds --lines 50"
echo "  - tail -50 /var/log/nginx/xfinds-error.log"
echo ""

