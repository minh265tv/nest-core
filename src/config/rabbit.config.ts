export default (): Record<string, any> => ({
  rabbitHost: process.env.RABBIT_HOST || 'localhost',
  rabbitPort: parseInt(process.env.RABBIT_PORT) || 5672,
  rabbitUser: process.env.RABBIT_USER || '',
  rabbitPass: process.env.RABBIT_PASS || '',
  rabbitVhost: process.env.RABBIT_VHOST || '',
});
