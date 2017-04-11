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


/// Who has admin previleges. From bot command
var whoAdminPrevileges = function (botId, callback) {
  getAdmins(function (err, admins) {
    if(err){
      callback(err, null);
      return;
    }
    console.log(admins);
    buildAdminDataRecursivley(0, admins, '', function (parsedData) {
      callback(null, parsedData);
    });
  });
};


var buildAdminDataRecursivley = function (i, data, parsedData, callback) {
  var len = data.length;

  if(i < len){
    parsedData += "--***---****---*** " +"( "+ (i + 1) + " ) " + " ***---****---***--\n\n" +
        "Имя: " + data[i].firstname + "\n" +
        "Фамилия: " + data[i].lastname + "\n" +
        "Превилегия Админа: " +  (data[i].admin? "Расширены" : "Ограничены") + "\n\n" +
        "         ---------**********---------       \n\n";
    buildAdminDataRecursivley(i + 1, data, parsedData, callback);
  } else {
    callback(parsedData);
  }
};

var getAdmins= function (callback) {
  Employees.find({ admin:true})
    .lean()
    .select({'firstname':1, 'lastname':1, 'admin':1 } )
    .exec(function (err, empl) {
      if(err){
        err.message = 'Неизвестная ошибка';
        err.status = 500;
        callback(err, null);
        return;
      }

      if(empl.length > 0){
        callback(null, empl);
      } else {
        var error = {};
        error.message = 'Нет пользователей с превилегиями.';
        error.status = 404;
        callback(error, null);
      }
    });
};


//mypass - return emplouyess passwords
var getMyPass = function (botId, callback) {
  fetchMyPass(botId, function (err, passwords) {
    if(err){
      callback(err, null);
      return;
    }
    callback(null, passwords);
  });
};

var fetchMyPass = function (botId, callback) {
  var str = '';
  Employees.findOne({botId: botId})
    .lean()
    .select({'megaplan':1, 'one_c': 1, 'computer':1})
    .exec(function (err, empl) {
      if(err){
        err.message = 'Неизвестная ошибка';
        err.status = 500;
      }

      if(empl){
        str += "--***---****---*** " + "Ваши пароли" + " ***---****---***--\n\n" +
          "Мегаплан: " + empl.megaplan + "\n" +
          "1С: " + empl.one_c + "\n" +
          "Компьютер: " + empl.computer + "\n\n" +
          "                     ---------**********---------       \n\n";
        callback(null, str);
      } else {
        var error = {};
        error.message = 'По вашим данным нет паролей! Обратитесь в тех. поддержку'
        error.status = 404;
        callback(error, null);
      }
    });
};

module.exports = {
  getMyId: getMyId,
  whoAdminPrevileges: whoAdminPrevileges,
  getMyPass: getMyPass
};