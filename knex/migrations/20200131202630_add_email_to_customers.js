exports.up = (knex, Promise) => {
    return knex.schema.alterTable('customers', (t) => {
        t.string('email').unique();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.table('customers', (t) => {
        t.dropColumn('email');
    });
};