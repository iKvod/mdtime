var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var mongoose = require('mongoose');

var config = require('./config');
var app = express();
app.use(cors);
// mongoose.connect(config.mongoUrl, config.opt);
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Соединение к базе прошло успешно");
});

var index = require('./routes/index');
var users = require('./routes/users');
var gSheet = require('./routes/googlesheet');
var parser = require('./routes/parseCsvRoute');
var candidates = require('./routes/candidates');
var botRoutes = require('./routes/botRoutes');
var employees = require('./routes/emplyees');
var subsidary = require('./routes/subsidaryRoutes');
// var botInteractive = require('./Utils/bot/interactiveChat');
var departmentRoutes = require('./routes/departments');
var workerRoutes = require('./routes/job');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
app.use('/api/sheets', gSheet);
app.use('/api/parser', parser);
app.use('/api/candidates', candidates);
app.use('/api/employees', employees);
app.use('/api/subsidary', subsidary);
app.use('/api/departments', departmentRoutes);
app.use('/api/workers', workerRoutes);


// app.use(botInteractive);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;