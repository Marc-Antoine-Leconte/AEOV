const { InstanceData } = require('../config/database');

class InstanceDataController {
  getAllInstanceData = async (req, res) => {
        try {
            const instanceData = await InstanceData.findAll();
            res.json(instanceData);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    getInstanceDataById = async (req, res) => {
        try {
            const instanceData = await InstanceData.findByPk(req.params.id);
            if (!instanceData) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "InstanceData not found"
                })
            }
            res.json(instanceData);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    createInstanceData = async (req, res) => {
        try {
            const instanceData = {
                gameState: req.body.gameState,
                currentPlayerId: req.body.currentPlayerId,
                maxPlayers: req.body.maxPlayers,
                ownerId: req.body.ownerId,
                rounds: req.body.rounds
            };
            var createdInstanceData = await InstanceData.create(instanceData);
            res.status(201)
                .json(createdInstanceData);
        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    statusCode: 500,
                    message: "Internal server error"
                });
        }
    }

    updateInstanceData = async (req, res) => {
        try {
            const existingInstanceData = await InstanceData.findByPk(req.params.id);
            if (!existingInstanceData) {
               return res.status(404).json({
                    statusCode: 404,
                    message: "InstanceData not found."
                });
            }
            const instanceDataToUpdate = {
                mode: req.body.mode,
                name: req.body.name
            };
            await InstanceData.update(instanceDataToUpdate, {
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

    deleteInstanceData = async (req, res) => {
        try {
            const id = req.params.id;
            const instanceData = await Instance.findByPk(id);
            if (!instanceData) {
                res.status(404).json({
                    statusCode: 404,
                    message: "InstanceData not found"
                });
            }
            instanceData.destroy();
            instanceData.save();
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

module.exports = new InstanceDataController();