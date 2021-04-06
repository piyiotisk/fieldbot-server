const productionEmail = require('./resetPasswordProduction')

describe('productionEmail', () => {
    it('should return a production email template', async () => {
        const email = 'john.doe@email.com';
        const token = 'fake-token';

        const expectedProductionEmail = {
            from: '"fieldbot 🤖" <reset-password@mail.fieldbot.io>', // sender address
            to: email,
            subject: 'Reset fieldbot.io user password', // Subject line
            html:
                `</p> Please click the link to reset your password <a href="https://fieldbot.io/login/update-password/${token}"` +
                `target="_blank">here.</a>` // html body
        };

        const actualProductionEmail = productionEmail(email, token);

        expect(expectedProductionEmail).toEqual(actualProductionEmail);
    });
});