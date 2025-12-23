var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'AEOV', message: process.env.version });
});

/* GET home page. */
router.get('/connection', async function(req, res, next) {
  res.render('connection', { title: 'AEOV' });
});

/* GET subscribe page. */
router.get('/subscribe', async function(req, res, next) {
  res.render('subscribe', { title: 'AEOV' });
});

module.exports = router;

