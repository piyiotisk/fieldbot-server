const verifyEmailService = require('./verifyEmailService');

jest.mock('../repositories/userRepository');
const userRepository = require('../repositories/userRepository');

jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

describe('.verify()', () => {

    it('calls userRepository with the correct email address', async () => {
        const userRepositoryMock = userRepository.verify.mockImplementation(() => undefined);
        jwt.verify.mockImplementation(() => { return { payload: { email: 'user@example.com' } } });

        await verifyEmailService.verify({ emailVerificationToken: '' });

        expect(userRepositoryMock).toBeCalledWith('user@example.com');
    });

    it('throws error if the jwt is expired', async () => {
        userRepository.verify.mockImplementation(() => undefined);
        jwt.verify.mockImplementation(() => { throw new Error('Token expired') });

        try {
            await verifyEmailService.verify({ emailVerificationToken: '' });
        } catch (err) {
            expect(err).toStrictEqual(new Error('Verification process failed'));
        }
    });

    it('throws error if query is empty', async () => {
        userRepository.verify.mockImplementation(() => undefined);

        try {
            await verifyEmailService.verify(undefined);
        } catch (err) {
            expect(err).toStrictEqual(new Error('Verification process failed'));
        }
    });
})
