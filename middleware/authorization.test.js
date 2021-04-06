const { auth } = require('./authorization');

jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

const req = {
    headers: {
        authorization: 'jwt_token'
    }
};

const invalidReq = {};

const res = {
    status: jest.fn(() => {
        return {
            json: jest.fn(),
        }
    })
};

const next = jest.fn();

const expectedToken = {
    payload: {
        user: {
            email: 'johndoe@email.com',
            emailConfirmed: true,
        }
    }
}

const expectedTokenWithUnconfirmedEmail = {
    payload: {
        user: {
            email: 'johndoe@email.com',
            emailConfirmed: false,
        }
    }
}

describe('auth', () => {
    it('authentication succeeds', async () => {
        jwt.verify.mockImplementation(() => expectedToken);

        await auth(req, res, next);

        expect(req.userEmail).toBe('johndoe@email.com');
    });

    it('returns 401 status code when jwt fails to verify', async () => {
        jwt.verify.mockImplementation(() => undefined);

        await auth(req, res, next);

        expect(res.status).toBeCalledWith(401);
    });

    it('throws error when user email is unconfirmed', async () => {
        jwt.verify.mockImplementation(() => expectedTokenWithUnconfirmedEmail);

        await auth(req, res, next);

        expect(res.status).toBeCalledWith(401);
    });

    it('throws error when jwt does not exist in the request header', async () => {
        jwt.verify.mockImplementation(() => { });

        await auth(invalidReq, res, next);

        expect(res.status).toBeCalledWith(401);
    });
});
