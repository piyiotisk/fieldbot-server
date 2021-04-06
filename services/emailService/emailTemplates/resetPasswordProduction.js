const productionEmail = (email, token) => ({
    from: '"fieldbot 🤖" <reset-password@mail.fieldbot.io>', // sender address
    to: email,
    subject: 'Reset fieldbot.io user password', // Subject line
    html:
        `</p> Please click the link to reset your password <a href="https://fieldbot.io/login/update-password/${token}"` +
        `target="_blank">here.</a>` // html body
});

module.exports = productionEmail;