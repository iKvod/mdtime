(function () {
  'use strict';
  var calendar = require('../calendar/calendar');

  /*
   * salaryFixedHourCalc - calculates the fixed salary for workdays and saturdays
   * calendar returns JSON object  {
   month: null,
   days: 0,
   workdays: 0,
   saturdays: 0,
   sundays: 0
   };
   * */

  var calcSalaryFixedPerDay = function (date, salaryFixedPerMonth) {
    // unefficient way becose it generate moth callendar every time
    var calReport = calendar.countForCurrentMonth(date.getYear(), date.getMonth());

    // var salaryFixedPerHour = {
    //     saturdaySalaryNormal: null,
    //     weekDaySalaryNormal: null
    // };

    var salaryFixedPerDay = salaryFixedPerMonth / (calReport.workdays + calReport.saturdays);
    // callback(salaryFixedPerDay);
    // console.log(calReport);
    return salaryFixedPerDay;
  };

  //determines the weekday and calculates salary per Hour for current day
  //returns salary per day
  /*
   * $params weekDay from check_in Date  info
   * weekDayType - passed as an object that contains holiday: Boolean, workday: Boolean
   * callback - calcSalaryFixedPerDay
   * bonus - bonus for holidays if exists
   * calcSalaryFixedPerHour - calculated salary for current month;
   * totalTimeInMinutes - how much time employye worked for current day;
   * */
  var salaryPerDay = function (date, weekDayType, salaryFixedPerMonth, totalTimeInMinutes, bonus, workhour_fixed) {
    //console.log(emplFixedWorkHour)
    var salaryFixedPerDay = calcSalaryFixedPerDay(date, salaryFixedPerMonth); // callback - fixed salary for per workday
    // console.log(calcSalaryFixedPerDay(date, salaryFixedPerMonth));
    var weekDay = date.getDay(); // this should in function parameter as object key

    // if(weekDay === 0){
    //   console.log(date.getDate());
    // }

    var salaryRealPerDay = null;
    var salaryReportPerDay  = {
      salaryRealPerDay: null,
      weekDay: null,
      workHourNormal: null
      // emplFixedWorkHour: null
    };

    // var weekDayWorkHourNormal  = 7.0;
    var weekDayWorkHourNormal  = workhour_fixed;
    var saturdayWorkHourNormal =  5.0;
    //var saturdatWorkHourReal =
    var weekDayWorkHourReal = totalTimeInMinutes / 60.0;
    weekDayType = {
      holiday: false,
      workday: true
    };

    if( weekDay != 6 && weekDay != 0 && !weekDayType.holiday && weekDayType.workday){

      if(weekDayWorkHourNormal >= weekDayWorkHourReal){
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
        // salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;

        // console.log("----------------------");
        // console.log("Всего отработал- " + totalTimeInMinutes);
        // console.log(salaryRealPerDay)
        // console.log("----------------------");
      } else {
        // console.log("Переработка");
        // console.log("++++++++++++++++++++++++");
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
        // salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
        // console.log("++++++++++++++++++++++++");
      }
      //console.log("Workday");
      // console.log(salaryRealPerDay);
      return salaryReportPerDay;
    } else if ( weekDay === 6 && !weekDayType.holiday && weekDayType.workday ) {

      if(saturdayWorkHourNormal >= weekDayWorkHourReal){
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / saturdayWorkHourNormal * weekDayWorkHourReal;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = saturdayWorkHourNormal;
        salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
        // salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
      } else {
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = saturdayWorkHourNormal;
        salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
        // salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
      }
      return salaryReportPerDay;
    } else if( weekDay === 0 && weekDayType.holiday && weekDayType.workday) { // if sunday and this day is workday
      if(weekDayWorkHourNormal >= weekDayWorkHourReal){
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay  =  salaryFixedPerDay + bonus; //* weekDayWorkHourNormal;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
        // salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
      } else {
        salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
        salaryReportPerDay.salaryRealPerDay = salaryFixedPerDay / weekDayWorkHourNormal * weekDayWorkHourReal + bonus;
        salaryReportPerDay.weekDay = weekDay;
        salaryReportPerDay.workHourNormal = weekDayWorkHourNormal;
        salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
        // salaryReportPerDay.emplFixedWorkHour = workhour_fixed;
        return salaryReportPerDay;
      }
      return salaryReportPerDay;
    } else if( weekDay === 0 && !weekDayType.holiday && weekDayType.workday) {
      salaryReportPerDay.salaryFixedPerDay =  0;
      salaryReportPerDay.salaryRealPerDay  =  0 + bonus; //* weekDayWorkHourNormal;
      salaryReportPerDay.weekDay = weekDay;
      salaryReportPerDay.workHourNormal = 0;
      salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
      // salaryReportPerDay.emplFixedWorkHour = 0;
      return salaryReportPerDay;
    } else {
      salaryReportPerDay.salaryFixedPerDay =  salaryFixedPerDay;
      salaryReportPerDay.salaryRealPerDay = 0.0;
      salaryReportPerDay.weekDay = weekDay;
      salaryReportPerDay.workHourNormal = 0;
      salaryReportPerDay.weekDayWorkHourReal = weekDayWorkHourReal;
      // salaryReportPerDay.emplFixedWorkHour = 0;
      return salaryReportPerDay;
    }
  };

  /* DUMMY FOO for calc total salary. Not completed!
   *calculates salary for current month;
   * calendarInfo from calendar model mongodb
   * params
   * month - current month
   * date - used to Determine the Year
   *
   * */
  var salaryTotal = function(date, month, salaryPerDay, weekDayType, calcSalaryFixedPerDay, salaryFixedPerMonth,  totalTimeInMinutes, bonus){ // calendarInfo used to determine fetch report per month

    var numberOfDays = calendar.countForCurrentMonth(date.getYear(), month);

    var salaryReport = [];
    var totalSalaryPerMonth = 0.0;

    for (var i = 0, len = salaryReport.length; i < len; ++i){
      totalSalaryPerMonth += salaryReport[i];
    }
  };

  module.exports = {
    calcSalaryFixedPerDay: calcSalaryFixedPerDay,
    salaryPerDay: salaryPerDay
  }
})();
