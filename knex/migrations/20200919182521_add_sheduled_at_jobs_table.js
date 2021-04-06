exports.up = (knex) => {
    return knex.schema.alterTable('jobs', (t) => {
        t.datetime('scheduled_at').nullable();
    });
};

exports.down = (knex) => {
    return knex.schema.table('jobs', (t) => {
        t.dropColumn('scheduled_at');
    });
};