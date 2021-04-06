const Joi = require('joi');

const validJobStatuses = ['PENDING', 'IN_PROGRESS', 'FINISHED'];

const isJobValid = (req) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(50).required(),
        scheduledAt: Joi.date().iso().optional(),
        description: Joi.string().allow('').optional(),
        status: Joi.string().valid(validJobStatuses),
        address: Joi.object().keys({
            street: Joi.string().min(3).max(100).allow('').optional(),
            city: Joi.string().min(2).max(100).allow('').optional(),
            state: Joi.string().min(2).max(100).allow('').optional(),
            country: Joi.string().min(2).max(100).allow('').optional(),
            postCode: Joi.string().min(2).max(100).allow('').optional(),
        }),
        userId: Joi.number().optional(),
        customerId: Joi.number().required(),
        images: Joi.object().keys({
            keys: Joi.array().optional(),
        }),
        tags: Joi.array().optional()
    });

    const dataToValidate = req.body;
    const result = Joi.validate(dataToValidate, schema);

    if (result.error) {
        console.log(result.error)
        return false;
    }
    return true;
}

module.exports = { isJobValid };