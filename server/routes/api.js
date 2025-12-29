var express = require('express');
const Ably = require('ably');

const rest = new Ably.Rest(process.env.ABLY_API_KEY);
var router = express.Router();

router.get('/ably/auth', async function (req, res) {
    console.log('ABLY AUTH')

    const tokenParams = {
        clientId: "aeov-client",
    };

  try {
    const tokenRequest = await rest.auth.createTokenRequest(tokenParams);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(tokenRequest));
  } catch (err) {
    res.status(500).send("Error requesting token: " + JSON.stringify(err));
  }
});

module.exports = router;