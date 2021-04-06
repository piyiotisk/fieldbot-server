const request = require('supertest')
const app = require('../app')

jest.mock('../services/verifyEmailService');
const verifyEmailService = require('../services/verifyEmailService');

describe('/verify', () => {
    it('should redirect to the correct url', async () => {
        verifyEmailService.verify.mockImplementation(() => Promise.resolve());

        const res = await request(app)
            .get('/verify/?emailVerificationToken=fake-token');;

        expect(res.statusCode).toEqual(302);
        expect(res.header.location).toEqual('https://fieldbot.io/login');
    });

    it('should return 500 for every other error', async () => {
        verifyEmailService.verify.mockImplementation(() => {
            const error = Error();
            throw error;
        });

        const res = await request(app)
            .get('/verify/?emailVerificationToken=fake-token');;

        expect(res.statusCode).toEqual(500);
    });
});