/**
 * Created by rafa on 11/04/2017.
 */
var Employees = require('../../models/employees');
var Positions = require('../../models/positions');
var Departments = require('../../models/departments');
var Candidates = require('../../models/candidates');


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
    buildAdminDataRecursivley(0, admins, '', function (parsedData) {
      callback(null, parsedData);
    });
  });
};


var buildAdminDataRecursivley = function (i, data, parsedData, callback) {
  var len = data.length;

  if(i < len){
    parsedData += " " +"( "+ (i + 1) + " ) " + " \n\n" +
        "Имя: " + data[i].firstname + "\n" +
        "Фамилия: " + data[i].lastname + "\n" +
        "Превилегия Админа: " +  (data[i].admin? "Расширены" : "Ограничены") + "\n\n" +
        "              \n\n";
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
        str += " " + "Ваши пароли" + " \n\n" +
          "Мегаплан: " + empl.megaplan + "\n" +
          "1С: " + empl.one_c + "\n" +
          "Компьютер: " + empl.computer + "\n\n" +
          "                     \n\n";
        callback(null, str);
      } else {
        var error = {};
        error.message = 'По вашим данным нет паролей! Обратитесь в тех. поддержку'
        error.status = 404;
        callback(error, null);
      }
    });
};


//generate id according his position
var generateId = function () {

};

var getCantidatePosition = function (candId, callback) {
  Candidates.findOne({ guest_id: candId })
    .select({'vacancy_id':1})
    .exec(function (err, cand) {
      if(err){
        err.status = 500;
        err.message = 'Неизвестная ошибка';
        callback(err, null);
        return;
      }
      if(cand){
        Positions.findOne({department: cand.vacancy_id})
          .select({ '':1 })
          .populate({
            path: 'department',
            match:{}
          })
          .exec(function (err, data) {
            
          });
        callback(null, cand);
      } else {
        var error = {};
        error.status = 404;
        error.message = 'В базе не найдено пользователя c Вашим гостевым ID.';
        сallback(error, null);
        return;
      }
    });
};

var getCandidate = function () {

};

var getActualPosition = function () {

};

var getCandidateData = function (guestId) {

};

var candAcutalInternDuration = function (userInput) {

};


module.exports = {
  getMyId: getMyId,
  whoAdminPrevileges: whoAdminPrevileges,
  getMyPass: getMyPass
};