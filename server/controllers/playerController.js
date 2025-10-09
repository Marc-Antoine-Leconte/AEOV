const { Player } = require('../config/database');

class PlayerController {
  getAllPlayers = async (req, res, allowTransmit = true) => {
        try {
            const players = await Player.findAll();
            if (allowTransmit) {
                res.json(players);
            }
            return players;
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

    getPlayerById = async (req, res, allowTransmit = true) => {
        try {
            const player = await Player.findByPk(req.params.id);
            if (!player) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Player not found"
                    });
                }
                return;
            }
            res.json(player);
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

    createPlayer = async (req, res, allowTransmit = true) => {
        try {
            const playerData = {
                username: req.body.username,
                status: req.body.status
            };
            var createdPlayer = await Player.create(playerData);
            if (allowTransmit) {
                res.status(201)
                    .json(createdPlayer);
            }
            return createdPlayer;
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

    updatePlayer = async (req, res, allowTransmit = true) => {
        try {
            const existingPlayer = await Player.findByPk(req.params.id);
            if (!existingPlayer) {
               if (allowTransmit) {
                   res.status(404).json({
                       statusCode: 404,
                       message: "Player not found."
                   });
               }
               return;
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

    deletePlayer = async (req, res, allowTransmit = true) => {
        try {
            const id = req.params.id;
            const player = await Player.findByPk(id);
            if (!player) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Player not found"
                    });
                }
                return;
            }
            player.destroy();
            player.save();
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

module.exports = new PlayerController();