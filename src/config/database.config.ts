export default (): Record<string, any> => ({
  databaseUrl: process.env.DATABASE_CONNECTION || 'mongodb://localhost:27017',
  databaseName: process.env.DATABASE_DB_NAME || 'nest-base',
})
