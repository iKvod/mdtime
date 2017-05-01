'use strict';

module.exports = {
  countForWholeYear: countForWholeYear,
  countForCurrentMonth: countForCurrentMonth
};


/*
 * Calculates workdays, saturdays, sundays for whole year;
 * $params year - for current year, month - for current month;
 * */
function countForWholeYear(year) {

  var calendarReport = [];
  var countWorkDays = 0;
  var countSaturdays = 0;
  var countSundays = 0;
  //var holidays = {month: null, days: []}; // should be included

  for(var i = 0; i < 12; ++i) {
    var countedDays = {
      month: null,
      days: 0,
      workdays: 0,
      saturdays: 0,
      sundays: 0
    };
    for(var j = 1; j <= 31; ++j){
      if(j === 1 ){
        // console.log('--------------------');
        // console.log(new Date(year, i, j + 1).getMonth() + 1)
        // console.log('--------------------');
      }
      if(new Date(year, i, j).getMonth() > i){
        // console.log('Begging of new month');
        // console.log(new Date(year, i, j));
        break;
      } else {
        var currentDay = new Date(year, i, j);
        if(j === 1){
          countedDays.month = currentDay.getMonth();
        }
        countedDays.days++;
        if( (currentDay.getDay() != 0) && (currentDay.getDay() != 6)){
          countedDays.workdays++;
        } else if (currentDay.getDay() === 6){
          countedDays.saturdays++;
        } else if(currentDay.getDay() === 0) {
          countedDays.sundays++;
        }
        // console.log('--------------------');
        // console.log(new Date(year, i, j + 1).getMonth() + 1)
        // console.log('--------------------');
        //console.log(new Date(year, i, j));
      }
      //console.dir(calendarReport)
    }
    calendarReport.push(countedDays);
  }
  return calendarReport;
}

/*
 * Calculates workdays, saturdays, sundays for current month;
 * $params year - for current year, month - for current month;
 * */
function countForCurrentMonth(year, month){
  var i = month;
  var countedDays = {
    month: null,
    days: 0,
    workdays: 0,
    saturdays: 0,
    sundays: 0
  };

  //var holidays = {month: null, days: []}; // should be included
  //     console.log(new Date(year, month , 0).getDate());
  for(var j = 1; j <= new Date(year, month + 1, 0).getDate(); ++j){
    if(j === 1 ){
      // console.log('--------------------');
      // console.log(new Date(year, i, j).getMonth() + 1)
      // console.log('--------------------');
    }
    if(new Date(year, i, j).getMonth() > month) {
      // console.log(new Date(year, i, j).getMonth());
      break;
    } else {
      var currentDay = new Date(year, i, j);
      if(j === 1 && year){
        countedDays.month = currentDay.getMonth();
      }
      countedDays.days++;

      if( (currentDay.getDay() != 6) && (currentDay.getDay() != 0)){
        countedDays.workdays++;
      } else if (currentDay.getDay() === 6){
        countedDays.saturdays++;
      } else if(currentDay.getDay() === 0) {
        countedDays.sundays++;
      }
    }
  }
  // console.log(countedDays);
  return countedDays;
}
//for testing
// countForWholeYear(2017);
// countForCurrentMonth(2017, 3);