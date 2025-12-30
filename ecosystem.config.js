// PM2 Ecosystem Configuration
// For production deployment with auto-restart and health monitoring

module.exports = {
  apps: [
    {
      name: 'xfinds',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      
      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Restart strategy
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
}

