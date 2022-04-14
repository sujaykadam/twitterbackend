/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.alterTable('user', (table) => {
        table.unique('username')
    })
    .createTable('tweets', (table) => {
        table.increments();
        table.string('username').references('user.username');
        table.string('tweet').notNullable();
        table.timestamps(true,true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('tweets');
};
