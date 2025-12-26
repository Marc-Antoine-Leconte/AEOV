const { Instance } = require('../config/database');
const { createInstancePlayer } = require('./instancePlayerController');

class InstanceController {
  getAllInstances = async (req, res, allowTransmit = true) => {
     console.log('@getAllInstances req => ', req.body);
        try {
            const instances = await Instance.findAll({ attributes: {exclude: ['ownerId', 'currentPlayerId']} });
            if (allowTransmit)
                res.json(instances);
            return instances;
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

    getAllAvailableInstances = async (req, res, allowTransmit = true) => {
     console.log('@getAllAvailableInstances req => ', req.body);
        try {
            const instances = await Instance.findAll({attributes: {exclude: ['ownerId', 'currentPlayerId']}, where: { gameState: 'waiting' } });
            if (allowTransmit)
                res.json(instances);
            return instances;
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

    getInstanceById = async (req, res, allowTransmit = true, filtered = false) => {
        console.log('@getInstanceById req => ', req.body);

        const instanceId = req.body.instanceId || req.params.instanceId || req.query.instanceId;
        try {
            var instance;
            if (filtered)
                instance= await Instance.findByPk({attributes: {exclude: ['ownerId', 'currentPlayerId']}, where: { id: instanceId } });
            else
                instance = await Instance.findByPk(instanceId);
            if (!instance) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Instance not found"
                    })
                }
                return;
            }
            if (allowTransmit)
                res.json(instance);
            return instance;
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

    createInstance = async (req, res, allowTransmit = true) => {
         console.log('@createInstance req => ', req.body);
        try {
            const instanceData = {
                mode: req.body.mode,
                name: req.body.name,
                ownerId: req.body.playerId,
                maxPlayers: req.body.maxPlayers
            };

            var createdInstance = await Instance.create(instanceData);
            if (!createdInstance) {
                console.log('Instance cannot be created');
                if (allowTransmit) {
                    res.status(400)
                        .json({
                            statusCode: 400,
                            message: "Instance cannot be created"
                        });
                    }
            }

            console.log('---createdInstance => ', createdInstance);

            var createdInstancePlayer = await createInstancePlayer({ ...req, body: {...req.body, instanceId: createdInstance.id, playerId: createdInstance.ownerId }}, res, false);
            if (!createdInstancePlayer) {
                console.log('InstancePlayer cannot be created');
            }

            if (allowTransmit) {
                res.status(201)
                    .json(createdInstance);
            }
            return createdInstance;
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

    updateInstance = async (req, res, data) => {
        console.log('@updateInstanceById req => ', data);
        try {
            await Instance.update(data, {
                where: {
                    id: data.id
                }
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }

    deleteInstance = async (req, res, allowTransmit = true) => {
         console.log('@deleteInstanceById req => ', req.body);
        try {
            const id = req.params.id;
            const instance = await Instance.findByPk(id);
            if (!instance) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Instance not found"
                        });
                    }
                return;
            }
            instance.destroy();
            instance.save();
            if (allowTransmit) {
                res.status(204).send();
            }
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

module.exports = new InstanceController();