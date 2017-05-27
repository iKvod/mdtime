/**
 * Created by rafa on 12/05/2017.
 */

var toMinuteFormatCb = function (date, cb) {
  var minutes = null;
  if(date){
    minutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds();
    cb(minutes);
  } else {
    cb(null);
  }
};

var toHourFormatCb = function (date, cb) {
  var hours = null;
  if(date){
    hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    cb(hours);
  } else {
    cb(null);
  }
};

var getMinutes = function (date) {
  if(date){
    return ( ( date.getDate() * 24 * 60) + ( date.getHours() * 60 ) + date.getMinutes() );
  } else {
    return null;
  }
};

module.exports = {
  toMinutesFormatCb: toMinuteFormatCb,
  toHourFormatCb: toHourFormatCb,
  getMinutes: getMinutes
};