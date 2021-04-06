const signupService = require('./signupService');

jest.mock('../validators/signupValidator');
const isReqValid = require('../validators/signupValidator');

jest.mock('../repositories/userRepository');
const userRepository = require('../repositories/userRepository');

jest.mock('./emailService/emailService');
const emailService = require('./emailService/emailService');

jest.mock('../services/emailService/emailTemplates/verifyEmailProduction');
const email = require('../services/emailService/emailTemplates/verifyEmailProduction');

const req = {
    body: {
        email: 'john@example.com',
        fullname: 'John Doe',
        password: 'password'
    }
}

const expectedUser = {
    id: 3,
    createdAt: '2019-08-25T16:27:45.887Z',
    updatedAt: null,
    deletedAt: null,
    email: 'user@gmail.com',
    password:
        '$2b$10$81mzMc6mYiOA0v5v5g7IFe0Apn4mNHBQlINJ7px180/yGTP40rT0C',
    fullname: 'John Snow'
}

describe('signupService', () => {
    beforeEach(() => {
        emailService.send.mockImplementation(() => Promise.resolve({
            accepted: ['user11@example.com'],
            rejected: [],
            envelopeTime: 23,
            messageTime: 117,
            messageSize: 686,
            response:
                '250 Accepted [STATUS=new MSGID=XXqpkhN-8SuKPWLOXX4s-CAaGyvGqoe-AAAADZQGlTdKCpzB7.RCM9hX6GA]',
            envelope: { from: 'verify@fieldbot.io', to: ['user11@example.com'] },
            messageId: '<5bfbd5c2-c0d4-0f15-e59c-0c6784bf21c9@fieldbot.io>'
        }));
    })

    describe('.signup()', () => {

        it('returns the newly created user', async () => {
            isReqValid.mockReturnValue(true);
            userRepository.getUserByEmail.mockImplementation(() => undefined);
            userRepository.save.mockImplementation(() => expectedUser);

            const actualUser = await signupService.signup(req);

            expect(actualUser).toBe(expectedUser);
        });

        it('throws error when validation fails', async () => {
            isReqValid.mockReturnValue(false);

            try {
                await signupService.signup(req);
            } catch (err) {
                expect(err).toStrictEqual(new Error('Validation failed'));
            }
        });

        it.only('throws error when database did not saved user', async () => {
            isReqValid.mockReturnValue(true);
            userRepository.getUserByEmail.mockImplementation(() => undefined);
            userRepository.save.mockImplementation(() => undefined);
            email.mockImplementation(() => undefined);

            try {
                await signupService.signup(req);
            } catch (err) {
                expect(err).toStrictEqual(new Error('Cannot save user to the database'));
            }
        });

        it('throws error when user already exists', async () => {
            isReqValid.mockReturnValue(true);
            userRepository.getUserByEmail.mockImplementation(() => expectedUser);
            userRepository.save.mockImplementation(() => undefined);

            try {
                await signupService.signup(req);
            } catch (err) {
                expect(err).toStrictEqual(new Error('User already exists'));
            }
        });
    })
})
