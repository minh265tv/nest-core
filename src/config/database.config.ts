export default (): Record<string, any> => ({
  databaseServers: process.env.DB_SERVERS || 'localhost:27017',
  databaseName: process.env.DB || 'auth',
  databaseUser: process.env.DB_USER || '',
  databasePassword: process.env.DB_PASSWORD || '',
  databaseReplica: process.env.DB_REPLS || '',
  databaseAuthSource: process.env.DB_AUTH_SOURCE || '',
});
