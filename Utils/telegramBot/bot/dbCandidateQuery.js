/**
 * Created by rafa on 10/04/2017.
 */
'use strict';
var Empl = require('../../../models/users/candidates');
var Employees = require('../../../models/employees');
var dbHelper = require('../../../routes/Helpers/dbRouteCommon');

//fetching data by id and sending to TB with apropriate message
var getEmployeeById = function (empId, callback) {
  //
  var emplData = null;

  Employees.findOne({employee_id:empId})
    .lean()
    .select({'firstname':1, 'lastname':1, 'botId':1,
      'employee_id':1, 'email':1, 'admin':1, 'phonenumber':1,'position':1, 'hired':1, 'username':1 })
    .exec(function (err, empl) {
      if(err){
        err.message = 'Ошибка. Обратитесь к техническому персоналу!';
        err.status = 500;
        callback(err, null);
        return;
      }
      if(empl){
        emplData = "Данные по сотруднику " + empl.firstname + " " + "\n" +
          "Имя: " + empl.firstname + "\n" +
          "Фамилия: " + empl.lastname +  "\n" +
          "Email: " + empl.email + '\n' +
          "Телефон: " + empl.phonenumber + "\n" +
          // "Должность: " + empl.position + '\n' +
          "Статус: " + ((empl.hired) ? 'Работает' : 'Уволен') + '\n' +
          "Телеграм ID: " + empl.botId  +  "\n" +
          "Username в телеграме: " + empl.username + "\n" +
          "Рабочий ID сотрудника:  " + empl.employee_id  + "\n" +
          "Доступы:  " + ((empl.admin) ? 'Расширены' : 'Ограничены');
        callback(null, emplData);
      } else  {
        var error = {};
        error.message  = "Ошибка при получений с базы данных сотрдуника.\n" +
          "Обратитесь тех. сотруднику" + "\nВозможно такого пользователя не существует!\n"
          + "Сообщите данные: Utils-dbCand__Qwery(line - 35)";
        error.status = 404;
        callback(error, null);
      }
    })
};

var getEmployeePasswords = function (employee_id, bot_id, callback) {
  var passWords = null;

  verifyAdmin(bot_id, function (err, fetchedData) {
    if(err){
      if(err.status === 401 && err.message){
        callback(err, null);
        return;
      } else if(err.status === 404){
        callback(err, null);
        return;
      }
      callback(err, null);
      return;
    }

    Employees.findOne({ employee_id: employee_id })
      .select({'firstname':1, 'lastname':1, 'megaplan':1, 'one_c':1, 'computer':1, 'employee_id': 1})
      .lean()
      .exec(function (err, data) {
        if(err){
          err.status = 500;
          err.message = 'Неизвестная ошибка. Обратитесь тех. сотруднику';
          callback(err, null);
          return;
        }

        if(data){
          passWords = "\t\t Пароли по сотруднику: " + data.firstname + " " + data.lastname + " | " + data.employee_id + " \n\n"
            + 'MD Mail | MD Plan: ' + data.megaplan + "\n"
            + "Компьютер | MD Сервер: " + data.computer + "\n"
            + '1C Base: ' + data.one_c + "\n";
          callback(null, passWords);
        } else {
          var error = {};
          error.message  = "Ошибка при получений с базы данных сотрдуника.\n" +
            "Cотрудника с такими данными не существует!\n";
            // + "Код ошибки: Utils-getEmployeePasswords(line - 82)";
          error.status = 404;
          callback(error, null);
        }
      });
  })
};

//
// var getEmployeesPassByName = function (query, bot_id, callback) {
//   var passWords = null;
//
//   verifyAdmin(bot_id, function (err, fetchedData) {
//     if(err){
//       if(err.status === 401 && err.message){
//         callback(err, null);
//         return;
//       } else if(err.status === 404){
//         callback(err, null);
//         return;
//       }
//       callback(err, null);
//       return;
//     }
//
//     dbHelper.getAllRoute(Employees, {
//
//     }, {
//
//     }, null, function (err, data) {
//
//     });
//
//     Employees.findOne({ employee_id: employee_id })
//       .select({'firstname':1, 'lastname':1, 'megaplan':1, 'one_c':1, 'computer':1, 'employee_id': 1})
//       .lean()
//       .exec(function (err, data) {
//         if(err){
//           err.status = 500;
//           err.message = 'Неизвестная ошибка. Обратитесь тех. сотруднику';
//           callback(err, null);
//           return;
//         }
//
//         if(data){
//           passWords = "\t\t Пароли по сотруднику: " + data.firstname + " " + data.lastname + " | " + data.employee_id + " \n\n"
//             + 'MD Mail | MD Plan: ' + data.megaplan + "\n"
//             + "Компьютер | MD Сервер: " + data.computer + "\n"
//             + '1C Base: ' + data.one_c + "\n";
//           callback(null, passWords);
//         }else {
//           var error = {};
//           error.message  = "Ошибка при получений с базы данных сотрдуника.\n" +
//             "Cотрудника с такими данными не существует!\n";
//           // + "Код ошибки: Utils-getEmployeePasswords(line - 82)";
//           error.status = 404;
//           callback(error, null);
//         }
//       });
//   })
// };


var getEmployeeId = function (botId, employeName, callback) {
  var emplIdInfo = '';
  verifyAdmin(botId, function (err, data) {
    if(err){
      callback(err, null);
      return;
    }

    var query =
    {
      firstname: employeName
    };


    if(data.admin){
      fetchEmplId(employeName, query, function (err, data) {
        if(err){
          callback(err, null);
          return;
        }

        data.forEach(function (empl) {
          emplIdInfo += 'Рабочий ID сотрудника - ' + empl.firstname + ' ' + empl.lastname + ' \n'
            + ' Id - ' + empl.employee_id + '\n\n';
        });
        callback(null, emplIdInfo);
      });
    }
  })

};

//Helper callback function for getting ID by any qwery
var fetchEmplId = function(employeName, query, callback){

  dbHelper.getAllRoute(Employees, query, {
    'firstname': 1,
    'lastname': 1,
    'employee_id' : 1
  }, null, function (err, data) {
    if(err){
      callback(err, null);
      return
    }

    callback(null, data);
  });
};


// used to authorize some request only for admins when some authorized
// commands come from tb
var verifyAdmin = function (bot_id, callback) {

  Employees.findOne({ botId: bot_id })
    .select({'admin':1 , 'firstname':1})
    .exec(function (err, data ) {
      if(err){
        callback(err, null);
        return;
      }
      if(data){
        if(!data.admin){
          var error = {};
          error.status = 401;
          error.message = "У вас нет прав на такой вид запроса.";
          callback(error, null)
        } else {
          callback(null, data);
        }
      } else {
        var error = {};
        error.message  = "Ошибка при получений с базы данных сотрдуника.\n" +
          "Обратитесь тех. сотруднику.\nВозможно Вы не зарегистрированы в системе";
        error.status = 404;
        callback(error, null);
      }
    })
};


module.exports = {
  getEmployeeById:getEmployeeById,
  verifyAdmin: verifyAdmin,
  getEmployeePasswords: getEmployeePasswords,
  getEmployeeId: getEmployeeId
};
