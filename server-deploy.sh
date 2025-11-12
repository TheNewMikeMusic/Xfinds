#!/bin/bash
# Xfinds 服务器部署脚本
# 使用方法: chmod +x server-deploy.sh && ./server-deploy.sh

set -e

echo "=========================================="
echo "开始部署 Xfinds 应用"
echo "=========================================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 安装依赖
echo ""
echo "=== 安装依赖 ==="
npm install

# 生成 JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
echo ""
echo "=== 配置环境变量 ==="
cat > .env.local << EOF
NODE_ENV=production
JWT_SECRET=${JWT_SECRET}
AUTH_MODE=stub
APP_URL=http://154.21.200.177
NEXT_PUBLIC_APP_URL=http://154.21.200.177
EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest/CNY
EOF

# 构建项目
echo ""
echo "=== 构建项目 ==="
npm run build

# 停止旧进程（如果存在）
echo ""
echo "=== 管理 PM2 进程 ==="
pm2 delete xfinds 2>/dev/null || true

# 启动应用
pm2 start npm --name "xfinds" -- start
pm2 save

# 设置开机自启
pm2 startup | tail -1 | bash || true

# 配置防火墙
echo ""
echo "=== 配置防火墙 ==="
ufw allow 3000/tcp 2>/dev/null || firewall-cmd --permanent --add-port=3000/tcp 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

echo ""
echo "=========================================="
echo "部署完成！"
echo "访问地址: http://154.21.200.177:3000"
echo "=========================================="
pm2 status

