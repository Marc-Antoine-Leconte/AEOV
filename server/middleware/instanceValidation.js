// middleware/validation.js

const Joi = require('joi');

const instanceSchema = Joi.object({
    mode: Joi.string()
        .valid('pvp', 'pve')
        .required(),
    name: Joi.string()
        .min(1)
        .max(30)
        .required(),
    gameState: Joi.string()
        .valid('waiting', 'in-progress', 'completed'),
    currentPlayerId: Joi.number()
        .integer()
        .min(1),
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
        .min(0),
});

const validateInstance = (req, res, next) => {
    console.log('$$ validateInstance req.body => ', req.body);
    const { mode, name, maxPlayers, playerId } = req.body;
    const ownerId = playerId;
    const { error } = instanceSchema.validate({ mode: mode, name: name, maxPlayers: maxPlayers, ownerId: ownerId });

    if (error) {
        console.log('validateInstance error => ', error);
        res.status(400)
            .json({
                statusCode: 400,
                message: "Validation failed",
                errors: error.details.map(detail => detail.message)
            });
    }
    next();
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