const productionEmail = require('./verifyEmailProduction')

describe('productionEmail', () => {
    it('should return a production email template', async () => {
        const user = {
            email: 'john.doe@email.com',
        };
        const emailVerificationToken = 'fake-token';

        const expectedProductionEmail = {
            from: '"fieldbot 🤖" <verify@mail.fieldbot.io>', // sender address
            to: user.email,
            subject: 'Please confirm your account at fieldbot.io', // Subject line
            html:
                `<p>Thank you for signing up for <b>fieldbot.io</b>` +
                `</p> Please confirm your email <a href="https://api.fieldbot.io/verify/?emailVerificationToken=${emailVerificationToken}"` +
                `target="_blank">here.</a>` // html body
        };

        const actualProductionEmail = productionEmail(user, emailVerificationToken);

        expect(expectedProductionEmail).toEqual(actualProductionEmail);
    });
});