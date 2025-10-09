var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize } = require('./server/config/database');

var indexRouter = require('./server/routes/index');
var usersRouter = require('./server/routes/users');
var instanceRouter = require('./server/routes/instance');

var app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "'sha256-t4hrt/shI2RwfCP1tEJaQhtZRY5CE2e+X7jwYfSODV0='"],
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/instance', instanceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
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
