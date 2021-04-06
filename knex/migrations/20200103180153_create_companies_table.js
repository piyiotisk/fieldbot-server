exports.up = (knex) => {
    return knex.schema
        .createTable('companies', (t) => {
            t.increments('id').unsigned().primary();
            t.string('name').notNull();
            t.dateTime('createdAt').notNull();
            t.dateTime('updatedAt').nullable();
            t.dateTime('deletedAt').nullable();
        })
        // We have to add this here so the companies table is created before the foreign key
        .alterTable('users', (t) => {
            t.foreign('fk_company_id').references('companies.id');
        });
};

exports.down = (knex) => {
    return knex.schema.dropTable('companies');
};
