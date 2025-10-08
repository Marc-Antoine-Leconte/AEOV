// middleware/validation.js

const Joi = require('joi');

const instancePlayerSchema = Joi.object({
    playerId: Joi.number()
        .integer()
        .min(1)
        .required(),
    instanceId: Joi.number()
        .integer()
        .min(1)
        .required(),
});

const validateInstancePlayer = (req, res, next) => {
    const { error } = instancePlayerSchema.validate(req.body);

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

const validateInstancePlayerUpdate = (req, res, next) => {
    const updateSchema = instancePlayerSchema.fork(['playerId', 'instanceId'], (schema) => schema.optional());
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
    validateInstancePlayer,
    validateInstancePlayerUpdate
};