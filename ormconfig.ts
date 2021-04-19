export = {
  host: process.env.DATABASE_CONNECTION,
  type: 'mongodb',
  database: process.env.DATABASE_DB_NAME,
  migrations: [
    'src/database/migrations/*.ts',
  ],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
