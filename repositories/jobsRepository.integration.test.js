const jobsRepository = require('./jobsRepository');
const knex = require('../knex/knex');

jest.mock('../utils/s3Util');
const s3Util = require('../utils/s3Util');


clearDatabase = async () => {
    await knex('companies')
        .delete();
    await knex('users')
        .delete();
    await knex('jobs_tags')
        .delete();
    await knex('tags')
        .delete();
    await knex('jobs')
        .delete();
    await knex('customers')
        .delete();
};

describe('jobsRepository', () => {
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
        it('should save a job with tags', async () => {
            const job = {
                name: 'job-name',
                tags: ['tag-1', 'tag-2']
            };

            const actualJobSaved = await jobsRepository.save(job);

            const expectedJobSaved = {
                id: actualJobSaved.id,
                name: 'job-name',
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: null,
                images: undefined,
                tags: ['tag-1', 'tag-2']
            };

            expect(actualJobSaved).toEqual(expectedJobSaved);

            const tags = await jobsRepository.findTagsByJobId(actualJobSaved.id);
        });
    });

    describe('.update', () => {
        xit('should update a job', async () => {
            const job = {
                id: 1,
                name: 'job-name',
            };

            // insert a job to the db
            await knex.raw(`INSERT INTO jobs (id, name, "createdAt") VALUES (${job.id}, \'${job.name}\', current_timestamp);`);

            const actualUpdatedJob = await jobsRepository.update({ id: job.id, name: 'job-updated-name' });

            const expectedUpdatedJob = {
                id: actualUpdatedJob.id,
                name: 'job-updated-name',
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: null,
                images: undefined,
                tags: null
            };

            expect(actualUpdatedJob).toEqual(expectedUpdatedJob);
        });

        xit('should update tags in a job', async () => {
            const job = {
                name: 'job-name',
                tags: ['tag-1', 'tag-2']
            };

            const savedJob = await jobsRepository.save(job);

            const actualUpdatedJob = await jobsRepository.update({ id: savedJob.id, tags: ['tag-1-updated'] });

            const expectedUpdatedJob = {
                id: actualUpdatedJob.id,
                name: 'job-name',
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: null,
                images: undefined,
                tags: ['tag-1-updated']
            };

            expect(actualUpdatedJob).toEqual(expectedUpdatedJob);
        });
    });

    describe('.findJobById', () => {
        it('should find a job by its id', async () => {
            const job = {
                id: 1,
                name: 'job-name',
            };

            // insert a job to the db
            await knex.raw(`INSERT INTO jobs (id, name, "createdAt") VALUES (${job.id}, \'${job.name}\', current_timestamp);`);

            const actualJobFound = await jobsRepository.findJobById(1);

            const expectedJobFound = {
                id: job.id,
                name: job.name,
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: null,
                images: undefined,
                tags: null
            };

            expect(actualJobFound).toEqual(expectedJobFound);
        });

        it('should find a job with tags by its id', async () => {
            const job = {
                name: 'job-name',
                tags: ['tag-1', 'tag-2']
            };

            const savedJob = await jobsRepository.save(job);
            const actualJobFound = await jobsRepository.findJobById(savedJob.id);

            const expectedJobFound = {
                id: savedJob.id,
                name: job.name,
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: null,
                images: undefined,
                tags: ['tag-1', 'tag-2']
            };

            expect(actualJobFound).toEqual(expectedJobFound);
        });

        it('should return a job with same id and signed url for images', async () => {
            const key1 = 'key-1';
            const job = {
                id: 1,
                name: 'job-name',
                images: {
                    keys: [key1],
                }
            };

            // insert a job to the db
            await knex.raw(`INSERT INTO jobs (id, name, "createdAt", images) VALUES (${job.id}, \'${job.name}\', current_timestamp, \'${JSON.stringify(job.images)}\');`);

            s3Util.getSignedUrl.mockImplementation(() => 'signed-url-1');

            const actualJobFound = await jobsRepository.findJobById(1);

            const expectedJobFound = {
                id: job.id,
                name: job.name,
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: null,
                images: [{ key: key1, signedUrl: 'signed-url-1' }],
                tags: null
            };

            expect(actualJobFound).toEqual(expectedJobFound);
        });
    });

    describe('.findJobsByCustomer', () => {
        it('should find all the jobs for a customer', async () => {
            const job1 = {
                id: 1,
                name: 'job-name-1',
                customerId: 1,
            };

            const job2 = {
                id: 2,
                name: 'job-name-2',
                customerId: 1,
            };

            // create a company 
            await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');

            // create customer
            await knex.raw(`INSERT INTO customers (id, firstname, lastname, "createdAt") VALUES (1, \'John\', \'Doe\', current_timestamp);`);

            // insert two job to the db that belong to the same customer
            await knex.raw(`INSERT INTO jobs (id, name, "createdAt", fk_customer_id) VALUES (${job1.id}, \'${job1.name}\', current_timestamp, ${job1.customerId});`);
            await knex.raw(`INSERT INTO jobs (id, name, "createdAt", fk_customer_id) VALUES (${job2.id}, \'${job2.name}\', current_timestamp, ${job2.customerId});`);

            const actualJobsFound = await jobsRepository.findJobsByCustomer(1);

            const expectedJobsFound = [{
                id: job1.id,
                name: job1.name,
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: job1.customerId,
                images: undefined,
                tags: null
            }, {
                id: job2.id,
                name: job2.name,
                scheduledAt: null,
                description: null,
                status: null,
                address: null,
                companyId: null,
                updatedAt: null,
                userId: null,
                customerId: job2.customerId,
                images: undefined,
                tags: null
            }]

            expect(actualJobsFound).toEqual(expectedJobsFound);
        });
    });

    describe('.delete', () => {
        it('should delete a job by its id', async () => {
            const job = {
                name: 'job-name',
            };

            const savedJob = await jobsRepository.save(job);

            const numberOfDeletedRows = await jobsRepository.deleteJob(savedJob.id);

            expect(numberOfDeletedRows).toEqual(1);
        });
    });
});
