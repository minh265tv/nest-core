export default (): Record<string, any> => ({
  hostRedis: process.env.REDIS_HOST || 'localhost',
  portRedis: parseInt(process.env.REDIS_PORT) || 6379,
  passRedis: process.env.REDIS_PASSWORD || null,
  prefixRedis: process.env.REDIS_PREFIX || 'auth:',
  dbRedis: parseInt(process.env.REDIS_DB) || 0,
  sentinelRedis: process.env.REDIS_SENTINEL,
  nameClusterRedis: process.env.REDIS_CLUSTER_NAME || null,
  passClusterRedis: process.env.REDIS_CLUSTER_PASSWORD || null,
});
