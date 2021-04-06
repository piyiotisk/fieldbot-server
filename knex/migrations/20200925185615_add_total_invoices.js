exports.up = (knex) => {
    return knex.schema.alterTable('invoices', (t) => {
        t.decimal('total', 16, 2).notNullable().defaultTo(0.00);
    });
};

exports.down = (knex) => {
    return knex.schema.table('invoices', (t) => {
        t.dropColumn('total');
    });
};