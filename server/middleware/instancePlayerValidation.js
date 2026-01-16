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
    civilization: Joi.string()
        .valid('roman', 'viking', 'egyptian', 'medieval', 'greek'),
    color: Joi.string()
        .valid('red', 'blue', 'purple', 'green', 'yellow', 'orange', 'pink', 'brown', 'aqua'),
    gold: Joi.number()
        .integer()
        .min(0),
    food: Joi.number()
        .integer()
        .min(0),
    wood: Joi.number()
        .integer()
        .min(0),
    stone: Joi.number()
        .integer()
        .min(0),
    iron: Joi.number()
        .integer()
        .min(0),
    diamond: Joi.number()
        .integer()
        .min(0),
    leather: Joi.number()
        .integer()
        .min(0),
    army: Joi.number()
        .integer()
        .min(0),
    population: Joi.number()
        .integer()
        .min(0),
    tool: Joi.number()
        .integer()
        .min(0),
    weapons: Joi.number()
        .integer()
        .min(0),
    armor: Joi.number()
        .integer()
        .min(0),
    horse: Joi.number()
        .integer()
        .min(0),
    treasure: Joi.number()
        .integer()
        .min(0),
    maxArmyMovementPoints: Joi.number()
        .integer()
        .min(0),
    maxTool: Joi.number()
        .integer()
        .min(0),
    maxPopulation: Joi.number()
        .integer()
        .min(0),
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
    const updateSchema = instancePlayerSchema.fork(['playerId', 'instanceId', 'gold', 'food', 'wood', 'stone', 'iron', 'leather', 'diamond', 'army', 'population', 'tool', 'weapons', 'armor', 'treasure', 'maxArmyMovementPoints', 'maxTool', 'maxPopulation'], (schema) => schema.optional());
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