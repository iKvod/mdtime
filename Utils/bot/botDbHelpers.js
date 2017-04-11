/**
 * Created by rafa on 11/04/2017.
 */
var Employees = require('../../models/employees');

var getMyId = function (botId, callback) {
  Employees.findOne({botId : botId})
    .select({'employee_id': 1, 'firstname': 1})
    .lean()
    .exec(function (err, empl) {
      if(err){
        err.status = 500;
        err.message = 'Неизвестная ошибка; Ut/bo/boDb..: 12';
        callback(err, null);
        return
      }
      if(empl){
        callback(null, empl);
      } else {
        err.status = 404;
        err.message = 'Вы не зарегистророваны в системе! ' +
          'Или не правильный ID ввели';
        callback(err, null);
      }
    });
};

module.exports = {
  getMyId: getMyId
};