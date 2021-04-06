const developmentEmail = (user, emailVerificationToken) => ({
    from: '"fieldbot 🤖" <verify@fieldbot.io>', // sender address
    to: user.email,
    subject: 'Please confirm your account at fieldbot.io', // Subject line
    html:
        `<p>Thank you for signing up for <b>fieldbot.io</b>` +
        `</p> Please confirm your email <a href="http://localhost:3000/verify/?emailVerificationToken=${emailVerificationToken}"` +
        `target="_blank">here.</a>` // html body
})

module.exports = developmentEmail;