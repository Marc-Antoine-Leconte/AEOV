const { Instance } = require('../config/database');

class InstanceController {
  getAllInstances = async (req, res) => {
        try {
            const instances = await Instance.findAll();
            res.json(instances);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    getInstanceById = async (req, res) => {
        try {
            const instance = await Instance.findByPk(req.params.id);
            if (!instance) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Instance not found"
                })
            }
            res.json(instance);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    createInstance = async (req, res) => {
        try {
            const instanceData = {
                mode: req.body.mode,
                name: req.body.name
            };
            var createdInstance = await Instance.create(instanceData);
            res.status(201)
                .json(createdInstance);
        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    statusCode: 500,
                    message: "Internal server error"
                });
        }
    }

    updateInstance = async (req, res) => {
        try {
            const existingInstance = await Instance.findByPk(req.params.id);
            if (!existingInstance) {
               return res.status(404).json({
                    statusCode: 404,
                    message: "Instance not found."
                });
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

    deleteInstance = async (req, res) => {
        try {
            const id = req.params.id;
            const instance = await Instance.findByPk(id);
            if (!instance) {
                res.status(404).json({
                    statusCode: 404,
                    message: "Instance not found"
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

module.exports = new InstanceController();