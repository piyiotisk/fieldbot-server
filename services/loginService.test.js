const loginService = require('./loginService');

jest.mock('../validators/loginValidator');
const { isReqValidForLogin } = require('../validators/loginValidator');

jest.mock('../repositories/userRepository');
const userRepository = require('../repositories/userRepository');

jest.mock('bcrypt');
const bcrypt = require('bcrypt');

jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

const req = {
    body: {
        email: 'test@example.com',
        password: 'password.1234'
    }
}

const expectedUser = {
    id: 3,
    createdAt: '2019-08-25T16:27:45.887Z',
    updatedAt: null,
    deletedAt: null,
    email: 'user@gmail.com',
    emailConfirmed: true,
    password:
        '$2b$10$81mzMc6mYiOA0v5v5g7IFe0Apn4mNHBQlINJ7px180/yGTP40rT0C',
    fullname: 'John Snow'
}

const expectedUserWithUnconfirmedEmail = {
    id: 3,
    createdAt: '2019-08-25T16:27:45.887Z',
    updatedAt: null,
    deletedAt: null,
    email: 'user@gmail.com',
    emailConfirmed: false,
    password:
        '$2b$10$81mzMc6mYiOA0v5v5g7IFe0Apn4mNHBQlINJ7px180/yGTP40rT0C',
    fullname: 'John Snow'
}

const expectedToken = 'expected-token';

describe('loginService', () => {
    describe('.login()', () => {

        it('returns token when the user exists and the validation passes', async () => {
            isReqValidForLogin.mockReturnValue(true);
            bcrypt.compare.mockImplementation(() => Promise.resolve(true));
            userRepository.getUserByEmail.mockImplementation(() => expectedUser);
            jwt.sign.mockImplementation(() => expectedToken);

            const actualToken = await loginService.login(req);

            expect(actualToken).toBe(expectedToken);
        });

        it('throws error when the password is incorrect', async () => {
            isReqValidForLogin.mockReturnValue(true);
            bcrypt.compare.mockImplementation(() => Promise.resolve(false));
            userRepository.getUserByEmail.mockImplementation(() => expectedUser);
            jwt.sign.mockImplementation(() => expectedToken);

            try {
                await loginService.login(req);
            } catch (err) {
                expect(err).toStrictEqual(Error('Incorrect password'));
            }
        });

        it('throws error when validation fails', async () => {
            isReqValidForLogin.mockReturnValue(false);
            bcrypt.compare.mockImplementation(() => Promise.resolve(false));
            userRepository.getUserByEmail.mockImplementation(() => expectedUser);
            jwt.sign.mockImplementation(() => expectedToken);

            try {
                await loginService.login(req);
            } catch (err) {
                expect(err).toStrictEqual(Error('Email or password do not pass validation'));
            }
        });

        it('throws error when user does not exist', async () => {
            isReqValidForLogin.mockReturnValue(true);
            userRepository.getUserByEmail.mockImplementation(() => undefined);

            try {
                await loginService.login(req);
            } catch (err) {
                expect(err).toStrictEqual(Error('User does not exist'));
            }
        });

        it('throws error when user exist but email is not confirmed', async () => {
            isReqValidForLogin.mockReturnValue(true);
            userRepository.getUserByEmail.mockImplementation(() => expectedUserWithUnconfirmedEmail);

            try {
                await loginService.login(req);
            } catch (err) {
                expect(err).toStrictEqual(Error('User has not verified email'));
            }
        });

    })
})
