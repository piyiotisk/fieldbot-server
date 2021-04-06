const companiesRepository = require('./companiesRepository');
const knex = require('../knex/knex');

clearDatabase = async () => {
    await knex('users')
        .delete();
    await knex('companies')
        .delete();
    await knex('customers')
        .delete();
};

describe('companiesRepository', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        // Closing the DB connection allows Jest to exit successfully.
        await knex.destroy();
    });

    it('should save a company', async () => {
        const company = {
            name: 'company-name',
            email: 'test@fieldbot.io'
        };

        const actualCompanySaved = await companiesRepository.save(company);

        const expectedCompanySaved = {
            id: actualCompanySaved.id,
            name: 'company-name',
            email: 'test@fieldbot.io'
        };
        expect(actualCompanySaved).toEqual(expectedCompanySaved);
    });

    it('should update company details based on company id', async () => {
        const company = {
            name: 'company-name',
            email: 'test@fieldbot.io'
        };
        const savedCompany = await companiesRepository.save(company);
        const updatedCompany = {
            id: savedCompany.id,
            name: 'updated-company-name',
            email: 'test@fieldbot.io'
        };

        const actualUpdateCompany = await companiesRepository.update(updatedCompany);

        expect(actualUpdateCompany).toEqual(updatedCompany);
    });

    it('should throw error updating company details when company does not exist', async () => {
        const company = {
            name: 'company-name',
            email: 'test@fieldbot.io'
        };
        const savedCompany = await companiesRepository.save(company);
        const updatedCompany = {
            id: savedCompany.id + 1,
            name: 'updated-company-name',
            email: 'test@fieldbot.io'
        };

        try {
            await companiesRepository.update(updatedCompany);
        } catch (err) {
            expect(err.message).toEqual(`Updating company with id:${updatedCompany.id} failed`);
        }
    });

    it('should find a company based on company id', async () => {
        const company = {
            name: 'company-name',
            email: 'test@fieldbot.io'
        };
        const savedCompany = await companiesRepository.save(company);

        const actualCompany = await companiesRepository.findCompanyById(savedCompany.id);

        expect(actualCompany).toEqual(savedCompany);
    });

    it('should throw error updating company details when company does not exist', async () => {
        const company = {
            name: 'company-name',
            email: 'test@fieldbot.io'
        };
        const savedCompany = await companiesRepository.save(company);

        try {
            await companiesRepository.findCompanyById(savedCompany.id + 1);
        } catch (err) {
            expect(err.message).toEqual(`Finding company with id:${savedCompany.id + 1} failed`);
        }
    });

    it('should delete a company based on company id', async () => {
        const company = {
            name: 'company-name',
            email: 'test@fieldbot.io'
        };
        const savedCompany = await companiesRepository.save(company);

        const actualDeletedCompany = await companiesRepository.deleteCompanyById(savedCompany.id);

        expect(actualDeletedCompany).toEqual(savedCompany);
    });

    it('should throw error deleting a company when company does not exist', async () => {
        const company = {
            name: 'company-name',
            email: 'test@fieldbot.io'
        };
        const savedCompany = await companiesRepository.save(company);

        try {
            await companiesRepository.deleteCompanyById(savedCompany.id + 1);
        } catch (err) {
            expect(err.message).toEqual(`Deleting company with id:${savedCompany.id + 1} failed`);
        }
    });
});