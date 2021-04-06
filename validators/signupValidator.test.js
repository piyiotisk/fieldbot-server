const isReqValid = require('./signupValidator');

describe('.loginValidator', () => {
    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isReqValid({
            body: {
                email: 'test@example.com',
                fullname: 'John Doe',
                password: 'password.1234',
            }
        });

        expect(actualValidationResult).toBe(true);
    })

    it('returns false when password is less than 3 characters', () => {
        const actualValidationResult = isReqValid({
            body: {
                email: 'test@example.com',
                fullname: 'John Doe',
                password: '12'
            }
        });

        expect(actualValidationResult).toBe(false);
    })

    it('returns false when password is more than 30 characters', () => {
        const actualValidationResult = isReqValid({
            body: {
                email: 'test@example.com',
                fullname: 'John Doe',
                password: 'qwertyuioplkjhgfdsazxcvbn.lkhgf'
            }
        });

        expect(actualValidationResult).toBe(false);
    })

    it('returns false when email is not valid', () => {
        const actualValidationResult = isReqValid({
            body: {
                email: 'testcom',
                fullname: 'John Doe',
                password: 'password'
            }
        });

        expect(actualValidationResult).toBe(false);
    })

    it('returns false when email is missing', () => {
        const actualValidationResult = isReqValid({
            body: {
                fullname: 'John Doe',
                password: 'password'
            }
        });

        expect(actualValidationResult).toBe(false);
    })

    it('returns false when password is missing', () => {
        const actualValidationResult = isReqValid({
            body: {
                fullname: 'John Doe',
                email: 'testcom',
            }
        });

        expect(actualValidationResult).toBe(false);
    })

    it('returns false when fullname is missing', () => {
        const actualValidationResult = isReqValid({
            body: {
                email: 'testcom',
                password: 'password'
            }
        });

        expect(actualValidationResult).toBe(false);
    })
})