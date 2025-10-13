const { col } = require('sequelize');
const { InstancePlayer } = require('../config/database');

class InstancePlayerController {
  getAllInstancePlayers = async (req, res, allowTransmit = true) => {
        try {
            const instancePlayers = await InstancePlayer.findAll();
            if (allowTransmit) {
                res.json(instancePlayers);
            }
            return instancePlayers;
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

    getCountInstancePlayersByInstanceId = async (req, res, allowTransmit = true) => {
        try {
            const count = await InstancePlayer.count({ where: { instanceId: req.body.instanceId } });
            if (allowTransmit) {
                res.json({ count });
            }
            return count;
        } catch (error) {
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

    getInstancePlayerByPlayerAndInstance = async (req, res, allowTransmit = true) => {
        try {
            const instancePlayer = await InstancePlayer.findOne({
                where: {
                    playerId: req.body.playerId,
                    instanceId: req.body.instanceId
                }
            });
            if (!instancePlayer) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "InstancePlayer not found"
                    });
                }
                return;
            }
            if (allowTransmit)
                res.json(instancePlayer);
            return instancePlayer;
        } catch (error) {
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

    getInstancePlayersByInstanceId = async (req, res, allowTransmit = true) => {
        try {
            const instancePlayers = await InstancePlayer.findAll({
                where: {
                    instanceId: req.body.instanceId
                }
            });
            if (!instancePlayers) {
                if (allowTransmit) {
                    return res.status(404).json({
                        statusCode: 404,
                        message: "InstancePlayers not found"
                    });
                }
            }
            if (allowTransmit)
                res.json(instancePlayers);
            return instancePlayers;
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

    createInstancePlayer = async (req, res, allowTransmit = true) => {
        try {
            const instancePlayer = {
                playerId: req.body.playerId,
                instanceId: req.body.instanceId
            };
            var createdInstancePlayer = await InstancePlayer.create(instancePlayer);
            if (allowTransmit) {
                res.status(201)
                    .json(createdInstancePlayer);
            }
            return createdInstancePlayer;
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

    updateInstancePlayerByServer = async (req, res) => {
        try {
            await InstancePlayer.update(req.body, {
                where: {
                    playerId: req.body.playerId,
                    instanceId: req.body.instanceId
                }
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }

    updateInstancePlayer = async (req, res, allowTransmit = true) => {
        try {
            const existingInstancePlayer = await this.getInstancePlayerByPlayerAndInstance(req, res, false);
            if (!existingInstancePlayer) {
               if (allowTransmit) {
                   return res.status(404).json({
                       statusCode: 404,
                       message: "InstancePlayer not found."
                   });
               }
               return;
            }
            const instancePlayerToUpdate = { 
                ...existingInstancePlayer.dataValues,
                civilization: req.body.civilization,
                color: req.body.color
            };
            await InstancePlayer.update(instancePlayerToUpdate, {
                where: {
                    playerId: req.body.playerId,
                    instanceId: req.body.instanceId
                }
            });
            if (allowTransmit) {
                res.status(204).json(instancePlayerToUpdate);
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

    deleteInstancePlayerByInstanceAndPlayer = async (req, res, allowTransmit = true) => {
        try {
            const instancePlayer = await InstancePlayer.findOne({
                where: {
                    instanceId: req.body.instanceId,
                    playerId: req.body.playerId
                }
            });
            if (instancePlayer) {
                await instancePlayer.destroy();
                if (allowTransmit) {
                res.status(204).send();
                }
                return true;
            } else {
                 if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "InstancePlayer not found"
                    });
                }
                return;
            }
            
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

    deleteInstancePlayer = async (req, res, allowTransmit = true) => {
        try {
            const id = req.params.id;
            const instancePlayer = await InstancePlayer.findByPk(id);
            if (!instancePlayer) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "InstancePlayer not found"
                    });
                }
                return;
            }
            instancePlayer.destroy();
            instancePlayer.save();
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

module.exports = new InstancePlayerController();