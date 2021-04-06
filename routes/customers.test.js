const request = require('supertest')
const app = require('../app')

jest.mock('../services/customersService');
const customersService = require('../services/customersService');

jest.mock('../middleware/authorization');
const authorization = require('../middleware/authorization');

describe('/customers', () => {
    describe('POST /customers', () => {
        it('should return 201 when customer is saved', async () => {
            authorization.auth.mockImplementation((req, res, next) => next());
            customersService.save.mockImplementation(() => Promise.resolve({ firstName: 'john' }));

            const res = await request(app)
                .post('/customers')
                .set('Accept', 'application/json')
                .send({});

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ customer: { firstName: 'john' } });
        });
    });

    describe('GET /customers', () => {
        it('should return customers that the a company has', async () => {
            const customers = [{ firstName: 'john' }];

            authorization.auth.mockImplementation((req, res, next) => next());
            customersService.findCustomersByCompanyId.mockImplementation(() => Promise.resolve(customers));

            const res = await request(app)
                .get('/customers')
                .set('Accept', 'application/json');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ customers });
        });
    });

    describe('GET /customers/:id', () => {
        it('should return customer with id', async () => {
            const customer = { id: 1, firstName: 'john' };

            authorization.auth.mockImplementation((req, res, next) => next());
            customersService.findCustomerById.mockImplementation(() => Promise.resolve(customer));

            const res = await request(app)
                .get('/customers/1')
                .set('Accept', 'application/json');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ customer });
        });
    });

    describe('PUT /customers/:id', () => {
        it('should return 200 when a customer is updated', async () => {
            const customer = { firstName: 'john' };

            authorization.auth.mockImplementation((req, res, next) => next());
            customersService.update.mockImplementation(() => Promise.resolve(customer));

            const res = await request(app)
                .put('/customers/1')
                .set('Accept', 'application/json');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ customer: { firstName: 'john' } });
        });
    });

    describe('DELETE /customers/:id', () => {
        it('should return 200 when a customer is deleted', async () => {
            authorization.auth.mockImplementation((req, res, next) => next());
            customersService.deleteCustomer.mockImplementation(() => Promise.resolve(true));

            const res = await request(app)
                .delete('/customers/1')
                .set('Accept', 'application/json');

            expect(res.statusCode).toEqual(200);
        });
    });
});