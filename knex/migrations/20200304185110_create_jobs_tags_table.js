exports.up = (knex) => {
    return knex.schema.createTable('jobs_tags', (t) => {
        t.increments('id').unsigned().primary();
        t.integer('fk_job_id').unsigned();
        t.foreign('fk_job_id').references('jobs.id');
        t.integer('fk_tag_id').unsigned();
        t.foreign('fk_tag_id').references('tags.id');
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('jobs_tags');
};
