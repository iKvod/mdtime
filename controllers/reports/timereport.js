'use strict';

function calculateMinutes (users, month, callback) {
  var usersReports = [];
  var userReport = {
    employee_id : null,
    username: null,
    salaryfixed: null,
    reportminutes: [],
    work_time: null
  };

  var  repMin = [];
  for(var i = 0, len = users.length; i < len; i++){
    var name = users[i].getName();
    userReport.employee_id = users[i].employee_id;
    userReport.username = name;
    userReport.salaryfixed = users[i].salary_fixed;
    userReport.work_time = users[i].work_time;

    var lastReportDay = null;
    var cnt = 0; // cnt < repLen

    for(var j = 1, len1 = new Date(2017, month + 1, 0).getDate(); j <= len1; j++) {
      var obj = {};
      var curDayReport;

      if(users[i].report[cnt]){
        curDayReport  = users[i].report[cnt].createdAt.getDate();
        if(lastReportDay === curDayReport){
          lastReportDay = curDayReport;
          cnt++;
          j--;
        } else {
          if( j === curDayReport ){
            obj.check_in = new Date(users[i].report[cnt].check_in);
            obj.check_out = new Date(users[i].report[cnt].check_out);
            obj.report = users[i].report[cnt].calcTimeCorrectly();
            repMin.push(obj);
            lastReportDay = curDayReport;
            cnt++;
          } else {
            repMin.push({
              message: 'Воскресенье или Отсутствовал(а)',
              // counter: cnt,
              // day: ['Пн.','Вт.', 'Ср.', 'Чт.', 'Пт.','Сб.','Вс.'][j],
              reportDay: (new Date(2017, month, j)).getDate(),
              reportDate: new Date(2017, month, j),
              date: j
            });
          }
        }
      } else {
        repMin.push({
          message: 'За этот день нет отчета',
          // counter: cnt,
          // day: ['Пн.','Вт.', 'Ср.', 'Чт.', 'Пт.','Сб.','Вс.'][j],
          reportDay: (new Date(2017, month, j)).getDate(),
          reportDate: new Date(2017, month, j),
          date: j
        });
      }
    }
    userReport.reportminutes = repMin;
    usersReports.push(userReport);
    repMin = [];
    userReport = {};
  }
  callback(usersReports);
}

module.exports = {
  calculateMinutes: calculateMinutes
};