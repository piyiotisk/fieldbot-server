const request = require('supertest')
const app = require('../app')

jest.mock('../services/loginService');
const loginService = require('../services/loginService');

describe('/login', () => {
    describe('/', () => {
        it('should return 200 with auth token', async () => {
            const token = "mocked-token";
            loginService.login.mockImplementation(() => Promise.resolve(token));

            const validRequest = {
                "email": "john.doe@email.com",
                "password": "1234"
            };

            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send(validRequest);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ authorization: token });
        });

        it('should return 401 when req is invalid', async () => {
            loginService.login.mockImplementation(() => {
                const error = Error();
                error.status = 401;
                throw error;
            });

            const invalidRequest = {};

            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send(invalidRequest);

            expect(res.statusCode).toEqual(401);
        });

        it('should return 403 when req does not pass validation', async () => {
            loginService.login.mockImplementation(() => {
                const error = Error();
                error.status = 403;
                throw error;
            });

            const invalidRequest = {
                "email": "john.doe",
                "password": "1234"
            };

            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send(invalidRequest);

            expect(res.statusCode).toEqual(403);
        });

        it('should return 404 when user does not exist', async () => {
            loginService.login.mockImplementation(() => {
                const error = Error();
                error.status = 404;
                throw error;
            });

            const invalidRequest = {
                "email": "john.doe@email.com",
                "password": "1234"
            };

            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send(invalidRequest);

            expect(res.statusCode).toEqual(404);
        });

        it('should return 500 for every other error', async () => {
            loginService.login.mockImplementation(() => {
                const error = Error();
                error.status = 500;
                throw error;
            });

            const invalidRequest = {};

            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send(invalidRequest);

            expect(res.statusCode).toEqual(500);
        });
    });

    describe('/reset-password', () => {
        it('should return 200', async () => {
            loginService.resetPassword.mockImplementation(() => Promise.resolve());

            const validRequest = {
                "email": "john.doe@email.com",
            };

            const res = await request(app)
                .post('/login/reset-password')
                .set('Accept', 'application/json')
                .send(validRequest);

            expect(res.statusCode).toEqual(200);
        });

        it('should return 403 when req does not pass validation', async () => {
            loginService.resetPassword.mockImplementation(() => {
                const error = Error();
                error.status = 403;
                throw error;
            });

            const invalidRequest = {
                "email": "john.doe",
            };

            const res = await request(app)
                .post('/login/reset-password')
                .set('Accept', 'application/json')
                .send(invalidRequest);

            expect(res.statusCode).toEqual(403);
        });

        it('should return 500 for every other error', async () => {
            loginService.resetPassword.mockImplementation(() => {
                const error = Error();
                error.status = 500;
                throw error;
            });

            const invalidRequest = {};

            const res = await request(app)
                .post('/login/reset-password')
                .set('Accept', 'application/json')
                .send(invalidRequest);

            expect(res.statusCode).toEqual(500);
        });
    });

    describe('/update-password', () => {
        it('should return 200', async () => {
            loginService.updatePassword.mockImplementation(() => Promise.resolve());

            const validRequest = {
                "password": "password-cleartext",
                "token": "jwt-token"
            };

            const res = await request(app)
                .put('/login/update-password')
                .set('Accept', 'application/json')
                .send(validRequest);

            expect(res.statusCode).toEqual(200);
        });

        it('should return 500 for every other error', async () => {
            loginService.updatePassword.mockImplementation(() => {
                const error = Error();
                error.status = 500;
                throw error;
            });

            const invalidRequest = {};

            const res = await request(app)
                .put('/login/update-password')
                .set('Accept', 'application/json')
                .send(invalidRequest);

            expect(res.statusCode).toEqual(500);
        });
    });
});
