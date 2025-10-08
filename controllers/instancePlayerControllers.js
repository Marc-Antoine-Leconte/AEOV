const { InstancePlayer } = require('../config/database');

class InstancePlayerController {
  getAllInstancePlayers = async (req, res) => {
        try {
            const instancePlayers = await InstancePlayer.findAll();
            res.json(instancePlayers);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    getInstancePlayerById = async (req, res) => {
        try {
            const instancePlayer = await InstancePlayers.findByPk(req.params.id);
            if (!instancePlayer) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "InstancePlayer not found"
                })
            }
            res.json(instancePlayer);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    createInstancePlayer = async (req, res) => {
        try {
            const instancePlayer = {
                playerId: req.body.playerId,
                instanceId: req.body.instanceId
            };
            var createdInstancePlayer = await Instance.create(instancePlayer);
            res.status(201)
                .json(createdInstancePlayer);
        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    statusCode: 500,
                    message: "Internal server error"
                });
        }
    }

    updateInstancePlayer = async (req, res) => {
        try {
            const existingInstancePlayer = await InstancePlayer.findByPk(req.params.id);
            if (!existingInstancePlayer) {
               return res.status(404).json({
                    statusCode: 404,
                    message: "InstancePlayer not found."
                });
            }
            const instancePlayerToUpdate = {
                playerId: req.body.playerId,
                instanceId: req.body.instanceId
            };
            await InstancePlayer.update(instancePlayerToUpdate, {
                where: {
                    id: req.params.id
                }
            });
            res.status(204).send();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    deleteInstancePlayer = async (req, res) => {
        try {
            const id = req.params.id;
            const instancePlayer = await InstancePlayer.findByPk(id);
            if (!instancePlayer) {
                res.status(404).json({
                    statusCode: 404,
                    message: "InstancePlayer not found"
                });
            }
            instance.destroy();
            instance.save();
            res.status(204).send();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }
}

module.exports = new InstancePlayerController();