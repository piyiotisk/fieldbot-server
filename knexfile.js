module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      database: 'fieldbot',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    }
  },

  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      database: 'fieldbot',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      database: 'fieldbot',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    }
  }

};