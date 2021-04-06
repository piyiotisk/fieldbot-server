exports.up = (knex, Promise) => {
    return knex.schema.alterTable('jobs', (t) => {
        t.dropColumn('amount');
        t.dropColumn('amount_paid');
        t.dropColumn('external_invoice_id');
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.table('jobs', (t) => {
        t.decimal('amount').nullable();
        t.decimal('amount_paid').nullable();
        t.string('external_invoice_id').nullable();
    });
};