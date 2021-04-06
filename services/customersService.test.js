const customersService = require('./customersService');

jest.mock('../repositories/userRepository');
const userRepository = require('../repositories/userRepository');

jest.mock('../repositories/customersRepository');
const customersRepository = require('../repositories/customersRepository');

jest.mock('../validators/customersValidation');
const { isCustomerValid } = require('../validators/customersValidation');
const { isCustomerToBeUpdatedValid } = require('../validators/customersValidation');


describe("companiesService", () => {
    beforeEach(() => {
        isCustomerValid.mockImplementation(() => true);
        isCustomerToBeUpdatedValid.mockImplementation(() => true);
    });

    describe(".save", () => {
        it("should save a customer", async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 1,
                emailConfirmed: false
            }
            userRepository.getUserByEmail.mockImplementation(() => user);

            const expectedCustomer = {
                firstName: 'John',
                lastName: 'Doe',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
            };

            const req = {
                body: expectedCustomer
            }

            customersRepository.save.mockImplementation(() => expectedCustomer);

            const actualCustomer = await customersService.save(req);

            expect(actualCustomer).toEqual(expectedCustomer);
        });


        it("should throw error when fk_company_id does not exists", async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: null,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => user);

            try {
                await customersService.save({});
            } catch (err) {
                expect(err.message).toEqual('User does not have a company');
                expect(err.status).toEqual(400);
            }
        });
    });

    describe(".findCustomerById", () => {
        it("should find a customer with the specified id and that belongs to the user making the request", async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 1,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(user));

            const expectedCustomers = [{
                firstName: 'John',
                lastName: 'Doe',
                email: 'email@e.com',
                phone: '1234',
                address: {},
                companyId: 1,
            }];

            customersRepository.findCustomerById.mockImplementation(() => Promise.resolve(expectedCustomers));

            const actualCustomers = await customersService.findCustomerById({ params: { id: 1 } });

            expect(actualCustomers).toEqual(expectedCustomers);
        });

        it("should throw an error when user does not exist", async () => {
            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(undefined));
            try {
                await customersService.findCustomersByCompanyId({
                    query: {
                        page: 1,
                        limit: 10,
                    }
                });
            } catch (err) {
                expect(err.message).toEqual('User not found');
                expect(err.status).toEqual(500);
            }
        });
    });

    describe(".countCustomersByCompanyId", () => {
        it("should return number of customer with the specified company id", async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 1,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(user));


            customersRepository.countCustomersByCompanyId.mockImplementation(() => Promise.resolve(1));

            const actualNumberOfCustomers = await customersService.countCustomersByCompanyId(user.fk_company_id);

            expect(actualNumberOfCustomers).toEqual(1);
        });
    });

    describe(".getCustomersByCompanyId", () => {
        it("should get the customers of a company with specified id", async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 1,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(user));

            const expectedCustomers = [{
                firstName: 'John',
                lastName: 'Doe',
                phone: '1234',
                address: {},
                companyId: 1,
            }];

            customersRepository.findCustomersByCompanyId.mockImplementation(() => Promise.resolve(expectedCustomers));

            const actualCustomers = await customersService.findCustomersByCompanyId({
                query: {
                    page: 1,
                    limit: 10,
                }
            });

            expect(actualCustomers).toEqual(expectedCustomers);
        });

        it("should throw an error when user does not exist", async () => {
            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(undefined));
            try {
                await customersService.findCustomersByCompanyId({
                    query: {
                        page: 1,
                        limit: 10,
                    }
                });
            } catch (err) {
                expect(err.message).toEqual('User not found');
                expect(err.status).toEqual(500);
            }
        });
    });

    describe(".update", () => {
        it('should update a customer', async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 1,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(user));

            const expectedCustomer = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1,
            };

            const req = {
                body: expectedCustomer
            }

            customersRepository.findCustomersByCompanyId.mockImplementation(() => [expectedCustomer]);
            customersRepository.update.mockImplementation(() => expectedCustomer);

            const actualCustomer = await customersService.update(req, expectedCustomer.id);

            expect(actualCustomer).toEqual(expectedCustomer);
        });

        it('should throw an error when request does not pass validation', async () => {
            const expectedCustomer = {
                // missing the id property
                firstName: 'John',
                lastName: 'Doe',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1,
            };

            const req = {
                body: expectedCustomer
            }

            isCustomerToBeUpdatedValid.mockImplementation(() => false);


            try {
                await customersService.update(req, 1);
            } catch (err) {
                expect(err.message).toEqual('Customer to be updated does not pass validation');
                expect(err.status).toEqual(400);
            }
        });

        it('should throw an error when fk_company_id in req does not much user companyId', async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                // this is different than the companyId in the customer req.body
                fk_company_id: 2,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(user));

            const expectedCustomer = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1,
            };

            const req = {
                body: expectedCustomer
            }
            customersRepository.findCustomersByCompanyId.mockImplementation(() => [expectedCustomer]);
            customersRepository.update.mockImplementation(() => expectedCustomer);

            try {
                await customersService.update(req, expectedCustomer.id);
            } catch (err) {
                expect(err.message).toEqual('Company ID does not much user company ID');
                expect(err.status).toEqual(409);
            }
        });
    });

    describe(".delete", () => {
        it('should delete a customer', async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 1,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(user));

            const expectedCustomer = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 1,
            };

            const req = {}

            customersRepository.findCustomersByCompanyId.mockImplementation(() => [expectedCustomer]);
            customersRepository.deleteCustomer.mockImplementation(() => 1);

            const deleteCustomer = await customersService.deleteCustomer(req, expectedCustomer.id);

            expect(true).toEqual(deleteCustomer);
        });

        it('should throw an error when the customer does not belong to the company of the current user', async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 1,
                emailConfirmed: false
            }

            userRepository.getUserByEmail.mockImplementation(() => Promise.resolve(user));

            const customer = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                phone: '+44 (0) 1234566',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
                companyId: 2,
            };

            const req = {}
            customersRepository.findCustomersByCompanyId.mockImplementation(() => [customer]);
            // customersRepository.deleteCustomer.mockImplementation(() => 1);

            try {
                await customersService.deleteCustomer(req, customer.id);
            } catch (err) {
                expect(err.message).toEqual(`The customer with id: ${customer.id} does not belong to the company of the current user`);
                expect(err.status).toEqual(409);
            }
        });
    });
});