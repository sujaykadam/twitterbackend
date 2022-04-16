/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    await knex('following').insert([
    {id: 2, username: 'sujay', follows:'sskk'}
  ]);
};
