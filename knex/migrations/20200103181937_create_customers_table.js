exports.up = (knex) => {
    return knex.schema.createTable('customers', (t) => {
        t.increments('id').unsigned().primary();
        t.dateTime('createdAt').notNull();
        t.dateTime('updatedAt').nullable();
        t.dateTime('deletedAt').nullable();
        t.string('firstname').notNull();
        t.string('lastname').notNull();
        t.string('phone').nullable();
        t.json('address').nullable();
        t.integer('fk_company_id').unsigned();
        t.foreign('fk_company_id').references('companies.id');
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('customers');
};
