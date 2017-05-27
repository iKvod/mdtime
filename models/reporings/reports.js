/**
 * Created by rafa on 26/04/2017.
 */

//Utils
var timeUtil = require('../../Utils/time/timeformat');

//mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimeReportingSchema = new Schema({
  created_at: { type: Date },
  employee: { type: Schema.Types.ObjectId, ref: 'Employees' },
  checkin: { type: Date, default: null },
  checkout: { type: Date, default: null },
  goOutFromWork: { type: Number, default: null },// only for fixed tarifed employees
  lateToWorkTime: { type: Number, default: null },// only for fixed tarifed employees
  willBeAbsent: { type: Boolean, default: false }, //
  report: { type: String, default: null},
  insight: { type: String, default: null },
  goOut: {type: Date, default: null},
  comeToWork: { type: Date, default: null },
  overtime: { type: Date, default: null },
  timedeficit: { type: Number, default: null } // < 0
}, {
  timestamps: {createdAt: 'created_at'}
});


TimeReportingSchema.methods.checkWorkTime = function (cb) {
  var timeDifference =   null;
  if(this.checkout && this.checkin){
    timeDifference = this.checkout - this.checkin;
    cb(timeDifference);
  } else {
    cb(timeDifference);
  }
}; // hacker

// TimeReportingSchema.methods.checkWorkTimeFixed = function (cb) {
//   var timeDifference = null;
//   if(this.checkout && this.checkin && this.goOutFromWork && this.com)
//
//
// };

//time reporting для flex
//determining the overtime and timedeficit
//dailyFixedWTime - is the number of hours which employee should work per day;
TimeReportingSchema.methods.flexTimeReport = function (dailyFixedWTime, cb) {
  var overtime = null;
  var deficit = null;

  if( this.goOut && this.comeToWork ) {
    if( this.checkin && this.checkout ){
      // emplWorkhourReal - the number of hour employee has worked
      var emplWorkHourReal = timeUtil.getMinutes(this.checkout)
        - timeUtil.getMinutes(this.checkin)
      - (timeUtil.getMinutes(this.comeToWork) - timeUtil.getMinutes(this.goOut));
      if(emplWorkHourReal < dailyFixedWTime){
        this.timedeficit = dailyFixedWTime - emplWorkHourReal;
        cb(null, null, this.timedeficit);
      } else if(emplWorkHourReal > dailyFixedWTime){
        this.overtime = emplWorkHourReal - dailyFixedWTime; // in minutes
        cb(null, this.overtime, null);
      }
    } else {
      cb({message: "Отчет не полный за этот день"}, null, null);
    }
  } else {
    if( this.checkin && this.checkout ){
      var timeDifference = timeUtil.getMinutes(this.checkout) - timeUtil.getMinutes(this.checkin);
      if(timeDifference < dailyFixedWTime){
        this.timedeficit = dailyFixedWTime - timeDifference;
        cb(null, null, this.timedeficit);
      } else if(timeDifference > dailyFixedWTime){
        this.overtime = timeDifference - dailyFixedWTime; // in minutes
        cb(null, this.overtime, null);
      }
    } else {
      cb({ message: "Отчет не полный за этот день"}, null, null);
    }
  }
};

TimeReportingSchema.methods.freeTimeReport = function (cb) {
  var dailyFixedWTime = null;

  
};


// TimeReportingSchema.pre('save', function () {
//
// })


module.exports = mongoose.model('Timereportings', TimeReportingSchema);