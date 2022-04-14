/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.alterTable('user', (table) => {
        table.string('fname').notNullable();
        table.string('lname');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('user', (table) => {
        table.dropColumn('fname');
        table.dropColumn('lname');
    })
}