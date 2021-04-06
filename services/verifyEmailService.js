const jwt = require('jsonwebtoken');
const config = require('config');

const userRepository = require('../repositories/userRepository');

const JWTSecret = config.get('jwt.secret');

const verify = async (query) => {
    try {
        const { emailVerificationToken } = query;
        const { payload } = jwt.verify(emailVerificationToken, JWTSecret);
        const { email } = payload;
        return await userRepository.verify(email);
    } catch (err) {
        throw new Error('Verification process failed');
    }
}

module.exports = { verify }