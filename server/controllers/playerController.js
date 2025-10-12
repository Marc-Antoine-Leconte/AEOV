const { Player } = require('../config/database');
const bcrypt = require('bcrypt');

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
            console.log('# getPlayerById - req.body => ', req.body);
            const id = req.body.playerId;
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
            if (allowTransmit) {
                res.json(player);
            }
            return player;
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

    authenticatePlayer = async (req, res, allowTransmit = true) => {
        console.log('# authenticatePlayer - req.body => ', req.body);
        try {
            const { name, password } = req.body;

            const players = await Player.findAll({ where: { name: name } });

            if (!players || players.length <= 0) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Player not found"
                    });
                }
                return;
            }

            var player = null;
            players.forEach(element => {
                const isPasswordValid = bcrypt.compareSync(password, element.password);
                if (isPasswordValid) {
                    player = element;
                }
            });

            if (!player) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Player not found"
                    });
                }
                return;
            }
            if (allowTransmit) {
                res.json(player);
            }
            return player;
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
        const { name, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 12);

        try {
            const playerData = {
                name: name,
                password: hashedPassword
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
        const { name, password, id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

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
                name: name,
                password: hashedPassword
            };
            await Player.update(playerToUpdate, {
                where: {
                    id: id
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