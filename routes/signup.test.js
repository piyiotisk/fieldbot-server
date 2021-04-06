const request = require('supertest')
const app = require('../app')

jest.mock('../services/signupService');
const signupService = require('../services/signupService');

describe('/login', () => {
    describe('/', () => {
        it('should return 200', async () => {
            const user = {
                "fullname": "John Doe",
                "email": "john.doe@email.com",
                "password": "1234",
            };

            signupService.signup.mockImplementation(() => Promise.resolve(user));

            const validRequest = {
                "fullname": "John Doe",
                "email": "john.doe@email.com",
                "password": "1234",
            };

            const res = await request(app)
                .post('/signup')
                .set('Accept', 'application/json')
                .send(validRequest);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(user);
        });

        it('should return 409 when user already exists', async () => {
            const user = {
                "fullname": "John Doe",
                "email": "john.doe@email.com",
                "password": "1234",
            };

            const errorMessage = "User already exists";

            signupService.signup.mockImplementation(() => {
                const error = Error(errorMessage);
                throw error;
            });

            const validRequest = {
                "fullname": "John Doe",
                "email": "john.doe@email.com",
                "password": "1234",
            };

            const res = await request(app)
                .post('/signup')
                .set('Accept', 'application/json')
                .send(validRequest);

            expect(res.statusCode).toEqual(409);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });
});