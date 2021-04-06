const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: 'api-key',
        domain: 'domain'
    }
}

const productionTransporter = nodemailer.createTransport(mg(auth));

const developmentTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'user',
        pass: 'pass'
    }
});

getTransporter = () => {
    const environment = process.env.ENVIRONMENT || 'development';

    if (environment === 'development') {
        return developmentTransporter;
    }

    return productionTransporter;
}

send = async (email) => {
    const transporter = getTransporter();
    const info = await transporter.sendMail(email);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = { send }