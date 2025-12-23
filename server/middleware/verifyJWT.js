const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    console.log('## verifyJWT ##');
    // const authHeader = req.headers['authorization'];
    // if (!authHeader) {
    //     return res.render('index', { title: "Déconnecté", error: 'Erreur 401', message: 'Authorization header missing' });
    // }
    // console.log('## verifyJWT - authHeader => ', authHeader); // Bearer <token>

    // const token = authHeader.split(' ')[1];
    
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.render('index', { title: "Déconnecté", error: 'Erreur 401', message: 'Jeton manquant' });
    }

    jwt.verify(
        token, 
        process.env.REFRESH_TOKEN_SECRET, //ACCESS_TOKEN_SECRET, 
        { algorithms: [process.env.JWT_ALGORITHM] }, 
        (err, decoded) => {
            if (err) {
                console.log('## verifyJWT - token verification error => ', err);
                res.status(err.status || 500);
                return res.render('index', { title: "Déconnecté", error: "Erreur 500", message: err.message, error: err });
            }
            console.log('## verifyJWT - decoded token => TRUE');
            req.body.name = decoded.name;
            req.body.playerId = decoded.playerId;
            next();
        });
};

module.exports = verifyJWT;
