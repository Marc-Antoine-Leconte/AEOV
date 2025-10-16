const { Action } = require('../config/database');

class ActionController {
  getAllActions = async (req, res, allowTransmit = true) => {
     console.log('@getAllActions req => ', req.body);
        try {
            const actions = await Action.findAll();
            if (allowTransmit)
                res.json(actions);
            return actions;
        }
        catch (error) {
            console.log(error);
            if (allowTransmit)
                res.status(500).json({
                    statusCode: 500,
                    message: "Internal server error"
                });
            return;
        }
    }

    getActionById = async (req, res, allowTransmit = true) => {
        console.log('@getActionById req => ', req.body);

        const actionId = req.body.actionId;
        try {
            const action = await Action.findByPk(actionId);
            if (!action) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Action not found"
                    })
                }
                return;
            }
            if (allowTransmit)
                res.json(action);
            return action;
        }
        catch (error) {
            console.log(error);
            if (allowTransmit) {
                res.status(500).json({
                    statusCode: 500,
                    message: "Internal server error"
                });
            }
            return;
        }
    }
}

module.exports = new ActionController();