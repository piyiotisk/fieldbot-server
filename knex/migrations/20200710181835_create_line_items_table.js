exports.up = (knex) => {
    return knex.schema.createTable('line_items', (t) => {
        t.uuid('id').primary();
        t.uuid('fk_invoice_id');
        t.foreign('fk_invoice_id').references('invoices.id');
        t.timestamps(false, true);
        t.string('name');
        t.text('description');
        t.integer('quantity').notNullable().defaultTo(0);
        t.decimal('price', 16, 2).notNullable().defaultTo(0.00);
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('line_items');
};