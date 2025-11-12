# Xfinds 部署指南

## 服务器信息
- **IP 地址**: 154.21.200.177
- **用户名**: root
- **密码**: dm6b1acaggAoLcln

## 快速部署方法

### 方法一：从 GitHub 拉取并完全替换部署（推荐）

这是最简单快捷的方式，会自动从 GitHub 拉取最新代码并完全替换现有项目。

1. **连接到服务器**：
```bash
ssh root@154.21.200.177
```

2. **上传部署脚本到服务器**：
   - 方式 A: 使用 SCP（在本地 PowerShell 执行）：
   ```powershell
   scp deploy-from-github.sh root@154.21.200.177:/root/
   ```
   
   - 方式 B: 直接在服务器上创建文件：
   ```bash
   nano /root/deploy-from-github.sh
   # 然后复制 deploy-from-github.sh 的内容
   ```

3. **执行部署脚本**：
```bash
chmod +x /root/deploy-from-github.sh
/root/deploy-from-github.sh
```

**脚本功能说明**：
- ✅ 自动停止当前运行的 PM2 进程
- ✅ 备份现有项目（包括 .env.local）
- ✅ 完全删除旧项目
- ✅ 从 GitHub 拉取最新代码
- ✅ 恢复环境变量配置
- ✅ 安装依赖并构建项目
- ✅ 重启 PM2 进程
- ✅ 自动配置防火墙

**一键执行命令**（在服务器上直接运行）：
```bash
curl -fsSL https://raw.githubusercontent.com/TheNewMikeMusic/Xfinds/main/deploy-from-github.sh -o /tmp/deploy.sh && chmod +x /tmp/deploy.sh && /tmp/deploy.sh
```

### 方法二：使用本地部署脚本

适用于已有项目目录的情况，不会完全替换项目。

1. **连接到服务器**：
```bash
ssh root@154.21.200.177
```

2. **上传部署脚本到服务器**：
   - 方式 A: 使用 SCP（在本地 PowerShell 执行）：
   ```powershell
   scp server-deploy.sh root@154.21.200.177:/root/
   ```
   
   - 方式 B: 直接在服务器上创建文件：
   ```bash
   nano /root/server-deploy.sh
   # 然后复制 server-deploy.sh 的内容
   ```

3. **执行部署脚本**：
```bash
chmod +x /root/server-deploy.sh
/root/server-deploy.sh
```

### 方法三：手动部署步骤

如果脚本执行失败，可以按照以下步骤手动部署：

#### 1. 连接到服务器
```bash
ssh root@154.21.200.177
```

#### 2. 更新系统并安装必要工具
```bash
apt-get update && apt-get upgrade -y
apt-get install -y git curl

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 验证安装
node -v
npm -v
pm2 -v
```

#### 3. 克隆项目
```bash
mkdir -p /var/www/xfinds
cd /var/www/xfinds
git clone https://github.com/TheNewMikeMusic/Xfinds.git .
```

#### 4. 安装依赖
```bash
cd /var/www/xfinds
npm install
```

#### 5. 配置环境变量
```bash
cd /var/www/xfinds
cat > .env.local << 'EOF'
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
AUTH_MODE=stub
APP_URL=http://154.21.200.177
NEXT_PUBLIC_APP_URL=http://154.21.200.177
EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest/CNY
EOF

# 生成 JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
sed -i "s|\$(openssl rand -base64 32)|$JWT_SECRET|" .env.local
```

#### 6. 构建项目
```bash
cd /var/www/xfinds
npm run build
```

#### 7. 启动应用
```bash
cd /var/www/xfinds
pm2 start npm --name "xfinds" -- start
pm2 save
pm2 startup
```

#### 8. 配置防火墙（如果需要）
```bash
# UFW
ufw allow 3000/tcp

# 或 firewalld
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload
```

## 配置 Nginx 反向代理（可选）

如果需要通过 80 端口访问，可以配置 Nginx：

### 1. 安装 Nginx
```bash
apt-get install -y nginx
```

### 2. 创建配置文件
```bash
nano /etc/nginx/sites-available/xfinds
```

复制 `nginx.conf` 文件的内容到配置文件中。

### 3. 启用站点
```bash
ln -s /etc/nginx/sites-available/xfinds /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 常用管理命令

### PM2 命令
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs xfinds

# 重启应用
pm2 restart xfinds

# 停止应用
pm2 stop xfinds

# 删除应用
pm2 delete xfinds
```

### 更新代码

#### 方式一：使用 GitHub 部署脚本（推荐）
```bash
/root/deploy-from-github.sh
```

#### 方式二：手动更新
```bash
cd /var/www/xfinds
git pull origin main
npm install
npm run build
pm2 restart xfinds
```

## 访问应用

部署完成后，可以通过以下地址访问：
- **直接访问**: http://154.21.200.177:3000
- **通过 Nginx**: http://154.21.200.177（如果配置了 Nginx）

## 故障排查

### 应用无法启动
1. 检查日志：`pm2 logs xfinds`
2. 检查端口是否被占用：`netstat -tulpn | grep 3000`
3. 检查环境变量：`cat /var/www/xfinds/.env.local`

### 构建失败
1. 检查 Node.js 版本：`node -v`（需要 18+）
2. 清除缓存：`rm -rf .next node_modules && npm install`
3. 检查磁盘空间：`df -h`

### 无法访问
1. 检查防火墙：`ufw status` 或 `firewall-cmd --list-all`
2. 检查 PM2 状态：`pm2 status`
3. 检查端口监听：`netstat -tulpn | grep 3000`

## 安全建议

1. **更改默认密码**：部署后立即更改 root 密码
2. **配置 SSH 密钥**：使用密钥认证替代密码登录
3. **设置防火墙规则**：只开放必要的端口
4. **定期更新**：保持系统和依赖包更新
5. **备份数据**：定期备份重要数据

## 支持

如有问题，请检查：
- PM2 日志：`pm2 logs xfinds`
- Nginx 日志：`/var/log/nginx/xfinds-error.log`
- 系统日志：`journalctl -u nginx` 或 `dmesg`

