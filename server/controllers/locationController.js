const { Location } = require('../config/database');

class LocationController {
    getAllLocations = async (req, res, allowTransmit = true) => {
        console.log('@getAllLocations req => ', req.body);
        try {
            const locations = await Location.findAll();
            if (allowTransmit)
                res.json(locations);
            return locations;
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

    getLocationById = async (req, res, allowTransmit = true) => {
        console.log('@getLocationById req => ', req.body);

        const locationId = req.body.locationId;
        try {
            const location = await Location.findByPk(locationId);
            if (!location) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Location not found"
                    })
                }
                return;
            }
            if (allowTransmit)
                res.json(location);
            return location;
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

    getLocationsByInstanceId = async (req, res, allowTransmit = true) => {
        console.log('@getLocationByInstanceId req => ', req.body);

        const instanceId = req.body.instanceId;
        try {
            const locations = await Location.findAll({
                where: { instanceId: instanceId },
                order: [['pointId', 'ASC']]
            });
            if (!locations) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Location not found"
                    })
                }
                return;
            }
            if (allowTransmit)
                res.json(locations);
            return locations;
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

    createLocation = async (req, res) => {
        console.log('@createLocation req => ', req.body);
        try {
            const locationData = {
                name: req.body.name,
                ownerId: req.body.ownerId,
                pointId: req.body.pointId,
                buildings: req.body.buildings,
                instanceId: req.body.instanceId,
                type: req.body.type
            };

            var createdLocation = await Location.create(locationData);
            if (!createdLocation) {
                console.log('Instance cannot be created');
                return;
            }

            return createdLocation;
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

    updateLocationByInstanceAndPoint = async (req, res) => {
        console.log('@updateLocationByInstanceAndPoint req => ', req);
        const data = req.body;
        try {
            await Location.update(data, {
                where: {
                    pointId: data.pointId,
                    instanceId: data.instanceId
                }
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }

    deleteLocationByInstanceId = async (req, res, allowTransmit = true) => {
        console.log('@deleteLocationByInstanceId req => ', req.body);
        try {
            const locations = await Location.destroy({ where: { instanceId: req.body.instanceId } });
            if (!locations) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Instance not found"
                    });
                }
                return;
            }
            
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

module.exports = new LocationController();