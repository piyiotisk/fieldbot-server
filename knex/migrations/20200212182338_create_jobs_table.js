exports.up = (knex) => {
    return knex.schema.createTable('jobs', (t) => {
        t.increments('id').unsigned().primary();
        t.dateTime('createdAt').notNull();
        t.dateTime('updatedAt').nullable();
        t.dateTime('deletedAt').nullable();
        t.string('name').notNull();
        t.text('description').nullable();
        t.string('status').nullable();
        t.json('address').nullable();
        t.decimal('amount').nullable();
        t.decimal('amount_paid').nullable();
        t.string('external_invoice_id').nullable();
        t.integer('fk_company_id').unsigned();
        t.foreign('fk_company_id').references('companies.id');
        t.integer('fk_user_ud').unsigned().nullable();
        t.foreign('fk_user_ud').references('users.id');
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('jobs');
};
