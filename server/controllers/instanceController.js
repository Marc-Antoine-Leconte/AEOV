const { Instance } = require('../config/database');
const { deleteInstanceData, createInstanceData } = require('./instanceDataController');
const { deleteInstancePlayerByInstanceAndPlayer, createInstancePlayer } = require('./instancePlayerController');

class InstanceController {
  getAllInstances = async (req, res, allowTransmit = true) => {
     console.log('@getAllInstances req => ', req.body);
        try {
            const instances = await Instance.findAll();
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

    getInstanceById = async (req, res, allowTransmit = true) => {
        console.log('@getInstanceById req => ', req.body);
        try {
            const instance = await Instance.findByPk(req.body.instanceId);
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
                name: req.body.name
            };
            var createdInstance = await Instance.create(instanceData);
            
            console.log('---createdInstance => ', createdInstance);

            var createdInstanceData = await createInstanceData({...req, body: { ...req.body, 
                instanceId: createdInstance.dataValues.id,
                gameState: 'waiting',
                currentPlayerId: req.body.ownerId,
                maxPlayers: req.body.maxPlayers,
                ownerId: req.body.ownerId,
                rounds: 0
            }}, res, false);

            var createdInstancePlayer = await createInstancePlayer({...req, body: { ...req.body, 
                instanceId: createdInstance.dataValues.id,
                playerId: req.body.ownerId
            }}, res, false);

            if (!createdInstanceData || !createdInstancePlayer) {
                await deleteInstance(req, res, allowTransmit);
                if (createdInstanceData)
                    await deleteInstanceData(req, res, allowTransmit);
                if (createdInstancePlayer)
                    await deleteInstancePlayerByInstanceAndPlayer({...req, body: { ...req.body, 
                        instanceId: createdInstance.id,
                        playerId: req.body.ownerId
                    }}, res, allowTransmit);
                return;
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

    updateInstance = async (req, res, allowTransmit = true) => {
         console.log('@updateInstanceById req => ', req.body);
        try {
            const existingInstance = await Instance.findByPk(req.params.id);
            if (!existingInstance) {
               if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Instance not found."
                    });
                }
                return;
            }
            const instanceToUpdate = {
                mode: req.body.mode,
                name: req.body.name
            };
            await Instance.update(instanceToUpdate, {
                where: {
                    id: req.params.id
                }
            });
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