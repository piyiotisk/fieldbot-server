exports.up = (knex) => {

    return knex.schema.createTable('invoices', (t) => {
        t.uuid('id').primary();
        t.integer('fk_job_id').unsigned();
        t.foreign('fk_job_id').references('jobs.id');
        t.timestamps(false, true);
        t.string('custom_invoice_id');
        t.boolean('tax_included').defaultTo(false);
        t.decimal('tax_rate', 5, 2).defaultTo(0.00);
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('invoices');
};
