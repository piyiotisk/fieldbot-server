const companiesRepository = require('../repositories/companiesRepository');
const userRepository = require('../repositories/userRepository');

const save = async (req) => {
    // TODO: joi validation
    const company = req.body;
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id } = user;

    if (fk_company_id) {
        const error = Error('User has already a company');
        error.status = 409;
        throw error;
    }

    const savedCompany = await companiesRepository.save(company);
    const { userEmail } = req;
    const userToUpdate = {
        email: userEmail,
        fk_company_id: savedCompany.id,
    }
    // TODO: try catch here. if it fails roll back transaction that saved the company
    await userRepository.update(userToUpdate);
    return savedCompany;
}

const update = async (req) => {
    // TODO: joi validation
    const company = req.body;
    const user = await userRepository.getUserByEmail(req.userEmail);

    if (!user) {
        const error = Error('User not found');
        error.status = 500;
        throw error;
    }

    const { fk_company_id } = user;
    // allow updates only for a company that a user owns
    if (fk_company_id !== company.id) {
        const error = Error(`Company with id: ${company.id} cannot be updated`);
        error.status = 401;
        throw error;
    };

    return await companiesRepository.update(company);
}

// TODO: delete a company


const getCompanyByUser = async (req) => {
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

        return await companiesRepository.findCompanyById(fk_company_id);
    } catch (err) {
        throw err;
    }
}

module.exports = { getCompanyByUser, save, update };