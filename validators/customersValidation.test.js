const { isCustomerValid, isCustomerToBeUpdatedValid } = require('./customersValidation');

describe('.isCustomerValid', () => {
    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isCustomerValid({
            body: {
                firstName: 'John',
                lastName: 'Doe',
                phone: '99967876',
                address: {},
            }
        });

        expect(actualValidationResult).toBe(true);
    });

    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isCustomerValid({
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '99967876',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
            }
        });

        expect(actualValidationResult).toBe(true);
    });

    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isCustomerValid({
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                phone: '99967876',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
            }
        });

        expect(actualValidationResult).toBe(true);
    });

    it('returns false when the body of the request is valid', () => {
        const actualValidationResult = isCustomerValid({
            body: {
                firstName: 'Jo',
                lastName: 'Doe',
                phone: '99967876',
                address: {},
            }
        });

        expect(actualValidationResult).toBe(false);
    });
});

describe('.isCustomerToBeUpdatedValid', () => {
    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isCustomerToBeUpdatedValid({
            body: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                phone: '99967876',
                address: {},
            }
        });

        expect(actualValidationResult).toBe(true);
    });

    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isCustomerToBeUpdatedValid({
            body: {
                id: 100,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '99967876',
                address: {
                    street: 'Devan Grove',
                    city: 'London',
                    state: '',
                    country: 'UK',
                    postCode: 'N4 2GS'
                },
            }
        });

        expect(actualValidationResult).toBe(true);
    });

    it('returns false when the body of the request is valid', () => {
        // is missing the id property
        const actualValidationResult = isCustomerToBeUpdatedValid({
            body: {
                firstName: 'John',
                lastName: 'Doe',
                phone: '99967876',
                address: {},
            }
        });

        expect(actualValidationResult).toBe(false);
    });
});

