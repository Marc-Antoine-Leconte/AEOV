const { InstanceData } = require('../config/database');
const { Sequelize } = require('sequelize');

class InstanceDataController {
  getAllInstanceData = async (req, res, allowTransmit = true) => {
    console.log('@getAllInstanceData req => ', req.body);
        try {
            const instanceData = await InstanceData.findAll();
            if (allowTransmit) {
                res.json(instanceData);
            }
            return instanceData;
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

    getInstanceDataById = async (req, res, allowTransmit = true) => {
        console.log('@getInstanceDataById req => ', req.body);
        try {
            const instanceData = await InstanceData.findByPk(req.params.id);
            if (!instanceData) {
                if (allowTransmit) {
                    res.status(404).json({
                    statusCode: 404,
                    message: "InstanceData not found"
                    });
                }
                return;
            }
            res.json(instanceData);
            return instanceData;
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

    getExtendedInstanceDataById = async (req, res, allowTransmit = true) => {
        console.log('@getExtendedInstanceDataById req => ', req.body);
        try {
            const extendedInstanceData = await InstanceData.findOne({
                 where: { instanceId: req.body.instanceId },
                 attributes: {
                    include: [
                    [
                        Sequelize.literal(`(
                                    SELECT COUNT(*)
                                    FROM instancePlayer AS ip
                                    WHERE ip.instanceId = instanceData.instanceId
                                )`),
                        'playerCount',
                    ],
                    ],
                }, 
                });

            console.log('---extendedInstanceData => ', extendedInstanceData);

            if (!extendedInstanceData) {
                if (allowTransmit) {
                    res.status(404).json({
                    statusCode: 404,
                    message: "ExtendedInstanceData not found"
                    });
                }
                return;
            }
            if (allowTransmit)
                res.json(extendedInstanceData);
            return extendedInstanceData;
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

    createInstanceData = async (req, res, allowTransmit = true) => {
        console.log('@createInstanceData req => ', req.body);
        try {
            const instanceData = {
                instanceId: req.body.instanceId,
                gameState: req.body.gameState,
                currentPlayerId: req.body.currentPlayerId,
                maxPlayers: req.body.maxPlayers,
                ownerId: req.body.ownerId,
                rounds: req.body.rounds
            };
            var createdInstanceData = await InstanceData.create(instanceData);
            if (allowTransmit) {
                res.status(201)
                    .json(createdInstanceData);
            }
            return createdInstanceData;
        } catch (error) {
            console.log(error);
            if (allowTransmit) {
                res.status(500)
                    .json({
                        statusCode: 500,
                        message: "Internal server error"
                    });
            }
            return;
        }
    }

    updateInstanceData = async (req, res, allowTransmit = true) => {
        console.log('@updateInstanceData req => ', req.body);
        try {
            const existingInstanceData = await InstanceData.findByPk(req.params.id);
            if (!existingInstanceData) {
               if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "InstanceData not found."
                    });
                }
                return;
            }
            const instanceDataToUpdate = {
                gameState: req.body.gameState,
                currentPlayerId: req.body.currentPlayerId,
                maxPlayers: req.body.maxPlayers,
                ownerId: req.body.ownerId,
                rounds: req.body.rounds
            };
            await InstanceData.update(instanceDataToUpdate, {
                where: {
                    id: req.params.id
                }
            });
            if (allowTransmit)
                res.status(204).send();
            return true;
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

    deleteInstanceData = async (req, res, allowTransmit = true) => {
        console.log('@deleteInstanceData req => ', req.body);
        try {
            const id = req.params.id;
            const instanceData = await Instance.findByPk(id);
            if (!instanceData) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "InstanceData not found"
                    });
                }
                return;
            }
            instanceData.destroy();
            instanceData.save();
            if (allowTransmit)
                res.status(204).send();
            return true;
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

module.exports = new InstanceDataController();