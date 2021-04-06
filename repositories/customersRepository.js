const knex = require('../knex/knex');

const mapDBCustomerToCustomer = (dbCustomer) => {
    const { id, firstname: firstName, lastname: lastName, email, phone, address, fk_company_id: companyId, ...rest } = dbCustomer;
    return { id, firstName, lastName, email, phone, address, companyId };
}

const save = async (customer) => {
    const { firstName, lastName, email, phone, address, companyId } = customer;

    return await knex('customers')
        .insert({
            createdAt: new Date(),
            firstname: firstName.toLowerCase(),
            lastname: lastName.toLowerCase(),
            email: email ? email.toLowerCase() : undefined,
            phone: phone.toLowerCase(),
            address,
            fk_company_id: companyId,
        })
        .returning('*')
        .then((res) => {
            return mapDBCustomerToCustomer(res[0]);
        })
        .catch((err) => {
            console.log(err);
            throw err
        });
};

const findCustomerById = async (id, companyId) => {
    return await knex('customers')
        .where('id', '=', id)
        .andWhere('fk_company_id', '=', companyId)
        .then((res) => mapDBCustomerToCustomer(res[0]))
        .catch((err) => {
            throw Error(`Finding customer with id:${id} failed`);
        });
};

const findCustomersByCompanyId = async (id, offset, limit) => {
    return await knex('customers')
        .where('fk_company_id', '=', id)
        .offset(offset)
        .limit(limit)
        .then((res) => res.map((dbCustomer) => mapDBCustomerToCustomer(dbCustomer)))
        .catch((err) => {
            throw Error(`Finding customer with companyId: ${id} failed`);
        });
};

const countCustomersByCompanyId = async (id, offset, limit) => {
    return await knex('customers')
        .where('fk_company_id', '=', id)
        .count('*')
        .then(res => parseInt(res[0].count))
        .catch((err) => {
            throw Error(`Counting customer with companyId: ${id} failed`);
        });
};

const update = async (customer) => {
    const { id, firstName, email, lastName, phone, address } = customer;

    return await knex('customers')
        .where('id', '=', id)
        .update({
            updatedAt: new Date(),
            firstname: firstName.toLowerCase(),
            lastname: lastName.toLowerCase(),
            email: email ? email.toLowerCase() : '',
            phone: phone.toLowerCase(),
            address,
        })
        .returning('*')
        .then((res) => {
            return mapDBCustomerToCustomer(res[0]);
        })
        .catch((err) => {
            console.log(err);
            throw err
        });
};

const deleteCustomer = async (id) => {
    return await knex('customers')
        .where('id', '=', id)
        .del()
        .catch((err) => {
            throw Error(`Deleting customer with id:${id} failed`);
        });
};


const searchCustomersByCompanyId = async (searchTerm, companyId) => {
    const subQuery1 =
        knex.raw(`
        (SELECT 
            id,
            firstname || ' ' || 
            lastname || ' ' ||
            phone || ' ' ||
            coalesce(email, ' ') as document
        FROM 
            customers 
        WHERE
            fk_company_id = ? 
        GROUP BY
            id) p_search`
            , [companyId]);

    const subQuery2 =
        knex('customers')
            .select('id')
            .from(subQuery1)
            .where('p_search.document', 'LIKE', `%${searchTerm.toLowerCase()}%`)
            .limit(10);

    const query =
        knex('customers')
            .select('*')
            .where('id', 'IN', subQuery2)
            .limit(10);

    return await
        query
            .then((res) => res.map((dbCustomer) => mapDBCustomerToCustomer(dbCustomer)))
            .catch((err) => {
                throw Error(`Searching failed ${err.message}`);
            });
};

module.exports = { save, findCustomerById, findCustomersByCompanyId, countCustomersByCompanyId, update, deleteCustomer, searchCustomersByCompanyId }
