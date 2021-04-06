exports.up = (knex, Promise) => {
    return knex.schema.alterTable('jobs', (t) => {
        t.dropForeign('fk_user_ud');
        t.dropColumn('fk_user_ud');
        t.integer('fk_user_id').unsigned().nullable();
        t.foreign('fk_user_id').references('users.id');
        t.integer('fk_customer_id').unsigned().nullable();
        t.foreign('fk_customer_id').references('customers.id');
        t.json('images').nullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.table('jobs', (t) => {
        t.integer('fk_user_ud').unsigned().nullable();
        t.foreign('fk_user_ud').references('users.id');
        t.dropForeign('fk_user_id');
        t.dropColumn('fk_user_id');
        t.dropForeign('fk_customer_id');
        t.dropColumn('fk_customer_id');
        t.dropColumn('images');
    });
};