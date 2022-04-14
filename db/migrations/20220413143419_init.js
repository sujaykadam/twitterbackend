/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('following', (table) => {
        table.increments();
        table.string('username').references('user.username');
        table.string('follows');
        table.timestamps(true,true)
    }).createTable('followers', (table) => {
        table.increments();
        table.string('username').references('user.username');
        table.string('follower');
        table.timestamps(true,true)
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('following')
    .dropTableIfExists('following');
};
