const Joi = require('joi');

const isCustomerValid = (req) => {
    const schema = Joi.object().keys({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().allow('').optional(),
        phone: Joi.string().min(6).max(50),
        address: Joi.object().keys({
            street: Joi.string().min(3).max(100).allow('').optional(),
            city: Joi.string().min(2).max(100).allow('').optional(),
            state: Joi.string().min(2).max(100).allow('').optional(),
            country: Joi.string().min(2).max(100).allow('').optional(),
            postCode: Joi.string().min(2).max(100).allow('').optional(),
        }),
    });
    const dataToValidate = req.body;
    const result = Joi.validate(dataToValidate, schema);

    if (result.error) {
        return false;
    }
    return true;
}

const isCustomerToBeUpdatedValid = (req) => {
    const schema = Joi.object().keys({
        id: Joi.number().integer().required(),
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().allow('').optional(),
        phone: Joi.string().min(6).max(50),
        address: Joi.object().keys({
            street: Joi.string().min(3).max(100).allow('').optional(),
            city: Joi.string().min(2).max(100).allow('').optional(),
            state: Joi.string().min(2).max(100).allow('').optional(),
            country: Joi.string().min(2).max(100).allow('').optional(),
            postCode: Joi.string().min(2).max(100).allow('').optional(),
        }),
    });
    const dataToValidate = req.body;
    const result = Joi.validate(dataToValidate, schema);

    if (result.error) {
        return false;
    }
    return true;
}

module.exports = { isCustomerValid, isCustomerToBeUpdatedValid };