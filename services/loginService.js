const bcrypt = require('bcrypt');
const { isReqValidForLogin, isReqValidForResetPassword } = require('../validators/loginValidator');
const jwt = require('jsonwebtoken');

const userRepository = require('../repositories/userRepository');
const { createJWT } = require('../utils/createJWT');
const emailService = require('../services/emailService/emailService');
const email = require('../services/emailService/emailTemplates/resetPasswordProduction');
const config = require('config');

const JWTSecret = config.get('jwt.secret');

const login = async (req) => {
    if (!isReqValidForLogin(req)) {
        const error = Error('Email or password do not pass validation');
        error.status = 403;
        throw error;
    }

    const user = await userRepository.getUserByEmail(req.body.email.toLowerCase());

    if (!user) {
        const error = Error('User does not exist');
        error.status = 404;
        throw error;
    }

    if (!user.emailConfirmed) {
        const error = Error('User has not verified email');
        error.status = 401;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
        const error = Error('Incorrect password');
        error.status = 401;
        throw error;
    }

    return createJWT({ user });
}

const resetPassword = async (req) => {
    if (!isReqValidForResetPassword(req)) {
        const error = Error('Email do not pass validation');
        error.status = 403;
        throw error;
    }

    const { email: emailAddress } = req.body;

    const jwtOptions = {
        expiresIn: '1h',
        issuer: 'fieldbot-server'
    }
    const token = createJWT({ username: emailAddress.toLowerCase() }, jwtOptions);
    await emailService.send(email(emailAddress.toLowerCase(), token));
}

const updatePassword = async (req) => {
    try {
        const { password, token } = req.body;
        const decodedToken = await jwt.verify(token, JWTSecret);
        const { username } = decodedToken.payload.user;

        const user = await userRepository.getUserByEmail(username);
        if (!user) {
            throw new Error('User does not exist');
        }

        await userRepository.updatePassword(username, password)
    } catch (err) {
        const error = Error('Failed to update user password');
        error.status = 500;
        throw error;
    }

}

module.exports = { login, resetPassword, updatePassword }
