// middleware/validation.js

const Joi = require('joi');

const playerSchema = Joi.object({
    id: Joi.number()
        .integer()
        .min(1)
        .required(),
    username: Joi.string()
        .min(5)
        .max(100)
        .required(),
    status: Joi.string()
        .valid('disconnected', 'online', 'in-game')
        .required()
});

const validatePlayer = (req, res, next) => {
    const { error } = playerSchema.validate(req.body);

    if (error) {
        res.status(400)
            .json({
                statusCode: 400,
                message: "Validation failed",
                errors: error.details.map(detail => detail.message)
            });
    }

    next();
}

const validatePlayerUpdate = (req, res, next) => {
    const updateSchema = playerSchema.fork(['username', 'status'], (schema) => schema.optional());
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
    validatePlayer,
    validatePlayerUpdate
};