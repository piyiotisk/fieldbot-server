const { isJobValid } = require('./jobsValidator');

describe('.isJobValid', () => {
    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isJobValid({
            body: {
                name: 'Job 1',
                scheduledAt: undefined,
                description: undefined,
                status: 'PENDING',
                address: {},
                customerId: '1',
                userId: '1',
                images: {
                    keys: []
                },
                tags: ['tag-1', 'tag-2']
            }
        });

        expect(actualValidationResult).toBe(true);
    });

    it('returns true when the body of the request is valid', () => {
        const actualValidationResult = isJobValid({
            body: {
                name: 'Job 1',
                scheduledAt: "2020-09-19T15:00:12Z",
                description: undefined,
                status: 'PENDING',
                address: {},
                customerId: '1',
                userId: '1',
                images: {
                    keys: []
                },
                tags: undefined
            }
        });

        expect(actualValidationResult).toBe(true);
    });


    it('returns false when the body of the request is invalid', () => {
        const actualValidationResult = isJobValid({
            body: {
                name: 'Job 1',
                description: undefined,
                status: 'PENDING',
                address: {},
                amount: -1,
                amountPaid: undefined,
                externalInvoiceId: undefined,
            }
        });

        expect(actualValidationResult).toBe(false);
    });

});