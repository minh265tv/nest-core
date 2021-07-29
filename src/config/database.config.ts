export default (): Record<string, any> => ({
  databaseUri: process.env.DATABASE_CONNECTION || 'mongodb://localhost:27017'
})
