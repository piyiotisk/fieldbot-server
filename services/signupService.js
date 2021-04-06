const { createJWT } = require('../utils/createJWT');
const userRepository = require('../repositories/userRepository');
const isReqValid = require('../validators/signupValidator');
const emailService = require('../services/emailService/emailService');
const email = require('../services/emailService/emailTemplates/verifyEmailProduction');

const jwtOptions = {
    expiresIn: '1h',
    issuer: 'fieldbot-server'
};

const signup = async (req) => {
    if (!isReqValid) {
        throw new Error('Validation failed');
    }

    const isUserAlreadyExists = await userRepository.getUserByEmail(req.body.email.toLowerCase());
    if (isUserAlreadyExists) {
        throw new Error('User already exists');
    }

    const user = await userRepository.save(req.body);

    if (!user) {
        throw new Error('Cannot save user to the database');
    }

    emailVerificationToken = createJWT({ email: user.email }, jwtOptions)
    await emailService.send(email(user, emailVerificationToken));

    return user;
}

module.exports = { signup };