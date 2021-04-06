const customersRepository = require('./customersRepository');
const knex = require('../knex/knex');

clearDatabase = async () => {
    await knex('users').delete();
    await knex('customers').delete();
    await knex('companies').delete();
};

describe('customersRepository', () => {
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

    describe('.save', () => {
        it('should save a customer', async () => {
            // create a company first 
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const actualSavedCustomer = await customersRepository.save(customer);

            const expectedCustomerSaved = {
                id: actualSavedCustomer.id,
                firstName: 'john',
                lastName: 'doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            expect(actualSavedCustomer).toEqual(expectedCustomerSaved);
        });

        it('should save a customer with empty email property', async () => {
            // create a company first 
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer = {
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const actualSavedCustomer = await customersRepository.save(customer);

            const expectedCustomerSaved = {
                id: actualSavedCustomer.id,
                firstName: 'john',
                lastName: 'doe',
                email: null,
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            expect(actualSavedCustomer).toEqual(expectedCustomerSaved);
        });
    });

    describe('.findCustomerById', () => {
        it('should find a customer by id', async () => {
            // create a company first 
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const savedCustomer = await customersRepository.save(customer);
            const actualCustomerFound = await customersRepository.findCustomerById(savedCustomer.id, 1);

            const expectedCustomer = {
                id: actualCustomerFound.id,
                firstName: 'john',
                lastName: 'doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            expect(actualCustomerFound).toEqual(expectedCustomer);
        });

        it('should throw an error if the companyId does not match the user with the specified id', async () => {
            // create a company first 
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const savedCustomer = await customersRepository.save(customer);
            try {
                await customersRepository.findCustomerById(savedCustomer.id, 2);
            } catch (err) {
                expect(err.message).toEqual(`Finding customer with id:${savedCustomer.id} failed`);
            }
        });
    });

    describe('.findCustomersByCompanyId', () => {
        it('should return a list of customers that have the specified company id', async () => {
            // create a company first
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (2, \'company-name\', current_timestamp);');

            const customer1 = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const customer2 = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@email.com',
                phone: '+44 (0) 5555555',
                address: {
                    street: 'Fake Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N2 3HG'
                },
                companyId: 2
            };

            const c1 = await customersRepository.save(customer1);
            await customersRepository.save(customer2);

            const actualCustomers = await customersRepository.findCustomersByCompanyId(1, 0, 10);

            expect(actualCustomers).toEqual([{
                ...customer1,
                id: c1.id,
                firstName: customer1.firstName.toLowerCase(),
                lastName: customer1.lastName.toLowerCase()
            }]);
        });

        it('should return an empty list when customers are not found for a company', async () => {
            // create a company first
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer1 = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            await customersRepository.save(customer1);

            const actualCustomers = await customersRepository.findCustomersByCompanyId(2, 0, 10);

            expect(actualCustomers).toEqual([]);
        });
    });

    describe('.countCustomersByCompanyId', () => {
        it('should return the number of customers that have the specified company id', async () => {
            // create a company first
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer1 = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const customer2 = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@email.com',
                phone: '+44 (0) 5555555',
                address: {
                    street: 'Fake Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N2 3HG'
                },
                companyId: 1
            };

            await customersRepository.save(customer1);
            await customersRepository.save(customer2);

            const actualNumberOfCustomers = await customersRepository.countCustomersByCompanyId(1);

            expect(actualNumberOfCustomers).toEqual(2);
        });

        it('should return 0 when customers are not found for a company', async () => {
            // create a company first
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const actualNumberOfCustomers = await customersRepository.countCustomersByCompanyId(1);

            expect(actualNumberOfCustomers).toEqual(0);
        });
    });

    describe('.update', () => {
        it('should update a customer', async () => {
            // create a company first 
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');
            // create a customer
            await knex.raw('INSERT INTO customers (id, "createdAt", firstname, lastname, phone, address, fk_company_id) VALUES (1, current_timestamp, \'first-name\', \'last-name\', \'99991234\', \'{}\', 1);');

            const customer = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                // companyId should not change
                companyId: 10
            };

            const expectedUpdatedCustomer = {
                id: 1,
                firstName: 'john',
                lastName: 'doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const actualUpdatedCustomer = await customersRepository.update(customer);

            expect(expectedUpdatedCustomer).toEqual(actualUpdatedCustomer);
        });
    });

    describe('.delete', () => {
        it('should delete a customer', async () => {
            // create a company first 
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');
            // create a customer
            await knex.raw('INSERT INTO customers (id, "createdAt", firstname, lastname, phone, address, fk_company_id) VALUES (1, current_timestamp, \'first-name\', \'last-name\', \'99991234\', \'{}\', 1);');

            const customer = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const actualUpdatedCustomer = await customersRepository.deleteCustomer(customer.id);

            expect(actualUpdatedCustomer).toEqual(1);
        });
    });

    describe('.searchCustomersByCompanyId', () => {
        it('should return the id of customers that belong to the company and match the search query', async () => {
            // create a company first
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer1 = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const customer2 = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@email.com',
                phone: '+44 (0) 5555555',
                address: {
                    street: 'Fake Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N2 3HG'
                },
                companyId: 1
            };

            await customersRepository.save(customer1);
            await customersRepository.save(customer2);

            const result = await customersRepository.searchCustomersByCompanyId('j', 1);

            expect(result.length).toEqual(2);
        });

        it('should return the id of customers that belong to the company and match the search query', async () => {
            // create a company first
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const customer1 = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1
            };

            const customer2 = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@email.com',
                phone: '+44 (0) 5555555',
                address: {
                    street: 'Fake Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N2 3HG'
                },
                companyId: 1
            };

            await customersRepository.save(customer1);
            await customersRepository.save(customer2);

            const result = await customersRepository.searchCustomersByCompanyId('Jane', 1);

            expect(result.length).toEqual(1);
        });

        it('should return 0 when customers are not found for a company', async () => {
            // create a company first
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            const result = await customersRepository.searchCustomersByCompanyId('Jane', 1);

            expect(result.length).toEqual(0);
        });
    });
});
