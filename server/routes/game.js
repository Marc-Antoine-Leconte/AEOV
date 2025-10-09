var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    console.log('# Rendering gameBoard page');
  res.render('gameBoard', { title: 'Game Board' });
});

module.exports = router;
