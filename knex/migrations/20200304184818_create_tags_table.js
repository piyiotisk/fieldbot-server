exports.up = (knex) => {
    return knex.schema.createTable('tags', (t) => {
        t.increments('id').unsigned().primary();
        t.string('value').notNull();
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('tags');
};
