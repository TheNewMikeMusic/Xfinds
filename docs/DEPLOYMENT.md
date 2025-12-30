# Deployment Guide

This guide covers deploying Xfinds to a production server.

## Prerequisites

- Node.js 18+ installed
- PM2 process manager (`npm install -g pm2`)
- Nginx (recommended for reverse proxy)
- SSL certificate (Let's Encrypt recommended)

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/xfinds.git
   cd xfinds
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set the required variables:
   - `JWT_SECRET`: A secure random string (min 32 characters)
   - `NODE_ENV`: Set to `production`
   - `APP_URL`: Your production URL

4. **Build the application**
   ```bash
   npm run build
   ```

## Running in Production

### Using PM2 (Recommended)

```bash
# Start with ecosystem config
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup startup script
pm2 startup
```

### PM2 Commands

```bash
pm2 status          # Check status
pm2 logs xfinds     # View logs
pm2 restart xfinds  # Restart app
pm2 stop xfinds     # Stop app
```

## Nginx Configuration

Example Nginx configuration for reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d yourdomain.com

# Test auto-renewal
certbot renew --dry-run
```

## Updating the Application

```bash
cd /path/to/xfinds
git pull origin main
npm install
npm run build
pm2 restart xfinds
```

## Troubleshooting

### Application won't start
- Check logs: `pm2 logs xfinds`
- Verify environment variables
- Ensure port 8000 is available

### Build failures
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node.js version: `node -v`

### 502 Bad Gateway
- Check if app is running: `pm2 status`
- Verify Nginx config: `nginx -t`
- Check port binding: `netstat -tulpn | grep 8000`


