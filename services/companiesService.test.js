const companiesService = require('./companiesService');

jest.mock('../repositories/userRepository');
const userRepository = require('../repositories/userRepository');

jest.mock('../repositories/companiesRepository');
const companiesRepository = require('../repositories/companiesRepository');

describe("companiesService", () => {
    describe(".save", () => {
        it("should save a company", async () => {
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

            const expectedCompany = { name: 'company 1', email: 'test@fieldbot.io', id: 1 }
            const req = {
                body: expectedCompany
            }

            companiesRepository.save.mockImplementation(() => expectedCompany);

            const actualCompany = await companiesService.save(req);

            expect(actualCompany).toEqual(expectedCompany);
        });


        it("should throw error when fk_company_id exists", async () => {
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
            try {
                await companiesService.save({});
            } catch (err) {
                expect(err.message).toEqual('User has already a company');
                expect(err.status).toEqual(409);
            }
        });
    });

    describe(".update", () => {
        it("should update a company", async () => {
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

            const expectedCompany = { name: 'company 1', email: 'test@fieldbot.io', id: 1 }
            companiesRepository.update.mockImplementation(() => expectedCompany);

            const req = {
                body: expectedCompany
            }

            const actualCompany = await companiesService.update(req);

            expect(actualCompany).toEqual(expectedCompany);
        });


        it("should throw error when user repository returns undefined", async () => {
            userRepository.getUserByEmail.mockImplementation(() => undefined);

            try {
                const expectedCompany = { name: 'company 1', email: 'test@fieldbot.io', id: 1 }
                const req = {
                    body: expectedCompany
                }

                companiesRepository.update.mockImplementation(() => expectedCompany);

                await companiesService.update(req);
            } catch (err) {
                expect(err.message).toEqual('User not found');
                expect(err.status).toEqual(500);
            }
        });


        it("should throw error when company id does not match the id of the company that the user owns", async () => {
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

            try {
                const expectedCompany = { name: 'company 1', email: 'test@fieldbot.io', id: 2 }
                const req = {
                    body: expectedCompany
                }

                await companiesService.update(req);
            } catch (err) {
                expect(err.message).toEqual(`Company with id: 2 cannot be updated`);
                expect(err.status).toEqual(401);
            }
        });
    });

    describe(".getCompanyByUser", () => {
        it("should return a company", async () => {
            const user = {
                id: 1,
                createdAt: '2020-01-12T11:53:52.206Z',
                updatedAt: null,
                deletedAt: null,
                email: 'john.doe@email.com',
                password: '$2b$10$XmiiAtJp1RsfFf3EWlKAPeCCGIiEzx7mbMrlTzw4M82gekfyRp0ty',
                fullname: 'John Doe',
                fk_company_id: 8,
                emailConfirmed: false
            }
            userRepository.getUserByEmail.mockImplementation(() => user);

            const expectedCompany = { name: 'company 1', email: 'test@fieldbot.io', id: 1 }
            companiesRepository.findCompanyById.mockImplementation(() => expectedCompany);

            const actualCompany = await companiesService.getCompanyByUser(user.email);

            expect(actualCompany).toEqual(expectedCompany);
        });

        it("should throw error when user repository returns undefined", async () => {
            userRepository.getUserByEmail.mockImplementation(() => undefined);
            const userEmail = 'john@email.com';

            try {
                await companiesService.getCompanyByUser(userEmail);
            } catch (err) {
                expect(err.message).toEqual('User not found');
                expect(err.status).toEqual(500);
            }
        });

        it("should throw error when user.fk_company_id is null", async () => {

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
                await companiesService.getCompanyByUser(user.email);
            } catch (err) {
                expect(err.message).toEqual('Company does not exist, please create a new company');
                expect(err.status).toEqual(404);
            }
        });

    });
});
