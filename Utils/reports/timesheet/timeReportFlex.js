/**
 * Created by rafa on 12/05/2017.
 */
var Timelates = require('../../../models/reporings/latereports');
var Reports = require('../../../models/reporings/reports');
var dbHelper = require('../../../routes/Helpers/dbRouteCommon');
var botDbHelper = require('../../telegramBot/bot/botDbHelpers');

// time late
  //нельзя отработать с помощю переработок
var timeLate = function (cb) {
  
};

// Аналитика по времени
//? часов отработал
// ? времени переработал
// ? времени недоработки предупреждением

var time = function (cb) {
  var timesWorked = null;
  var overtime = null;
  var timeDeficitNotified = null;
};

