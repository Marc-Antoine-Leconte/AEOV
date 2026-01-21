var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { Sequelize } = require('./server/config/database');

const verifyJWT = require('./server/middleware/verifyJWT');

var indexRouter = require('./server/routes/index');
var playerRouter = require('./server/routes/player');
var homeRouter = require('./server/routes/home');
var instanceRouter = require('./server/routes/instance');
var gameRouter = require('./server/routes/game');
var apiRouter = require('./server/routes/api');
var resourcesRouter = require('./server/routes/resources');

const { error } = require('console');

var app = express(); 

// view engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(
  helmet({
    //contentSecurityPolicy: false,
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", process.env.CSP_SRC_ENCRYPTION],
        "connect-src": ["'self'", "https://internet-up.ably-realtime.com", "https://main.realtime.ably.net", "wss://main.realtime.ably.net", "wss://ws-up.ably-realtime.com/"],
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/player', playerRouter);
app.use(verifyJWT);
app.use('/resources', resourcesRouter)
app.use('/api', apiRouter)
app.use('/home', homeRouter);
app.use('/instance', instanceRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('## 404 error handler - req.originalUrl => ', req.originalUrl);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('## error handler - err => ', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: "Error", message: err.message, error: err });
});

const connectDb = async () => {
    try {
        await Sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        if (process.env.NODE_ENV !== 'production') {
            await Sequelize.sync({ alter: true });
            console.log('📊 Database models synchronized.');
        }
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}
connectDb();

module.exports = app;
