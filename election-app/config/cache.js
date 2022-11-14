module.exports = {
  // Redis 配置信息
  port: process.env.REDIS_PORT || 6379, // 端口
  host: process.env.REDIS_HOST || '127.0.0.1', // 主机
};
