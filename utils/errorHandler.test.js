const { handleError } = require('./errorHandler');

const res = {
    status: jest.fn(() => {
        return {
            json: jest.fn(),
        }
    }),
    sendStatus: jest.fn(),
};

describe('handleError', () => {
    it('tests handleError() returns 401 with the message provided', () => {
        const error = Error();
        error.status = 401;

        handleError(error, res);

        expect(res.status).toBeCalledWith(401);
    });

    it('tests handleError() returns 403 with the message provided', () => {
        const error = Error();
        error.status = 403;

        handleError(error, res);

        expect(res.status).toBeCalledWith(403);
    });

    it('tests handleError() returns 404 with the message provided', () => {
        const error = Error();
        error.status = 404;

        handleError(error, res);

        expect(res.status).toBeCalledWith(404);
    });

    it('tests handleError() returns 500 with the message provided', () => {
        const error = Error();
        error.status = 500;

        handleError(error, res);

        expect(res.status).toBeCalledWith(500);
    });

    it('tests handleError() returns 500 for unknown error statuses', () => {
        const error = Error();

        handleError(error, res);

        expect(res.status).toBeCalledWith(500);
    });

});