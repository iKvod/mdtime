/**
 * Created by rafa on 10/04/2017.
 */
'use strict';
var Empl = require('../models/candidates');

//fetching data by id and sending to TB with apropriate message
var getEmployeeById = function (empId, callback) {

  var emplData = null;

  Empl.findOne({employee_id:empId})
    .lean()
    .select({'general_name':1, 'general_surname':1, 'bot_id':1, 'employee_id':1, 'admin':1})
    .exec(function (err, empl) {
      if(err){
        err.message = 'Ошибка. Обратитесь к техническому персоналу!';
        err.status = 500;
        callback(err, null);
        return;
      }
      if(empl){
        emplData = "*******Данные сотрудника*******" + "\n" +
          "Имя: " + empl.general_name + "\n" +
          "Фамилия: " + empl.general_surname +  "\n" +
          "Телеграм ID " + empl.bot_id  +  "\n" +
          "ID сотрудника:  " + empl.employee_id  + "\n" +
          "Доступы:  " + ((empl.admin) ? 'Расширены' : 'Ограничены') + "\n" ;
        callback(null, emplData);
      } else  {
          var error = {};
          error.message  = "Ошибка при получений с базы данных сотрдуника.\n" +
            "Обратитесь тех. сотруднику" + "\n Возможно такого пользователя не существует!"
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

    Empl.findOne({employee_id: employee_id})
      .select({'general_name':1, 'general_surname':1, 'megaplan':1, '1C':1, 'computer':1})
      .lean()
      .exec(function (err, data) {
        if(err){
          err.status = 500;
          err.message = 'Неизвестная ошибка. Обратитесь тех. сотруднику';
          callback(err, null);
          return;
        }

        if(data){
          passWords = "\t\t" + fetchedData.general_name + " ,запрошенные вами данные на сотрудника:\n\n" +
            "******** Пороли для " + data.general_name + " " + data.general_surname + " в системах ********\n\t\t"
            + 'Megaplan: ' + data.megaplan + "\n"
            + '\t\t1C: ' + data.one_c + "\n"
            +  "\t\tКомпьютер: " + data.computer + "\n";
          callback(null, passWords);
        }else  {
          var error = {};
          error.message  = "Ошибка при получений с базы данных сотрдуника.\n" +
            "Обратитесь тех. сотруднику. Возможно сотрудника с такими данными не существует!"
            + "Сообщите данные: Utils-getEmployeePasswords(line - 82)";
          error.status = 404;
          callback(error, null);
        }
      });
  })
};


// used to authorize some request only for admins
var verifyAdmin = function (bot_id, callback) {

  Empl.findOne({ bot_id: bot_id })
    .select({'admin':1 , 'general_name':1})
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
  getEmployeePasswords: getEmployeePasswords
};