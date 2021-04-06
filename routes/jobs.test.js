const request = require('supertest')
const app = require('../app')

jest.mock('../services/jobsService');
const jobsService = require('../services/jobsService');

jest.mock('../middleware/authorization');
const authorization = require('../middleware/authorization');

describe('/jobs', () => {
    describe('POST /jobs', () => {
        it('should return 201 when job is saved', async () => {
            authorization.auth.mockImplementation((req, res, next) => next());
            const expectedJob = {
                id: 1510,
                name: 'Job 1',
                description: 'Description of the job',
                status: 'PENDING',
                address: {},
                companyId: 3094,
                userId: 49,
                customerId: 2117,
                images: {
                    keys: []
                },
                tags: [
                    'tag-1',
                    'tag-2'
                ]
            }

            jobsService.save.mockImplementation(() => Promise.resolve(expectedJob));

            const res = await request(app)
                .post('/jobs')
                .set('Accept', 'application/json')
                .send({});

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ job: expectedJob });
        });
    });

    describe('GET /jobs/customer/:id', () => {
        it('should return the jobs for a customer with id', async () => {
            const expectedJobs = [
                {
                    id: 1510,
                    name: 'Job 1',
                    description: 'Description of the job',
                    status: 'PENDING',
                    address: {},
                    companyId: 3094,
                    userId: 49,
                    customerId: 2117,
                    images: {
                        keys: []
                    },
                    tags: [
                        'tag-1',
                        'tag-2'
                    ]
                }
            ];

            authorization.auth.mockImplementation((req, res, next) => next());
            jobsService.findJobsByCustomer.mockImplementation(() => Promise.resolve(expectedJobs));

            const res = await request(app)
                .get('/jobs/customer/2117')
                .set('Accept', 'application/json');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ jobs: expectedJobs });
        });
    });

    describe('PUT /jobs/:id', () => {
        it('should return 200 when job is updated', async () => {
            authorization.auth.mockImplementation((req, res, next) => next());
            const expectedJob = {
                id: 1510,
                name: 'Job 1 updated',
                description: 'Description of the job',
                status: 'PENDING',
                address: {},
                companyId: 3094,
                userId: 49,
                customerId: 2117,
                images: {
                    keys: []
                },
                tags: [
                    'tag-1',
                    'tag-2'
                ]
            }

            jobsService.update.mockImplementation(() => Promise.resolve(expectedJob));

            const res = await request(app)
                .put(`/jobs/${expectedJob.id}`)
                .set('Accept', 'application/json')
                .send({});

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ job: expectedJob });
        });
    });

    describe('DELETE /jobs/:id', () => {
        it('should return 204 when job is deleted', async () => {
            const jobId = 2;

            authorization.auth.mockImplementation((req, res, next) => next());

            jobsService.deleteJobById.mockImplementation(() => Promise.resolve());

            const res = await request(app)
                .delete(`/jobs/${jobId}`)
                .set('Accept', 'application/json')
                .send({});

            expect(res.statusCode).toEqual(204);
            expect(res.body).toEqual({});
            expect(authorization.auth).toHaveBeenCalled();
            expect(jobsService.deleteJobById).toHaveBeenCalledTimes(1);
        })
    });

    describe('GET /jobs/:id', () => {
        it('should return the job with the same id', async () => {
            const jobId = 1510;

            const expectedJob = {
                id: jobId,
                name: 'Job 1',
                description: 'Description of the job',
                status: 'PENDING',
                address: {},
                companyId: 3094,
                userId: 49,
                customerId: 2117,
                images: {
                    keys: []
                },
                tags: [
                    'tag-1',
                    'tag-2'
                ]
            }

            authorization.auth.mockImplementation((req, res, next) => next());

            jobsService.findJobById.mockImplementation(() => Promise.resolve(expectedJob))

            const res = await request(app)
                .get(`/jobs/${jobId}`)
                .set('Accept', 'application/json')
                .send({});

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ job: expectedJob });
        })
    })
});