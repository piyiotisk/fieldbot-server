const emailService = require('./emailService');

jest.mock('nodemailer');
const nodemailer = require('nodemailer');

const expectedEmail = {
    from: '"fieldbot 🤖" <verify@fieldbot.io>', // sender address
    to: 'test@example.com',
    subject: 'Please confirm your account at fieldbot.io', // Subject line
    html:
        `<p>Thank you for signing up for <b>fieldbot.io</b>` +
        `</p> Please confirm your email <a href="http://localhost:3000/verify/?emailVerificationToken=token"` +
        `target="_blank">here.</a>` // html body
}

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'user',
        pass: 'pass'
    }
});

describe('emailService', () => {
    describe('.send()', () => {

        it('sends an email with the correct configuration', async () => {
            // TODO

            expect(true).toBe(true);
        });

    })
})
