// middleware/validation.js

const Joi = require('joi');

const instanceDataSchema = Joi.object({
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

const validateInstanceData = (req, res, next) => {
    console.log('$$ validateInstanceData req => ', req.body);
    const { error } = instanceDataSchema.validate(req.body);

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

const validateInstanceDataUpdate = (req, res, next) => {
    console.log('$$ validateInstanceDataUpdate req => ', req.body);

    const updateSchema = instanceDataSchema.fork(['gameState', 'currentPlayerId', 'maxPlayers', 'ownerId', 'rounds'], (schema) => schema.optional());
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
    validateInstanceData,
    validateInstanceDataUpdate
};