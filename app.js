var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
// var redis = require('redis');
// var redisClient = redis.createClient({
//   host: 'localhost',
//   port: 6379
// });
var redisClient = require('./Utils/redis/redis');
var mongoose = require('mongoose');

var config = require('./config');
var app = express();
// app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//if mongo with auth
// mongoose.connect(config.mongoUrl, config.opt);
//mongoose connection
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Соединение к базе прошло успешно");
});


//redis connection
redisClient.on('ready', function () {
  console.log('Successfully connected to Redis');
});
redisClient.on('error', function (err) {
  console.log(err);
  console.log('Error on connecting to Redis');
});


var index = require('./routes/index');
var users = require('./routes/users');
var gSheet = require('./routes/openAPI/googlesheet');
var parser = require('./routes/parseCsvRoute');
var candidates = require('./routes/company/candidates');
var botRoutes = require('./Utils/telegramBot/botRoutes');
var employees = require('./routes/company/emplyees');
var subsidary = require('./routes/company/subsidaryRoutes');
var departmentRoutes = require('./routes/company/departments');
var workerRoutes = require('./routes/company/job');
var checklistRoutes = require('./routes/checklist/check');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', index);
app.use('/users', users);
app.use('/api/sheets', gSheet);
app.use('/api/parser', parser);
app.use('/api/candidates', candidates);
app.use('/api/employees', employees);
app.use('/api/subsidary', subsidary);
app.use('/api/departments', departmentRoutes);
app.use('/api/workers', workerRoutes);

//checklist
app.use('/api/checklist', checklistRoutes);

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + "./public/bower_components"));
// app.use(express.static(__dirname + "./public/views/pages"));
// app.use(express.static(__dirname + "./public/images"));
// app.use(express.static(__dirname + "./public/stylesheets"));
// app.use(express.static(__dirname + "./public/photos"));
// app.use(express.static(__dirname + "./public/components"));

app.use('/*', function(req, res){
  // console.log(__dirname);
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

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