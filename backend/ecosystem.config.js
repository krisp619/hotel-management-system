/**
 * PM2 Ecosystem Configuration
 * Production deployment for Hotel Management Backend
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'hotel-api',
      script: './server-production-verified.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: '/var/log/pm2/hotel-api-error.log',
      out_file: '/var/log/pm2/hotel-api-out.log',
      log_file: '/var/log/pm2/hotel-api-combined.log',
      time: true,
      max_memory_restart: '500M',
      watch: false, // Disable watch mode in production
      ignore_watch: ['node_modules', '.git', 'logs'],
      max_restarts: 10,
      min_uptime: '10s',
      autorestart: true,
      shutdown_with_message: true,
      listen_timeout: 3000,
      kill_timeout: 5000,
    },
  ],

  // Deploy configuration for AWS EC2
  deploy: {
    production: {
      user: 'ec2-user',
      host: '18.215.168.203',
      ref: 'origin/main',
      repo: 'https://github.com/krisp619/hotel-management-system.git',
      path: '/home/ec2-user/hotel-api',
      'post-deploy':
        'npm install && pm2 restart all',
      'env': {
        NODE_ENV: 'production',
      },
    },
  },
};
