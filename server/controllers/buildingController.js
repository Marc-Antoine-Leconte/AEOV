const { Building } = require('../config/database');

class BuildingController {
  getAllBuildings = async (req, res, allowTransmit = true) => {
     console.log('@getAllBuildings req => ', req.body);
        try {
            const buildings = await Building.findAll();
            if (allowTransmit)
                res.json(buildings);
            return buildings;
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

    getBuildingById = async (req, res, allowTransmit = true) => {
        console.log('@getBuildingById req => ', req.body);

        const buildingId = req.body.buildingId;
        try {
            const building = await Building.findByPk(buildingId);
            if (!building) {
                if (allowTransmit) {
                    res.status(404).json({
                        statusCode: 404,
                        message: "Building not found"
                    })
                }
                return;
            }
            if (allowTransmit)
                res.json(building);
            return building;
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

module.exports = new BuildingController();