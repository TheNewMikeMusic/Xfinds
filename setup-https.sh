#!/bin/bash
# Let's Encrypt SSL 证书配置脚本
# 域名: xfinds.cc

set -e

DOMAIN="xfinds.cc"
EMAIL="admin@xfinds.cc"  # 修改为您的邮箱地址
NGINX_CONFIG="/etc/nginx/sites-available/xfinds"
CERTBOT_WEBROOT="/var/www/certbot"

echo "=========================================="
echo "配置 Let's Encrypt SSL 证书"
echo "域名: $DOMAIN"
echo "=========================================="

# 1. 安装 Certbot
echo ""
echo "=== 安装 Certbot ==="
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 2. 创建 certbot webroot 目录
echo ""
echo "=== 创建 Certbot webroot 目录 ==="
mkdir -p "$CERTBOT_WEBROOT"

# 3. 确保 Nginx 配置已就位（临时配置，用于验证）
if [ ! -f "$NGINX_CONFIG" ]; then
    echo ""
    echo "=== 创建临时 Nginx 配置（用于证书验证） ==="
    cat > "$NGINX_CONFIG" << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root $CERTBOT_WEBROOT;
    }

    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
fi

# 4. 创建符号链接（如果不存在）
if [ ! -L /etc/nginx/sites-enabled/xfinds ]; then
    echo ""
    echo "=== 启用 Nginx 站点 ==="
    ln -s "$NGINX_CONFIG" /etc/nginx/sites-enabled/
fi

# 5. 测试 Nginx 配置
echo ""
echo "=== 测试 Nginx 配置 ==="
nginx -t

# 6. 重启 Nginx
echo ""
echo "=== 重启 Nginx ==="
systemctl restart nginx

# 7. 获取 SSL 证书
echo ""
echo "=== 获取 SSL 证书 ==="
echo "请确保域名 $DOMAIN 已正确解析到服务器 IP"
read -p "按 Enter 继续获取证书..."

certbot certonly --webroot \
    -w "$CERTBOT_WEBROOT" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive \
    --preferred-challenges http

# 8. 更新 Nginx 配置（使用完整的 HTTPS 配置）
echo ""
echo "=== 更新 Nginx 配置（使用完整 HTTPS 配置） ==="
echo "请确保已从项目仓库复制最新的 nginx.conf 到 $NGINX_CONFIG"
echo "或手动更新配置文件以包含 SSL 证书路径"

# 9. 测试更新后的 Nginx 配置
echo ""
echo "=== 测试更新后的 Nginx 配置 ==="
nginx -t

# 10. 重新加载 Nginx
echo ""
echo "=== 重新加载 Nginx ==="
systemctl reload nginx

# 11. 配置自动续期
echo ""
echo "=== 配置证书自动续期 ==="
# Certbot 会自动创建续期任务，测试续期
certbot renew --dry-run

echo ""
echo "=========================================="
echo "SSL 证书配置完成！"
echo "证书位置: /etc/letsencrypt/live/$DOMAIN/"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 确保 Nginx 配置文件包含完整的 HTTPS 配置"
echo "2. 重新加载 Nginx: systemctl reload nginx"
echo "3. 访问 https://$DOMAIN 验证 HTTPS 是否正常工作"

