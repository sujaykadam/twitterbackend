// Update with your config settings.

const {knexSnakeCaseMappers} = require("objection");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: '8823',
      database: 'twitterdb',
      user:     'sujaykadam',
      password: 'pass',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    ...knexSnakeCaseMappers,
  }

};
