const Joi = require('joi');

const isReqValidForLogin = (req) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().trim().min(3).max(30).required(),
    });
    const dataToValidate = req.body;
    const result = Joi.validate(dataToValidate, schema);

    if (result.error) {
        return false;
    }
    return true;
}

const isReqValidForResetPassword = (req) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
    });
    const dataToValidate = req.body;
    const result = Joi.validate(dataToValidate, schema);

    if (result.error) {
        return false;
    }
    return true;
}

module.exports = { isReqValidForLogin, isReqValidForResetPassword };