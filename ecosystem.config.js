module.exports = {
  apps: [
    {
      name: 'prod', // pm2 start App name
      script: 'dist/src/main.js',
      exec_mode: 'cluster', // 'cluster' or 'fork'
      instance_var: 'APP_INSTANCE_ID', // instance variable
      instances: 2, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ['node_modules', 'logs'], // ignore files change
      max_memory_restart: '2G', // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: './logs/access.log', // pm2 log file
      error: './logs/error.log', // pm2 error log file
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
};
