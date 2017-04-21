/**
 * Created by rafa on 11/04/2017.
 */
var Employees = require('../../models/employees');
var Positions = require('../../models/positions');
var Departments = require('../../models/departments');
var Candidates = require('../../models/candidates');
var Subsidaries  = require('../../models/subsidary');
var Workertypes = require('../../models/workertype');
var Worktimes = require('../../models/worktimes');
var Workermodes = require('../../models/workermode');
var Workhours = require('../../models/workhours');
var Internperiod = require('../../models/intperiod');
//Db helpers
var dbOps = require('../../routes/Helpers/dbRouteCommon');


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


//find candidate position by guest id
var getCandidatePosition = function (candId, callback) {
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

//finds positions and deps that applied by abbrevations
var getCandidatePos = function (abSub, abPos, callback) {
  // console.log(abSub.slice(0,1))
  // console.log(abSub.slice(1,2));
  //[abSub.slice(0,1), abSub.slice(1,2)]
  var reg = new RegExp('^'+abSub.slice(0,1), 'i');
  // var reg = /+abSub +/;
  Subsidaries.findOne({ subsidary: { $regex: reg } })
    .select({'subsidary': 1})
    .exec(function (err, data) {
      if(err){
        err.message = 'Внутреняя ошибка';
        err.status = 500;
        callback(err, null);
        return;
      }

      if(data){
        // console.log(data);
        callback(null, data);
      } else {
        var error = {};
        error.message = 'Данные не найдены';
        error.status = 404;
        callback(error, null);
      }
    });
};


var getSubsDepartments = function (id, callback) {
  Subsidaries
    .findOne({_id: id})
    .lean()
    .select({
      'subsidary': 1
      ,'departments':1
    })
    .populate({
      path:'departments',
      select: 'department'
    })
    .exec(function (err, data) {
       if(err){
         err.message = 'Неизвестная ошибка';
         err.status  = 500;
         callback(err, null);
         return
       }

       if(data){
         callback(null, data);
       }else {
         var error = {};
         error.message = 'Данные не найдены.';
         error.status = 404;
         callback(error, null);
       }
    });
};


// Dummy
var getDepPositions = function (depId, callback) {

  dbOps.getAllRoute(Positions, {//query
    department: depId
  },{//select

  }, { // populate
    path: 'department',
    select: 'worktimes worktypes workmodes',

  }, function (err, data) { //callback
    if(err){
      // console.log(err);
      callback(err, null);
      return;
    }

    callback(null, data);
    // console.log(data);
    // if(data.length > 0){
    //   console.log(data);
    //
    //
    // } else {
    //   console.log('Нет данных');
    // }
  })
};


//Getting available positions for particular department
var getPosDept = function(depId, callback){ //geting position for particular department
  dbOps.getAllRoute(Positions, { department: depId }, {
    '_id': 1, 'department' : 1, 'position': 1
  }, null, function (err,  data) {

    if(err){
      callback(err, null);
      return
    }
    callback(null, data);
  });
};


//Getting workers type. E.g. Intern or Probation period types
var getWorkerTypes = function (callback) {
  dbOps.getAllRoute(Workertypes, {}, {}, null, function (err, data) {
    if(err){
      callback(err, null);
      return;
    }
    callback(null, data);
  });
};



//Getting work times
var getWorkTimes = function (callback) {
  dbOps.getAllRoute(Worktimes, {}, {}, null, function (err, data) {
    if(err){
      callback(err, null);
      return;
    }
    callback(null, data);
  });

};



var getInternPeriods = function (callback) {
  dbOps.getAllRoute(Internperiod, {}, {}, null, function (err, data) {
    if(err){
      callback(err, null);
      return;
    }

    callback(null, data);
  });
};

var getWorkerMode = function (callback) {
  dbOps.getAllRoute(Workermodes, {}, {}, null, function (err, data) {
    if(err){
      callback(err, null);
      return;
    }
    callback(null, data);
  });
};

var getWorkHours = function (callback) {
  dbOps.getAllRoute(Workhours, {}, {}, null,
    function (err, data) {
      if(err){
        callback(err, null);
        return;
      }

      callback(null, data);

    });
};


module.exports = {
  getMyId: getMyId,
  whoAdminPrevileges: whoAdminPrevileges,
  getMyPass: getMyPass,
  getCandidatePosition : getCandidatePosition,
  getCandidatePos: getCandidatePos,
  getSubsDepartments: getSubsDepartments,
  getDepPositions: getDepPositions,
  getPosDept: getPosDept,
  getWorkerTypes: getWorkerTypes,
  getWorkTimes: getWorkTimes,
  getWorkHours: getWorkHours,
  getInternPeriods: getInternPeriods,
  getWorkerMode: getWorkerMode
};