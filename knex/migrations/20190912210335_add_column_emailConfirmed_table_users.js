exports.up = (knex, Promise) => {
    return knex.schema.alterTable('users', (t) => {
        t.boolean('emailConfirmed').notNull().defaultTo(false);
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.table('users', (t) => {
        t.dropColumn('emailConfirmed');
    });
};