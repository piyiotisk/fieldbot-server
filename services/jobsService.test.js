const jobsService = require('./jobsService');

jest.mock('../repositories/userRepository');
const userRepository = require('../repositories/userRepository');

jest.mock('../repositories/jobsRepository');
const jobsRepository = require('../repositories/jobsRepository');

jest.mock('../validators/jobsValidator');
const { isJobValid } = require('../validators/jobsValidator');


describe("jobsService", () => {
    beforeEach(() => {
        isJobValid.mockImplementation(() => true);
    });

    describe(".save", () => {
        it("should save a job", async () => {
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

            const expectedJob = {
                id: 1,
                name: 'job-1',
                description: undefined,
                status: 'PENDING',
                address: {},
                amount: undefined,
                amountPaid: undefined,
                externalInvoiceId: undefined,
                companyId: 1,
                userId: 1,
                customerId: 1,
                images: {},
                tags: null
            };

            const req = {
                body: expectedJob
            }

            jobsRepository.save.mockImplementation(() => expectedJob);

            const actualJob = await jobsService.save(req);

            expect(actualJob).toEqual(expectedJob);
        });

    });

    describe(".update", () => {
        it("should update a job", async () => {
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

            const expectedJob = {
                id: 1,
                name: 'job-1',
                description: undefined,
                status: 'PENDING',
                address: {},
                amount: undefined,
                amountPaid: undefined,
                externalInvoiceId: undefined,
                companyId: 1,
                userId: 1,
                customerId: 1,
                images: {},
                tags: null
            };

            const req = {
                params: {
                    id: 1,
                },
                body: expectedJob
            }

            jobsRepository.update.mockImplementation(() => expectedJob);

            const actualJob = await jobsService.update(req);

            expect(actualJob).toEqual(expectedJob);
        });

    });

    describe(".delete", () => {
        it("should delete a job with same id", async () => {
            const req = {
                params: {
                    id: 1,
                },
            }

            const expectedNumberOfDeletedRow = 1;

            jobsRepository.deleteJob.mockImplementation(() => expectedNumberOfDeletedRow);

            const actualNumberOfDeletedRow = await jobsService.deleteJobById(req);

            expect(actualNumberOfDeletedRow).toEqual(expectedNumberOfDeletedRow);
        })
    });

    describe(".findJobById", () => {
        it("should get job with same id", async () => {
            const req = {
                params: {
                    id: 1,
                },
            };

            const expectedJob = {
                id: 1,
                name: "job-1",
                description: undefined,
                status: "PENDING",
                address: {},
                amount: undefined,
                amountPaid: undefined,
                externalInvoiceId: undefined,
                companyId: 1,
                userId: 1,
                customerId: 1,
                images: {},
                tags: null,
            };

            jobsRepository.findJobById.mockImplementation(() => expectedJob);

            const actualJob = await jobsService.findJobById(req);

            expect(actualJob).toEqual(expectedJob);
        });
    });
});