const jwt = require('jsonwebtoken');
const config = require('config');

const JWTSecret = config.get('jwt.secret');

const auth = async (req, res, next) => {
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
        try {
            let { authorization } = req.headers;
            authorization = authorization.replace(/['"]+/g, '');
            const { payload } = await jwt.verify(authorization, JWTSecret);
            const { email, emailConfirmed } = payload.user;

            if (!emailConfirmed) {
                throw Error('Unconfirmed Email');
            }

            req.userEmail = email;
        } catch (err) {
            return res.status(401).json({
                error: {
                    msg: 'Failed to authenticate token!'
                }
            });
        }
    } else {
        return res.status(401).json({
            error: {
                msg: 'No token!'
            }
        });
    }
    next();
    return;
}

module.exports = { auth };