var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'AEOV' });
});

/* GET home page. */
router.get('/connection', async function(req, res, next) {
  res.render('connection', { title: 'AEOV' });
});

/* GET subscribe page. */
router.get('/subscribe', async function(req, res, next) {
  res.render('subscribe', { title: 'AEOV' });
});

/* GET subscribe page. */
router.get('/home', async function(req, res, next) {
  res.render('home', { title: 'AEOV' });
});

module.exports = router;

