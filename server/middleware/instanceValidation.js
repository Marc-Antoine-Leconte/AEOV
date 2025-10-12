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
        .required(),
    gameState: Joi.string()
        .valid('waiting', 'in-progress', 'completed')
        .required(),
    currentPlayerId: Joi.number()
        .integer()
        .min(1)
        .required(),
    maxPlayers: Joi.number()
        .integer()
        .min(1)
        .max(8)
        .required(),
    ownerId: Joi.number()
        .integer()
        .min(1)
        .required(),
    rounds: Joi.number()
        .integer()
        .min(0)
        .required()
});

const validateInstance = (req, res, next) => {
    console.log('$$ validateInstance req.body => ', req.body);
    const { error } = instanceSchema.validate({mode: req.body.mode, name: req.body.name});

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