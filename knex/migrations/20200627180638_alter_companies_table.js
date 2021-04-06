const uuid = require('uuid');

exports.up = (knex, Promise) => {
    return knex.schema.alterTable('companies', (t) => {
        t.dropColumn('name');
    })
        .then(() => {
            return knex.schema.alterTable('companies', (t) => {
                t.string('name').notNull().defaultTo(uuid.v4());
            })
        })
};

exports.down = (knex, Promise) => {
    return knex.schema.table('companies', (t) => {
        t.dropColumn('emailConfirmed');
    });
};