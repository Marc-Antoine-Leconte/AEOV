const { Player } = require('../config/database');

class PlayerController {
  getAllPlayers = async (req, res) => {
        try {
            const players = await Player.findAll();
            res.json(players);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    getPlayerById = async (req, res) => {
        try {
            const player = await Player.findByPk(req.params.id);
            if (!player) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Player not found"
                })
            }
            res.json(player);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    createPlayer = async (req, res) => {
        try {
            const playerData = {
                username: req.body.username,
                status: req.body.status
            };
            var createdPlayer = await Player.create(playerData);
            res.status(201)
                .json(createdPlayer);
        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    statusCode: 500,
                    message: "Internal server error"
                });
        }
    }

    updatePlayer = async (req, res) => {
        try {
            const existingPlayer = await Player.findByPk(req.params.id);
            if (!existingPlayer) {
               return res.status(404).json({
                    statusCode: 404,
                    message: "Player not found."
                });
            }
            const playerToUpdate = {
                username: req.body.username,
                status: req.body.status
            };
            await Player.update(playerToUpdate, {
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

    deletePlayer = async (req, res) => {
        try {
            const id = req.params.id;
            const player = await Player.findByPk(id);
            if (!player) {
                res.status(404).json({
                    statusCode: 404,
                    message: "Player not found"
                });
            }
            player.destroy();
            player.save();
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

module.exports = new PlayerController();