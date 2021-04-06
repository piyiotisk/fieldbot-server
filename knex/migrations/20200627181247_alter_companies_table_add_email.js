exports.up = (knex, Promise) => {
    return knex.schema.alterTable('companies', (t) => {
        t.string('email').unique().nullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.table('companies', (t) => {
        t.dropColumn('email');
    });
};