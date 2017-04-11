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
        err.message = 'Неизвестная ошибка; Ut/bo/boDb..: 12';
        callback(err, null);
        return
      }
      callback(null, empl);
    });
};

module.exports = {
  getMyId: getMyId
};