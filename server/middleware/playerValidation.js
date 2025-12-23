// middleware/validation.js

const Joi = require('joi');

const playerSchema = Joi.object({
    id: Joi.number()
        .integer()
        .min(1),
    name: Joi.string()
        .min(5)
        .max(100)
        .required(),
    password: Joi.string()
        .min(8)
        .max(100)
        .required()
});

const validatePlayer = (req, res, next) => {
    const { error } = playerSchema.validate(req.body);
    console.log('$$ validatePlayer req => ', req.body);

    if (error) {
        console.log('$$ validatePlayer error => ', error);
        res.status(400)
            .json({
                statusCode: 400,
                message: "Validation failed",
                errors: error.details.map(detail => detail.message)
            });
        return error;
    }

    next();
}

const validatePlayerUpdate = (req, res, next) => {
    const updateSchema = playerSchema.fork(['name', 'password'], (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);

    if (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Validation failed",
            errors: error.details.map(d => d.message)
        });
        return error;
    }
    next();
}

module.exports =
{
    validatePlayer,
    validatePlayerUpdate
};