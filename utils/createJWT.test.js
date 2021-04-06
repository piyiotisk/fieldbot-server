const { createJWT } = require('./createJWT');

jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

const payload = {
    "hello": "world",
};

const testSecret = 'test-secret';

describe('createJWT', () => {

    beforeEach(() => {
        jwt.sign.mockClear();
    });

    it('tests that jwt.sign has been called with the correct parameters', async () => {
        const jwtOptions = {
            expiresIn: '1d',
            issuer: 'fieldbot-server-test'
        };

        jwt.sign.mockImplementation(() => { })

        createJWT(payload, jwtOptions);

        expect(jwt.sign).toBeCalledWith({ payload }, testSecret, jwtOptions);
    });

    it('tests that jwt.sign has been called with the correct parameters when jwtOptions are not provided', async () => {
        const jwtOptions = {
            expiresIn: '7d',
            issuer: 'fieldbot-server'
        };

        jwt.sign.mockImplementation(() => { })

        createJWT(payload);

        expect(jwt.sign).toBeCalledWith({ payload }, testSecret, jwtOptions);
    });

    it('returns a valid token', async () => {
        const jwtOptions = {
            expiresIn: '7d',
            issuer: 'fieldbot-server'
        };
        const expectedToken = 'expected-token';

        jwt.sign.mockImplementation(() => expectedToken)

        const actualToken = createJWT(payload);

        expect(actualToken).toBe(expectedToken);
        expect(jwt.sign).toBeCalledWith({ payload }, testSecret, jwtOptions);
    });

    it('throws an error when payload is undefined', async () => {
        const expectedToken = 'expected-token';

        jwt.sign.mockImplementation(() => expectedToken)

        try {
            createJWT(undefined);
        } catch (err) {
            expect(err).toStrictEqual(Error('No payload is provided'));
            expect(jwt.sign).toHaveBeenCalledTimes(0);
        }
    });

    it('throws an error when payload is null', async () => {
        const expectedToken = 'expected-token';

        jwt.sign.mockImplementation(() => expectedToken)

        try {
            createJWT(null);
        } catch (err) {
            expect(err).toStrictEqual(Error('No payload is provided'));
            expect(jwt.sign).toHaveBeenCalledTimes(0);
        }
    });

    it('throws an error when JWT throws an error', async () => {
        jwt.sign.mockImplementation(() => {
            throw new Error();
        });

        try {
            createJWT(payload);
        } catch (err) {
            expect(err).toStrictEqual(Error('Creating JWT failed'));
            expect(jwt.sign).toHaveBeenCalledTimes(1);
        }
    });
});