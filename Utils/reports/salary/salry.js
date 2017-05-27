'use strict';

var express = require('express');
var salaryRoute = express.Router();
var Reports = require('../models/reporting');
var Users = require('../models/employee');
var timeCalculator = require('./helpers/TimeCalcReportings/calcMinutes');
var salaryCalculator = require('./helpers/SalaryReportingHelpers/reportSalary');
var calendar = require('./helpers/calendar/calendar');

salaryRoute.get('/', function (req, res, next) {

  // Users.find({}) // for prod pass disabled:false
  //   .populate('report')
  //   .select({'employee_id':1, 'lastname':1,'firstname':1 , 'salary_fixed':1, 'report': 1, 'bonus': 1, 'work_time': 1 })
  //   .exec(function (err, users) {
  //
  //     if (err) {
  //       return next(err);
  //     }
  //     timeCalculator.calculateMinutes(users, res, function (userReport, res) {
  //       sendSalaryReport(userReport, res, function (res, usersSalaryReport) {
  //         res.send(usersSalaryReport);
  //       });
  //     });
  //   });
});

salaryRoute.get('/monthly', function (req, res, next) {
  var date = req.body.date; // date.begin $ date.end of month

  Users.find({ disabled:false }) // for prod pass disabled:false
    .populate({
      path: 'report',
      match: { $and: [{createdAt: { $gte: new Date(2017, 3, 1)}}, { createdAt: { $lte: new Date(2017, 3, 31)}}] }
    })
    .select({
      'employee_id':1, 'lastname':1,'firstname':1 ,
      'salary_fixed':1, 'report': 1, 'bonus': 1,
      'work_time': 1
    })
    .exec(function (err, users) {
      if (err) {
        return next(err);
      }
      timeCalculator.calculateMinutes(users, 3, function (userReport) {
        // res.send(userReport);
        sendSalaryReport(userReport, function (monthReport) {
          // console.log(monthReport);
          res.send(monthReport);
        });
      });
    });
});

// not complited, should the same as above api
salaryRoute.get('/monthly/:id', function (req, res, next) {
  Users.find({_id: req.params.id}) // for prod pass disabled:false
    .populate({
      path: 'report',
      match: { $and: [{createdAt: { $gte: new Date(2017, 3, 1)}}, { createdAt: { $lte: new Date(2017, 3, 31)}}] }
    })
    .select({
      'employee_id':1, 'lastname':1,'firstname':1 ,
      'salary_fixed':1, 'report': 1, 'bonus': 1,
      'work_time': 1
    })
    .exec(function (err, users) {
      if (err) {
        return next(err);
      }
      timeCalculator.calculateMinutes(users, 3, function (userReport) {
        // res.send(userReport);
        sendSalaryReport(userReport, function (monthReport) {
          // console.log(monthReport);
          res.send(monthReport);
        });
      });
    });
});

