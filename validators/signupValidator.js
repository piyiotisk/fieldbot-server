const Joi = require('joi');

const isReqValid = (req) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        fullname: Joi.string().min(3).max(50).required(),
        password: Joi.string().trim().min(3).max(30).required(),
    });
    const dataToValidate = req.body;
    const result = Joi.validate(dataToValidate, schema);

    if (result.error) {
        return false;
    }
    return true;
}

module.exports = isReqValid;