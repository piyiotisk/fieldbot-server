const jwt = require('jsonwebtoken');
const config = require('config');

const JWTSecret = config.get('jwt.secret');

const createJWT = (payload, options) => {

    if (payload === undefined || payload === null) {
        throw Error('No payload is provided');
    }

    const jwtDefaultOptions = {
        expiresIn: '7d',
        issuer: 'fieldbot-server'
    };

    const jwtOptions = options || jwtDefaultOptions;

    try {
        return jwt.sign({ payload }, JWTSecret, jwtOptions);
    } catch (err) {
        throw Error('Creating JWT failed');
    }
}

module.exports = { createJWT }