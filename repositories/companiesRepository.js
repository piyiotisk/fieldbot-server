const knex = require('../knex/knex');

const save = async (company) => {
    const { name, email } = company;

    return await knex('companies')
        .insert({
            createdAt: new Date(),
            name: name.toLowerCase(),
            email: email ? email.toLowerCase() : null
        })
        .returning('*')
        .then((res) => {
            const { name, id, email, ...rest } = res[0];
            return { name, email, id };
        })
        .catch((err) => { console.log(err); throw err });
};

const update = async (company) => {
    const { id, name, email } = company;

    return await knex('companies')
        .where('id', '=', id)
        .update({
            updatedAt: new Date(),
            name: name.toLowerCase(),
            email: email ? email.toLowerCase() : null
        })
        .returning('*')
        .then((res) => {
            const { name, id, email, ...rest } = res[0];
            return { name, email, id };
        })
        .catch((err) => {
            throw Error(`Updating company with id:${id} failed`);
        });
};

const findCompanyById = async (id) => {
    return await knex('companies')
        .where('id', '=', id)
        .then((res) => {
            const { name, id, email, ...rest } = res[0];
            return { name, email, id };
        })
        .catch((err) => {
            throw Error(`Finding company with id:${id} failed`);
        });
};

const deleteCompanyById = async (id) => {
    return await knex('companies')
        .where('id', '=', id)
        .update({
            deletedAt: new Date(),
        })
        .returning('*')
        .then((res) => {
            const { name, id, email, ...rest } = res[0];
            return { name, email, id };
        })
        .catch((err) => {
            throw Error(`Deleting company with id:${id} failed`);
        });
};


module.exports = { save, update, findCompanyById, deleteCompanyById }
