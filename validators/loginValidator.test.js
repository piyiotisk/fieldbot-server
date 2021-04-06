const { isReqValidForLogin, isReqValidForResetPassword } = require('./loginValidator');

describe('.isReqValidForLogin', () => {
    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isReqValidForLogin({
            body: {
                email: 'test@example.com',
                password: 'password.1234'
            }
        });

        expect(actualValidationResult).toBe(true);
    })

    it('returns false when password is less than 3 characters', () => {
        const actualValidationResult = isReqValidForLogin({
            body: {
                email: 'test@example.com',
                password: '12'
            }
        });

        expect(actualValidationResult).toBe(false);
    })

    it('returns false when password is more than 30 characters', () => {
        const actualValidationResult = isReqValidForLogin({
            body: {
                email: 'test@example.com',
                password: 'qwertyuioplkjhgfdsazxcvbn.lkhgf'
            }
        });

        expect(actualValidationResult).toBe(false);
    });

    it('returns false when email is not valid', () => {
        const actualValidationResult = isReqValidForLogin({
            body: {
                email: 'testcom',
                password: 'password'
            }
        });

        expect(actualValidationResult).toBe(false);
    });

    it('returns false when email is missing', () => {
        const actualValidationResult = isReqValidForLogin({
            body: {
                password: 'password'
            }
        });

        expect(actualValidationResult).toBe(false);
    });

    it('returns false when password is missing', () => {
        const actualValidationResult = isReqValidForLogin({
            body: {
                email: 'testcom',
            }
        });

        expect(actualValidationResult).toBe(false);
    });
});

describe('.isReqValidForResetPassword', () => {
    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isReqValidForResetPassword({
            body: {
                email: 'test@example.com',
            }
        });

        expect(actualValidationResult).toBe(true);
    });

    it('returns false when email is not valid', () => {
        const actualValidationResult = isReqValidForResetPassword({
            body: {
                email: 'testcom',
            }
        });

        expect(actualValidationResult).toBe(false);
    });

    it('returns false when email is missing', () => {
        const actualValidationResult = isReqValidForResetPassword({
            body: {
            }
        });

        expect(actualValidationResult).toBe(false);
    });
});