function sendSalaryReport (userReport, callback){
  var monthReport = {
    calendarReport: null,
    usersSalaryReport: null
  };

  var usersSalaryReport = [];
  var salaryReport = [];
  var employeeInfo = {
    employee_id: null,
    name : null,
    salaryFixed: null,
    workHourCurMonth: null,
    totalMustSalary: null,
    totalSalary: null,
    totalMonthHours: null,
    totalTimeMinutes: null,
    mustWorkHours: null,
    emplWorkTimeFixed: null,
    workTimeDifference: null,
    salaryReports: []
  };

  var salary = {
    salaryPerDay:  null,
    salaryDetails: null
  };

  monthReport.calendarReport  = calendar.countForCurrentMonth(2017, 3);


  for(var i = 0, len = userReport.length; i < len; ++i) {
    employeeInfo.employee_id = userReport[i].employee_id;
    employeeInfo.name = userReport[i].username;
    employeeInfo.salaryFixed = userReport[i].salaryfixed;
    employeeInfo.workHourCurMonth =  monthReport.calendarReport.workdays * userReport[i].work_time + monthReport.calendarReport.saturdays * 5;
    employeeInfo.emplWorkTimeFixed = userReport[i].work_time;

    for(var j = 0, len1 = userReport[i].reportminutes.length; j < len1; j++) {

      if(userReport[i].reportminutes[j].report){

        salary.salaryPerDay = salaryCalculator.salaryPerDay(userReport[i].reportminutes[j].report.beginWorkDay, {}, userReport[i].salaryfixed,  userReport[i].reportminutes[j].report.totalTimeInMinutes, null, userReport[i].work_time);
        salary.salaryDetails = userReport[i].reportminutes[j];
        salaryReport.push(salary);
        employeeInfo.totalMonthHours += userReport[i].reportminutes[j].report.fullTimeHours;
        employeeInfo.totalTimeMinutes += userReport[i].reportminutes[j].report.minutes;
        employeeInfo.totalMustSalary += salary.salaryPerDay.salaryRealPerDay;
        employeeInfo.mustWorkHours += salary.salaryPerDay.workHourNormal;
        salary = {};
      } else {
        salary.salaryPerDay = salaryCalculator.salaryPerDay(userReport[i].reportminutes[j].reportDate, {}, userReport[i].salaryfixed,  0.0, null, userReport[i].work_time);
        salary.salaryDetails = userReport[i].reportminutes[j];
        salaryReport.push(salary);
        salary = {};
      }
    }

    if(employeeInfo.totalMonthHours){
      employeeInfo.workTimeDifference = employeeInfo.totalMonthHours - employeeInfo.workHourCurMonth;
      employeeInfo.salaryReports = salaryReport;
      employeeInfo.totalSalary = ((employeeInfo.workTimeDifference > 0)? employeeInfo.salaryFixed : employeeInfo.totalMustSalary);

      usersSalaryReport.push(employeeInfo);
      employeeInfo = {
        employee_id:null,
        name : null,
        salaryFixed: null,
        totalMustSalary: null,
        totalMonthHours: null,
        totalTimeMinutes: null,
        mustWorkHours:null,
        emplWorkTimeFixed: null,
        workTimeDifference: null,
        salaryReports: []
      };
      salaryReport = [];
    } else {
      usersSalaryReport.push(employeeInfo);
      employeeInfo = {
        employee_id:null,
        name : null,
        salaryFixed: null,
        totalMustSalary: null,
        totalMonthHours: null,
        totalTimeMinutes: null,
        mustWorkHours:null,
        emplWorkTimeFixed: null,
        workTimeDifference: null,
        salaryReports: []
      };
      salaryReport = [];
    }
  }
  monthReport.usersSalaryReport = usersSalaryReport;
  callback(monthReport);
}


salaryRoute.get('/:id', function (req, res, next) {
  Users.find({ _id: req.params.id})
    .populate('report')
    .select({'employee_id':1, 'lastname':1,'firstname':1 , 'salary_fixed':1, 'report': 1})
    .exec(function (err, users) {
      if (err) {
        return next(err);
      }
      // res.send(users);
      timeCalculator.calculateMinutes(users, res, function (userReport, res) {
        var salaryReport = ['ss'];
        var fullSalaryReport = [];

        var obj = {
          userReport: userReport,
          salaryReport: []
        };

        sendSalaryReport(userReport, res, function (res, usersSalaryReport) {
          //console.log(salaryReport);
          // res.send(userReport);
          res.status(200).send(usersSalaryReport);
        });
        // res.send(users)
      });
    });
});


salaryRoute.put('/employee/:id', function (req, res, next) {

  Users.findById(req.params.id, function (err, user) {

    if (err) {
      return next(err);
    }
    user.salary_fixed = req.body.salaryFixed;

    user.save(function (err) {
      if(err) {
        return next(err);
      }
      res.send({message: "Salary updated!"});
    });
  });
});

module.exports = salaryRoute;/**
 * Created by rafa on 12/05/2017.
 */
