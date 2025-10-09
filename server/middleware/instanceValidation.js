// middleware/validation.js

const Joi = require('joi');

const instanceSchema = Joi.object({
    mode: Joi.string()
        .min(1)
        .max(30)
        .required(),
    name: Joi.string()
        .min(1)
        .max(30)
        .required()
});

const validateInstance = (req, res, next) => {
    const { error } = instanceSchema.validate(req.body);

    if (error) {
        res.status(400)
            .json({
                statusCode: 400,
                message: "Validation failed",
                errors: error.details.map(detail => detail.message)
            });
    } else {
        next();
    }
}

const validateInstanceUpdate = (req, res, next) => {
    const updateSchema = instanceSchema.fork(['mode', 'name'], (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);

    if (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Validation failed",
            errors: error.details.map(d => d.message)
        });
    }
    next();
}

module.exports =
{
    validateInstance,
    validateInstanceUpdate
};