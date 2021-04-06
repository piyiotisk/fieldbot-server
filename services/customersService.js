const customersRepository = require('../repositories/customersRepository');
const userRepository = require('../repositories/userRepository');
const { isCustomerValid, isCustomerToBeUpdatedValid } = require('../validators/customersValidation');

const save = async (req) => {
    if (!isCustomerValid(req)) {
        const error = Error('Customer object does not pass validation');
        error.status = 400;
        throw error;
    }

    const customer = req.body;
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id } = user;

    if (!fk_company_id) {
        const error = Error('User does not have a company');
        error.status = 400;
        throw error;
    }

    // TODO: check if customer already exist
    const customerToSave = {
        ...customer,
        email: customer.email === '' ? null : customer.email,
        companyId: fk_company_id
    }

    return await customersRepository.save(customerToSave);
}

const findCustomerById = async (req) => {
    try {
        const user = await userRepository.getUserByEmail(req.userEmail);

        if (!user) {
            const error = Error('User not found');
            error.status = 500;
            throw error;
        }

        const { fk_company_id } = user;

        if (!fk_company_id) {
            const error = Error('Company does not exist');
            error.status = 500;
            throw error;
        }

        const id = parseInt(req.params.id);

        return await customersRepository.findCustomerById(id, fk_company_id)
    } catch (err) {
        throw err;
    }
}

const findCustomersByCompanyId = async (req) => {
    try {
        const user = await userRepository.getUserByEmail(req.userEmail);

        if (!user) {
            const error = Error('User not found');
            error.status = 500;
            throw error;
        }

        const { fk_company_id } = user;

        if (!fk_company_id) {
            const error = Error('Company does not exist, please create a new company');
            error.status = 404;
            throw error;
        }

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const offset = (page - 1) * limit

        return await customersRepository.findCustomersByCompanyId(fk_company_id, offset, limit);
    } catch (err) {
        throw err;
    }
}

const countCustomersByCompanyId = async (req) => {
    try {
        const user = await userRepository.getUserByEmail(req.userEmail);

        if (!user) {
            const error = Error('User not found');
            error.status = 500;
            throw error;
        }

        const { fk_company_id } = user;

        if (!fk_company_id) {
            const error = Error('Company does not exist, please create a new company');
            error.status = 404;
            throw error;
        }

        return await customersRepository.countCustomersByCompanyId(fk_company_id);
    } catch (err) {
        throw err;
    }
}


const update = async (req, id) => {
    if (!isCustomerToBeUpdatedValid(req)) {
        const error = Error('Customer to be updated does not pass validation');
        error.status = 400;
        throw error;
    }
    // TODO: check if customer exists

    const user = await userRepository.getUserByEmail(req.userEmail);

    if (!user) {
        const error = Error('User not found');
        error.status = 500;
        throw error;
    }

    const { fk_company_id } = user;

    if (!fk_company_id) {
        const error = Error('Company does not exist');
        error.status = 500;
        throw error;
    }

    const customer = req.body;
    customer.id = id;
    const customerToUpdate = {
        ...customer,
        email: customer.email === '' ? null : customer.email,
        companyId: fk_company_id
    }


    const customersForCompany = await customersRepository.findCustomersByCompanyId(fk_company_id);
    const allowUpdate = customersForCompany.find((cr) => cr.id === customer.id);
    if (allowUpdate === undefined) {
        const error = Error('Company ID does not much user company ID');
        error.status = 409;
        throw error;
    }

    return await customersRepository.update(customerToUpdate);
}

const deleteCustomer = async (req, id) => {
    const user = await userRepository.getUserByEmail(req.userEmail);

    if (!user) {
        const error = Error('User not found');
        error.status = 500;
        throw error;
    }

    const { fk_company_id } = user;

    if (!fk_company_id) {
        const error = Error('Company does not exist');
        error.status = 500;
        throw error;
    }

    const customersForCompany = await customersRepository.findCustomersByCompanyId(fk_company_id);
    const allowDelete = customersForCompany.find((cr) => cr.companyId === fk_company_id);

    if (allowDelete === undefined) {
        const error = Error(`The customer with id: ${id} does not belong to the company of the current user`);
        error.status = 409;
        throw error;
    }

    const result = await customersRepository.deleteCustomer(id);
    if (result !== 1) {
        // TODO: revert the transaction
        const error = Error('Deleting customer went wrong');
        error.status = 500;
        throw error;
    }
    return true;
}


const searchCustomersByCompanyId = async (req) => {
    const searchTerm = req.params.searchTerm;
    if (searchTerm === undefined || searchTerm === null) {
        return [];
    }

    const user = await userRepository.getUserByEmail(req.userEmail);

    if (!user) {
        const error = Error('User not found');
        error.status = 500;
        throw error;
    }

    const { fk_company_id } = user;

    if (!fk_company_id) {
        const error = Error('Company does not exist');
        error.status = 500;
        throw error;
    }

    const result = await customersRepository.searchCustomersByCompanyId(searchTerm, fk_company_id);
    return result;
}

module.exports = { save, findCustomerById, findCustomersByCompanyId, countCustomersByCompanyId, update, deleteCustomer, searchCustomersByCompanyId }